# Sail JSON Schema - Quick Reference

## Minimal Valid Strategy

```json
{
  "id": "uuid-v4-here",
  "version": "1.0.0",
  "meta": {
    "name": "My Strategy",
    "author": "0x1234...abcd",
    "description": "Description here",
    "created_at": 1700000000000,
    "updated_at": 1700000000000,
    "tags": []
  },
  "nodes": [
    {
      "id": "borrow_1",
      "type": "FLASH_BORROW",
      "protocol": "NAVI",
      "params": {
        "asset": "0x2::sui::SUI",
        "amount": "1000000000"
      },
      "outputs": [
        { "id": "coin", "type": "Coin<SUI>", "output_type": "COIN" },
        { "id": "receipt", "type": "Receipt", "output_type": "RECEIPT" }
      ]
    },
    {
      "id": "repay_1",
      "type": "FLASH_REPAY",
      "protocol": "NAVI",
      "params": {
        "asset": "0x2::sui::SUI"
      },
      "inputs": {
        "coin_repay": "borrow_1.coin",
        "receipt": "borrow_1.receipt"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "borrow_1",
      "source_output": "coin",
      "target": "repay_1",
      "target_input": "coin_repay",
      "edge_type": "COIN",
      "coin_type": "0x2::sui::SUI"
    },
    {
      "id": "edge_2",
      "source": "borrow_1",
      "source_output": "receipt",
      "target": "repay_1",
      "target_input": "receipt",
      "edge_type": "RECEIPT"
    }
  ]
}
```

## Node Templates

### FLASH_BORROW (Navi)

```json
{
  "id": "borrow_1",
  "type": "FLASH_BORROW",
  "protocol": "NAVI",
  "params": {
    "asset": "0x2::sui::SUI",
    "amount": "10000000000"
  },
  "outputs": [
    { "id": "coin_borrowed", "type": "Coin<SUI>", "output_type": "COIN" },
    { "id": "receipt", "type": "Receipt", "output_type": "RECEIPT" }
  ]
}
```

### FLASH_REPAY (Navi)

```json
{
  "id": "repay_1",
  "type": "FLASH_REPAY",
  "protocol": "NAVI",
  "params": {
    "asset": "0x2::sui::SUI"
  },
  "inputs": {
    "coin_repay": "swap_final.coin_out",
    "receipt": "borrow_1.receipt"
  }
}
```

### DEX_SWAP (Cetus)

```json
{
  "id": "swap_1",
  "type": "DEX_SWAP",
  "protocol": "CETUS",
  "params": {
    "pool_id": "0xCetusPoolID",
    "coin_type_a": "0x2::sui::SUI",
    "coin_type_b": "0x...::USDC",
    "direction": "A_TO_B",
    "amount_mode": "EXACT_IN",
    "amount": "10000000000",
    "slippage_tolerance": "0.01"
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    { "id": "coin_out", "type": "Coin<USDC>", "output_type": "COIN" }
  ]
}
```

### COIN_SPLIT

```json
{
  "id": "split_1",
  "type": "COIN_SPLIT",
  "protocol": "NATIVE",
  "params": {
    "amounts": ["5000000000", "5000000000"]
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

### COIN_MERGE

```json
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

## Edge Templates

### COIN Edge

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

### RECEIPT Edge (Hot Potato)

```json
{
  "id": "edge_receipt",
  "source": "borrow_1",
  "source_output": "receipt",
  "target": "repay_1",
  "target_input": "receipt",
  "edge_type": "RECEIPT"
}
```

## Common Patterns

### Pattern 1: Simple Arbitrage Loop

Borrow → Swap A→B → Swap B→A → Repay

```json
{
  "nodes": [
    { "id": "borrow_1", "type": "FLASH_BORROW", "..." },
    { "id": "swap_1", "type": "DEX_SWAP", "..." },    // SUI → USDC
    { "id": "swap_2", "type": "DEX_SWAP", "..." },    // USDC → SUI
    { "id": "repay_1", "type": "FLASH_REPAY", "..." }
  ],
  "edges": [
    { "source": "borrow_1", "target": "swap_1", "edge_type": "COIN" },
    { "source": "swap_1", "target": "swap_2", "edge_type": "COIN" },
    { "source": "swap_2", "target": "repay_1", "edge_type": "COIN" },
    { "source": "borrow_1", "target": "repay_1", "edge_type": "RECEIPT" }
  ]
}
```

### Pattern 2: Split Strategy

Borrow → Split → Swap1 + Swap2 → Merge → Repay

```json
{
  "nodes": [
    { "id": "borrow_1", "type": "FLASH_BORROW", "..." },
    { "id": "split_1", "type": "COIN_SPLIT", "params": { "amounts": ["5000", "5000"] } },
    { "id": "swap_1", "type": "DEX_SWAP", "..." },
    { "id": "swap_2", "type": "DEX_SWAP", "..." },
    { "id": "merge_1", "type": "COIN_MERGE", "..." },
    { "id": "repay_1", "type": "FLASH_REPAY", "..." }
  ],
  "edges": [
    { "source": "borrow_1", "target": "split_1" },
    { "source": "split_1", "source_output": "coin_1", "target": "swap_1" },
    { "source": "split_1", "source_output": "coin_2", "target": "swap_2" },
    { "source": "swap_1", "target": "merge_1", "target_input": "target_coin" },
    { "source": "swap_2", "target": "merge_1", "target_input": "merge_coins" },
    { "source": "merge_1", "target": "repay_1" },
    { "source": "borrow_1", "target": "repay_1", "edge_type": "RECEIPT" }
  ]
}
```

## Validation Checklist

Before executing a strategy, ensure:

- [ ] Every `FLASH_BORROW` has a matching `FLASH_REPAY`
- [ ] Receipt edge connects borrow → repay directly
- [ ] Borrow and repay use same `protocol` and `asset`
- [ ] All node IDs are unique
- [ ] All edge references point to existing nodes
- [ ] No cycles in the graph
- [ ] Coin types match across edges
- [ ] All required fields are present

## Common Coin Types

```typescript
// SUI
"0x2::sui::SUI"

// USDC
"0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"

// Amount format (string, u64)
"1000000000"  // 1 SUI (9 decimals)
"1000000"     // 1 USDC (6 decimals)
```

## Protocols

### Flash Loan Protocols

- `NAVI` - Fee: 0.06%
- `DEEPBOOK_V3` - TBD
- `SCALLOP` - Fee: 0.1%
- `BUCKET` - TBD

### DEX Protocols

- `CETUS` - CLMM, requires `sqrt_price_limit`
- `DEEPBOOK_V3` - Order book
- `TURBOS` - CLMM
- `AFTERMATH_ROUTER` - Smart aggregator

## Reference Format

Node outputs referenced as: `"nodeId.outputId"`

Examples:
- `"borrow_1.coin_borrowed"`
- `"swap_1.coin_out"`
- `"split_1.coin_1"`
- `"borrow_1.receipt"`

## Error Messages

| Error | Fix |
|-------|-----|
| "Hot potato not consumed" | Add FLASH_REPAY node with receipt connection |
| "Cannot resolve reference" | Check node ID and output ID exist |
| "Cycle detected" | Remove circular edges |
| "Asset mismatch" | Ensure borrow and repay use same asset |
| "Protocol mismatch" | Ensure borrow and repay use same protocol |
