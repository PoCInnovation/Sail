/**
 * Simulator
 *
 * Orchestrates the dry run of a strategy against the Sui network.
 * Validates the strategy, builds the transaction, and executes a dry run
 * to estimate gas costs and profit/loss.
 */

import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { TransactionBuilder } from "./transaction-builder";
import {
  Strategy,
  SimulationResult,
  ValidationRule,
  SwapEstimate,
} from "../types/strategy";

export class Simulator {
  private builder: TransactionBuilder;
  private client: SuiClient;

  constructor(private readonly network: "mainnet" | "testnet" = "mainnet") {
    this.builder = new TransactionBuilder(this.network);
    this.client = new SuiClient({ url: this.getFullNodeUrl() });
  }

  /**
   * Simulate a strategy by running a dry run on the network.
   *
   * @param strategy - The strategy to simulate
   * @param sender - The sender address to use for the simulation
   * @returns SimulationResult containing success status, gas estimate, and profit/loss
   */
  async simulate(strategy: Strategy, sender: string): Promise<SimulationResult> {
    // Reset builder state
    this.builder.reset();

    // Log simulation start with network info
    console.log(`[SIMULATOR] Starting simulation on ${this.network}`);
    console.log(`[SIMULATOR] Sender: ${sender}`);
    console.log(`[SIMULATOR] Strategy ID: ${strategy.id}`);

    const result: SimulationResult = {
      success: false,
      estimated_gas: 0,
      estimated_profit_loss: [],
      swap_estimates: new Map<string, SwapEstimate>(),
      errors: [],
      warnings: [],
    };

    try {
      // 1. Build the transaction
      // This also performs validation and pre-simulation (swap estimates)
      console.log(`[SIMULATOR] Building transaction with network: ${this.network}`);
      const tx = await this.builder.buildFromStrategy(strategy);
      tx.setSender(sender);
      console.log(`[SIMULATOR] Transaction built successfully`);

      // Capture swap estimates from builder if available
      // Note: TransactionBuilder doesn't expose cache publicly yet.
      // We might want to add a getter to TransactionBuilder for this,
      // or just accept that we don't have them in the simulation result for now unless we modify Builder.
      // For now, let's proceed without explicit swap estimates in the output 
      // (or we could assume the builder attached them to the node objects if we modified it, but we didn't).

      // 2. Execute Dry Run
      // Set a high gas budget for simulation to avoid "could not determine budget" errors
      // The dry run will show actual gas needed regardless of this value
      const txBytes = await tx.build({ client: this.client });

      const dryRunResult = await this.client.dryRunTransactionBlock({
        transactionBlock: txBytes,
      });

      // 3. Parse Results
      if (dryRunResult.effects.status.status === "success") {
        result.success = true;

        // Calculate Gas Used
        const gasUsed =
          BigInt(dryRunResult.effects.gasUsed.computationCost) +
          BigInt(dryRunResult.effects.gasUsed.storageCost) -
          BigInt(dryRunResult.effects.gasUsed.storageRebate);

        result.estimated_gas = Number(gasUsed);

        // Calculate Profit/Loss from Balance Changes
        // We only care about changes for the sender
        const balanceMap = new Map<string, bigint>();

        if (dryRunResult.balanceChanges) {
          for (const change of dryRunResult.balanceChanges) {
            // Check if the owner is the sender
            // Owner can be { AddressOwner: string } or { ObjectOwner: string } or { Shared: ... }
            // We need to check if it matches our sender
            if (
              change.owner &&
              typeof change.owner === 'object' &&
              'AddressOwner' in change.owner &&
              change.owner.AddressOwner === sender
            ) {
              const current = balanceMap.get(change.coinType) || 0n;
              balanceMap.set(change.coinType, current + BigInt(change.amount));
            }
          }
        }

        // Convert map to result array
        balanceMap.forEach((amount, coinType) => {
          result.estimated_profit_loss.push({
            coin_type: coinType,
            amount: amount.toString(),
          });
        });
      } else {
        // Transaction failed
        result.success = false;
        const errorMsg = dryRunResult.effects.status.error || "Unknown error";
        
        // Log full error details for debugging
        console.error("=== DRY RUN FAILED ===");
        console.error("Network:", this.network);
        console.error("Error from effects:", errorMsg);
        console.error("Full effects:", JSON.stringify(dryRunResult.effects, null, 2));
        console.error("=====================");
        
        // Parse error message with improved error detection
        const userMessage = this.parseExecutionError(errorMsg);
        
        result.errors.push({
          rule_id: "dry_run_failed",
          severity: "ERROR",
          message: userMessage,
        });
      }

    } catch (error: any) {
      result.success = false;
      
      // Log full error details for debugging
      console.error("=== SIMULATION ERROR DETAILS ===");
      console.error("Network:", this.network);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      console.error("================================");
      
      // Parse error message - prioritize package/object errors over balance errors
      const errorMessage = error.message || error.toString() || "An unexpected error occurred during simulation";
      const userMessage = this.parseExecutionError(errorMessage);
      
      result.errors.push({
        rule_id: "simulation_error",
        severity: "ERROR",
        message: userMessage,
      });
    }

    return result;
  }

