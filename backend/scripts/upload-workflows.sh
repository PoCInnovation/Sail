#!/bin/bash

echo "🚀 Marketplace Workflow Upload Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8000/api/seal/health > /dev/null 2>&1; then
    echo "❌ Backend is not running!"
    echo "   Please start it with: npm run dev"
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Run the TypeScript upload script
cd "$(dirname "$0")/.."
npx tsx scripts/upload-test-workflow.ts
