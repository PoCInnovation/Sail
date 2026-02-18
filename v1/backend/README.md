# Sail Backend - PTB Builder Engine

The core engine that compiles flash loan strategy JSON into Sui Programmable Transaction Blocks (PTB).

## 📁 Project Structure

```
backend/
├── src/
│   ├── types/              # TypeScript interfaces and Zod schemas
│   │   ├── strategy.ts     # Core strategy interfaces
│   │   └── schema.ts       # Zod validation schemas
│   ├── validation/         # Validation logic
│   │   ├── schema-validator.ts   # JSON schema validation
│   │   └── graph-validator.ts    # Graph structure validation
│   ├── adapters/           # Protocol adapters
│   │   ├── flashloan/      # Flash loan protocol adapters
│   │   │   ├── types.ts    # Adapter interfaces
│   │   │   └── navi-adapter.ts
│   │   └── dex/            # DEX protocol adapters
│   │       ├── types.ts    # Adapter interfaces
│   │       └── cetus-adapter.ts
│   ├── core/               # Core PTB builder
│   │   └── transaction-builder.ts
│   ├── utils/              # Utility functions
│   │   └── topological-sort.ts
│   ├── examples/           # Example strategy JSON files
│   │   └── simple-arbitrage.json
│   └── index.ts            # Main export file
├── JSON_SCHEMA.md          # Complete JSON schema documentation
├── package.json
├── tsconfig.json
└── README.md               # This file
```

## 🚀 Quick Start

### Installation

```bash
cd backend
pnpm install
```

### Build

```bash
pnpm build
```

### Development

```bash
pnpm dev   # Watch mode
```

## 📖 Usage

### Basic Example

```typescript
import { TransactionBuilder } from "@sail/backend";
import { Strategy } from "@sail/backend";

// Load strategy JSON
const strategy: Strategy = {
  id: "uuid-here",
  version: "1.0.0",
  meta: { /* ... */ },
  nodes: [ /* ... */ ],
  edges: [ /* ... */ ]
};

// Validate strategy
const validation = TransactionBuilder.validate(strategy);
if (!validation.success) {
  console.error("Validation failed:", validation.errors);
  return;
}

// Build PTB
const builder = new TransactionBuilder("testnet");
const tx = await builder.buildFromStrategy(strategy);

// Sign and execute
const result = await signAndExecuteTransaction({ transaction: tx });
```

### Validation Only

```typescript
import { SchemaValidator, GraphValidator } from "@sail/backend";

// Schema validation
const schemaResult = SchemaValidator.validate(strategyJson);

// Graph validation (hot potato rules, DAG, etc.)
const graphResult = GraphValidator.validate(strategy);
```

## 🏗️ Architecture

### 1. Validation Pipeline

```
Strategy JSON
  ↓
Schema Validator (Zod)
  ↓
Graph Validator (Hot Potato, DAG, Type Safety)
  ↓
✓ Valid Strategy
```

### 2. PTB Construction Pipeline

```
Valid Strategy
  ↓
Topological Sort (Dependency Order)
  ↓
Pre-Simulate DEX Swaps (Get Estimates)
  ↓
Execute Nodes in Order
  ↓
Result Caching (nodeId.outputId → PTB Result)
  ↓
Reference Resolution (Connect Outputs to Inputs)
  ↓
✓ Complete PTB
```

### 3. Hot Potato Flow

```
FLASH_BORROW Node
  ├─→ coin (can be swapped, split, merged)
  └─→ receipt (MUST go directly to FLASH_REPAY)
       │
       └─→ FLASH_REPAY Node (same protocol)
```

## 🔌 Protocol Adapters

### Flash Loan Adapters

Implemented:
- ✅ **Navi Protocol** (0.06% fee)

To Implement:
- ⏳ DeepBook V3
- ⏳ Scallop (0.1% fee)
- ⏳ Bucket Protocol

### DEX Adapters

Implemented:
- ✅ **Cetus CLMM** (requires pre-swap simulation)

To Implement:
- ⏳ DeepBook V3
- ⏳ Turbos Finance
- ⏳ Aftermath Router (smart aggregator)

### Adding New Adapters

#### Flash Loan Adapter