  /**
   * Parse Move execution errors and return user-friendly messages
   * Distinguishes clearly between:
   * 1. Package/Object does not exist (configuration issue)
   * 2. Insufficient balance (funding issue)
   */
  private parseExecutionError(errorMsg: string): string {
    // ===================================================================
    // PRIORITY 1: Package/Object does not exist (CONFIGURATION ERROR)
    // ===================================================================
    
    // Handle "Package object does not exist" - This is a CONFIGURATION issue, not a balance issue
    if (errorMsg.includes("Package object does not exist") || errorMsg.includes("does not exist with ID")) {
      // Extract package ID if present
      const packageIdMatch = errorMsg.match(/0x[a-fA-F0-9]{64}/);
      const packageId = packageIdMatch ? packageIdMatch[0] : null;
      
      let message = `❌ CONFIGURATION ERROR: Package does not exist on ${this.network}.\n\n`;
      
      if (packageId) {
        message += `Package ID: ${packageId}\n\n`;
        
        // Check if it's a known package and suggest the issue
        if (packageId === "0x8200ce83e1bc0894b641f0a466694b4f6e25d3f9cc3093915a887ec9e7f3395e") {
          message += `⚠️ This is the old Navi Protocol package ID.\n`;
          message += `The package may not exist on ${this.network}, or you need to use the updated package ID.\n\n`;
          message += `Action: Check the correct package ID for ${this.network} on SuiScan:\n`;
          message += `https://suiscan.xyz/${this.network}\n`;
        } else if (packageId === "0xee0041239b89564ce870a7dec5ddc5d114367ab94a1137e90aa0633cb76518e0") {
          if (this.network === "testnet") {
            message += `⚠️ This is the Navi Protocol mainnet package ID (upgrade Nov 2025).\n`;
            message += `Navi Protocol is not available on testnet.\n\n`;
            message += `💡 On testnet, use Turbos Finance for flash loans and swaps:\n`;
            message += `   - Flash Loans: Use protocol "TURBOS" with Turbos flash_swap\n`;
            message += `   - DEX Swaps: Use protocol "TURBOS" with Turbos pools\n`;
            message += `   - Turbos Package: 0x3526c88f5304c78fb93ed1cc1961d56b8517108550c9938b8a5a0e6c90fbe2a5\n\n`;
            message += `Action: Switch your strategy to use "TURBOS" protocol on testnet, or switch to mainnet for Navi.\n`;
          } else {
            message += `⚠️ This is the Navi Protocol mainnet package ID (upgrade Nov 2025).\n`;
            message += `Action: Verify this package exists on ${this.network}:\n`;
            message += `https://suiscan.xyz/${this.network}/package/${packageId}\n`;
          }
        } else {
          message += `Action: Verify this package exists on ${this.network}:\n`;
          message += `https://suiscan.xyz/${this.network}/package/${packageId}\n`;
        }
      } else {
        message += `Action: Check your strategy configuration and verify all package IDs are correct for ${this.network}.\n`;
      }
      
      message += `\nThis is NOT a balance issue - your wallet balance is sufficient.`;
      return message;
    }
    
    // Handle "Object does not exist" - Similar configuration issue
    if (errorMsg.includes("Object does not exist") || errorMsg.includes("Object ID") && errorMsg.includes("does not exist")) {
      const objectIdMatch = errorMsg.match(/0x[a-fA-F0-9]{64}/);
      const objectId = objectIdMatch ? objectIdMatch[0] : null;
      
      let message = `❌ CONFIGURATION ERROR: Object does not exist on ${this.network}.\n\n`;
      
      if (objectId) {
        message += `Object ID: ${objectId}\n\n`;
        message += `This could be:\n`;
        message += `- STORAGE, FLASHLOAN_CONFIG, or other protocol objects\n`;
        message += `- A pool ID that doesn't exist\n`;
        message += `- An incorrect object ID in your configuration\n\n`;
        message += `Action: Verify the object exists on ${this.network}:\n`;
        message += `https://suiscan.xyz/${this.network}/object/${objectId}\n`;
      }
      
      message += `\nThis is NOT a balance issue - your wallet balance is sufficient.`;
      return message;
    }
    
    // ===================================================================
    // PRIORITY 2: Insufficient Balance (FUNDING ERROR)
    // ===================================================================
    
    // Handle "could not automatically determine a budget" errors with MoveAbort
    if (errorMsg.includes("could not automatically determine a budget") && errorMsg.includes("MoveAbort")) {
      // Extract abort code
      const abortCodeMatch = errorMsg.match(/MoveAbort.*?(\d+)\)/);
      const abortCode = abortCodeMatch ? parseInt(abortCodeMatch[1]) : null;

      if (abortCode === 1503) {
        return `💰 INSUFFICIENT BALANCE: You don't have enough SUI on ${this.network}.\n\n` +
               `Required: Borrowed amount + flash loan fees (0.06%) + gas fees\n\n` +
               `Action: Add more SUI to your wallet on ${this.network}.\n` +
               `This is a FUNDING issue, not a configuration issue.`;
      }
      if (abortCode === 1502) {
        return "Flash loan repayment error: The repayment amount is incorrect. The borrowed amount plus fees must be repaid exactly.";
      }
      if (abortCode === 1) {
        return "Assertion failed in flash loan contract. Check your strategy logic.";
      }

      return `💰 INSUFFICIENT BALANCE: The protocol cannot determine the required budget (error code: ${abortCode || "unknown"}).\n\n` +
             `This usually means you don't have enough SUI on ${this.network}.\n\n` +
             `Action: Add more SUI to your wallet.\n` +
             `This is a FUNDING issue, not a configuration issue.`;
    }

