import { SuiClient } from '@mysten/sui/client';
import dotenv from 'dotenv';

dotenv.config();

let suiClientInstance: SuiClient | null = null;

/**
 * Get or create a singleton instance of SuiClient
 */
export function getSuiClient(): SuiClient {
  if (!suiClientInstance) {
    const network = process.env.SUI_NETWORK || 'mainnet';

    let url: string;
    switch (network) {
      case 'mainnet':
        url = 'https://fullnode.mainnet.sui.io:443';
        break;
      case 'testnet':
        url = 'https://fullnode.testnet.sui.io:443';
        break;
      case 'devnet':
        url = 'https://fullnode.devnet.sui.io:443';
        break;
      default:
        url = 'https://fullnode.mainnet.sui.io:443';
    }

    suiClientInstance = new SuiClient({ url });
    console.log(`✅ SuiClient initialized for ${network}`);
  }

  return suiClientInstance;
}
