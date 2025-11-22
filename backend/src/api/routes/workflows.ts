import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SealWalrusService } from '../../services/SealWalrusService';
import { Strategy } from '../../types/strategy';
import { SessionKey } from '@mysten/seal';
import { getAdminKeypair, ADMIN_CONFIG } from '../../config/admin';

const router: ExpressRouter = Router();

// Initialize Sui client and service
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const sealWalrusService = new SealWalrusService(suiClient);

// In-memory storage for marketplace (en production, utilisez une vraie DB)
interface MarketplaceWorkflow {
  id: string;
  metadataBlobId: string;
  strategy: Strategy;
  purchasedBy: string[]; // Liste des adresses qui ont acheté
  createdAt: number;
}

const marketplaceWorkflows: MarketplaceWorkflow[] = [];

// Store session keys for decrypt flow
const sessionKeys = new Map<string, SessionKey>();

/**
 * POST /api/workflows/upload
 * Upload et encrypt un workflow sur Walrus
 * Body: JSON du workflow (Strategy)
 */
router.post('/workflows/upload', async (req: Request, res: Response) => {
  try {
    const strategy: Strategy = req.body;

    if (!strategy || !strategy.id || !strategy.meta) {
      return res.status(400).json({ error: 'Invalid workflow data' });
    }

    // Valider que le workflow est bien formé
    if (!strategy.nodes || !Array.isArray(strategy.nodes)) {
      return res.status(400).json({ error: 'Workflow must contain nodes array' });
    }

    // Convertir le workflow en JSON
    const workflowJson = JSON.stringify(strategy);
    const workflowBuffer = Buffer.from(workflowJson, 'utf-8');

    console.log('📤 Uploading workflow to Walrus (encrypted):', strategy.meta.name);

    // Encrypt et stocker sur Walrus
    const result = await sealWalrusService.encryptAndStore(
      workflowBuffer,
      `${strategy.meta.name}.json`
    );

    // Ajouter à la marketplace
    const marketplaceEntry: MarketplaceWorkflow = {
      id: strategy.id,
      metadataBlobId: result.metadataBlobId,
      strategy,
      purchasedBy: [],
      createdAt: Date.now(),
    };

    marketplaceWorkflows.push(marketplaceEntry);

    console.log('✅ Workflow uploaded and encrypted');

    res.json({
      success: true,
      data: {
        workflowId: strategy.id,
        metadataBlobId: result.metadataBlobId,
        dataBlobId: result.dataBlobId,
        walrusUrl: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${result.metadataBlobId}`,
      },
    });
  } catch (error: any) {
    console.error('Workflow upload error:', error);
    res.status(500).json({
      error: 'Failed to upload workflow',
      message: error.message,
    });
  }
});

/**
 * GET /api/workflows/list
 * Liste tous les workflows disponibles dans la marketplace
 */
router.get('/workflows/list', async (req: Request, res: Response) => {
  try {
    // Retourner les métadonnées publiques (pas le contenu encrypté)
    const workflows = marketplaceWorkflows.map((w) => ({
      id: w.id,
      metadataBlobId: w.metadataBlobId,
      name: w.strategy.meta.name,
      author: w.strategy.meta.author,
      description: w.strategy.meta.description,
      tags: w.strategy.meta.tags,
      price_sui: w.strategy.meta.price_sui || 0,
      created_at: w.strategy.meta.created_at,
      purchaseCount: w.purchasedBy.length,
      createdAt: w.createdAt,
    }));

    res.json({
      success: true,
      data: workflows,
    });
  } catch (error: any) {
    console.error('Workflow list error:', error);
    res.status(500).json({
      error: 'Failed to list workflows',
      message: error.message,
    });
  }
});

/**
 * POST /api/workflows/purchase
 * Acheter un workflow (ajouter l'adresse à la whitelist ON-CHAIN automatiquement)
 * Body: { workflowId, address }
 */
router.post('/workflows/purchase', async (req: Request, res: Response) => {
  try {
    const { workflowId, address } = req.body;

    if (!workflowId || !address) {
      return res.status(400).json({
        error: 'Missing required fields: workflowId, address',
      });
    }

    // Trouver le workflow
    const workflow = marketplaceWorkflows.find((w) => w.id === workflowId);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Vérifier si déjà acheté
    if (workflow.purchasedBy.includes(address)) {
      return res.status(400).json({
        error: 'You already own this workflow',
      });
    }

    console.log('🛒 Processing purchase for workflow:', workflowId);
    console.log('   Adding address to whitelist:', address);

    // Récupérer les métadonnées pour obtenir whitelistId et nonce
    const metadata = await sealWalrusService.getMetadata(workflow.metadataBlobId);
    
    // Construire l'ID pour la whitelist
    const { fromHex } = await import('@mysten/sui/utils');
    const cleanWhitelistId = metadata.whitelistId.startsWith('0x') 
      ? metadata.whitelistId.slice(2) 
      : metadata.whitelistId;
    const whitelistIdBytes = fromHex(cleanWhitelistId);
    const nonceBytes = new TextEncoder().encode(metadata.nonce);
    const idBytes = new Uint8Array([...whitelistIdBytes, ...nonceBytes]);

    // Ajouter l'utilisateur à la whitelist ON-CHAIN avec le wallet admin
    const adminKeypair = getAdminKeypair();
    
    if (!adminKeypair) {
      return res.status(500).json({
        error: 'Admin wallet not configured. Please set ADMIN_PRIVATE_KEY in .env',
      });
    }

    try {
      console.log('🔐 Adding user to on-chain whitelist...');
      
      // Build transaction to add user to whitelist
      const tx = new Transaction();
      tx.moveCall({
        target: `${ADMIN_CONFIG.PACKAGE_ID}::whitelist::add`,
        arguments: [
          tx.object(ADMIN_CONFIG.WHITELIST_ID),
          tx.object(ADMIN_CONFIG.CAP_ID),
          tx.pure.address(address),
        ],
      });

      // Sign and execute with admin wallet
      const result = await suiClient.signAndExecuteTransaction({
        signer: adminKeypair,
        transaction: tx,
      });

      console.log('✅ User added to whitelist. TX:', result.digest);

      // Ajouter l'adresse à notre liste locale
      workflow.purchasedBy.push(address);

      res.json({
        success: true,
        data: {
          workflowId: workflow.id,
          metadataBlobId: workflow.metadataBlobId,
          message: 'Workflow purchased and access granted',
          transactionDigest: result.digest,
        },
      });
    } catch (txError: any) {
      console.error('❌ Failed to add user to whitelist:', txError);
      
      // Check if error is because user is already in whitelist
      if (txError.message?.includes('EDuplicate') || txError.message?.includes('3')) {
        // User already in whitelist, just add to local list
        workflow.purchasedBy.push(address);
        return res.json({
          success: true,
          data: {
            workflowId: workflow.id,
            metadataBlobId: workflow.metadataBlobId,
            message: 'Workflow purchased (already in whitelist)',
          },
        });
      }
      
      throw new Error(`Failed to add to whitelist: ${txError.message}`);
    }
  } catch (error: any) {
    console.error('Workflow purchase error:', error);
    res.status(500).json({
      error: 'Failed to purchase workflow',
      message: error.message,
    });
  }
});

/**
 * POST /api/workflows/get-decrypt-message
 * Obtenir le message à signer pour décrypter un workflow
 */
router.post('/workflows/get-decrypt-message', async (req: Request, res: Response) => {
  try {
    const { workflowId, address } = req.body;

    if (!workflowId || !address) {
      return res.status(400).json({
        error: 'Missing required fields: workflowId, address',
      });
    }

    // Trouver le workflow
    const workflow = marketplaceWorkflows.find((w) => w.id === workflowId);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Vérifier que l'utilisateur a acheté le workflow
    if (!workflow.purchasedBy.includes(address)) {
      return res.status(403).json({
        error: 'You must purchase this workflow first',
      });
    }

    // Créer une session key pour le decrypt
    const sessionKey = await sealWalrusService.createSessionKey(address);
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Stocker la session key en mémoire
    sessionKeys.set(sessionId, sessionKey);

    console.log('🔑 Created session key for decrypt:', sessionId);

    res.json({
      success: true,
      data: {
        sessionId,
        message: Array.from(sessionKey.getPersonalMessage()),
        messageHex: Buffer.from(sessionKey.getPersonalMessage()).toString('hex'),
      },
    });
  } catch (error: any) {
    console.error('Get decrypt message error:', error);
    res.status(500).json({
      error: 'Failed to create decrypt message',
      message: error.message,
    });
  }
});

/**
 * POST /api/workflows/decrypt
 * Décrypter un workflow acheté
 */
router.post('/workflows/decrypt', async (req: Request, res: Response) => {
  try {
    const { workflowId, address, sessionId, signature } = req.body;

    if (!workflowId || !address || !sessionId || !signature) {
      return res.status(400).json({
        error: 'Missing required fields: workflowId, address, sessionId, signature',
      });
    }

    // Trouver le workflow
    const workflow = marketplaceWorkflows.find((w) => w.id === workflowId);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Vérifier que l'utilisateur a acheté le workflow
    if (!workflow.purchasedBy.includes(address)) {
      return res.status(403).json({
        error: 'You must purchase this workflow first',
      });
    }

    // Récupérer la session key
    const sessionKey = sessionKeys.get(sessionId);
    if (!sessionKey) {
      return res.status(400).json({
        error: 'Invalid or expired session',
      });
    }

    console.log('🔓 Decrypting workflow:', workflowId);

    // Décrypter depuis Walrus
    const decryptedData = await sealWalrusService.decryptFromWalrus(
      workflow.metadataBlobId,
      sessionKey,
      signature,
      address
    );

    // Parser le JSON
    const workflowJson = JSON.parse(decryptedData.toString('utf-8'));

    // Nettoyer la session key
    sessionKeys.delete(sessionId);

    res.json({
      success: true,
      data: {
        workflow: workflowJson,
      },
    });
  } catch (error: any) {
    console.error('Workflow decrypt error:', error);
    res.status(500).json({
      error: 'Failed to decrypt workflow',
      message: error.message,
    });
  }
});

/**
 * GET /api/workflows/owned/:address
 * Liste tous les workflows possédés par une adresse
 */
router.get('/workflows/owned/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const ownedWorkflows = marketplaceWorkflows
      .filter((w) => w.purchasedBy.includes(address))
      .map((w) => ({
        id: w.id,
        metadataBlobId: w.metadataBlobId,
        name: w.strategy.meta.name,
        author: w.strategy.meta.author,
        description: w.strategy.meta.description,
        tags: w.strategy.meta.tags,
        created_at: w.strategy.meta.created_at,
      }));

    res.json({
      success: true,
      data: ownedWorkflows,
    });
  } catch (error: any) {
    console.error('Owned workflows error:', error);
    res.status(500).json({
      error: 'Failed to fetch owned workflows',
      message: error.message,
    });
  }
});

export default router;