    // Handle Move abort errors (e.g., "MoveAbort(MoveLocation { ... }, 1503)")
    if (errorMsg.includes("MoveAbort")) {
      // Extract abort code if available
      const abortCodeMatch = errorMsg.match(/MoveAbort.*?(\d+)\)/);
      const abortCode = abortCodeMatch ? parseInt(abortCodeMatch[1]) : null;

      // Map common abort codes to user-friendly messages
      if (abortCode === 1503) {
        return `💰 INSUFFICIENT BALANCE: You don't have enough SUI on ${this.network}.\n\n` +
               `Required: Borrowed amount + flash loan fees (0.06%) + gas fees\n\n` +
               `Action: Add more SUI to your wallet on ${this.network}.\n` +
               `This is a FUNDING issue, not a configuration issue.`;
      }
      if (abortCode === 1502) {
        return "Flash loan repayment error: The repayment amount is incorrect. The borrowed amount plus fees must be repaid exactly.";
      }
      if (abortCode === 1) {
        return "Assertion failed in flash loan contract. Check your strategy logic.";
      }
      if (abortCode === 0) {
        return "Non-zero coin destruction: You are trying to destroy a coin that still has value. This usually happens when a swap doesn't consume the full input amount, and the remainder is not handled. Please ensure your swap amounts match your input amounts exactly.";
      }

