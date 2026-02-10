/**
 * Turbos Finance DEX Adapter
 *
 * Integrates with Turbos CLMM (Concentrated Liquidity Market Maker).
 * Turbos Finance is available on testnet and provides DEX swaps.
 *
 * Source: https://turbos.gitbook.io/turbos/developer-docs/dev-overview
 */

import { Transaction } from "@mysten/sui/transactions";
import { DexSwapNode, TurbosSwapParams } from "../../types/strategy";
import { BaseDexAdapter, SwapEstimate } from "./types";
import { getAddresses, Network, TESTNET_ADDRESSES } from "../../config/addresses";

export class TurbosAdapter extends BaseDexAdapter {
  readonly protocol = "TURBOS";
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

  async preSwap(node: DexSwapNode, estimatedInputAmount?: string): Promise<SwapEstimate> {
    const params = node.params as TurbosSwapParams;
    
    // Get Turbos config (will throw if not on testnet)
    const turbosConfig = this.getTurbosConfig();

    // For Turbos, we need to simulate the swap to get estimates
    // Since we don't have the SDK yet, we'll use a mock estimate
    // TODO: Integrate Turbos SDK when available: npm install turbos-clmm-sdk
    
    const byAmountIn = params.amount_mode === "EXACT_IN";
    const mockAmount = params.amount === "ALL"
      ? (estimatedInputAmount || "1000000")
      : params.amount;

    // Mock estimate - in production, use Turbos SDK to get real estimates
    return {
      amount_in: byAmountIn ? mockAmount : "1000000",
      amount_out: byAmountIn ? "1000000" : mockAmount,
      price_impact: "0",
      fee: "0",
      // Turbos uses tick-based pricing, not sqrt_price_limit
      sqrt_price_limit: undefined,
      amount_limit: byAmountIn ? "0" : "18446744073709551615",
    };
  }

  /**
   * Add swap transaction to PTB using Turbos CLMM
   * 
   * Turbos CLMM functions (based on standard CLMM pattern):
   * - swap_exact_input_for_output: Swap exact input amount (A->B or B->A)
   * - swap_exact_output_for_input: Swap exact output amount (A->B or B->A)
   * 
   * Note: Turbos uses a2b parameter to determine swap direction
   * - a2b = true: Swap from coin_type_a to coin_type_b
   * - a2b = false: Swap from coin_type_b to coin_type_a
   */
  swap(tx: Transaction, node: DexSwapNode, coinIn: any, estimate: SwapEstimate): any {
    const params = node.params as TurbosSwapParams;
    
    // Get Turbos config (will throw if not on testnet)
    const turbosConfig = this.getTurbosConfig();

    const byAmountIn = params.amount_mode === "EXACT_IN";
    const user_a2b = params.direction === "A_TO_B";

    // Determine which coin type is the input
    const inputCoinType = user_a2b ? params.coin_type_a : params.coin_type_b;
    const outputCoinType = user_a2b ? params.coin_type_b : params.coin_type_a;

    // Handle "ALL" amount
    let amount: any;
    if (params.amount === "ALL") {
      amount = tx.moveCall({
        target: "0x2::coin::value",
        arguments: [coinIn],
        typeArguments: [inputCoinType],
      });
    } else {
      amount = tx.pure.u64(BigInt(params.amount));
    }

    // Calculate slippage-adjusted amount limit
    const amountLimit = byAmountIn
      ? this.calculateAmountLimit(estimate, params.slippage_tolerance, false) // min output
      : this.calculateAmountLimit(estimate, params.slippage_tolerance, true); // max input

    // Turbos CLMM swap function signatures:
    // swap_exact_input_for_output<CoinTypeA, CoinTypeB>(
    //   pool_config: &PoolConfig,
    //   pool: &Pool,
    //   coin_a: Coin<CoinTypeA>,
    //   amount: u64,
    //   min_amount_b: u64,
    //   a2b: bool,  // Direction: true = A->B, false = B->A
    //   clock: &Clock,
    //   ctx: &mut TxContext
    // ): Coin<CoinTypeB>
    //
    // swap_exact_output_for_input<CoinTypeA, CoinTypeB>(
    //   pool_config: &PoolConfig,
    //   pool: &Pool,
    //   coin_a: Coin<CoinTypeA>,
    //   amount: u64,
    //   max_amount_a: u64,
    //   a2b: bool,  // Direction: true = A->B, false = B->A
    //   clock: &Clock,
    //   ctx: &mut TxContext
    // ): Coin<CoinTypeB>

    if (byAmountIn) {
      // swap_exact_input_for_output
      const coinOut = tx.moveCall({
        target: `${turbosConfig.PACKAGE}::pool::swap_exact_input_for_output`,
        arguments: [
          tx.object(turbosConfig.CONFIG.pool_config),
          tx.object(params.pool_id),
          coinIn,
          amount,
          tx.pure.u64(BigInt(amountLimit)), // min_amount_b (with slippage)
          tx.pure.bool(user_a2b), // a2b direction
          tx.object("0x6"), // Clock
        ],
        typeArguments: [params.coin_type_a, params.coin_type_b],
      });
      return coinOut;
    } else {
      // swap_exact_output_for_input
      const coinOut = tx.moveCall({
        target: `${turbosConfig.PACKAGE}::pool::swap_exact_output_for_input`,
        arguments: [
          tx.object(turbosConfig.CONFIG.pool_config),
          tx.object(params.pool_id),
          coinIn,
          amount,
          tx.pure.u64(BigInt(amountLimit)), // max_amount_a (with slippage)
          tx.pure.bool(user_a2b), // a2b direction
          tx.object("0x6"), // Clock
        ],
        typeArguments: [params.coin_type_a, params.coin_type_b],
      });
      return coinOut;
    }
  }
}
