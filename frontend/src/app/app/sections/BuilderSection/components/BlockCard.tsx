"use client";

import { motion } from "framer-motion";
import { Typography, IconButton } from "@mui/material";
import { Trash2, ArrowDown } from "lucide-react";
import { Block, BlockTypeDef } from "./types";
import { AssetSelector } from "./AssetSelector";

interface BlockCardProps {
  block: Block;
  blockDef: BlockTypeDef;
  index: number;
  tokenMap: Record<string, string>;
  onRemove: (id: string) => void;
  onUpdateParam: (id: string, key: string, value: string) => void;
  isLast: boolean;
}

export function BlockCard({ 
  block, 
  blockDef, 
  index, 
  tokenMap, 
  onRemove, 
  onUpdateParam,
  isLast 
}: BlockCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full relative z-10"
    >
      {/* Connection Line (Industrial) */}
      {index > 0 && (
        <div className="h-6 w-px bg-gray-800 mx-auto" />
      )}

      {/* Block Body - Minimalist Industrial */}
      <div className={`
        relative bg-[#050505] border border-gray-800 
        hover:border-gray-600 transition-colors duration-200
        p-0 group
      `}>
        {/* Colored Accent Line (Top) */}
        <div className={`h-0.5 w-full ${blockDef.indicator}`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-900 pb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-8 flex items-center justify-center 
                bg-gray-900 border border-gray-800
                text-gray-400 group-hover:text-white transition-colors
              `}>
                <blockDef.icon size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Typography className="font-mono text-sm text-white font-bold tracking-wider uppercase">
                    {blockDef.label}
                  </Typography>
                  <span className="px-1.5 py-0.5 bg-gray-900 text-[9px] font-mono text-gray-500">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>
                <Typography className="font-mono text-[9px] text-gray-600 mt-0.5">
                  ID: {block.id.slice(0, 8).toUpperCase()}
                </Typography>
              </div>
            </div>
            <IconButton 
              size="small" 
              onClick={() => onRemove(block.id)}
              className="text-red-600 hover:text-red-400 hover:bg-red-500/10 rounded-none transition-colors"
            >
              <Trash2 size={14} />
            </IconButton>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            {block.type === "flash_borrow" && (
              <>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Asset</label>
                  <AssetSelector
                    value={block.params.asset}
                    onChange={(value) => onUpdateParam(block.id, "asset", value)}
                    tokenMap={tokenMap}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Amount</label>
                  <input
                    type="text"
                    value={block.params.amount}
                    onChange={(e) => onUpdateParam(block.id, "amount", e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0a0a0a] text-sm text-white font-mono px-3 py-2 border border-[#333] focus:border-gray-500 outline-none transition-colors placeholder-gray-800 text-right"
                  />
                </div>
              </>
            )}

            {block.type === "swap" && (
              <>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">From</label>
                  <AssetSelector
                    value={block.params.from}
                    onChange={(value) => onUpdateParam(block.id, "from", value)}
                    tokenMap={tokenMap}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">To</label>
                  <AssetSelector
                    value={block.params.to}
                    onChange={(value) => onUpdateParam(block.id, "to", value)}
                    tokenMap={tokenMap}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Amount</label>
                  <input
                    type="text"
                    value={block.params.amount}
                    onChange={(e) => onUpdateParam(block.id, "amount", e.target.value)}
                    placeholder="ALL or Amount"
                    className="w-full bg-[#0a0a0a] text-sm text-white font-mono px-3 py-2 border border-[#333] focus:border-gray-500 outline-none transition-colors placeholder-gray-800 text-right"
                  />
                </div>
              </>
            )}

            {block.type === "flash_repay" && (
              <div className="space-y-2 col-span-2">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Repay Asset</label>
                <AssetSelector
                  value={block.params.asset}
                  onChange={(value) => onUpdateParam(block.id, "asset", value)}
                  tokenMap={tokenMap}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Arrow (Bottom) */}
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-gray-800 z-0">
          <ArrowDown size={14} />
        </div>
      )}
    </motion.div>
  );
}

