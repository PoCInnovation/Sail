# Deployment Info

## Whitelist Contract (startHack)

**Deployed on:** Sui Testnet  
**Date:** 22 novembre 2025

### Contract IDs

- **Package ID:** `0x0fe074f026b27ea8617d326dc732b635a762bb64e23b943bafc7ac49f8e9eb52`
- **Whitelist ID:** `0x7d4fdefe79f2b7332672e2289b331dcc445a47d2379a39bed95adbe91e5fcc7d`
- **Cap ID:** `0xcc9cb3bedca6f9e34f69420832b18cc24887dea30fe6616feec08113769051c5`

### Transaction Digests

- **Publish:** `CqtwY36hAGGmGjrhwp6DBRKybua1uFuup6JEW7Adwanr`
- **Create Whitelist:** `FxhGXZUPChM7xFgvmhPhyDDa6bQ1Kp1MPeixccuRpgGK`

### Module Functions

```move
module startHack::whitelist {
  // Create a new whitelist and cap
  public fun create_whitelist(ctx: &mut TxContext): (Cap, Whitelist)
  
  // Entry function to create and share whitelist
  entry fun create_whitelist_entry(ctx: &mut TxContext)
  
  // Add address to whitelist (requires Cap)
  public fun add(wl: &mut Whitelist, cap: &Cap, account: address)
  
  // Remove address from whitelist (requires Cap)
  public fun remove(wl: &mut Whitelist, cap: &Cap, account: address)
  
  // Check if address has access (for Seal IBE)
  entry fun seal_approve(id: vector<u8>, wl: &Whitelist, ctx: &TxContext)
}
```

### Usage in Code

Update the following files with these values:

- `/backend/src/services/SealWalrusService.ts` - PACKAGE_ID, WHITELIST_ID
- `/backend/src/api/routes/seal.ts` - packageId in SessionKey.create()

### Admin Wallet

The Cap object is owned by: `0x904f64f755764162a228a7da49b1288160597165ec60ebbf5fb9a94957db76c3`

To add users to the whitelist, use this Cap to call `whitelist::add`.
