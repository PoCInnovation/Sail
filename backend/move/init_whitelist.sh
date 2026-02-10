#!/bin/bash

# Script pour initialiser la whitelist après déploiement

PACKAGE_ID="0xff53bc852bf1281d2f477f47c8699f5af3ad7b8ffe5efabcc0922aef5ce2a758"
BENEFICIARY="0x904f64f755764162a228a7da49b1288160597165ec60ebbf5fb9a94957db76c3"

echo "🚀 Initializing whitelist..."
echo "   Package ID: $PACKAGE_ID"
echo "   Beneficiary: $BENEFICIARY"
echo ""

# Appeler create_whitelist_entry
sui client call \
  --package "$PACKAGE_ID" \
  --module whitelist \
  --function create_whitelist_entry \
  --args "$BENEFICIARY" \
  --gas-budget 10000000

echo ""
echo "✅ Whitelist initialized!"
echo ""
echo "📋 Now extract the IDs from the output above:"
echo "   - Look for 'Owner: Account Address' with type '...::whitelist::Cap' → This is CAP_ID"
echo "   - Look for 'Owner: Shared' with type '...::whitelist::Whitelist' → This is WHITELIST_ID"
