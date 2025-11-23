# 🚀 Déploiement Rapide - Guide Complet

Ce guide vous permet de déployer et tester le système de marketplace de bout en bout.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement du Smart Contract](#1-déploiement-du-smart-contract)
3. [Configuration Backend](#2-configuration-backend)
4. [Upload de Workflows](#3-upload-de-workflows)
5. [Test Frontend](#4-test-frontend)

---

## Prérequis

- Node.js 18+ installé
- Sui CLI installé et configuré
- Un wallet Sui avec des fonds testnet

---

## 1. Déploiement du Smart Contract

### Étape 1.1 : Déployer le contrat

```bash
cd backend/move
sui move build
sui client publish --gas-budget 100000000
```

**Notez le `PACKAGE_ID` dans l'output !**

### Étape 1.2 : Initialiser la whitelist

```bash
cd backend/move
chmod +x init_whitelist.sh
./init_whitelist.sh
```

**Extrayez les IDs suivants de l'output :**
- **WHITELIST_ID** : Object avec `Owner: Shared` et type `...::whitelist::Whitelist`
- **CAP_ID** : Object avec `Owner: Account Address` et type `...::whitelist::Cap`

### Étape 1.3 : Mettre à jour le .env

Éditez `backend/.env` :

```bash
# Admin Wallet Configuration
ADMIN_PRIVATE_KEY=suiprivkey1...  # Votre clé privée
ADMIN_ADDRESS=0x...                # Votre adresse

# Whitelist Contract IDs
PACKAGE_ID=0x...      # De l'étape 1.1
WHITELIST_ID=0x...    # De l'étape 1.2
CAP_ID=0x...          # De l'étape 1.2

# Sui Network
SUI_NETWORK=testnet
```

---

## 2. Configuration Backend

### Étape 2.1 : Installer les dépendances

```bash
cd backend
pnpm install
```

### Étape 2.2 : Démarrer le serveur

```bash
npm run start:dev
```

Vous devriez voir :
```
🚀 Sail API Server running on http://localhost:8000
```

---

## 3. Upload de Workflows

### Méthode Automatique (Recommandée)

Dans un nouveau terminal :

```bash
cd backend
npm run upload:workflows
```

Le script va :
1. ✅ Vérifier que le backend est en marche
2. 📤 Uploader 3 workflows de test (total: 6.5 SUI)
3. 🔐 Les chiffrer avec Seal
4. 📦 Les stocker sur Walrus
5. 🔗 Les enregistrer on-chain

### Workflows uploadés

1. **SUI-USDC Arbitrage (Cetus → Turbos)** - 2.5 SUI
2. **DeepBook → Aftermath Arbitrage** - 3.0 SUI
3. **Simple Cetus CLMM Strategy** - 1.0 SUI

---

## 4. Test Frontend

### Étape 4.1 : Installer et démarrer

```bash
cd frontend
pnpm install
npm run dev
```

Ouvrez http://localhost:3000

### Étape 4.2 : Tester l'achat d'une template

1. **Connecter votre wallet** (bouton en haut à droite)
2. **Aller dans "Marketplace"** (section dans la sidebar)
3. **Voir les 3 workflows** uploadés avec leurs prix
4. **Cliquer sur "BUY"** pour un workflow
5. **Signer la transaction** (paiement en SUI)
6. **Signer le message** de décryptage
7. ✅ **Le workflow est sauvegardé** dans vos templates!

### Étape 4.3 : Vérifier l'accès

- Allez dans "My Templates" → vous devriez voir le workflow acheté
- Essayez d'acheter la même template → ❌ Erreur "You already own this template!"
- Essayez avec un autre wallet → ❌ Erreur "Access denied" si pas acheté

---

## 🔍 Vérification On-Chain

### Voir la whitelist

```bash
sui client object <WHITELIST_ID> --json
```

### Voir les templates

```bash
sui client object <WHITELIST_ID> | grep -A 20 "templates"
```

### Vérifier l'accès d'un utilisateur

```bash
curl "http://localhost:8000/api/seal/check-template-access/<ADDRESS>/<TEMPLATE_ID>"
```

---

## 🐛 Troubleshooting

### Backend ne démarre pas

```bash
# Vérifier que le port 8000 est libre
lsof -i :8000

# Si occupé, tuer le process
kill -9 <PID>
```

### Upload échoue

**Erreur : "Admin keypair not found"**
→ Vérifiez `ADMIN_PRIVATE_KEY` dans `.env`

**Erreur : "Failed to create template placeholder"**
→ Vérifiez que `PACKAGE_ID`, `WHITELIST_ID`, `CAP_ID` sont corrects

**Erreur : "Walrus upload failed"**
→ Vérifiez votre connexion internet (Walrus testnet peut être lent)

### Frontend ne se connecte pas

**Wallet non détecté**
→ Installez Sui Wallet extension

**Transactions échouent**
→ Vérifiez que vous avez des fonds SUI testnet

**Workflows non visibles**
→ Vérifiez que le backend est démarré et accessible

---

## 📊 Architecture du Système

```
┌─────────────┐
│   Frontend  │  (React + Vite)
│  Port 3000  │
└─────┬───────┘
      │ API Calls
      ▼
┌─────────────┐
│   Backend   │  (Express + TypeScript)
│  Port 8000  │
└─────┬───────┘
      │
      ├─► 🔐 Seal (Encryption)
      ├─► 📦 Walrus (Storage)
      └─► ⛓️  Sui Blockchain
           └─► Whitelist Contract
                ├─► Templates
                ├─► Template Access (Table<ID, Table<address, bool>>)
                └─► Balance (Payments)
```

---

## 🎯 Prochaines Étapes

1. **Créer vos propres templates**
   - Éditez `backend/scripts/upload-test-workflow.ts`
   - Ajoutez vos workflows au tableau `exampleWorkflows`

2. **Customiser les prix**
   - Changez `price_sui` dans les metadata

3. **Déployer en production**
   - Changez `SUI_NETWORK=mainnet` dans `.env`
   - Redéployez le contrat sur mainnet
   - Mettez à jour les IDs

---

## 📚 Documentation

- [Template Marketplace Guide](./TEMPLATE_MARKETPLACE_GUIDE.md) - Architecture détaillée
- [Backend Scripts README](./backend/scripts/README.md) - Usage des scripts
- [Deploy Guide](./backend/move/DEPLOY_GUIDE.md) - Déploiement du contrat

---

**Auteur** : Claude & Greg
**Date** : Novembre 2024
**Hackathon** : SUI Flashbuilder 2024-2025
