# 📋 Liste des Blocks Gérés et Leurs Paramètres

## 1️⃣ FLASH_BORROW

**Type**: `"FLASH_BORROW"`  
**Protocoles supportés**: `"NAVI"`, `"DEEPBOOK_V3"`, `"BUCKET"`, `"SCALLOP"`

### Paramètres

```json
{
  "asset": "string",     // Type du coin: "0x2::sui::SUI"
  "amount": "string",    // Montant à emprunter (u64 en string)
  "pool_id": "string",   // (Optionnel) Requis pour DeepBook
  "asset_type": "BASE" | "QUOTE"  // (Optionnel) Requis pour DeepBook
}
```

### Outputs

- `coin_borrowed` (COIN)
- `receipt` (RECEIPT)

---

## 2️⃣ FLASH_REPAY

**Type**: `"FLASH_REPAY"`  
**Protocoles supportés**: `"NAVI"`, `"DEEPBOOK_V3"`, `"BUCKET"`, `"SCALLOP"`

### Paramètres

```json
{
  "asset": "string",     // Doit correspondre au borrow
  "pool_id": "string",   // (Optionnel) Requis pour DeepBook
  "asset_type": "BASE" | "QUOTE"  // (Optionnel) Requis pour DeepBook
}
```

### Inputs

```json
{
  "coin_repay": "node_id.output_id", // Coin pour rembourser
  "receipt": "borrow_node_id.receipt" // Receipt du borrow
}
```

---

## 3️⃣ DEX_SWAP

**Type**: `"DEX_SWAP"`  
**Protocoles supportés**: `"CETUS"`, `"DEEPBOOK_V3"`, `"TURBOS"`, `"AFTERMATH_ROUTER"`

### Paramètres CETUS

```json
{
  "pool_id": "string",
  "coin_type_a": "string",           // "0x2::sui::SUI"
  "coin_type_b": "string",           // "0x...::usdc::USDC"
  "direction": "A_TO_B" | "B_TO_A",
  "amount_mode": "EXACT_IN" | "EXACT_OUT",
  "amount": "string",                // Montant ou "ALL"
  "slippage_tolerance": "string",    // "0.01" pour 1%
  "sqrt_price_limit": "string"       // (Optionnel)
}
```

### Paramètres DEEPBOOK_V3

```json
{
  "pool_key": "string",
  "direction": "BASE_TO_QUOTE" | "QUOTE_TO_BASE",
  "amount": "string",
  "slippage_tolerance": "string"     // (Optionnel)
}
```

### Paramètres TURBOS

```json
{
  "pool_id": "string",
  "coin_type_a": "string",
  "coin_type_b": "string",
  "direction": "A_TO_B" | "B_TO_A",
  "amount": "string",
  "slippage_tolerance": "string"
}
```

### Paramètres AFTERMATH_ROUTER

```json
{
  "coin_type_in": "string",
  "coin_type_out": "string",
  "amount_in": "string",
  "slippage_tolerance": "string",
  "referrer": "string", // (Optionnel) Adresse
  "platform_fee": "string" // (Optionnel) "0.001" pour 0.1%
}
```

### Inputs

```json
{
  "coin_in": "node_id.output_id"
}
```

### Outputs

- `coin_out` (COIN)

---

## 4️⃣ COIN_SPLIT

**Type**: `"COIN_SPLIT"`  
**Protocol**: `"NATIVE"`

### Paramètres

```json
{
  "amounts": ["string", "string", ...]  // Liste de montants à split
}
```

### Inputs

```json
{
  "coin": "node_id.output_id" | "GAS"  // Coin à split ou "GAS"
}
```

### Outputs

- Multiple `coin_X` (COIN) - un par montant dans `amounts`

---

## 5️⃣ COIN_MERGE

**Type**: `"COIN_MERGE"`  
**Protocol**: `"NATIVE"`

### Paramètres

```json
{} // Objet vide
```

### Inputs

