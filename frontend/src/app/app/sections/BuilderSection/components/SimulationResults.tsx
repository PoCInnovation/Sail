"use client";

import { motion } from "framer-motion";
import { Paper, Typography } from "@mui/material";
import { Play, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { SimulationResult } from "./types";

interface SimulationResultsProps {
  simulationResult: SimulationResult | null;
  error: string | null;
  blocksCount: number;
}

export function SimulationResults({ simulationResult, error, blocksCount }: SimulationResultsProps) {
  return (
    <Paper 
      className="h-full border border-gray-800 p-6 flex flex-col relative overflow-hidden"
      sx={{ 
        backgroundColor: '#0a0f1e',
        color: 'white'
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-blue-500/10 border border-blue-500/30">
          <Play size={16} className="text-blue-400" />
        </div>
        <div>
          <Typography className="font-mono text-sm text-white font-bold uppercase tracking-wider">
            Simulation Results
          </Typography>
          <Typography className="font-mono text-[10px] text-gray-500 mt-0.5">
            Real-time execution feedback
          </Typography>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        {!simulationResult && !error ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-700 bg-[#0f1629] flex items-center justify-center mb-4">
              <Info size={24} className="text-gray-600" />
            </div>
            <Typography className="font-mono text-sm text-gray-500 text-center max-w-[250px]">
              No simulation executed yet
            </Typography>
            <Typography className="font-mono text-[10px] text-gray-600 text-center mt-2 max-w-[250px]">
              Click "EXECUTE SIMULATION" to run your strategy
            </Typography>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/5 border border-red-500/30 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-red-500" />
              <Typography className="font-mono text-sm text-red-400 font-bold uppercase">
                Execution Failed
              </Typography>
            </div>
            <div className="text-sm text-red-300/90 leading-relaxed break-words font-mono">
              {error}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Success Header */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-emerald-400" />
                <Typography className="font-mono text-sm text-emerald-400 font-bold uppercase">
                  Simulation Successful
                </Typography>
              </div>
              <Typography className="font-mono text-[10px] text-emerald-400/70 ml-8">
                Completed in 142ms
              </Typography>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f1629] border border-gray-800 p-3">
                <Typography className="font-mono text-[9px] text-gray-500 mb-2 uppercase">
                  Gas Estimate
                </Typography>
                <Typography className="font-mono text-lg text-blue-400 font-bold">
                  {simulationResult?.estimated_gas}
                </Typography>
                <Typography className="font-mono text-[10px] text-gray-600 mt-1">
                  SUI
                </Typography>
              </div>
              <div className="bg-[#0f1629] border border-gray-800 p-3">
                <Typography className="font-mono text-[9px] text-gray-500 mb-2 uppercase">
                  Operations
                </Typography>
                <Typography className="font-mono text-lg text-purple-400 font-bold">
                  {blocksCount}
                </Typography>
                <Typography className="font-mono text-[10px] text-gray-600 mt-1">
                  Steps
                </Typography>
              </div>
            </div>

            {/* Balance Changes */}
            <div className="bg-[#0f1629] border border-gray-800 p-4">
              <Typography className="font-mono text-[10px] text-gray-500 mb-4 uppercase">
                Balance Changes
              </Typography>
              <div className="space-y-2">
                {simulationResult?.estimated_profit_loss.map((pnl, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
                    <Typography className="font-mono text-sm text-gray-300">
                      {pnl.token}
                    </Typography>
                    <Typography className={`font-mono text-sm font-bold ${
                      parseFloat(pnl.amount) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {parseFloat(pnl.amount) > 0 ? '+' : ''}{pnl.amount}
                    </Typography>
                  </div>
                ))}
                {(!simulationResult?.estimated_profit_loss || simulationResult.estimated_profit_loss.length === 0) && (
                  <div className="text-center py-4">
                    <Typography className="font-mono text-xs text-gray-600 italic">
                      No balance changes detected
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Paper>
  );
}