```typescript
import { BaseFlashLoanAdapter, BorrowResult } from "./types";

export class YourProtocolAdapter extends BaseFlashLoanAdapter {
  readonly protocol = "YOUR_PROTOCOL";
  protected readonly feePercentage = 0.001; // 0.1%

  borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult {
    // Implement borrow logic
    return { coin, receipt };
  }

  repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any): void {
    // Implement repay logic
  }
}
```

#### DEX Adapter

```typescript
import { BaseDexAdapter, SwapEstimate } from "./types";

export class YourDexAdapter extends BaseDexAdapter {
  readonly protocol = "YOUR_DEX";

  async preSwap(node: DexSwapNode): Promise<SwapEstimate> {
    // Simulate swap, return estimate
  }

  swap(tx: Transaction, node: DexSwapNode, coinIn: any, estimate: SwapEstimate): any {
    // Add swap to PTB, return coin out
  }
}
```

## 📝 JSON Schema

See [JSON_SCHEMA.md](./JSON_SCHEMA.md) for complete documentation.

### Key Concepts

1. **Node Reference Format**: `"nodeId.outputId"` (e.g., `"borrow_1.coin_borrowed"`)
2. **Hot Potato Constraint**: Receipt MUST flow from borrow → repay
3. **Edge Types**:
   - `COIN`: Coin flow (can go through swaps, splits, merges)
   - `RECEIPT`: Receipt flow (direct borrow → repay only)

## ✅ Validation Rules

### Critical Errors

| Rule | Description |
|------|-------------|
| `HOT_POTATO_1` | Every FLASH_BORROW must have FLASH_REPAY |
| `HOT_POTATO_2` | Receipt connects directly (no intermediate nodes) |
| `HOT_POTATO_3` | Borrow/Repay same protocol |
| `ASSET_1` | Borrow/Repay same asset |
| `GRAPH_1` | No cycles (DAG) |
| `TYPE_SAFETY_2` | COIN_MERGE same coin types |
| `PTB_1` | Max 1024 commands |

## 🧪 Testing

### Run Tests

```bash
pnpm test
```

### Test with Example Strategy

```typescript
import simpleArbitrage from "./src/examples/simple-arbitrage.json";

const builder = new TransactionBuilder("testnet");
const validation = TransactionBuilder.validate(simpleArbitrage);
console.log("Validation:", validation);

if (validation.success) {
  const tx = await builder.buildFromStrategy(simpleArbitrage);
  console.log("PTB built successfully!");
}
```

## 🔗 Integration with Other Teams

### For UI Team

```typescript
// Export strategy from React Flow
const strategy: Strategy = exportStrategyFromUI(nodes, edges);

// Validate before enabling "Execute" button
const validation = TransactionBuilder.validate(strategy);
if (validation.success) {
  enableExecuteButton();
}
```

### For Marketplace Team

```typescript
// Strategy is just JSON - can be stored anywhere
const jsonString = JSON.stringify(strategy);

// Encrypt with Seal
const encrypted = await sealSDK.encrypt(jsonString);

// Upload to Walrus
const blobId = await walrusSDK.upload(encrypted);
```

## 🐛 Troubleshooting

### Common Errors

**"Cannot resolve reference: borrow_1.coin"**
- Ensure the node ID and output ID exist
- Check that nodes are in correct order (topological sort handles this automatically)

**"Hot potato validation failed"**
- Ensure every FLASH_BORROW has a FLASH_REPAY
- Check that receipt edge connects directly (no intermediate nodes)
- Verify protocol matches between borrow and repay

**"Cycle detected in strategy graph"**
- Strategy must be a DAG (no loops)
- Check edge connections in React Flow

## 📚 Resources

- **Sui PTB Documentation**: https://docs.sui.io/concepts/transactions/prog-txn-blocks
- **Navi SDK**: https://sdk.naviprotocol.io
- **Cetus SDK**: https://cetus-1.gitbook.io/cetus-developer-docs
- **Hot Potato Pattern**: https://github.com/sui-foundation/sui-move-intro-course/blob/main/unit-five/lessons/2_hot_potato_pattern.md

## 🤝 Contributing

To add a new protocol:

1. Create adapter in `/src/adapters/flashloan/` or `/src/adapters/dex/`
2. Implement the required interface (`FlashLoanAdapter` or `DexAdapter`)
3. Register in `TransactionBuilder` constructor
4. Add tests
5. Update documentation

## 📄 License

MIT
