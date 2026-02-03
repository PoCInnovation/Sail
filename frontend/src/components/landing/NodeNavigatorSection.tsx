"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant: "cyan" | "indigo" | "pink";
}

function FeatureCard({ icon, title, description, variant }: FeatureCardProps) {
  const colorClasses = {
    cyan: {
      border: "border-cyan/30 hover:border-cyan/60",
      bg: "bg-cyan/10",
      iconBg: "bg-cyan/20",
      text: "text-cyan",
      glow: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
    },
    indigo: {
      border: "border-indigo-500/30 hover:border-indigo-500/60",
      bg: "bg-indigo-500/10",
      iconBg: "bg-indigo-500/20",
      text: "text-indigo-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    },
    pink: {
      border: "border-pink-500/30 hover:border-pink-500/60",
      bg: "bg-pink-500/10",
      iconBg: "bg-pink-500/20",
      text: "text-pink-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    },
  };

  const colors = colorClasses[variant];

  return (
    <motion.div
      className={`glass-panel p-5 rounded-xl flex items-center gap-4 group border ${colors.border} ${colors.glow} transition-all duration-300 cursor-pointer`}
      whileHover={{ x: 5 }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`p-4 rounded-xl ${colors.iconBg} ${colors.text} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <h3
          className="font-bold text-white text-lg mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "var(--font-tech)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// SVG Icons
const HubIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);


function NodeVisualization() {
  return (
    <div className="relative h-[400px] w-full glass-panel rounded-2xl border border-cyan/30 overflow-hidden">
      {/* Header bar - IDE style */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/30 border-b border-white/10 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-white/40 text-xs font-mono">my_strategy.flow</span>
        </div>
        <div className="flex items-center gap-2 text-cyan/50">
          <svg className="w-4 h-4 cursor-pointer hover:text-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <svg className="w-4 h-4 cursor-pointer hover:text-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 pt-10">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="nodeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,240,255,0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nodeGrid)" />
        </svg>
      </div>

      {/* SVG Connection lines - Simple horizontal flow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glowLine">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection: Input to Swap */}
        <motion.line
          x1="160"
          y1="200"
          x2="290"
          y2="200"
          stroke="url(#lineGradient1)"
          strokeWidth="3"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Connection: Swap to Output */}
        <motion.line
          x1="410"
          y1="200"
          x2="540"
          y2="200"
          stroke="url(#lineGradient2)"
          strokeWidth="3"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Animated particle along the path */}
        <circle r="6" fill="#00f0ff" filter="url(#glowLine)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M 160 200 L 290 200 L 410 200 L 540 200" />
        </circle>
      </svg>

      {/* Nodes Container - Centered horizontally */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-8" style={{ paddingTop: '40px' }}>
        <div className="flex items-center justify-between w-full max-w-2xl">

          {/* Node 1: Input (Wallet) */}
          <motion.div
            className="p-4 glass-panel rounded-xl border-2 border-cyan/50 w-36 hover:scale-105 transition-transform cursor-pointer hover:border-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-cyan font-mono">INPUT</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">100 SUI</div>
          </motion.div>

          {/* Node 2: Process (Swap) */}
          <motion.div
            className="p-4 glass-panel rounded-xl border-2 border-indigo-500/50 w-36 hover:scale-105 transition-transform cursor-pointer hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-indigo-400 font-mono">SWAP</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">SUI → USDC</div>
          </motion.div>

          {/* Node 3: Output (Yield) */}
          <motion.div
            className="p-4 glass-panel rounded-xl border-2 border-emerald-500/50 w-36 hover:scale-105 transition-transform cursor-pointer hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-bold text-emerald-400 font-mono">OUTPUT</span>
            </div>
            <div className="text-xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-display)" }}>+12.4%</div>
          </motion.div>

        </div>
      </div>

      {/* Footer stats */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/30 border-t border-white/10 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-mono">3 Nodes Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] text-gray-400 font-mono">Auto-sync</span>
          </div>
        </div>
        <button className="px-3 py-1 bg-cyan/10 border border-cyan/30 rounded text-cyan text-[10px] font-mono hover:bg-cyan/20 transition-colors">
          DEPLOY →
        </button>
      </div>
    </div>
  );
}

{/* Grid background */ }
<div className="absolute inset-0 pt-10">
  <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="nodeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,240,255,0.4)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#nodeGrid)" />
  </svg>
</div>

{/* SVG Connection lines */ }
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15, top: 40 }}>
        <defs>
          <linearGradient id="lineGradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGradientIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glowLine">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection: Wallet to Swap */}
        <motion.path
          d="M 180 80 Q 260 100 300 150"
          fill="none"
          stroke="url(#lineGradientCyan)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Connection: Wallet to Stake */}
        <motion.path
          d="M 180 80 Q 200 180 300 240"
          fill="none"
          stroke="url(#lineGradientCyan)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        {/* Connection: Swap to Center */}
        <motion.path
          d="M 380 150 Q 420 180 450 200"
          fill="none"
          stroke="url(#lineGradientCyan)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Connection: Stake to Center */}
        <motion.path
          d="M 380 240 Q 420 220 450 200"
          fill="none"
          stroke="url(#lineGradientCyan)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* Connection: Center to Yield */}
        <motion.path
          d="M 530 200 Q 580 160 620 120"
          fill="none"
          stroke="url(#lineGradientIndigo)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />

        {/* Connection: Center to Pool */}
        <motion.path
          d="M 530 200 Q 580 250 620 290"
          fill="none"
          stroke="url(#lineGradientIndigo)"
          strokeWidth="2"
          filter="url(#glowLine)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />

        {/* Animated particles */}
        <circle r="4" fill="#00f0ff" filter="url(#glowLine)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 180 80 Q 260 100 300 150 Q 420 180 530 200 Q 580 160 620 120" />
        </circle>
        <circle r="3" fill="#6366f1" filter="url(#glowLine)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M 180 80 Q 200 180 300 240 Q 420 220 530 200 Q 580 250 620 290" />
        </circle>
      </svg>

      <div className="relative z-20 w-full h-full pt-10 p-6">
        {/* Node: Wallet (Input) */}
        <motion.div
          className="absolute top-16 left-6 p-3 glass-panel rounded-xl border-l-4 border-cyan w-40 hover:scale-105 transition-transform cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-mono text-cyan block">WALLET</span>
              <span className="text-[10px] text-gray-500">0x8f3...a2c</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>Balance</span>
            <span className="text-cyan font-mono">1,250 SUI</span>
          </div>
        </motion.div>

        {/* Node: Swap */}
        <motion.div
          className="absolute top-24 left-[38%] p-3 glass-panel rounded-xl border-l-4 border-indigo-500 w-32 hover:scale-105 transition-transform cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-mono text-indigo-400 block">SWAP</span>
              <span className="text-[10px] text-gray-500">SUI → USDC</span>
            </div>
          </div>
        </motion.div>

        {/* Node: Stake */}
        <motion.div
          className="absolute bottom-28 left-[38%] p-3 glass-panel rounded-xl border-l-4 border-indigo-500 w-32 hover:scale-105 transition-transform cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-mono text-indigo-400 block">STAKE</span>
              <span className="text-[10px] text-gray-500">APY: 8.2%</span>
            </div>
          </div>
        </motion.div>

        {/* Central Node: Process */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 glass-panel rounded-full border-2 border-cyan/50 flex items-center justify-center shadow-orb"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-10 h-10 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Node: Yield Output */}
        <motion.div
          className="absolute top-20 right-6 p-3 glass-panel rounded-xl border-l-4 border-emerald-500 w-36 hover:scale-105 transition-transform cursor-pointer"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs font-mono text-emerald-400">YIELD</span>
          </div>
          <div className="text-xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-display)" }}>
            +12.4%
          </div>
          <span className="text-[10px] text-gray-500">Est. Annual</span>
        </motion.div>

        {/* Node: LP Pool */}
        <motion.div
          className="absolute bottom-20 right-6 p-3 glass-panel rounded-xl border-l-4 border-pink-500 w-36 hover:scale-105 transition-transform cursor-pointer"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs font-mono text-pink-400">LP POOL</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-cyan/30 border border-cyan/50" />
            <div className="w-4 h-4 rounded-full bg-indigo-500/30 border border-indigo-500/50 -ml-2" />
            <span className="text-[10px] text-gray-400 ml-1">SUI/USDC</span>
          </div>
        </motion.div>
      </div>

{/* Footer stats */ }
<div className="absolute bottom-0 left-0 right-0 h-10 bg-black/30 border-t border-white/10 flex items-center justify-between px-4 z-30">
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-[10px] text-gray-400 font-mono">6 Nodes Active</span>
    </div>
    <div className="flex items-center gap-1.5">
      <svg className="w-3 h-3 text-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span className="text-[10px] text-gray-400 font-mono">Auto-sync</span>
    </div>
  </div>
  <button className="px-3 py-1 bg-cyan/10 border border-cyan/30 rounded text-cyan text-[10px] font-mono hover:bg-cyan/20 transition-colors">
    DEPLOY →
  </button>
</div>
    </div >
  );
}

function BackgroundNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <line
            x1="400"
            y1="300"
            x2="200"
            y2="150"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="600"
            y2="150"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="200"
            y2="450"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="600"
            y2="450"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="300"
            r="10"
            fill="#00f0ff"
            className="animate-pulse"
          />
          <circle cx="200" cy="150" r="5" fill="#4f46e5" />
          <circle cx="600" cy="150" r="5" fill="#4f46e5" />
          <circle cx="200" cy="450" r="5" fill="#4f46e5" />
          <circle cx="600" cy="450" r="5" fill="#4f46e5" />
        </svg>
      </div>
    </div>
  );
}

export function NodeNavigatorSection() {
  const features: FeatureCardProps[] = [
    {
      icon: <HubIcon />,
      title: "Visual Logic",
      description: "No code required. Connect the dots.",
      variant: "cyan",
    },
    {
      icon: <SecurityIcon />,
      title: "Verified Modules",
      description: "Audited nodes for secure execution.",
      variant: "indigo",
    },
    {
      icon: <BoltIcon />,
      title: "Flash Execution",
      description: "Milliseconds latency on Sui.",
      variant: "pink",
    },
  ];

  return (
    <section
      id="builder"
      className="py-32 bg-midnight relative overflow-hidden flex justify-center"
    >
      <BackgroundNetwork />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-bold text-5xl md:text-6xl text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              NODE <span className="text-cyan text-glow">NAVIGATOR</span>
            </h2>
            <p
              className="text-cyan-100/60 text-lg mb-10"
              style={{ fontFamily: "var(--font-tech)" }}
            >
              Compose your strategy through an interactive web of crystalline
              connections. Drag, drop, and link logic nodes to execute complex
              financial maneuvers in the deep sea of DeFi.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </motion.div>

          {/* Right visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <NodeVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
