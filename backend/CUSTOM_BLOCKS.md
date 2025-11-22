# Custom Blocks - Guide Complet

## 🎯 Pourquoi les Custom Blocks ?

Les **Custom Blocks** permettent aux utilisateurs d'intégrer **n'importe quel protocole DeFi** sans attendre qu'on l'intègre nous-mêmes. C'est la "killer feature" pour le marketplace !

### Use Cases

1. **Nouveau DEX non supporté** (ex: BlueMove, Kriya, SuiSwap)
2. **Protocole de lending exotique**
3. **Opérations DeFi complexes** (staking, farming, etc.)
4. **Stratégies avancées** créées par des MEV searchers

---

## 📦 Structure JSON d'un Custom Block

```typescript
{
  "id": "custom_1",
  "type": "CUSTOM",
  "protocol": "CUSTOM",
  "label": "Mon DEX Custom",
  "params": {
    "target": "0xPackageID::module::function",
    "description": "Description pour le marketplace",
    "arguments": [
      {
        "type": "pure" | "object" | "input",
        "value": ...,              // Pour "pure"
        "input_ref": "...",        // Pour "input"
        "object_id": "0x...",      // Pour "object"
        "value_type": "u64" | "bool" | "address" | "string"
      }
    ],
    "type_arguments": ["0x2::sui::SUI", "0x...::USDC"]
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    { "id": "coin_out", "type": "Coin<USDC>", "output_type": "COIN" }
  ]
}
```

---

## 🔧 Types d'Arguments

### 1. **Pure** - Valeurs simples

```json
{
  "type": "pure",
  "value": 1000000,
  "value_type": "u64"
}
```

**Supported types:**
- `u64` - Entiers (montants, quantités)
- `u128` - Très grands entiers
- `bool` - Booléens (direction, flags)
- `address` - Adresses Sui
- `string` - Chaînes de caractères

### 2. **Object** - Objets on-chain

```json
{
  "type": "object",
  "object_id": "0xPoolObjectID"
}
```

Utilisé pour :
- Pool IDs
- Configuration objects
- NFTs
- Shared objects

### 3. **Input** - Référence à un autre node

```json
{
  "type": "input",
  "input_ref": "borrow_1.coin_borrowed"
}
```

Permet de chaîner les nodes en passant les outputs d'un node aux inputs d'un autre.

---

## 📝 Exemples Complets

### Exemple 1: BlueMove DEX Swap

```json
{
  "id": "bluemove_swap",
  "type": "CUSTOM",
  "protocol": "CUSTOM",
  "label": "Swap sur BlueMove",
  "params": {
    "target": "0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9::swap::swap_exact_input",
    "description": "Swap SUI → USDC sur BlueMove avec slippage protection",
    "arguments": [
      {
        "type": "object",
        "object_id": "0xBlueMovePoolSUI_USDC",
        "comment": "Pool object"
      },
      {
        "type": "input",
        "input_ref": "borrow_1.coin_borrowed",
        "comment": "Coin to swap"
      },
      {
        "type": "pure",
        "value": 5000000,
        "value_type": "u64",
        "comment": "Minimum output (slippage 5%)"
      },
      {
        "type": "pure",
        "value": true,
        "value_type": "bool",
        "comment": "Direction: A to B"
      }
    ],
    "type_arguments": [
      "0x2::sui::SUI",
      "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
    ]
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    {
      "id": "coin_out",
      "type": "Coin<USDC>",
      "output_type": "COIN"
    }
  ]
}
```

### Exemple 2: Staking Protocol

