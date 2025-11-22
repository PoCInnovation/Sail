"use client";

import { motion } from "framer-motion";
import { BLOCK_TYPES, BlockType } from "./types";

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="flex gap-3 p-2 overflow-x-auto pb-4">
      {BLOCK_TYPES.map((block) => (
        <motion.button
          key={block.type}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddBlock(block.type)}
          className={`
            flex items-center gap-3 px-4 py-3 
            bg-[#0a0a0a] border border-gray-800 
            hover:border-gray-500 
            transition-all group min-w-[140px]
            relative overflow-hidden
          `}
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${block.indicator}`} />
          
          <div className="p-1.5 bg-gray-900 border border-gray-800 group-hover:border-gray-600 transition-colors">
            <block.icon size={16} className="text-gray-400 group-hover:text-white" />
          </div>
          <div className="text-left">
            <span className="block font-mono text-[9px] text-gray-600 uppercase tracking-wider group-hover:text-gray-400">
              ADD MODULE
            </span>
            <span className="block font-bold font-mono text-xs text-white tracking-widest uppercase">
              {block.label}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

