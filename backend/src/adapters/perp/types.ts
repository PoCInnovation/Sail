/**
 * Perp DEX Adapter Interface
 *
 * Standardized interface for all Perpetual DEX protocols.
 * Each protocol (Aftermath, HyperSui, Astros, PerpSea) implements this interface.
 */

import { Transaction } from "@mysten/sui/transactions";
import { PerpOpenNode, PerpCloseNode } from "../../types/strategy";

/**
 * Position estimate result
 */
export interface PerpEstimate {
  position_size: string;         // Actual position size
  collateral_required: string;   // Collateral needed
  leverage: string;              // Actual leverage
  liquidation_price: string;    // Price at which position would be liquidated
  funding_rate?: string;         // Current funding rate
  fee: string;                   // Opening/closing fee
}

/**
 * Standard interface all Perp DEX adapters must implement
 */
export interface PerpAdapter {
  /**
   * Protocol name
   */
  readonly protocol: string;

  /**
   * Simulate opening a position to get estimates
   * MUST be called before openPosition() for accurate calculations
   *
   * @param node - Perp open node from strategy
   * @returns Position estimate
   */
  preOpenPosition(node: PerpOpenNode): Promise<PerpEstimate>;

  /**
   * Add open position transaction to PTB
   *
   * @param tx - Transaction block
   * @param node - Perp open node from strategy
   * @param collateral - Input collateral coin
   * @param estimate - Pre-open estimate (from preOpenPosition)
   * @returns Position ID or receipt
   */
  openPosition(tx: Transaction, node: PerpOpenNode, collateral: any, estimate: PerpEstimate): any;

  /**
   * Simulate closing a position to get estimates
   *
   * @param node - Perp close node from strategy
   * @returns Close estimate (collateral returned, PnL, etc.)
   */
  preClosePosition(node: PerpCloseNode): Promise<PerpEstimate>;

  /**
   * Add close position transaction to PTB
   *
   * @param tx - Transaction block
   * @param node - Perp close node from strategy
   * @param position - Position ID or receipt from open
   * @param estimate - Pre-close estimate (from preClosePosition)
   * @returns Collateral returned (with PnL)
   */
  closePosition(tx: Transaction, node: PerpCloseNode, position: any, estimate: PerpEstimate): any;
}

/**
 * Base adapter class with common functionality
 */
export abstract class BasePerpAdapter implements PerpAdapter {
  abstract readonly protocol: string;

  abstract preOpenPosition(node: PerpOpenNode): Promise<PerpEstimate>;
  abstract openPosition(tx: Transaction, node: PerpOpenNode, collateral: any, estimate: PerpEstimate): any;
  abstract preClosePosition(node: PerpCloseNode): Promise<PerpEstimate>;
  abstract closePosition(tx: Transaction, node: PerpCloseNode, position: any, estimate: PerpEstimate): any;

  /**
   * Calculate liquidation price
   * Formula: liquidation_price = entry_price * (1 - 1/leverage)
   */
  protected calculateLiquidationPrice(entryPrice: string, leverage: string): string {
    const entry = parseFloat(entryPrice);
    const lev = parseFloat(leverage);
    const liquidation = entry * (1 - 1 / lev);
    return liquidation.toString();
  }

  /**
   * Calculate required collateral
   * Formula: collateral = position_size / leverage
   */
  protected calculateRequiredCollateral(positionSize: string, leverage: string): string {
    const size = BigInt(positionSize);
    const lev = BigInt(parseFloat(leverage) * 1000000); // Use fixed point for precision
    const collateral = (size * BigInt(1000000)) / lev;
    return collateral.toString();
  }
}
