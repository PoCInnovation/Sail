/**
 * Cetus DEX Adapter
 *
 * Integrates with Cetus CLMM (Concentrated Liquidity Market Maker).
 * Requires pre-swap calculation for sqrt_price_limit and amount_limit.
 */

import { Transaction } from "@mysten/sui/transactions";
import { CetusClmmSDK } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { DexSwapNode, CetusSwapParams } from "../../types/strategy";
import { BaseDexAdapter, SwapEstimate } from "./types";

export class CetusAdapter extends BaseDexAdapter {
  readonly protocol = "CETUS";
  private sdk: CetusClmmSDK | null = null;

  constructor(
    private readonly network: "mainnet" | "testnet" = "testnet"
  ) {
    super();

    // Initialize Cetus SDK
    // Note: Actual initialization depends on Cetus SDK version
    // This is a placeholder for now
    try {
      this.sdk = new CetusClmmSDK({
        network: this.network,
        // Additional config as needed
      } as any);
    } catch (error) {
      console.warn("Cetus SDK initialization failed. Adapter will work in mock mode.");
    }
  }

  async preSwap(node: DexSwapNode): Promise<SwapEstimate> {
    const params = node.params as CetusSwapParams;

    if (!this.sdk) {
      // Mock estimate for development
      return this.mockPreSwap(params);
    }

    try {
      // Fetch pool data
      const pool = await (this.sdk as any).Pool.getPool(params.pool_id);

      if (!pool) {
        throw new Error(`Cetus pool not found: ${params.pool_id}`);
      }

      // Determine swap direction
      const a2b = params.direction === "A_TO_B";
      const byAmountIn = params.amount_mode === "EXACT_IN";

      // Pre-swap calculation
      const preswapResult = await (this.sdk as any).Swap.preswap({
        pool: pool,
        currentSqrtPrice: pool.currentSqrtPrice || pool.current_sqrt_price,
        coinTypeA: params.coin_type_a,
        coinTypeB: params.coin_type_b,
        decimalsA: 9, // TODO: Get actual decimals
        decimalsB: 6, // TODO: Get actual decimals
        a2b: a2b,
        by_amount_in: byAmountIn,
        amount: params.amount,
      });

      if (!preswapResult) {
        throw new Error("Preswap returned null");
      }

      // Calculate sqrt_price_limit
      const sqrt_price_limit = a2b
        ? "4295048016" // MIN_SQRT_PRICE
        : "79226673515401279992447579055"; // MAX_SQRT_PRICE

      // Calculate amount_limit with slippage
      const slippage = parseFloat(params.slippage_tolerance);
      const estimatedAmount = byAmountIn ? preswapResult.estimatedAmountOut : preswapResult.estimatedAmountIn;

      const amount_limit = byAmountIn
        ? this.calculateMinOutput(BigInt(estimatedAmount), slippage)
        : this.calculateMaxInput(BigInt(estimatedAmount), slippage);

      return {
        amount_in: byAmountIn ? params.amount : estimatedAmount.toString(),
        amount_out: byAmountIn ? estimatedAmount.toString() : params.amount,
        price_impact: "0",
        fee: preswapResult.estimatedFeeAmount?.toString() || "0",
        sqrt_price_limit: params.sqrt_price_limit || sqrt_price_limit,
        amount_limit: amount_limit,
      };
    } catch (error) {
      console.warn("Cetus preswap failed, using mock estimate:", error);
      return this.mockPreSwap(params);
    }
  }

  private mockPreSwap(params: CetusSwapParams): SwapEstimate {
    // Mock estimate for development/testing
    const a2b = params.direction === "A_TO_B";
    const sqrt_price_limit = a2b ? "4295048016" : "79226673515401279992447579055";

    return {
      amount_in: params.amount,
      amount_out: params.amount, // 1:1 for mock
      price_impact: "0",
      fee: "0",
      sqrt_price_limit: params.sqrt_price_limit || sqrt_price_limit,
      amount_limit: params.amount,
    };
  }

  swap(tx: Transaction, node: DexSwapNode, coinIn: any, estimate: SwapEstimate): any {
    const params = node.params as CetusSwapParams;

    const a2b = params.direction === "A_TO_B";
    const byAmountIn = params.amount_mode === "EXACT_IN";

    // Build swap transaction
    const swapResult = tx.moveCall({
      target: `${this.getCetusPackageId()}::pool::swap`,
      arguments: [
        tx.object(params.pool_id),
        coinIn,
        tx.pure.bool(a2b),
        tx.pure.bool(byAmountIn),
        tx.pure.u64(params.amount),
        tx.pure.u128(estimate.sqrt_price_limit || "0"),
        tx.pure.u64(estimate.amount_limit || "0"),
      ],
      typeArguments: [params.coin_type_a, params.coin_type_b],
    });

    return swapResult;
  }

  private calculateMinOutput(estimatedOutput: bigint, slippage: number): string {
    const minOutput = (estimatedOutput * BigInt(Math.floor((1 - slippage) * 1000000))) / BigInt(1000000);
    return minOutput.toString();
  }

  private calculateMaxInput(estimatedInput: bigint, slippage: number): string {
    const maxInput = (estimatedInput * BigInt(Math.floor((1 + slippage) * 1000000))) / BigInt(1000000);
    return maxInput.toString();
  }

  private getFullNodeUrl(): string {
    return this.network === "mainnet"
      ? "https://fullnode.mainnet.sui.io:443"
      : "https://fullnode.testnet.sui.io:443";
  }

  private getCetusPackageId(): string {
    // TODO: Get actual package ID from Cetus SDK or configuration
    return this.network === "mainnet"
      ? "0x..." // Mainnet package
      : "0x..."; // Testnet package
  }
}