```json
{
  "target_coin": "node_id.output_id",      // Coin destinataire
  "merge_coins": ["node_id.output_id", ...]  // Coins à merger
}
```

### Outputs

- `merged_coin` (COIN)

---

## 6️⃣ CUSTOM

**Type**: `"CUSTOM"`  
**Protocol**: `"CUSTOM"`

### Paramètres

```json
{
  "target": "string",              // "0xPackage::module::function"
  "arguments": [CustomArgument],   // Liste d'arguments
  "type_arguments": ["string"],    // (Optionnel) Type params
  "description": "string"          // (Optionnel) Description
}
```

### CustomArgument Types

#### Type: `"pure"`

```json
{
  "type": "pure",
  "value": any,                    // string | number | boolean
  "value_type": "string",          // "u64", "u128", "bool", "address", etc.
  "comment": "string"              // (Optionnel)
}
```

#### Type: `"object"`

```json
{
  "type": "object",
  "object_id": "string", // "0x..." Object ID
  "comment": "string" // (Optionnel)
}
```

#### Type: `"shared_object"`

```json
{
  "type": "shared_object",
  "value": "string",               // "0x..." Shared object ID
  "mutable": boolean,              // (Optionnel) Si mutable
  "comment": "string"              // (Optionnel)
}
```

#### Type: `"input"`

```json
{
  "type": "input",
  "input_ref": "string", // "node_id.output_id"
  "comment": "string" // (Optionnel)
}
```

### Inputs

```json
{
  "any_key": "node_id.output_id" | ["node_id.output_id", ...]
}
```

### Outputs

```json
[
  { "id": "string", "type": "string", "output_type": "COIN" | "RECEIPT" }
]
```

---

## 📊 Exemple Complet

```json
{
  "id": "example-strategy",
  "version": "1.0.0",
  "meta": {
    "name": "Example Strategy",
    "author": "0x...",
    "description": "...",
    "created_at": 1700000000000,
    "updated_at": 1700000000000,
    "tags": ["example"]
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
        { "id": "coin", "type": "Coin<0x2::sui::SUI>", "output_type": "COIN" },
        {
          "id": "receipt",
          "type": "FlashLoanReceipt",
          "output_type": "RECEIPT"
        }
      ]
    },
    {
      "id": "swap_1",
      "type": "DEX_SWAP",
      "protocol": "CETUS",
      "params": {
        "pool_id": "0x...",
        "coin_type_a": "0x2::sui::SUI",
        "coin_type_b": "0x...::usdc::USDC",
        "direction": "A_TO_B",
        "amount_mode": "EXACT_IN",
        "amount": "1000000000",
        "slippage_tolerance": "0.01"
      },
      "inputs": { "coin_in": "borrow_1.coin" },
      "outputs": [
        { "id": "usdc_out", "type": "Coin<USDC>", "output_type": "COIN" }
      ]
    },
    {
      "id": "repay_1",
      "type": "FLASH_REPAY",
      "protocol": "NAVI",
      "params": { "asset": "0x2::sui::SUI" },
      "inputs": {
        "coin_repay": "swap_1.usdc_out",
        "receipt": "borrow_1.receipt"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "borrow_1",
      "source_output": "coin",
      "target": "swap_1",
      "target_input": "coin_in",
      "edge_type": "COIN",
      "coin_type": "0x2::sui::SUI"
    },
    {
      "id": "e2",
      "source": "borrow_1",
      "source_output": "receipt",
      "target": "repay_1",
      "target_input": "receipt",
      "edge_type": "RECEIPT"
    }
  ]
}
```

---

## 🔗 Références

- Code source: [`src/types/strategy.ts`](file:///home/aurelien/POC/hackathon_SUI/backend/src/types/strategy.ts)
- Validation: [`src/types/schema.ts`](file:///home/aurelien/POC/hackathon_SUI/backend/src/types/schema.ts)
- Exemples: [`examples/`](file:///home/aurelien/POC/hackathon_SUI/backend/examples/)
