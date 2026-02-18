#!/usr/bin/env node

/**
 * Test script to upload a workflow to the marketplace
 * Usage: node test-upload-workflow.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:3000/api';

async function uploadWorkflow() {
  try {
    // Read example workflow
    const workflowPath = path.join(__dirname, '..', '..', 'examples', 'example-workflow-marketplace.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

    console.log('📤 Uploading workflow to marketplace...');
    console.log(`   Name: ${workflowData.meta.name}`);
    console.log(`   Price: ${workflowData.meta.price_sui} SUI`);

    const response = await fetch(`${API_BASE_URL}/workflows/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflowData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('\n✅ Workflow uploaded successfully!');
      console.log(`   Workflow ID: ${result.data.workflowId}`);
      console.log(`   Metadata Blob ID: ${result.data.metadataBlobId}`);
      console.log(`   Data Blob ID: ${result.data.dataBlobId}`);
      console.log(`   Walrus URL: ${result.data.walrusUrl}`);
    } else {
      console.error('\n❌ Upload failed:', result.error);
    }
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
  }
}

async function listWorkflows() {
  try {
    console.log('\n📋 Listing all workflows in marketplace...');

    const response = await fetch(`${API_BASE_URL}/workflows/list`);
    const result = await response.json();

    if (result.success) {
      console.log(`\n✅ Found ${result.data.length} workflow(s):`);
      result.data.forEach((workflow: any, index: number) => {
        console.log(`\n${index + 1}. ${workflow.name}`);
        console.log(`   ID: ${workflow.id}`);
        console.log(`   Author: ${workflow.author.slice(0, 10)}...`);
        console.log(`   Price: ${workflow.price_sui} SUI`);
        console.log(`   Purchases: ${workflow.purchaseCount}`);
        console.log(`   Tags: ${workflow.tags.join(', ')}`);
      });
    } else {
      console.error('❌ Failed to list workflows:', result.error);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
(async () => {
  console.log('🚀 Testing Marketplace API\n');
  console.log('Make sure the backend is running on http://localhost:3000\n');

  await uploadWorkflow();
  await listWorkflows();

  console.log('\n✨ Test complete!');
})();
