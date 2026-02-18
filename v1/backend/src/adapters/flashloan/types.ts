/**
 * Flash Loan Adapter Interface
 *
 * Standardized interface for all flash loan protocols.
 * Each protocol (Navi, DeepBook, Scallop, Bucket) implements this interface.
 */

import { Transaction } from "@mysten/sui/transactions";
import { FlashBorrowNode, FlashRepayNode } from "../../types/strategy";

/**
 * Result from a borrow operation
 * Returns [coin, receipt] where receipt is the "hot potato"
 */
export interface BorrowResult {
  coin: any;          // PTB result for borrowed coin
  receipt: any;       // PTB result for flash loan receipt (hot potato)
}

/**
 * Standard interface all flash loan adapters must implement
 */
export interface FlashLoanAdapter {
  /**
   * Protocol name
   */
  readonly protocol: string;

  /**
   * Add borrow transaction to PTB
   *
   * @param tx - Transaction block
   * @param node - Flash borrow node from strategy
   * @returns Borrow result with coin and receipt
   */
  borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult;

  /**
   * Add repay transaction to PTB
   *
   * @param tx - Transaction block
   * @param node - Flash repay node from strategy
   * @param coin - Coin to repay (from result cache)
   * @param receipt - Receipt from borrow (hot potato)
   */
  repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any, borrowedAmount?: bigint): void;

  /**
   * Calculate flash loan fee
   *
   * @param amount - Borrow amount
   * @returns Fee amount
   */
  calculateFee(amount: bigint): bigint;

  /**
   * Get total amount to repay (amount + fee)
   *
   * @param amount - Borrow amount
   * @returns Total repay amount
   */
  getRepayAmount(amount: bigint): bigint;
}

/**
 * Base adapter class with common functionality
 */
export abstract class BaseFlashLoanAdapter implements FlashLoanAdapter {
  abstract readonly protocol: string;
  protected abstract readonly feePercentage: number; // e.g., 0.0006 for 0.06%

  abstract borrow(tx: Transaction, node: FlashBorrowNode): BorrowResult;
  abstract repay(tx: Transaction, node: FlashRepayNode, coin: any, receipt: any, borrowedAmount?: bigint): void;

  calculateFee(amount: bigint): bigint {
    return (amount * BigInt(Math.floor(this.feePercentage * 1000000))) / BigInt(1000000);
  }

  getRepayAmount(amount: bigint): bigint {
    return amount + this.calculateFee(amount);
  }
}
