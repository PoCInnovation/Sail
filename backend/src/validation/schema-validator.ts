/**
 * Schema Validator
 *
 * Validates strategy JSON against Zod schemas.
 * This is the first validation step before graph validation.
 */

import { ZodError } from "zod";
import { StrategySchema } from "../types/schema";
import { Strategy, ValidationResult, ValidationRule } from "../types/strategy";

export class SchemaValidator {
  /**
   * Validate a strategy object against the Zod schema
   */
  static validate(strategyJson: unknown): ValidationResult {
    const errors: ValidationRule[] = [];
    const warnings: ValidationRule[] = [];
    const info: ValidationRule[] = [];

    try {
      // Parse and validate using Zod schema
      StrategySchema.parse(strategyJson);

      // If we get here, schema validation passed
      info.push({
        rule_id: "SCHEMA_VALID",
        severity: "INFO",
        message: "Strategy JSON schema is valid",
      });

      return {
        success: true,
        errors,
        warnings,
        info,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        // Convert Zod errors to ValidationRule format
        error.issues.forEach((issue, index) => {
          errors.push({
            rule_id: `SCHEMA_ERROR_${index}`,
            severity: "ERROR",
            message: `${issue.path.join(".")}: ${issue.message}`,
          });
        });
      } else {
        // Unknown error
        errors.push({
          rule_id: "SCHEMA_UNKNOWN_ERROR",
          severity: "ERROR",
          message: error instanceof Error ? error.message : "Unknown validation error",
        });
      }

      return {
        success: false,
        errors,
        warnings,
        info,
      };
    }
  }

  /**
   * Validate and return typed strategy if valid
   */
  static validateAndParse(strategyJson: unknown): {
    valid: boolean;
    strategy?: Strategy;
    validation: ValidationResult;
  } {
    const validation = this.validate(strategyJson);

    if (validation.success) {
      // Safe to cast since validation passed
      return {
        valid: true,
        strategy: strategyJson as Strategy,
        validation,
      };
    }

    return {
      valid: false,
      validation,
    };
  }

  /**
   * Validate specific node reference format
   * Format: "nodeId.outputId"
   */
  static validateNodeReference(reference: string): boolean {
    const parts = reference.split(".");
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  }

  /**
   * Parse node reference into components
   */
  static parseNodeReference(reference: string): { nodeId: string; outputId: string } | null {
    if (!this.validateNodeReference(reference)) {
      return null;
    }

    const [nodeId, outputId] = reference.split(".");
    return { nodeId, outputId };
  }

  /**
   * Validate Sui address format
   */
  static validateSuiAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address);
  }

  /**
   * Validate coin type format
   */
  static validateCoinType(coinType: string): boolean {
    return /^0x[a-fA-F0-9]+::\w+::\w+$/.test(coinType);
  }
}
