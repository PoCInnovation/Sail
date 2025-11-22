"use client";

import { motion } from "framer-motion";

export function HistorySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-wider">
          HISTORY
        </h1>
        <div className="pt-8">
          <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-8">
            <p className="text-white font-pixel text-sm">
              HISTORY COMING SOON
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
