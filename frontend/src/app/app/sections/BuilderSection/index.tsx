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

export function BuilderSection() {
  const currentAccount = useCurrentAccount();
  const tokenMap = useTokens();
  
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

  return (
    <Box className="h-full mt-12 flex flex-col gap-6">
      <BuilderHeader
        onClear={handleClear}
        onRunSimulation={runSimulation}
        isSimulating={isSimulating}
        hasBlocks={blocks.length > 0}
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
