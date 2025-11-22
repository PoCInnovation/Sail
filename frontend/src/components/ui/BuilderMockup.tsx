"use client";

import { motion } from "framer-motion";
import { Coins, Target, Star } from "lucide-react";

export function BuilderMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[300px]">
      {/* Connecting Lines - Pixelated Style */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Deposit to Interact - Green Line */}
        <motion.line
          x1="28"
          y1="50"
          x2="41"
          y2="50"
          fill="none"
          stroke="#4ade80"
          strokeWidth="3"
          opacity="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Interact to Farm - Purple/Pink Line */}
        <motion.line
          x1="59"
          y1="50"
          x2="72"
          y2="50"
          fill="none"
          stroke="#d946ef"
          strokeWidth="3"
          opacity="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.7, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>

      {/* Nodes - Pixelated 3-Step Flow */}
      <div className="relative w-full h-full flex items-center justify-center gap-4 md:gap-8 lg:gap-16 px-4">
        {/* Node 1: Deposit */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-blue-600/20 border-4 border-blue-500 flex flex-col items-center justify-center gap-0.5 md:gap-1 relative shadow-lg"
            style={{ 
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1)"
            }}
          >
            {/* Pixel Corner Dots */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-400" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-400" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-400" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-400" />
            
            <motion.div
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-blue-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coins className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <div className="text-[9px] md:text-[10px] text-blue-200 font-pixel font-bold tracking-wider">DEPOSIT</div>
            <div className="text-[10px] md:text-xs font-bold text-white font-pixel">1000 SUI</div>
          </motion.div>
        </motion.div>

        {/* Node 2: Interact */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-walrus-purple/20 border-4 border-walrus-purple flex flex-col items-center justify-center gap-0.5 md:gap-1 relative shadow-lg"
            style={{ 
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)"
            }}
          >
            {/* Pixel Corner Dots */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-walrus-purple" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-walrus-purple" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-walrus-purple" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-walrus-purple" />
            
            <motion.div
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-walrus-purple flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <div className="text-[9px] md:text-[10px] text-purple-200 font-pixel font-bold tracking-wider">INTERACT</div>
            <div className="text-[10px] md:text-xs font-bold text-white font-pixel">5 DAPPS</div>
          </motion.div>
        </motion.div>

        {/* Node 3: Farm Points */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-walrus-mint/20 border-4 border-walrus-mint flex flex-col items-center justify-center gap-0.5 md:gap-1 relative shadow-lg"
            style={{ 
              boxShadow: "0 0 20px rgba(78, 222, 174, 0.3), inset 0 0 20px rgba(78, 222, 174, 0.1)"
            }}
          >
            {/* Pixel Corner Dots */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-walrus-mint" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-walrus-mint" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-walrus-mint" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-walrus-mint" />
            
            <motion.div
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-walrus-mint flex items-center justify-center"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white fill-white" />
            </motion.div>
            <div className="text-[9px] md:text-[10px] text-walrus-mint/80 font-pixel font-bold tracking-wider">FARM</div>
            <div className="text-[10px] md:text-xs font-bold text-walrus-mint font-pixel">+10000 PTS</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
