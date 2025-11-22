import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Block, BlockType, SimulationResult } from "../components/types";

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      params: { token: "SUI", amount: "" },
    };
    setBlocks(prev => [...prev, newBlock]);
    setSimulationResult(null);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSimulationResult(null);
  };

  const updateBlockParam = (id: string, key: string, value: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === id ? { ...b, params: { ...b.params, [key]: value } } : b
    ));
    setSimulationResult(null);
  };

  const clearBlocks = () => {
    setBlocks([]);
    setSimulationResult(null);
  };

  return {
    blocks,
    simulationResult,
    setSimulationResult,
    addBlock,
    removeBlock,
    updateBlockParam,
    clearBlocks,
  };
}

