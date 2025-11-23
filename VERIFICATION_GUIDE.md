# 🔍 Guide de Vérification - Seal + Walrus + Smart Contract

Ce guide explique comment vérifier que le système fonctionne correctement via Seal, Walrus et les smart contracts.

---

## 1. Vérification de l'Upload d'un Workflow

### Étape 1.1 : Upload via le script

```bash
cd backend
npm run upload:workflows
```

**Ce qui doit se passer :**

```
✅ Template placeholder created with ID: 0x...
📤 Uploading workflow to Walrus (encrypted with template ID): SUI-USDC Arbitrage
✅ Workflow uploaded successfully!
   Workflow ID: 0x6450003d...
   Metadata Blob: 8h3_CSwL_mN___Eod9cZMf0TgjFNAQbFCvUZoU1sbgc
   Data Blob: 9k4_DRxM_oO___Fpd0daMg1UhkGOBRcGDwVapV2tchl
   Template ID: 0x6450003d...
```

### Étape 1.2 : Vérifier on-chain

```bash
# Vérifier que le template existe avec les blob IDs
sui client object <WHITELIST_ID> --json | jq '.content.fields.templates[] | select(.fields.name == "SUI-USDC Arbitrage (Cetus → Turbos)")'
```

**Résultat attendu :**
```json
{
  "type": "..::whitelist::Template",
  "fields": {
    "id": "0x6450003d...",
    "name": "SUI-USDC Arbitrage (Cetus → Turbos)",
    "author": "0x904f...",
    "description": "...",
    "price": "5000000",  // 0.005 SUI en MIST
    "metadata_blob_id": "8h3_CSwL_mN...",  // ✅ NON VIDE
    "data_blob_id": "9k4_DRxM_oO..."       // ✅ NON VIDE
  }
}
```

### Étape 1.3 : Vérifier sur Walrus

```bash
# Vérifier que le blob est accessible sur Walrus
curl "https://aggregator.walrus-testnet.walrus.space/v1/blobs/8h3_CSwL_mN___Eod9cZMf0TgjFNAQbFCvUZoU1sbgc"
```

**Résultat attendu :** Données chiffrées (illisibles)

---

## 2. Vérification de l'Achat d'un Template

### Étape 2.1 : Acheter via le frontend

1. Ouvrir http://localhost:3000
2. Connecter le wallet
3. Aller dans "Marketplace"
4. Cliquer sur "BUY" pour un workflow
5. **Signer la transaction** (paiement on-chain)

### Étape 2.2 : Vérifier la transaction on-chain

```bash
# Récupérer le transaction digest depuis le frontend (affiché dans la console)
sui client transaction-block <TX_DIGEST>
```

**Ce qui doit être visible :**
- **Function call**: `buy_template_access`
- **Arguments**: `[WHITELIST_ID, template_index, payment_coin]`
- **Status**: `Success`

### Étape 2.3 : Vérifier l'accès on-chain

```bash
# Vérifier que votre adresse est dans la liste d'accès pour ce template
curl "http://localhost:8000/api/seal/check-template-access/<VOTRE_ADDRESS>/<TEMPLATE_ID>"
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "hasAccess": true  // ✅ TRUE après achat
  }
}
```

### Étape 2.4 : Vérifier le purchaseCount

```bash
# Recharger la marketplace
curl "http://localhost:8000/api/workflows/list" | jq '.data[] | {name, purchaseCount}'
```

**Résultat attendu :**
```json
{
  "name": "SUI-USDC Arbitrage (Cetus → Turbos)",
  "purchaseCount": 1  // ✅ A AUGMENTÉ
}
```

---

## 3. Vérification du Décryptage via Seal

### Étape 3.1 : Décryptage après achat

Après avoir cliqué sur "BUY" :

1. Le frontend demande un **message à signer** (pour Seal)
2. Signez le message
3. Le backend appelle **Seal.decrypt()** avec votre signature
4. **Seal vérifie on-chain** que vous avez accès via `seal_approve()`

### Étape 3.2 : Vérifier les logs backend

Dans les logs du backend, vous devriez voir :

```
🔐 Decrypting workflow for user: 0x904f...
📋 Creating Seal session for decryption...
✅ Seal approved access for template: 0x6450003d...
📤 Fetching encrypted data from Walrus...
🔓 Decrypting workflow data...
✅ Workflow decrypted successfully!
```

### Étape 3.3 : Vérifier que Seal a bien appelé le smart contract

```bash
# Chercher les événements seal_approve dans les transactions récentes
sui client events --transaction-digest <TX_DIGEST_DE_DECRYPT>
```

**Événement attendu :**
- Type: `seal::approve::ApproveEvent` (ou similaire)
- Fields: `{ caller: "0x904f...", id: "...", approved: true }`

---

## 4. Test Complet de Bout en Bout

### Script de test automatisé

```bash
# 1. Upload un workflow
npm run upload:workflows

# 2. Récupérer le premier template ID
TEMPLATE_ID=$(curl -s http://localhost:8000/api/workflows/list | jq -r '.data[0].id')

# 3. Vérifier qu'il n'y a pas encore d'acheteurs
curl -s "http://localhost:8000/api/seal/check-template-access/0xVOTRE_ADDRESS/$TEMPLATE_ID" | jq '.data.hasAccess'
# Résultat attendu: false

# 4. Acheter via le frontend (manuel)

# 5. Vérifier que vous avez maintenant accès
curl -s "http://localhost:8000/api/seal/check-template-access/0xVOTRE_ADDRESS/$TEMPLATE_ID" | jq '.data.hasAccess'
# Résultat attendu: true

# 6. Vérifier que le purchaseCount a augmenté
curl -s http://localhost:8000/api/workflows/list | jq ".data[] | select(.id == \"$TEMPLATE_ID\") | .purchaseCount"
# Résultat attendu: 1 (ou plus)
```

