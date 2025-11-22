"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Block, BLOCK_TYPES } from "./types";
import { BlockCard } from "./BlockCard";
import { EmptyCanvas } from "./EmptyCanvas";

interface CanvasProps {
  blocks: Block[];
  tokenMap: Record<string, string>;
  onRemoveBlock: (id: string) => void;
  onUpdateBlockParam: (id: string, key: string, value: string) => void;
}

export function Canvas({ blocks, tokenMap, onRemoveBlock, onUpdateBlockParam }: CanvasProps) {
  return (
    <div className="flex-1 bg-[#050810] border-2 border-dashed border-gray-800/50 rounded-2xl p-8 overflow-y-auto relative custom-scrollbar">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1a2236 1px, transparent 1px), linear-gradient(90deg, #1a2236 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {blocks.length === 0 ? (
        <EmptyCanvas />
      ) : (
        <div className="flex flex-col items-center gap-0 relative pb-20 max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {blocks.map((block, index) => {
              const blockDef = BLOCK_TYPES.find(t => t.type === block.type)!;
              return (
                <BlockCard
                  key={block.id}
                  block={block}
                  blockDef={blockDef}
                  index={index}
                  tokenMap={tokenMap}
                  onRemove={onRemoveBlock}
                  onUpdateParam={onUpdateBlockParam}
                  isLast={index === blocks.length - 1}
                />
              );
            })}
          </AnimatePresence>

          {/* End Node */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-2 opacity-50"
          >
            <div className="h-8 w-0.5 bg-gray-800" />
            <div className="px-3 py-1 rounded-full border border-gray-700 bg-[#0a0f1e] text-[10px] font-pixel text-gray-500">
              END SEQUENCE
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

