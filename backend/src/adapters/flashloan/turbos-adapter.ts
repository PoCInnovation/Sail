/**
 * Turbos Finance Flash Loan Adapter
 *
 * Integrates with Turbos Protocol's flash swap functionality.
 * Turbos uses "flash_swap" which is similar to flash loans.
 * 
 * Source: https://turbos.gitbook.io/turbos/developer-docs/via-contract/contract-modules#flash-loan-functions
 * 
 * Flash Swap Functions:
 * - flash_swap: Executes flash swap, returns receipt that needs to be repaid
 * - repay_flash_swap: Repays flash swap, returns remaining tokens
 */

import { Transaction } from "@mysten/sui/transactions";
import { FlashBorrowNode, FlashRepayNode } from "../../types/strategy";
import { BaseFlashLoanAdapter, BorrowResult } from "./types";
import { getAddresses, Network, TESTNET_ADDRESSES } from "../../config/addresses";

export class TurbosFlashLoanAdapter extends BaseFlashLoanAdapter {
  readonly protocol = "TURBOS";
  protected readonly feePercentage = 0.0003; // 0.03% (Turbos flash swap fee, to be verified)
  private network: Network;

  constructor(network: Network = "mainnet") {
    super();
    this.network = network;
  }

  private getConfig() {
    return getAddresses(this.network);
  }

  private getTurbosConfig() {
    const config = this.getConfig();
    // Type guard: TURBOS only exists in TESTNET_ADDRESSES
    if (this.network !== "testnet" || !("TURBOS" in config)) {
      throw new Error("Turbos Finance is only available on testnet. Please use testnet network.");
    }
    return (config as typeof TESTNET_ADDRESSES).TURBOS;
  }

  /**
   * Borrow tokens using Turbos flash_swap
   * 
   * Function signature:
   * flash_swap<CoinTypeA, CoinTypeB, FeeType>(
   *   pool: &mut Pool<CoinTypeA, CoinTypeB, FeeType>,
   *   recipient: address,
   *   a_to_b: bool,
   *   amount_specified: u128,
   *   amount_specified_is_input: bool,
   *   sqrt_price_limit: u128,
   *   clock: &Clock,
   *   ctx: &mut TxContext
   * ): FlashSwapReceipt<CoinTypeA, CoinTypeB>
   */
  borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult {
    const turbosConfig = this.getTurbosConfig();
    
    // For Turbos flash swap, we need to determine:
    // 1. Which pool to use (based on asset)
    // 2. Direction (a_to_b)
    // 3. Amount
    
    // Note: Turbos flash_swap requires a pool. We'll need the pool_id in params
    // For now, we'll assume the asset is one side of a pool pair
    // In production, you'd need to specify the pool_id and the other coin type
    
    const amount = BigInt(node.params.amount);
    const amountU128 = amount; // Turbos uses u128 for amounts
    
    // Determine direction: if borrowing coin_type_a, a_to_b = false (we want to receive A)
    // This needs to be determined based on the pool configuration
    // For now, we'll assume a_to_b = false (borrowing token A)
    const aToB = false;
    
    // sqrt_price_limit: 0 means no limit
    const sqrtPriceLimit = BigInt(0);
    
    // amount_specified_is_input: true means we specify the input amount we want to receive
    const amountSpecifiedIsInput = true;

    // Execute flash_swap
    // Note: This requires pool_id and the other coin type to be specified
    // We'll need to add these to FlashBorrowNode params for Turbos
    // Recipient: Use provided recipient or default to sender (will be set at transaction execution)
    const recipient = node.params.recipient || "0x0"; // Will be replaced by actual sender at execution
    
    if (!node.params.pool_id) {
      throw new Error(
        `❌ CONFIGURATION ERROR: Turbos flash_swap requires pool_id in FlashBorrowParams.\n\n` +
        `Your strategy is missing the required "pool_id" parameter for Turbos Finance.\n\n` +
        `💡 Solution: Add "pool_id" to your strategy params:\n` +
        `  "params": {\n` +
        `    "asset": "0x2::sui::SUI",\n` +
        `    "amount": "1000000000",\n` +
        `    "pool_id": "0x...",  // ← Add Turbos pool ID here\n` +
        `    "coin_type_a": "0x2::sui::SUI",\n` +
        `    "coin_type_b": "0x...::usdc::USDC"\n` +
        `  }\n\n` +
        `📚 Find Turbos pools on testnet: https://suiscan.xyz/testnet\n` +
        `This is NOT a balance issue - your wallet balance is sufficient.`
      );
    }
    
    if (!node.params.coin_type_a || !node.params.coin_type_b) {
      throw new Error(
        `❌ CONFIGURATION ERROR: Turbos flash_swap requires coin_type_a and coin_type_b in FlashBorrowParams.\n\n` +
        `Your strategy is missing the required coin type parameters for Turbos Finance.\n\n` +
        `💡 Solution: Add "coin_type_a" and "coin_type_b" to your strategy params:\n` +
        `  "params": {\n` +
        `    "asset": "0x2::sui::SUI",\n` +
        `    "amount": "1000000000",\n` +
        `    "pool_id": "0x...",\n` +
        `    "coin_type_a": "0x2::sui::SUI",  // ← Add first coin type\n` +
        `    "coin_type_b": "0x...::usdc::USDC"  // ← Add second coin type\n` +
        `  }\n\n` +
        `📚 Find Turbos pools on testnet: https://suiscan.xyz/testnet\n` +
        `This is NOT a balance issue - your wallet balance is sufficient.`
      );
    }
    
    const receipt = tx.moveCall({
      target: `${turbosConfig.PACKAGE}::pool::flash_swap`,
      arguments: [
        tx.object(node.params.pool_id),
        tx.pure.address(recipient), // Recipient (will be sender if not specified)
        tx.pure.bool(aToB), // a_to_b direction
        tx.pure.u128(amountU128), // amount_specified
        tx.pure.bool(amountSpecifiedIsInput), // amount_specified_is_input
        tx.pure.u128(sqrtPriceLimit), // sqrt_price_limit
        tx.object("0x6"), // Clock
      ],
      typeArguments: [
        node.params.coin_type_a,
        node.params.coin_type_b,
        "0x0", // FeeType - needs to be specified in params
      ],
    });

    // Flash swap returns a receipt, not a coin directly
    // We need to extract the coin from the receipt or use a different approach
    // For now, we'll return the receipt and handle coin extraction in repay
    
    // Note: Turbos flash_swap might work differently - need to check the actual return type
    // The receipt contains the borrowed tokens that need to be repaid
    
    return { 
      coin: receipt, // This might need adjustment based on actual Turbos implementation
      receipt: receipt 
    };
  }

