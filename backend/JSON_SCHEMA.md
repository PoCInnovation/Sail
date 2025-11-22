# Sail Flash Loan Builder - JSON Schema Documentation

## Table of Contents

1. [Overview](#overview)
2. [Strategy Structure](#strategy-structure)
3. [Node Types](#node-types)
4. [Edge Definitions](#edge-definitions)
5. [Validation Rules](#validation-rules)
6. [Complete Examples](#complete-examples)
7. [Integration Guide](#integration-guide)

---

## Overview

This document defines the **JSON schema contract** for the Sail Flash Loan Builder. This schema is the interface between:

- **UI Team**: Generates this JSON from the visual builder
- **Backend Team**: Compiles this JSON into Sui PTB
- **Marketplace Team**: Stores/encrypts this JSON on Walrus/Seal

### Key Principles

1. **Hot Potato Enforcement**: Every `FLASH_BORROW` must have a corresponding `FLASH_REPAY` connected via receipt
2. **Type Safety**: Coin edges must match types between nodes
3. **DAG Structure**: The strategy graph must be acyclic
4. **Reference Format**: All node references use `"nodeId.outputId"` format

---

## Strategy Structure

### Root Object

```typescript
interface Strategy {
  id: string;                    // UUID v4
  version: string;               // Schema version (e.g., "1.0.0")
  meta: StrategyMetadata;
  nodes: Node[];
  edges: Edge[];
  validation?: ValidationResult; // Optional validation state
}
```

### Metadata

```typescript
interface StrategyMetadata {
  name: string;                  // Strategy name (max 100 chars)
  author: string;                // Sui address (0x...)
  description: string;           // Description (max 500 chars)
  created_at: number;            // Unix timestamp (ms)
  updated_at: number;            // Unix timestamp (ms)
  tags: string[];                // Tags for categorization
  price_sui?: number;            // Marketplace price (optional)
  encrypted?: boolean;           // Is encrypted?
  walrus_blob_id?: string;       // Walrus storage ID
  seal_policy_id?: string;       // Seal policy ID
}
```

**Example:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "version": "1.0.0",
  "meta": {
    "name": "SUI-USDC Arbitrage",
    "author": "0x1234...abcd",
    "description": "Profit from SUI-USDC price differences",
    "created_at": 1700000000000,
    "updated_at": 1700000000000,
    "tags": ["arbitrage", "sui-usdc"],
    "price_sui": 10
  }
}
```

---

## Node Types

### 1. FLASH_BORROW

Borrows funds from a flash loan protocol.

```typescript
{
  "id": "borrow_1",
  "type": "FLASH_BORROW",
  "protocol": "NAVI" | "DEEPBOOK_V3" | "BUCKET" | "SCALLOP",
  "label": "Borrow 10 SUI",           // Optional display name
  "params": {
    "asset": "0x2::sui::SUI",         // Coin type to borrow
    "amount": "10000000000",          // Amount (string, u64)
    "pool_id": "0x...",               // Optional (required for DeepBook)
    "asset_type": "BASE" | "QUOTE"    // Optional (required for DeepBook)
  },
  "outputs": [
    { "id": "coin_borrowed", "type": "Coin<SUI>", "output_type": "COIN" },
    { "id": "receipt", "type": "FlashLoanReceipt", "output_type": "RECEIPT" }
  ],
  "position": { "x": 100, "y": 200 }  // Optional (for React Flow)
}
```

**Critical**: The `receipt` output MUST be connected to a `FLASH_REPAY` node with the same protocol.

### 2. FLASH_REPAY

Repays a flash loan.

```typescript
{
  "id": "repay_1",
  "type": "FLASH_REPAY",
  "protocol": "NAVI" | "DEEPBOOK_V3" | "BUCKET" | "SCALLOP",
  "label": "Repay Navi Loan",
  "params": {
    "asset": "0x2::sui::SUI",         // Must match borrow asset
    "pool_id": "0x...",               // Optional (required for DeepBook)
    "asset_type": "BASE" | "QUOTE"    // Optional (required for DeepBook)
  },
  "inputs": {
    "coin_repay": "swap_2.coin_out",  // Coin to repay (must include fee)
    "receipt": "borrow_1.receipt"     // Receipt from corresponding borrow
  }
}
```

**Critical**:
- `inputs.receipt` MUST reference a `FLASH_BORROW` node
- `protocol` and `asset` MUST match the borrow node

### 3. DEX_SWAP

Swaps coins on a DEX.

#### Cetus Example

```typescript
{
  "id": "swap_1",
  "type": "DEX_SWAP",
  "protocol": "CETUS",
  "params": {
    "pool_id": "0x...",               // Cetus pool ID
    "coin_type_a": "0x2::sui::SUI",   // Pool coin A
    "coin_type_b": "0x...::USDC",     // Pool coin B
    "direction": "A_TO_B" | "B_TO_A", // Swap direction
    "amount_mode": "EXACT_IN" | "EXACT_OUT",
    "amount": "10000000000",          // Amount as string
    "slippage_tolerance": "0.01",     // 1% slippage
    "sqrt_price_limit": "..."         // Optional (auto-calculated)
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    { "id": "coin_out", "type": "Coin<USDC>", "output_type": "COIN" }
  ]
}
```

#### Aftermath Router Example

```typescript
{
  "id": "swap_1",
  "type": "DEX_SWAP",
  "protocol": "AFTERMATH_ROUTER",
  "params": {
    "coin_type_in": "0x2::sui::SUI",
    "coin_type_out": "0x...::USDC",
    "amount_in": "10000000000",
    "slippage_tolerance": "0.01",
    "referrer": "0x...",              // Optional
    "platform_fee": "0.001"           // Optional (0.1%)
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    { "id": "coin_out", "type": "Coin<USDC>", "output_type": "COIN" }
  ]
}
```

### 4. COIN_SPLIT

Splits a coin into multiple coins.

```typescript
{
  "id": "split_1",
  "type": "COIN_SPLIT",
  "protocol": "NATIVE",
  "params": {
    "amounts": ["5000000000", "5000000000"]  // Array of amounts
  },
  "inputs": {
    "coin": "borrow_1.coin_borrowed"
  },
  "outputs": [
    { "id": "coin_1", "type": "Coin<SUI>", "output_type": "COIN" },
    { "id": "coin_2", "type": "Coin<SUI>", "output_type": "COIN" }
  ]
}
```

### 5. COIN_MERGE

Merges multiple coins into one.

```typescript
{
  "id": "merge_1",
  "type": "COIN_MERGE",
  "protocol": "NATIVE",
  "params": {},
  "inputs": {
    "target_coin": "swap_1.coin_out",
    "merge_coins": ["swap_2.coin_out", "swap_3.coin_out"]
  },
  "outputs": [
    { "id": "merged_coin", "type": "Coin<SUI>", "output_type": "COIN" }
  ]
}
```

---

## Edge Definitions

Edges connect node outputs to node inputs.

```typescript
interface Edge {
  id: string;                    // Unique edge ID
  source: string;                // Source node ID
  source_output: string;         // Output ID from source node
  target: string;                // Target node ID
  target_input: string;          // Input ID on target node
  edge_type: "COIN" | "RECEIPT"; // Type of data flow
  coin_type?: string;            // For COIN edges (optional but recommended)
}
```

**Example:**

```json
{
  "id": "edge_1",
  "source": "borrow_1",
  "source_output": "coin_borrowed",
  "target": "swap_1",
  "target_input": "coin_in",
  "edge_type": "COIN",
  "coin_type": "0x2::sui::SUI"
}
```

### Edge Types

- **COIN**: Represents coin flow between nodes
- **RECEIPT**: Represents receipt flow (hot potato) from borrow to repay

---

## Validation Rules

### Critical Errors (Prevent Execution)

| Rule ID | Description |
|---------|-------------|
| `HOT_POTATO_1` | Every FLASH_BORROW must have a corresponding FLASH_REPAY |
| `HOT_POTATO_2` | Receipt must connect directly from borrow to repay (no intermediate nodes) |
| `HOT_POTATO_3` | Borrow and repay must use same protocol |
| `ASSET_1` | Borrow and repay asset must match |
| `GRAPH_1` | Strategy must be a DAG (no cycles) |
| `TYPE_SAFETY_2` | COIN_MERGE cannot merge different coin types |
| `PTB_1` | Strategy must not exceed 1024 PTB commands |

### Warnings (Non-Critical)

| Rule ID | Description |
|---------|-------------|
| `PTB_2` | Strategy with >100 nodes may be slow to simulate |
| `GRAPH_2` | All nodes should be reachable from a FLASH_BORROW node |

---

## Complete Examples

### Example 1: Simple Arbitrage

See [/src/examples/simple-arbitrage.json](./src/examples/simple-arbitrage.json)

### Example 2: Multi-Protocol Strategy

```json
{
  "id": "uuid-here",
  "version": "1.0.0",
  "meta": { "name": "Multi-Protocol Arb", "..." },
  "nodes": [
    {
      "id": "borrow_navi",
      "type": "FLASH_BORROW",
      "protocol": "NAVI",
      "params": { "asset": "0x2::sui::SUI", "amount": "10000000000" },
      "outputs": [
        { "id": "coin", "type": "Coin<SUI>", "output_type": "COIN" },
        { "id": "receipt", "type": "Receipt", "output_type": "RECEIPT" }
      ]
    },
    {
      "id": "borrow_scallop",
      "type": "FLASH_BORROW",
      "protocol": "SCALLOP",
      "params": { "asset": "0x...::USDC", "amount": "10000000" },
      "outputs": [
        { "id": "coin", "type": "Coin<USDC>", "output_type": "COIN" },
        { "id": "receipt", "type": "Receipt", "output_type": "RECEIPT" }
      ]
    },
    // ... swaps using both borrowed coins ...
    {
      "id": "repay_navi",
      "type": "FLASH_REPAY",
      "protocol": "NAVI",
      "params": { "asset": "0x2::sui::SUI" },
      "inputs": {
        "coin_repay": "final_swap_sui.coin_out",
        "receipt": "borrow_navi.receipt"
      }
    },
    {
      "id": "repay_scallop",
      "type": "FLASH_REPAY",
      "protocol": "SCALLOP",
      "params": { "asset": "0x...::USDC" },
      "inputs": {
        "coin_repay": "final_swap_usdc.coin_out",
        "receipt": "borrow_scallop.receipt"
      }
    }
  ],
  "edges": [ "..." ]
}
```

---

## Integration Guide

### For UI Team (React Flow)

```typescript
import { Strategy } from "@sail/backend";

// Generate strategy from React Flow graph
function exportStrategy(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): Strategy {
  return {
    id: uuidv4(),
    version: "1.0.0",
    meta: {
      name: userInput.name,
      author: walletAddress,
      description: userInput.description,
      created_at: Date.now(),
      updated_at: Date.now(),
      tags: userInput.tags,
    },
    nodes: nodes.map(convertToStrategyNode),
    edges: edges.map(convertToStrategyEdge),
  };
}

// Validate before showing "Execute" button
import { TransactionBuilder } from "@sail/backend";

const validation = TransactionBuilder.validate(strategy);
if (!validation.success) {
  showErrors(validation.errors);
  disableExecuteButton();
}
```

### For Backend Team (PTB Builder)

```typescript
import { TransactionBuilder } from "@sail/backend";
import { Transaction } from "@mysten/sui/transactions";

// Build PTB from strategy
const builder = new TransactionBuilder("testnet");
const tx: Transaction = await builder.buildFromStrategy(strategy);

// Sign and execute
const result = await signAndExecuteTransaction({ transaction: tx });
```

### For Marketplace Team (Walrus/Seal)

```typescript
// Encrypt and upload
const jsonString = JSON.stringify(strategy);
const encrypted = await sealSDK.encrypt(jsonString);
const blobId = await walrusSDK.upload(encrypted);

// Update metadata
strategy.meta.encrypted = true;
strategy.meta.walrus_blob_id = blobId;
strategy.meta.seal_policy_id = policyId;

// Mint NFT with metadata
const nftId = await mintStrategyNFT(strategy.meta);
```

---

## Appendix: Coin Type Reference

| Coin | Type Address | Decimals |
|------|-------------|----------|
| SUI | `0x2::sui::SUI` | 9 |
| USDC | `0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN` | 6 |

---

## Support

For questions or issues with the JSON schema:
- Check validation errors for specific guidance
- See example strategies in `/src/examples/`
- Consult the TypeScript interfaces in `/src/types/strategy.ts`
