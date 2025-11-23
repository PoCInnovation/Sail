import { SealClient, SessionKey } from '@mysten/seal';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { fromHex } from '@mysten/sui/utils';

import { ADMIN_CONFIG } from '../config/admin';

const PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
const AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';

export interface EncryptResult {
  metadataBlobId: string;
  dataBlobId: string;
  nonce: string;
  originalSize: number;
}

export interface Metadata {
  packageId: string;
  whitelistId: string;
  nonce: string;
  dataBlobId: string;
  timestamp: number;
  originalSize: number;
  originalFilename?: string;
}

export class SealWalrusService {
  private suiClient: SuiClient;
  private sealClient: SealClient;

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient;
    this.sealClient = new SealClient({
      suiClient,
      serverConfigs: [
        { objectId: '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', weight: 1 }
      ],
      verifyKeyServers: false,
    });
  }

  /**
   * Encrypt data and store on Walrus
   */
  async encryptAndStore(data: Buffer, filename?: string): Promise<EncryptResult> {
    // Generate nonce
    const nonce = 'file-' + Date.now();

    // Build ID: [whitelistObjectId][nonce]
    // Build ID: [whitelistObjectId][nonce]
    const cleanWhitelistId = ADMIN_CONFIG.WHITELIST_ID.startsWith('0x') ? ADMIN_CONFIG.WHITELIST_ID.slice(2) : ADMIN_CONFIG.WHITELIST_ID;
    const whitelistIdBytes = fromHex(cleanWhitelistId);
    const nonceBytes = new TextEncoder().encode(nonce);
    const idBytes = new Uint8Array([...whitelistIdBytes, ...nonceBytes]);
    const hexId = Array.from(idBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    // Encrypt with Seal
    const result = await this.sealClient.encrypt({
      threshold: 1,
      packageId: ADMIN_CONFIG.PACKAGE_ID,
      id: hexId,
      data: new Uint8Array(data),
    });

    // Upload encrypted data to Walrus
    const dataResponse = await fetch(`${PUBLISHER}/v1/blobs?epochs=5`, {
      method: 'PUT',
      body: result.encryptedObject,
    });

    const dataWalrusResult = await dataResponse.json();
    const dataBlobId = dataWalrusResult.newlyCreated 
      ? dataWalrusResult.newlyCreated.blobObject.blobId 
      : dataWalrusResult.alreadyCertified.blobId;

    // Create metadata (without backupKey for security)
    // Create metadata (without backupKey for security)
    const metadata: Metadata = {
      packageId: ADMIN_CONFIG.PACKAGE_ID,
      whitelistId: ADMIN_CONFIG.WHITELIST_ID,
      nonce,
      dataBlobId,
      timestamp: Date.now(),
      originalSize: data.length,
      originalFilename: filename,
    };

    // Upload metadata to Walrus
    const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));
    const metadataResponse = await fetch(`${PUBLISHER}/v1/blobs?epochs=5`, {
      method: 'PUT',
      body: metadataBytes,
    });

    const metadataWalrusResult = await metadataResponse.json();
    const metadataBlobId = metadataWalrusResult.newlyCreated 
      ? metadataWalrusResult.newlyCreated.blobObject.blobId 
      : metadataWalrusResult.alreadyCertified.blobId;

    return {
      metadataBlobId,
      dataBlobId,
      nonce,
      originalSize: data.length,
    };
  }

  /**
   * Decrypt data from Walrus
   */
  async decryptFromWalrus(
    metadataBlobId: string,
    sessionKey: SessionKey,
    signature: string,
    address: string
  ): Promise<Buffer> {
    // Set signature on session key
    sessionKey.setPersonalMessageSignature(signature);

    // Fetch metadata from Walrus
    const metadata = await this.getMetadata(metadataBlobId);

    // Fetch encrypted data from Walrus
    const dataResponse = await fetch(`${AGGREGATOR}/v1/blobs/${metadata.dataBlobId}`);
    if (!dataResponse.ok) {
      throw new Error(`Failed to fetch encrypted data: ${dataResponse.status}`);
    }

    const encryptedObject = new Uint8Array(await dataResponse.arrayBuffer());

    // Build ID for policy
    const cleanWhitelistId = metadata.whitelistId.startsWith('0x') 
      ? metadata.whitelistId.slice(2) 
      : metadata.whitelistId;
    const whitelistIdBytes = fromHex(cleanWhitelistId);
    const nonceBytes = new TextEncoder().encode(metadata.nonce);
    const idBytes = new Uint8Array([...whitelistIdBytes, ...nonceBytes]);

    // Create seal_approve transaction
    const tx = new Transaction();
    tx.moveCall({
      target: `${metadata.packageId}::whitelist::seal_approve`,
      arguments: [
        tx.pure.vector('u8', Array.from(idBytes)),
        tx.object(metadata.whitelistId),
      ],
    });

    const txBytes = await tx.build({
      client: this.suiClient,
      onlyTransactionKind: true,
    });

    // Decrypt
    const decrypted = await this.sealClient.decrypt({
      data: encryptedObject,
      sessionKey,
      txBytes,
    });

    return Buffer.from(decrypted);
  }

  /**
   * Create a session key for decryption
   */
  async createSessionKey(address: string): Promise<SessionKey> {
    return await SessionKey.create({
      address,
      packageId: ADMIN_CONFIG.PACKAGE_ID,
      ttlMin: 10,
      suiClient: this.suiClient,
    });
  }

  /**
   * Get metadata from Walrus
   */
  async getMetadata(metadataBlobId: string): Promise<Metadata> {
    const metadataResponse = await fetch(`${AGGREGATOR}/v1/blobs/${metadataBlobId}`);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch metadata: ${metadataResponse.status}`);
    }

    const metadataBytes = await metadataResponse.arrayBuffer();
    return JSON.parse(new TextDecoder().decode(metadataBytes));
  }
}