      // Generic message for other abort codes
      return `⚠️ EXECUTION ERROR (Error code: ${abortCode || "unknown"}).\n\n` +
             `Possible causes:\n` +
             `- Insufficient balance (add more SUI)\n` +
             `- Strategy logic issue\n` +
             `- Configuration issue (wrong package/object IDs)\n\n` +
             `Check your wallet balance and strategy configuration on ${this.network}.`;
    }

    // Handle unused value errors (bytecode verification)
    if (errorMsg.includes("unused") || errorMsg.includes("drop")) {
       return "Unused value error: A coin or object was created but not used. In Sui, you cannot simply drop coins with value. You must merge them, transfer them, or destroy them (if zero).";
    }

    // Handle other error patterns related to balance
    if (errorMsg.includes("could not automatically determine a budget")) {
      return `💰 INSUFFICIENT BALANCE: Unable to determine gas budget.\n\n` +
             `You may not have enough SUI on ${this.network} for gas fees.\n\n` +
             `Action: Add more SUI to your wallet.\n` +
             `This is a FUNDING issue, not a configuration issue.`;
    }

    if (errorMsg.includes("balance") && (errorMsg.includes("insufficient") || errorMsg.includes("not enough"))) {
      return `💰 INSUFFICIENT BALANCE on ${this.network}.\n\n` +
             `You don't have enough SUI to execute this strategy.\n\n` +
             `Action: Add more SUI to your wallet.\n` +
             `This is a FUNDING issue, not a configuration issue.`;
    }

    if (errorMsg.includes("gas") && (errorMsg.includes("insufficient") || errorMsg.includes("not enough"))) {
      return `💰 INSUFFICIENT GAS on ${this.network}.\n\n` +
             `You don't have enough SUI to pay for gas fees.\n\n` +
             `Action: Add more SUI to your wallet.\n` +
             `This is a FUNDING issue, not a configuration issue.`;
    }

    if (errorMsg.includes("coin") && !errorMsg.includes("does not exist")) {
      return `⚠️ COIN ERROR on ${this.network}.\n\n` +
             `There may be an issue with the coins in your strategy.\n\n` +
             `Action: Check that all coin types are correct.\n` +
             `This could be a CONFIGURATION issue (wrong coin types) or a FUNDING issue (insufficient coins).`;
    }

    // ===================================================================
    // GENERIC ERROR - Try to determine if it's configuration or funding
    // ===================================================================
    
    // Check for common configuration error patterns
    if (errorMsg.includes("does not exist") || 
        errorMsg.includes("not found") || 
        errorMsg.includes("invalid") && (errorMsg.includes("package") || errorMsg.includes("object"))) {
      return `❌ CONFIGURATION ERROR on ${this.network}.\n\n` +
             `Error: ${errorMsg}\n\n` +
             `This is likely a configuration issue:\n` +
             `- Wrong package ID for ${this.network}\n` +
             `- Wrong object ID (STORAGE, FLASHLOAN_CONFIG, etc.)\n` +
             `- Package/object doesn't exist on ${this.network}\n\n` +
             `Action: Verify all package and object IDs are correct for ${this.network}.\n` +
             `Check: https://suiscan.xyz/${this.network}\n\n` +
             `This is NOT a balance issue.`;
    }
    
    // Default: Return original error with clear categorization attempt
    return `⚠️ EXECUTION ERROR on ${this.network}.\n\n` +
           `Error: ${errorMsg}\n\n` +
           `Possible causes:\n` +
           `1. ❌ CONFIGURATION: Wrong package/object IDs for ${this.network}\n` +
           `2. 💰 FUNDING: Insufficient SUI balance\n` +
           `3. ⚠️ LOGIC: Strategy logic issue\n\n` +
           `Check your configuration and wallet balance.`;
  }

  private getFullNodeUrl(): string {
    return this.network === "mainnet"
      ? "https://fullnode.mainnet.sui.io:443"
      : "https://fullnode.testnet.sui.io:443";
  }
}