```json
{
  "id": "custom_stake",
  "type": "CUSTOM",
  "protocol": "CUSTOM",
  "label": "Stake sur protocol X",
  "params": {
    "target": "0xStakingProtocol::staking::stake",
    "arguments": [
      {
        "type": "object",
        "object_id": "0xStakingPoolObject"
      },
      {
        "type": "input",
        "input_ref": "swap_1.coin_out"
      },
      {
        "type": "pure",
        "value": 30,
        "value_type": "u64",
        "comment": "Lock duration (days)"
      }
    ],
    "type_arguments": ["0x2::sui::SUI"]
  },
  "inputs": {
    "coin_in": "swap_1.coin_out"
  },
  "outputs": [
    {
      "id": "staking_nft",
      "type": "StakingNFT",
      "output_type": "COIN"
    }
  ]
}
```

### Exemple 3: Multi-output Function

Fonction qui retourne plusieurs valeurs (ex: swap avec fee séparée) :

```json
{
  "id": "custom_swap_with_fee",
  "type": "CUSTOM",
  "protocol": "CUSTOM",
  "params": {
    "target": "0xProtocol::dex::swap_and_collect_fee",
    "arguments": [...]
  },
  "inputs": {
    "coin_in": "borrow_1.coin_borrowed"
  },
  "outputs": [
    {
      "id": "coin_out",
      "type": "Coin<USDC>",
      "output_type": "COIN"
    },
    {
      "id": "fee_coin",
      "type": "Coin<FEE>",
      "output_type": "COIN"
    }
  ]
}
```

Les deux outputs seront disponibles séparément :
- `custom_swap_with_fee.coin_out`
- `custom_swap_with_fee.fee_coin`

---

## 🛠️ Comment Créer un Custom Block ?

### Étape 1: Identifier la fonction Move

1. Trouver le Package ID du protocole (ex: dans leur documentation)
2. Identifier le module et la fonction (ex: `swap::swap_exact_input`)
3. Construire le target: `0xPackageID::module::function`

### Étape 2: Analyser la signature de la fonction

```move
public fun swap_exact_input<CoinA, CoinB>(
    pool: &mut Pool<CoinA, CoinB>,
    coin_in: Coin<CoinA>,
    min_amount_out: u64,
    a_to_b: bool,
    ctx: &mut TxContext
): Coin<CoinB>
```

### Étape 3: Mapper les arguments

| Paramètre Move | Type JSON | Valeur |
|----------------|-----------|--------|
| `pool` | `object` | Pool object ID |
| `coin_in` | `input` | Référence au coin d'entrée |
| `min_amount_out` | `pure` (u64) | Montant minimum |
| `a_to_b` | `pure` (bool) | Direction |
| `ctx` | ❌ Automatique | N/A (géré par Sui SDK) |

**Note**: Le `TxContext` est toujours automatiquement ajouté par Sui, **ne pas le mettre dans arguments** !

### Étape 4: Définir les type_arguments

Pour `<CoinA, CoinB>` :
```json
"type_arguments": [
  "0x2::sui::SUI",           // CoinA
  "0x...::usdc::USDC"        // CoinB
]
```

---

## ⚠️ Pièges à Éviter

### ❌ Erreur 1: Oublier le `ctx` dans arguments

```json
// ❌ MAUVAIS
"arguments": [
  { "type": "object", "object_id": "0x..." },
  { "type": "input", "input_ref": "..." },
  { "type": "object", "object_id": "0xCtxObject" }  // ❌ Pas besoin !
]
```

```json
// ✅ BON
"arguments": [
  { "type": "object", "object_id": "0x..." },
  { "type": "input", "input_ref": "..." }
  // ctx est automatique
]
```

### ❌ Erreur 2: Mauvais type de valeur

```json
// ❌ MAUVAIS - nombre sans value_type
{
  "type": "pure",
  "value": 1000000
  // Manque value_type !
}
```

```json
// ✅ BON
{
  "type": "pure",
  "value": 1000000,
  "value_type": "u64"
}
```

### ❌ Erreur 3: Type arguments dans le mauvais ordre

```move
// Fonction Move
public fun swap<CoinA, CoinB>(...)
```

```json
// ❌ MAUVAIS - ordre inversé
"type_arguments": [
  "0x...::USDC",  // CoinB
  "0x2::sui::SUI" // CoinA
]
```

