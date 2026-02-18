import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHex } from '@mysten/sui/utils';
import dotenv from 'dotenv';

dotenv.config();

export const ADMIN_CONFIG = {
  PACKAGE_ID: process.env.PACKAGE_ID || '',
  WHITELIST_ID: process.env.WHITELIST_ID || '',
  CAP_ID: process.env.CAP_ID || '',
};

/**
 * Get admin keypair from environment variable
 * If not set, returns null (admin functions will be disabled)
 */
export function getAdminKeypair(): Ed25519Keypair | null {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn('⚠️  ADMIN_PRIVATE_KEY not set - admin functions disabled');
    return null;
  }

  try {
    // Support both formats:
    // 1. suiprivkey1... (Bech32 format from sui keytool export)
    // 2. 0x... (hex format)
    if (privateKey.startsWith('suiprivkey')) {
      // Use fromSecretKey with the Bech32 encoded key
      return Ed25519Keypair.fromSecretKey(privateKey);
    } else {
      // Assume hex format
      const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      const secretKey = fromHex(cleanKey);
      return Ed25519Keypair.fromSecretKey(secretKey);
    }
  } catch (error) {
    console.error('❌ Failed to load admin keypair:', error);
    return null;
  }
}
