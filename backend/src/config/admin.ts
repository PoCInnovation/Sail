import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { fromHex } from '@mysten/sui/utils';
import dotenv from 'dotenv';

dotenv.config();

export const ADMIN_CONFIG = {
  PACKAGE_ID: process.env.PACKAGE_ID || '',
  WHITELIST_ID: process.env.WHITELIST_ID || '',
  CAP_ID: process.env.CAP_ID || '',
};

// Export individual values for convenience
export const PACKAGE_ID = process.env.PACKAGE_ID || '';
export const WHITELIST_ID = process.env.WHITELIST_ID || '';
export const CAP_ID = process.env.CAP_ID || '';

/**
 * Get admin signer (keypair) from environment variable
 * If not set, returns null (admin functions will be disabled)
 * @deprecated Use getAdminKeypair instead
 */
export function getAdminSigner(): Ed25519Keypair | Secp256k1Keypair | null {
  return getAdminKeypair();
}

/**
 * Get admin keypair from environment variable
 * Supports both Ed25519 and Secp256k1 key schemes.
 * If not set, returns null (admin functions will be disabled)
 */
export function getAdminKeypair(): Ed25519Keypair | Secp256k1Keypair | null {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn('⚠️  ADMIN_PRIVATE_KEY not set - admin functions disabled');
    return null;
  }

  try {
    // Support both formats:
    // 1. suiprivkey1... (Bech32 format from sui keytool export)
    // 2. 0x... (hex format, assumed Ed25519)
    if (privateKey.startsWith('suiprivkey')) {
      // Decode the Bech32 key to detect scheme automatically
      const { schema, secretKey } = decodeSuiPrivateKey(privateKey);

      if (schema === 'Secp256k1') {
        return Secp256k1Keypair.fromSecretKey(secretKey);
      }
      // Default to Ed25519
      return Ed25519Keypair.fromSecretKey(secretKey);
    } else {
      // Assume hex format (Ed25519)
      const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      const secretKey = fromHex(cleanKey);
      return Ed25519Keypair.fromSecretKey(secretKey);
    }
  } catch (error) {
    console.error('❌ Failed to load admin keypair:', error);
    return null;
  }
}