```json
// ✅ BON - même ordre que dans la signature
"type_arguments": [
  "0x2::sui::SUI",  // CoinA
  "0x...::USDC"     // CoinB
]
```

---

## 🎓 Cas d'Usage Avancés

### 1. Chaîner plusieurs custom blocks

```json
{
  "nodes": [
    {
      "id": "custom_dex_1",
      "type": "CUSTOM",
      "params": { "target": "0xDEX1::swap::swap", ... },
      "inputs": { "coin_in": "borrow_1.coin_borrowed" },
      "outputs": [{ "id": "coin_out", ... }]
    },
    {
      "id": "custom_dex_2",
      "type": "CUSTOM",
      "params": { "target": "0xDEX2::swap::swap", ... },
      "inputs": { "coin_in": "custom_dex_1.coin_out" },  // ← Chaînage
      "outputs": [{ "id": "coin_out", ... }]
    }
  ]
}
```

### 2. Mixer custom blocks et blocks natifs

```json
{
  "nodes": [
    { "id": "borrow_1", "type": "FLASH_BORROW", "protocol": "NAVI", ... },
    { "id": "custom_swap", "type": "CUSTOM", ... },           // Custom
    { "id": "native_swap", "type": "DEX_SWAP", "protocol": "CETUS", ... },  // Natif
    { "id": "repay_1", "type": "FLASH_REPAY", "protocol": "NAVI", ... }
  ]
}
```

### 3. Fonction avec object mutable

```move
public fun add_liquidity<CoinA, CoinB>(
    pool: &mut Pool<CoinA, CoinB>,  // ← &mut (mutable reference)
    ...
)
```

Même syntaxe :
```json
{
  "type": "object",
  "object_id": "0xPoolID"  // Sui SDK gère automatiquement le &mut
}
```

---

## 📊 Marketplace Integration

Les custom blocks sont parfaits pour le marketplace car :

1. **Innovation**: Les traders peuvent créer des stratégies avec des protocoles non-supportés
2. **Monétisation**: Vendre des stratégies utilisant des DEX exotiques
3. **Alpha**: Garder secrète la combinaison de protocoles utilisée

### Metadata pour le marketplace

```json
{
  "meta": {
    "name": "Arbitrage Multi-DEX Custom",
    "description": "Utilise 3 DEX dont 2 customs pour max profit",
    "tags": ["custom", "advanced", "bluemove", "kriya"],
    "price_sui": 50  // Prix élevé car stratégie unique
  }
}
```

---

## 🔍 Debug & Testing

### Tester un custom block

1. **Vérifier le target**:
   ```bash
   sui client call --package 0xPACKAGE --module swap --function swap_exact_input
   ```

2. **Dry run la stratégie**:
   ```typescript
   const tx = await builder.buildFromStrategy(strategy);
   const result = await suiClient.dryRunTransactionBlock({ transaction: tx });
   console.log(result);
   ```

3. **Vérifier les types**:
   - Output types doivent matcher avec le prochain input
   - Type arguments doivent être dans le bon ordre

---

## 📚 Ressources

- **Sui Move Documentation**: https://docs.sui.io/guides/developer/first-app/write-package
- **Sui Explorer**: https://suiexplorer.com/ (pour trouver Package IDs)
- **Example Strategies**: `/backend/src/examples/custom-dex-example.json`

---

## 🚀 Prochaines Étapes

Pour l'équipe UI :
1. Créer un "Custom Block Builder" dans l'interface
2. Formulaire pour entrer:
   - Target (auto-complete avec les packages connus)
   - Arguments (avec type selector)
   - Type arguments (dropdown des coin types)
3. Preview du JSON généré
4. Validation en temps réel

Pour l'équipe Backend :
- Les custom blocks sont déjà implémentés ! ✅
- Compilation vers PTB fonctionne
- Il suffit de générer le bon JSON

---

**💡 Le custom block est LA feature qui différencie Sail des autres builders !**
