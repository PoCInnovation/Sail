import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHex } from '@mysten/sui/utils';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function deploy() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('ADMIN_PRIVATE_KEY not set in .env');
  }

  // Load keypair
  let keypair: Ed25519Keypair;
  if (privateKey.startsWith('suiprivkey')) {
    keypair = Ed25519Keypair.fromSecretKey(privateKey);
  } else {
    const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    keypair = Ed25519Keypair.fromSecretKey(fromHex(cleanKey));
  }

  const client = new SuiClient({ url: getFullnodeUrl('testnet') });
  const address = keypair.getPublicKey().toSuiAddress();
  console.log('Deploying from address:', address);

  // Read compiled modules
  const buildPath = path.join(__dirname, '../../move/build/startHack/bytecode_modules');
  const modules = ['whitelist.mv'];
  const modulesBytes = modules.map(m => fs.readFileSync(path.join(buildPath, m)));

  // Get dependencies (Sui framework)
  // For testnet, we usually just need to depend on 0x1 and 0x2.
  // The Move.toml defines dependencies.
  // We can try publishing with just the module bytes and let the node resolve dependencies if they are standard.
  // However, publish transaction requires `dependencies` list.
  // Standard Sui framework ID is 0x1 and 0x2.
  // Let's try with just the module.
  
  const tx = new Transaction();
  const [upgradeCap] = tx.publish({
    modules: modulesBytes.map(m => Array.from(m)),
    dependencies: [
      '0x0000000000000000000000000000000000000000000000000000000000000001', // std
      '0x0000000000000000000000000000000000000000000000000000000000000002', // sui
    ],
  });

  // Transfer upgrade cap to sender
  tx.transferObjects([upgradeCap], tx.pure.address(address));

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  console.log('Status:', result.effects?.status.status);
  if (result.effects?.status.status !== 'success') {
    console.error('Deployment failed:', result.effects?.status.error);
    process.exit(1);
  }

  // Find created objects
  const changes = result.objectChanges;
  let packageId = '';
  let whitelistId = '';
  let capId = '';

  if (changes) {
    for (const change of changes) {
      if (change.type === 'published') {
        packageId = change.packageId;
      } else if (change.type === 'created') {
        if (change.objectType.endsWith('::whitelist::Whitelist')) {
          whitelistId = change.objectId;
        } else if (change.objectType.endsWith('::whitelist::Cap')) {
          capId = change.objectId;
        }
      }
    }
  }

  console.log('\n✅ Package Published!');
  console.log('PACKAGE_ID=' + packageId);

  if (!packageId) {
    console.error('❌ Failed to get Package ID');
    process.exit(1);
  }

  // Initialize Whitelist
  console.log('\nInitializing Whitelist...');
  const initTx = new Transaction();
  initTx.moveCall({
    target: `${packageId}::whitelist::create_whitelist_entry`,
    arguments: [initTx.pure.address(address)], // Beneficiary is admin
  });

  const initResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: initTx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  if (initResult.effects?.status.status !== 'success') {
    console.error('Initialization failed:', initResult.effects?.status.error);
    process.exit(1);
  }

  const initChanges = initResult.objectChanges;
  if (initChanges) {
    for (const change of initChanges) {
      if (change.type === 'created') {
        if (change.objectType.endsWith('::whitelist::Whitelist')) {
          whitelistId = change.objectId;
        } else if (change.objectType.endsWith('::whitelist::Cap')) {
          capId = change.objectId;
        }
      }
    }
  }

  console.log('\n✅ Initialization Successful!');
  console.log('--------------------------------------------------');
  console.log('PACKAGE_ID=' + packageId);
  console.log('WHITELIST_ID=' + whitelistId);
  console.log('CAP_ID=' + capId);
  console.log('--------------------------------------------------');
  console.log('\n⚠️  Please update your .env file with these values!');
}

deploy().catch(console.error);
