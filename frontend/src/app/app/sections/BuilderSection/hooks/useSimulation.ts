import { useState } from "react";
import { SimulationResult } from "../components/types";
import { buildStrategyFromBlocks } from "../utils/strategyBuilder";
import { Block } from "../components/types";

interface UseSimulationProps {
  blocks: Block[];
  tokenMap: Record<string, string>;
  senderAddress: string;
  onSuccess: (result: SimulationResult) => void;
}

export function useSimulation({ blocks, tokenMap, senderAddress, onSuccess }: UseSimulationProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    if (!senderAddress) {
      setError("Please connect your wallet first");
      return;
    }

    setIsSimulating(true);
    setError(null);

    try {
      // Build strategy from blocks
      const strategy = buildStrategyFromBlocks(blocks, tokenMap, senderAddress);

      // 1. Validate
      const validateRes = await fetch("http://localhost:3000/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy }),
      });
      const validateData = await validateRes.json();

      if (!validateData.valid) {
        const errorMsg = validateData.errors.map((e: any) => `${e.rule_id}: ${e.message}`).join("\n");
        throw new Error(errorMsg || "Validation failed");
      }

      // 2. Simulate
      const simulateRes = await fetch("http://localhost:3000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          strategy, 
          sender: senderAddress 
        }),
      });
      const simulateData = await simulateRes.json();

      if (!simulateData.success && simulateData.errors?.length > 0) {
        throw new Error(simulateData.errors[0].message);
      }

      onSuccess(simulateData);
    } catch (err: any) {
      setError(err.message || "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    isSimulating,
    error,
    runSimulation,
    setError,
  };
}