---

## 5. Vérifications de Sécurité

### 5.1 : Tentative de décryptage SANS achat

1. **Avec un autre wallet** (qui n'a pas acheté)
2. Essayer de décrypter un workflow
3. **Résultat attendu** : Erreur "Access denied"

```
❌ Seal denied access: User not in template_access table
```

### 5.2 : Vérifier que les paiements vont au beneficiary

```bash
# Vérifier le balance du contrat
sui client object <WHITELIST_ID> --json | jq '.content.fields.balance'

# Vérifier le beneficiary
sui client object <WHITELIST_ID> --json | jq '.content.fields.beneficiary'
```

### 5.3 : Vérifier qu'on ne peut pas acheter deux fois

1. Acheter un template
2. Essayer de racheter le même template
3. **Résultat attendu** : Transaction échoue avec erreur `EDuplicate`

---

## 6. Checklist de Validation

- [ ] **Upload** : Les workflows sont uploadés avec `metadata_blob_id` et `data_blob_id` non vides
- [ ] **Walrus** : Les blobs sont accessibles sur Walrus testnet
- [ ] **Chiffrement** : Les blobs sont chiffrés (données illisibles)
- [ ] **Smart Contract** : Les templates sont visibles on-chain
- [ ] **Prix** : Le prix est correctement affiché (SUI → MIST)
- [ ] **Achat** : La transaction `buy_template_access` réussit
- [ ] **Accès** : L'adresse est ajoutée à `template_access[templateId]`
- [ ] **PurchaseCount** : Le compteur augmente après chaque achat
- [ ] **Décryptage** : Seal vérifie l'accès on-chain avant de décrypter
- [ ] **Sécurité** : Les non-acheteurs ne peuvent pas décrypter
- [ ] **Paiement** : Les SUI vont dans le balance du contrat

---

## 7. Diagramme de Flux Complet

```
┌─────────────┐
│   Creator   │
└──────┬──────┘
       │
       │ 1. Upload Workflow (npm run upload:workflows)
       ▼
┌─────────────────────┐
│   Backend API       │
│ POST /upload        │
└──────┬──────────────┘
       │
       ├─► 2a. Create Placeholder (Move call)
       │   ✅ Returns template_id via event
       │
       ├─► 2b. Encrypt with Seal
       │   🔐 ID format: [whitelistId][templateId][nonce]
       │
       ├─► 2c. Upload to Walrus
       │   📦 Returns metadata_blob_id + data_blob_id
       │
       └─► 2d. Update Template (Move call)
           ✅ Template stored on-chain with blob IDs

┌─────────────┐
│    Buyer    │
└──────┬──────┘
       │
       │ 3. Click "BUY" in Marketplace
       ▼
┌─────────────────────┐
│   Frontend          │
└──────┬──────────────┘
       │
       │ 4a. Build TX (POST /seal/build-template-purchase)
       │ 4b. Sign TX with wallet
       │ 4c. Execute: buy_template_access()
       ▼
┌─────────────────────┐
│  Smart Contract     │
│  (Whitelist)        │
└──────┬──────────────┘
       │
       ├─► 5a. Check payment >= template.price
       ├─► 5b. Check user not already in list
       ├─► 5c. Add user to template_access[templateId]
       └─► 5d. Transfer SUI to balance
           ✅ Access granted on-chain

       │ 6. Frontend: POST /workflows/decrypt
       ▼
┌─────────────────────┐
│   Backend + Seal    │
└──────┬──────────────┘
       │
       ├─► 7a. Create Seal session
       ├─► 7b. Call seal_approve()
       │   ▼
       │  ┌──────────────────┐
       │  │ Seal Network     │
       │  │ Verifies on-chain│
       │  └────┬─────────────┘
       │       │
       │       ├─► Check template_access[templateId][user]
       │       └─► ✅ Approved or ❌ Denied
       │
       ├─► 7c. Fetch encrypted blob from Walrus
       ├─► 7d. Decrypt with session key
       └─► 7e. Return workflow JSON
           ✅ Buyer gets decrypted workflow
```

---

## 8. Résolution de Problèmes

### Problème : purchaseCount toujours à 0

**Cause** : Le backend ne calcule pas depuis la blockchain

**Solution** : Vérifier que le code utilise `getDynamicFieldObject` pour lire `template_access`

### Problème : "Failed to decrypt - Access denied"

**Cause** : L'utilisateur n'a pas acheté OU la transaction n'a pas été confirmée

**Solution** :
1. Vérifier on-chain : `check-template-access/:address/:templateId`
2. Vérifier la transaction d'achat : `sui client transaction-block <digest>`

### Problème : blob_id vide

**Cause** : L'upload a échoué à l'étape Walrus ou update_template_blobs

**Solution** : Relancer l'upload ET vérifier les logs backend pour l'erreur exacte

---

**Auteur** : Claude & Greg
**Date** : Novembre 2024
**Hackathon** : SUI Flashbuilder 2024-2025
