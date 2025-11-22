/**
 * Navi Protocol Flash Loan Adapter
 *
 * Integrates with Navi Protocol's flash loan functionality.
 * Fee: 0.06%
 */

import { Transaction } from "@mysten/sui/transactions";
import { pool } from "navi-sdk/dist/address";
import { FlashBorrowNode, FlashRepayNode } from "../../types/strategy";
import { BaseFlashLoanAdapter, BorrowResult } from "./types";

export class NaviAdapter extends BaseFlashLoanAdapter {
  readonly protocol = "NAVI";
  protected readonly feePercentage = 0.0006; // 0.06%

  constructor(
    private readonly network: "mainnet" | "testnet" = "testnet"
  ) {
    super();
  }

  borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult {
    // Get pool config for the asset
    const poolConfig = this.getPoolConfig(node.params.asset);

    // Import the flashloan function from navi-sdk
    // NOTE: The actual import and function call depends on the navi-sdk version
    // This is a conceptual implementation based on documentation

    // For Navi, we use the borrowFlashLoan function
    // This returns [Balance<T>, FlashLoanReceipt]
    const amount = BigInt(node.params.amount);

    // Construct the PTB call for flash loan
    const [balance, receipt] = tx.moveCall({
      target: `${poolConfig.packageId}::flash_loan::borrow_flash_loan`,
      arguments: [
        tx.object(poolConfig.poolId),
        tx.pure.u64(amount),
      ],
      typeArguments: [node.params.asset],
    });

    // Convert Balance to Coin if needed
    const coin = tx.moveCall({
      target: "0x2::coin::from_balance",
      arguments: [balance],
      typeArguments: [node.params.asset],
    });

    return { coin, receipt };
  }

  repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any): void {
    const poolConfig = this.getPoolConfig(node.params.asset);

    // Convert Coin to Balance
    const balance = tx.moveCall({
      target: "0x2::coin::into_balance",
      arguments: [coin],
      typeArguments: [node.params.asset],
    });

    // Repay the flash loan
    tx.moveCall({
      target: `${poolConfig.packageId}::flash_loan::repay_flash_loan`,
      arguments: [
        tx.object(poolConfig.poolId),
        balance,
        receipt,
      ],
      typeArguments: [node.params.asset],
    });
  }

  /**
   * Get pool configuration for a given asset
   */
  private getPoolConfig(asset: string): any {
    // Map asset type to Navi pool
    // This is simplified - actual implementation needs proper pool lookup
    const poolKey = this.assetToPoolKey(asset);
    const poolObj = (pool as any)[poolKey];

    if (!poolObj) {
      throw new Error(`No Navi pool found for asset: ${asset}`);
    }

    return poolObj;
  }

  /**
   * Convert asset type to Navi pool key
   */
  private assetToPoolKey(asset: string): string {
    // Simplified mapping
    if (asset === "0x2::sui::SUI") {
      return "Sui";
    }
    // Add more mappings as needed
    throw new Error(`Unsupported asset for Navi: ${asset}`);
  }
}
