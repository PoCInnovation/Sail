# Marketplace Upload Scripts

Scripts pour uploader des workflows de test sur la marketplace.

## Prérequis

1. Le backend doit être démarré :
   ```bash
   cd backend
   npm run start:dev
   ```

2. Le fichier `.env` doit être configuré avec :
   - `ADMIN_PRIVATE_KEY` : Clé privée de l'admin
   - `ADMIN_ADDRESS` : Adresse de l'admin
   - `PACKAGE_ID`, `WHITELIST_ID`, `CAP_ID` : IDs du contrat déployé

## Utilisation

### Méthode 1 : Via npm script (recommandé)

```bash
cd backend
npm run upload:workflows
```

### Méthode 2 : Via le script bash

```bash
cd backend
./scripts/upload-workflows.sh
```

### Méthode 3 : Exécution directe du TypeScript

```bash
cd backend
npx tsx scripts/upload-test-workflow.ts
```

## Workflows inclus

Le script upload 3 workflows de test :

1. **SUI-USDC Arbitrage (Cetus → Turbos)** - 2.5 SUI
   - Flash loan arbitrage entre Cetus et Turbos DEX
   - Tags: arbitrage, defi, cetus, turbos, flash-loan

2. **DeepBook → Aftermath Arbitrage** - 3.0 SUI
   - Arbitrage multi-DEX avec DeepBook et Aftermath
   - Tags: arbitrage, deepbook, aftermath, aggregator

3. **Simple Cetus CLMM Strategy** - 1.0 SUI
   - Stratégie basique pour débutants
   - Tags: beginner, cetus, clmm, flash-loan

**Total value : 6.5 SUI**

## Personnalisation

Pour ajouter vos propres workflows, éditez le fichier `upload-test-workflow.ts` et ajoutez-les au tableau `exampleWorkflows`.

### Structure d'un workflow

```typescript
{
  id: 'unique-workflow-id',
  version: '1.0',
  meta: {
    name: 'Workflow Name',
    author: process.env.ADMIN_ADDRESS || '0x0',
    description: 'Description du workflow',
    created_at: Date.now(),
    updated_at: Date.now(),
    tags: ['tag1', 'tag2'],
    price_sui: 2.5, // Prix en SUI
  },
  nodes: [
    // Vos nodes ici
  ],
  edges: [
    // Vos connexions ici
  ],
}
```

## Que fait le script ?

Pour chaque workflow :

1. ✅ **Crée un placeholder on-chain** via `create_template_placeholder()`
2. 🔐 **Chiffre le workflow** avec Seal + le template ID
3. 📤 **Upload sur Walrus** (stockage décentralisé)
4. 🔗 **Met à jour le template** avec les blob IDs

## Vérification

Après l'upload, vous pouvez :

1. **Voir les workflows dans la marketplace** :
   - Frontend : http://localhost:3000 → Section "Marketplace"

2. **Vérifier on-chain** :
   ```bash
   sui client object <WHITELIST_ID>
   ```

3. **Tester l'achat** :
   - Connectez votre wallet dans le frontend
   - Cliquez sur "BUY" pour un workflow
   - Signez la transaction
   - Le workflow sera décrypté et sauvegardé

## Troubleshooting

### "Backend not running"
```bash
cd backend
npm run start:dev
```

### "Admin keypair not found"
Vérifiez que `ADMIN_PRIVATE_KEY` est défini dans `.env`

### "Failed to create template placeholder"
Vérifiez que :
- `PACKAGE_ID`, `WHITELIST_ID`, `CAP_ID` sont corrects
- L'admin a des fonds SUI pour payer le gas

### "Walrus upload failed"
- Vérifiez votre connexion internet
- Le réseau Walrus Testnet peut être temporairement indisponible
