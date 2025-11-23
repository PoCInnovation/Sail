
import { getFullnodeUrl } from '@mysten/sui/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env from backend/.env
dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log('Testnet URL:', getFullnodeUrl('testnet'));
console.log('Mainnet URL:', getFullnodeUrl('mainnet'));

console.log('PACKAGE_ID:', process.env.PACKAGE_ID);
console.log('WHITELIST_ID:', process.env.WHITELIST_ID);
