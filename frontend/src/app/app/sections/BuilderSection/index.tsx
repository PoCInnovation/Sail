"use client";

import { Box, Grid } from "@mui/material";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTokens } from "./hooks/useTokens";
import { useBlocks } from "./hooks/useBlocks";
import { useSimulation } from "./hooks/useSimulation";
import { BlockPalette } from "./components/BlockPalette";
import { Canvas } from "./components/Canvas";
import { SimulationResults } from "./components/SimulationResults";
import { BuilderHeader } from "./components/BuilderHeader";

import { buildStrategyFromBlocks } from "./utils/strategyBuilder";

import { useState } from "react";
import { SaveStrategyModal } from "./components/SaveStrategyModal";

interface BuilderSectionProps {
  onNavigate?: (section: string) => void;
}

export function BuilderSection({ onNavigate }: BuilderSectionProps) {
  const currentAccount = useCurrentAccount();
  const tokenMap = useTokens();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const {
    blocks,
    simulationResult,
    setSimulationResult,
    addBlock,
    removeBlock,
    updateBlockParam,
    clearBlocks,
  } = useBlocks();

  const {
    isSimulating,
    error,
    runSimulation,
    setError,
  } = useSimulation({
    blocks,
    tokenMap,
    senderAddress: currentAccount?.address || "",
    onSuccess: setSimulationResult,
  });

  const handleClear = () => {
    clearBlocks();
    setError(null);
  };

  const handleSaveClick = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = (name: string, description: string) => {
    try {
      const strategy = buildStrategyFromBlocks(blocks, tokenMap, currentAccount?.address || "Anonymous");
      
      // Update metadata with user input
      strategy.meta.name = name;
      strategy.meta.description = description;
      strategy.meta.updated_at = Date.now();

      // Save to localStorage
      const savedStrategies = JSON.parse(localStorage.getItem("saved_strategies") || "[]");
      savedStrategies.push(strategy);
      localStorage.setItem("saved_strategies", JSON.stringify(savedStrategies));

      console.log("Strategy saved:", strategy);
      
      // Navigate to Strategy Folder (templates)
      if (onNavigate) {
        onNavigate("templates");
      }
    } catch (e) {
      console.error("Failed to save strategy:", e);
      alert("Failed to save strategy");
    }
  };

  return (
    <Box className="h-full mt-12 flex flex-col gap-6">
      <BuilderHeader
        onClear={handleClear}
        onRunSimulation={runSimulation}
        onSave={handleSaveClick}
        isSimulating={isSimulating}
        hasBlocks={blocks.length > 0}
        simulationSuccess={!!simulationResult}
      />

      <SaveStrategyModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleConfirmSave}
      />

      <Grid container spacing={4} className="flex-1 min-h-0">
        {/* Left Panel: Canvas */}
        <Grid size={{ xs: 12, md: 8 }} className="flex flex-col gap-4 h-full overflow-hidden">
          {/* Block Palette */}
          <BlockPalette onAddBlock={addBlock} />

          {/* Canvas Area */}
          <Canvas
            blocks={blocks}
            tokenMap={tokenMap}
            onRemoveBlock={removeBlock}
            onUpdateBlockParam={updateBlockParam}
          />
        </Grid>

        {/* Right Panel: Simulation Results */}
        <Grid size={{ xs: 12, md: 4 }} className="h-full">
          <SimulationResults
            simulationResult={simulationResult}
            error={error}
            blocksCount={blocks.length}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
