"use client";

import { motion } from "framer-motion";
import { Play, AlertTriangle, CheckCircle, Info, Activity, Fuel, Wallet } from "lucide-react";
import { SimulationResult } from "./types";

interface SimulationResultsProps {
  simulationResult: SimulationResult | null;
  error: string | null;
  blocksCount: number;
}

export function SimulationResults({ simulationResult, error, blocksCount }: SimulationResultsProps) {
  return (
    <div className="h-full bg-black border-2 border-gray-800 p-6 flex flex-col relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-gray-600" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-gray-600" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-gray-600" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-600" />

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30">
            <Activity size={16} className="text-cyan-400" />
          </div>
          <h2 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-widest">
            ▸ SIMULATION RESULTS
          </h2>
        </div>
        <p className="font-mono text-[10px] text-gray-600 pl-9">
          Real-time execution feedback
        </p>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar pr-2">
        {!simulationResult && !error ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <div className="w-16 h-16 border-2 border-dashed border-gray-800 flex items-center justify-center mb-4">
              <Play size={24} className="text-gray-700" />
            </div>
            <p className="font-mono text-xs text-gray-500 text-center max-w-[200px] uppercase tracking-wider">
              Awaiting Execution
            </p>
            <p className="font-mono text-[10px] text-gray-700 text-center mt-2">
              Press "Execute Simulation" to run
            </p>
          </div>
        ) : error ? (
          // Error State
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-950/10 border border-red-500/30 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 mt-0.5" />
              <div>
                <h3 className="font-mono text-xs text-red-400 font-bold uppercase mb-2">
                  Execution Failed
                </h3>
                <p className="font-mono text-[11px] text-red-300/80 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // Success State
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Success Banner */}
            <div className="bg-emerald-950/10 border border-emerald-500/30 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-400" />
                <div>
                  <h3 className="font-mono text-xs text-emerald-400 font-bold uppercase">
                    Simulation Successful
                  </h3>
                  <p className="font-mono text-[10px] text-emerald-500/60 mt-0.5">
                    Completed successfully
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Gas Card */}
              <div className="bg-[#0a0a0a] border border-gray-800 p-3 relative group">
                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-50 transition-opacity">
                  <Fuel size={12} className="text-blue-400" />
                </div>
                <p className="font-mono text-[9px] text-gray-500 mb-1 uppercase tracking-wider">
                  Est. Gas
                </p>
                <div className="font-mono text-sm text-blue-400 font-bold">
                  {simulationResult?.estimated_gas ? (simulationResult.estimated_gas / 1_000_000_000).toFixed(6) : '0'}
                </div>
                <p className="font-mono text-[9px] text-gray-600">SUI</p>
              </div>

              {/* Operations Card */}
              <div className="bg-[#0a0a0a] border border-gray-800 p-3 relative group">
                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-50 transition-opacity">
                  <Activity size={12} className="text-purple-400" />
                </div>
                <p className="font-mono text-[9px] text-gray-500 mb-1 uppercase tracking-wider">
                  Ops
                </p>
                <div className="font-mono text-sm text-purple-400 font-bold">
                  {blocksCount}
                </div>
                <p className="font-mono text-[9px] text-gray-600">STEPS</p>
              </div>
            </div>

            {/* Balance Changes */}
            <div className="bg-[#0a0a0a] border border-gray-800 p-4 relative">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
                <Wallet size={14} className="text-gray-500" />
                <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  Balance Changes
                </h3>
              </div>
              
              <div className="space-y-2">
                {simulationResult?.estimated_profit_loss.map((pnl, i) => {
                  // Convert MIST to token amount
                  const amountInMist = parseFloat(pnl.amount);
                  const amountInToken = amountInMist / 1_000_000_000;
                  const tokenSymbol = pnl.coin_type?.split('::').pop() || pnl.token || 'Unknown';
                  const isPositive = amountInToken >= 0;
                  
                  return (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="font-mono text-xs text-gray-400">
                        {tokenSymbol}
                      </span>
                      <span className={`font-mono text-xs font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : ''}{amountInToken.toFixed(6)}
                      </span>
                    </div>
                  );
                })}
                
                {(!simulationResult?.estimated_profit_loss || simulationResult.estimated_profit_loss.length === 0) && (
                  <div className="text-center py-2">
                    <p className="font-mono text-[10px] text-gray-700 italic">
                      No balance changes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
