"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  index: number;
}

function StatCard({ label, value, index }: StatCardProps) {
  return (
    <motion.div
      className="glass-panel p-8 rounded-xl hover:border-cyan/50 transition-all group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="text-cyan font-mono text-sm mb-2 opacity-70 uppercase tracking-widest"
      >
        {label}
      </div>
      <div
        className="text-4xl font-bold text-white mb-1 group-hover:text-glow transition-all"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="w-full h-[1px] bg-gradient-to-r from-cyan/50 to-transparent mt-4" />
    </motion.div>
  );
}

export function StatsSection() {
  const stats = [
    { label: "Total Volume", value: "$142M+" },
    { label: "Strategies Deployed", value: "8,204" },
    { label: "Avg APY", value: "18.5%" },
    { label: "Integrations", value: "25+" },
  ];

  return (
    <section id="data" className="py-20 relative flex justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight to-deep opacity-90" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