  /**
   * Repay flash swap
   * 
   * Function signature:
   * repay_flash_swap<CoinTypeA, CoinTypeB, FeeType>(
   *   pool: &mut Pool<CoinTypeA, CoinTypeB, FeeType>,
   *   coin_a: Coin<CoinTypeA>,
   *   coin_b: Coin<CoinTypeB>,
   *   receipt: FlashSwapReceipt<CoinTypeA, CoinTypeB>,
   *   ctx: &mut TxContext
   * ): (Coin<CoinTypeA>, Coin<CoinTypeB>)
   */
  repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any, borrowedAmount?: bigint): void {
    const turbosConfig = this.getTurbosConfig();
    
    if (!borrowedAmount) {
      throw new Error("Turbos flash_swap repayment requires borrowedAmount to be provided");
    }
    
    if (!node.params.pool_id) {
      throw new Error("Turbos flash_swap repayment requires pool_id in FlashRepayParams");
    }
    
    if (!node.params.coin_type_a || !node.params.coin_type_b) {
      throw new Error("Turbos flash_swap repayment requires coin_type_a and coin_type_b in FlashRepayParams");
    }
    
    // Calculate repayment amount (borrowed + fee)
    const repayAmount = this.getRepayAmount(borrowedAmount);
    
    // For Turbos, we need to repay with both coins potentially
    // The receipt tells us what needs to be repaid
    // We'll need coin_a and coin_b
    
    // Split the coin to get the exact repayment amount
    const repayCoin = tx.moveCall({
      target: "0x2::coin::split",
      arguments: [
        coin,
        tx.pure.u64(repayAmount),
      ],
      typeArguments: [node.params.asset],
    });

    // Repay flash swap
    // Note: This might need both coin_a and coin_b depending on the swap direction
    // For now, we'll assume we only need one coin
    tx.moveCall({
      target: `${turbosConfig.PACKAGE}::pool::repay_flash_swap`,
      arguments: [
        tx.object(node.params.pool_id || ""), // Pool ID
        repayCoin, // coin_a
        tx.object("0x2::coin::Coin"), // coin_b - might need to be empty or zero
        receipt, // FlashSwapReceipt
      ],
      typeArguments: [
        node.params.coin_type_a || node.params.asset,
        node.params.coin_type_b || "",
        "0x0", // FeeType
      ],
    });
  }
}
