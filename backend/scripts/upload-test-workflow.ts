import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'http://localhost:8000/api';

interface WorkflowMetadata {
  name: string;
  author: string;
  description: string;
  created_at: number;
  updated_at: number;
  tags: string[];
  price_sui: number;
}

interface Strategy {
  id: string;
  version: string;
  meta: WorkflowMetadata;
  nodes: any[];
  edges: any[];
}

async function uploadWorkflow(workflow: Strategy) {
  console.log('📤 Uploading workflow to marketplace...');
  console.log('   Name:', workflow.meta.name);
  console.log('   Price:', workflow.meta.price_sui, 'SUI');
  console.log('   Author:', workflow.meta.author);

  try {
    const response = await fetch(`${API_BASE_URL}/workflows/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Server error response:', JSON.stringify(result, null, 2));
      throw new Error(result.error || result.message || 'Upload failed');
    }

    console.log('✅ Workflow uploaded successfully!');
    console.log('   Workflow ID:', result.data.id);
    console.log('   Metadata Blob:', result.data.metadataBlobId);
    console.log('   Data Blob:', result.data.dataBlobId);
    console.log('   Template ID:', result.data.templateId);

    return result.data;
  } catch (error: any) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
}

// Example workflows to upload
const exampleWorkflows: Strategy[] = [
  {
    id: 'arb-sui-usdc-cetus-turbos',
    version: '1.0',
    meta: {
      name: 'SUI-USDC Arbitrage (Cetus → Turbos)',
      author: process.env.ADMIN_ADDRESS || '0x0',
      description: 'Flash loan arbitrage between Cetus and Turbos DEX. Borrow SUI, swap SUI→USDC on Cetus, swap USDC→SUI on Turbos, repay loan + profit.',
      created_at: Date.now(),
      updated_at: Date.now(),
      tags: ['arbitrage', 'defi', 'cetus', 'turbos', 'flash-loan'],
      price_sui: 0.005,
    },
    nodes: [
      {
        id: 'node_1',
        type: 'FLASH_BORROW',
        protocol: 'NAVI',
        position: { x: 100, y: 100 },
        data: {
          amount: '1000000000', // 1 SUI
          asset: 'SUI',
        },
      },
      {
        id: 'node_2',
        type: 'DEX_SWAP',
        protocol: 'CETUS',
        position: { x: 300, y: 100 },
        data: {
          pool: 'SUI-USDC',
          direction: 'A2B',
          amountIn: 'from_borrow',
        },
      },
      {
        id: 'node_3',
        type: 'DEX_SWAP',
        protocol: 'TURBOS',
        position: { x: 500, y: 100 },
        data: {
          pool: 'USDC-SUI',
          direction: 'B2A',
          amountIn: 'from_previous',
        },
      },
      {
        id: 'node_4',
        type: 'FLASH_REPAY',
        protocol: 'NAVI',
        position: { x: 700, y: 100 },
        data: {
          receiptFrom: 'node_1',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node_1', target: 'node_2', sourceHandle: 'coin', targetHandle: 'coin_in' },
      { id: 'e2-3', source: 'node_2', target: 'node_3', sourceHandle: 'coin_out', targetHandle: 'coin_in' },
      { id: 'e3-4', source: 'node_3', target: 'node_4', sourceHandle: 'coin_out', targetHandle: 'coin_repay' },
      { id: 'e1-4', source: 'node_1', target: 'node_4', sourceHandle: 'receipt', targetHandle: 'receipt' },
    ],
  },
  {
    id: 'arb-deepbook-aftermath',
    version: '1.0',
    meta: {
      name: 'DeepBook → Aftermath Arbitrage',
      author: process.env.ADMIN_ADDRESS || '0x0',
      description: 'Multi-DEX arbitrage using DeepBook and Aftermath aggregator. Perfect for exploiting price differences across multiple liquidity sources.',
      created_at: Date.now(),
      updated_at: Date.now(),
      tags: ['arbitrage', 'deepbook', 'aftermath', 'aggregator'],
      price_sui: 0.003,
    },
    nodes: [
      {
        id: 'node_1',
        type: 'FLASH_BORROW',
        protocol: 'SCALLOP',
        position: { x: 100, y: 100 },
        data: {
          amount: '5000000000', // 5 SUI
          asset: 'SUI',
        },
      },
      {
        id: 'node_2',
        type: 'DEX_SWAP',
        protocol: 'DEEPBOOK',
        position: { x: 300, y: 100 },
        data: {
          pool: 'SUI-USDC',
          direction: 'sell',
        },
      },
      {
        id: 'node_3',
        type: 'DEX_SWAP',
        protocol: 'AFTERMATH',
        position: { x: 500, y: 100 },
        data: {
          tokenIn: 'USDC',
          tokenOut: 'SUI',
          useAggregator: true,
        },
      },
      {
        id: 'node_4',
        type: 'FLASH_REPAY',
        protocol: 'SCALLOP',
        position: { x: 700, y: 100 },
        data: {
          receiptFrom: 'node_1',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node_1', target: 'node_2' },
      { id: 'e2-3', source: 'node_2', target: 'node_3' },
      { id: 'e3-4', source: 'node_3', target: 'node_4' },
      { id: 'e1-4', source: 'node_1', target: 'node_4' },
    ],
  },
  {
    id: 'simple-cetus-swap',
    version: '1.0',
    meta: {
      name: 'Simple Cetus CLMM Strategy',
      author: process.env.ADMIN_ADDRESS || '0x0',
      description: 'Basic flash loan strategy for Cetus concentrated liquidity pools. Great for beginners to understand flash loan mechanics.',
      created_at: Date.now(),
      updated_at: Date.now(),
      tags: ['beginner', 'cetus', 'clmm', 'flash-loan'],
      price_sui: 0.001,
    },
    nodes: [
      {
        id: 'node_1',
        type: 'FLASH_BORROW',
        protocol: 'BUCKET',
        position: { x: 100, y: 100 },
        data: {
          amount: '500000000', // 0.5 SUI
          asset: 'BUCK',
        },
      },
      {
        id: 'node_2',
        type: 'DEX_SWAP',
        protocol: 'CETUS',
        position: { x: 300, y: 100 },
        data: {
          pool: 'BUCK-SUI',
          direction: 'A2B',
        },
      },
      {
        id: 'node_3',
        type: 'DEX_SWAP',
        protocol: 'CETUS',
        position: { x: 500, y: 100 },
        data: {
          pool: 'SUI-BUCK',
          direction: 'A2B',
        },
      },
      {
        id: 'node_4',
        type: 'FLASH_REPAY',
        protocol: 'BUCKET',
        position: { x: 700, y: 100 },
        data: {
          receiptFrom: 'node_1',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node_1', target: 'node_2' },
      { id: 'e2-3', source: 'node_2', target: 'node_3' },
      { id: 'e3-4', source: 'node_3', target: 'node_4' },
      { id: 'e1-4', source: 'node_1', target: 'node_4' },
    ],
  },
];

async function main() {
  console.log('🚀 Starting workflow upload script...\n');

  // Check if backend is running by trying to fetch workflows
  try {
    const healthCheck = await fetch(`${API_BASE_URL}/workflows/list`);
    if (!healthCheck.ok && healthCheck.status !== 404) {
      throw new Error('Backend not responding');
    }
    console.log('✅ Backend is running\n');
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend is not running. Please start it with: npm run start:dev');
      process.exit(1);
    }
    // If it's another error, continue (backend might be running)
    console.log('⚠️  Could not verify backend status, continuing anyway...\n');
  }

  // Upload each workflow
  for (let i = 0; i < exampleWorkflows.length; i++) {
    const workflow = exampleWorkflows[i];
    console.log(`\n[${ i + 1}/${exampleWorkflows.length}] Uploading: ${workflow.meta.name}`);
    console.log('━'.repeat(60));

    try {
      await uploadWorkflow(workflow);
      console.log('━'.repeat(60));

      // Wait a bit between uploads to avoid rate limiting
      if (i < exampleWorkflows.length - 1) {
        console.log('⏳ Waiting 3 seconds before next upload...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Failed to upload workflow:', workflow.id);
      console.error('Error:', error);
    }
  }

  console.log('\n✅ All workflows uploaded!');
  console.log('\n📋 Summary:');
  console.log(`   Total workflows: ${exampleWorkflows.length}`);
  console.log(`   Total value: ${exampleWorkflows.reduce((sum, w) => sum + w.meta.price_sui, 0)} SUI`);
  console.log('\n🌐 You can now view them in the marketplace at: http://localhost:3000');
}

main().catch(console.error);
