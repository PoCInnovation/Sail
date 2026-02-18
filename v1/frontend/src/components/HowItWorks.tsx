"use client";

import { motion } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "DESIGN STRATEGY",
    description: "Drag and drop DeFi primitives to create your custom workflow.",
    specs: ["Node-based Editor", "Real-time Validation", "Template Library"],
  },
  {
    id: "02",
    title: "SIMULATE EXECUTION",
    description: "Test your strategy against mainnet forks with zero risk.",
    specs: ["Gas Estimation", "Profit Projection", "Security Audit"],
  },
  {
    id: "03",
    title: "DEPLOY & EARN",
    description: "Publish your strategy to the marketplace or run it privately.",
    specs: ["One-click Deploy", "NFT Minting", "Royalty Management"],
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-[#0f172a] overflow-hidden border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-block border border-cyan-500/30 bg-cyan-950/30 px-4 py-1 mb-4">
            <span className="font-mono text-cyan-400 text-xs tracking-[0.2em]">SYSTEM_ARCHITECTURE // V.1.0</span>
          </div>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white tracking-tight">
            HOW IT <span className="text-cyan-400">WORKS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-[2px] bg-cyan-900/50 -z-10">
                  <div className="absolute inset-0 bg-cyan-500/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
                </div>
              )}

              {/* Card */}
              <div className="h-full bg-[#0f172a] border border-cyan-800/50 p-6 relative hover:border-cyan-400/50 transition-colors duration-300">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />

                {/* Step Number */}
                <div className="absolute -top-4 left-6 bg-[#0f172a] px-2 border border-cyan-800/50 text-cyan-500 font-mono text-sm">
                  STEP_{step.id}
                </div>

                <div className="mt-4 mb-4">
                  <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-mono mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="border-t border-cyan-900/30 pt-4">
                  <ul className="space-y-2">
                    {step.specs.map((spec, i) => (
                      <li key={i} className="flex items-center text-xs text-cyan-300/70 font-mono">
                        <span className="w-1 h-1 bg-cyan-500/50 mr-2" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
