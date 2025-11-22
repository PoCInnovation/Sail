import { v4 as uuidv4 } from "uuid";
import { Block } from "../components/types";

export function normalizeToken(input: string, tokenMap: Record<string, string>): string {
  if (!input) return "";
  const upperInput = input.toUpperCase();
  // Check dynamic map first
  if (tokenMap[upperInput]) return tokenMap[upperInput];
  // Fallback for SUI if not in map (though it should be)
  if (upperInput === "SUI") return "0x2::sui::SUI";
  return input;
}

export function normalizeAmount(amount: string): string {
  if (!amount) return "0";
  // If amount seems small (like "1.5"), assume it needs decimal conversion (x 10^9 for SUI)
  // This is a simplified heuristic for the hackathon
  if (amount.includes(".") || parseFloat(amount) < 1000000) {
    return Math.floor(parseFloat(amount) * 1_000_000_000).toString();
  }
  return amount;
}

export function buildStrategyFromBlocks(blocks: Block[], tokenMap: Record<string, string>, authorAddress: string) {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Create Strategy Metadata
  const strategyId = uuidv4();
  const strategy = {
    id: strategyId,
    version: "1.0.0",
    meta: {
      name: "Builder Strategy",
      author: authorAddress,
      description: "Created via Sail Builder UI",
      created_at: Date.now(),
      updated_at: Date.now(),
      tags: ["ui-builder"]
    },
    nodes,
    edges
  };

  // Build Nodes and Edges from linear block list
  let previousNodeId: string | null = null;
  let previousOutputId: string | null = null;

  blocks.forEach((block, index) => {
    const nodeId = `node_${index}_${block.type}`;
    let node: any = null;
    
    const token = normalizeToken(block.params.token, tokenMap);
    const amount = normalizeAmount(block.params.amount);

    // Map UI Block to Backend Node Type
    switch (block.type) {
      case "swap":
        node = {
          id: nodeId,
          type: "DEX_SWAP",
          protocol: "CETUS", 
          params: {
            pool_id: "0x...", 
            coin_type_a: token,
            coin_type_b: "0x...::usdc::USDC", 
            direction: "A_TO_B",
            amount_mode: "EXACT_IN",
            amount: amount,
            slippage_tolerance: "0.01"
          },
          inputs: {
            coin_in: previousNodeId ? `${previousNodeId}.coin_out` : "input_coin"
          },
          outputs: [{ id: "coin_out", type: "Coin", output_type: "COIN" }]
        };
        break;
      
      case "flashloan":
        node = {
          id: nodeId,
          type: "FLASH_BORROW",
          protocol: "NAVI",
          params: {
            asset: token,
            amount: amount
          },
          outputs: [
            { id: "loan_coin", type: "Coin", output_type: "COIN" },
            { id: "receipt", type: "Receipt", output_type: "RECEIPT" }
          ]
        };
        break;

      default:
        node = {
          id: nodeId,
          type: "CUSTOM",
          protocol: "CUSTOM",
          params: { target: "0x...", arguments: [] },
          inputs: {},
          outputs: []
        };
    }

    if (node) {
      nodes.push(node);

      // Create Edge from previous node if exists
      if (previousNodeId && previousOutputId) {
        edges.push({
          id: `edge_${index}`,
          source: previousNodeId,
          source_output: previousOutputId,
          target: nodeId,
          target_input: "coin_in",
          edge_type: "COIN",
          coin_type: block.params.token
        });
      }

      previousNodeId = nodeId;
      previousOutputId = node.outputs[0]?.id || null; 
    }
  });

  return strategy;
}

