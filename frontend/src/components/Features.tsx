"use client";

import { motion } from "framer-motion";
import { PixelCard } from "./ui/PixelCard";

const features = [
  {
    title: "No-Code Builder",
    description: "Drag, drop, and connect nodes to create complex DeFi strategies. Visual programming for everyone.",
    icon: "🏗️",
    variant: "default" as const,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Atomic Safety",
    description: "Zero capital risk. Transactions either succeed completely or fail without cost.",
    icon: "🛡️",
    variant: "mint" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Monetization",
    description: "Mint your alpha as NFTs. Earn royalties when others use your strategy.",
    icon: "💎",
    variant: "purple" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Flash Loans",
    description: "Access millions in liquidity without collateral for arbitrage opportunities.",
    icon: "⚡",
    variant: "pink" as const,
    className: "md:col-span-2 md:row-span-1",
  },
];

export function Features() {
  return (
    <section className="relative py-20 px-6 bg-walrus-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-walrus-mint/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-walrus-purple/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-pixel text-3xl md:text-5xl font-bold text-white mb-4">
            POWERFUL <span className="text-walrus-mint">FEATURES</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to build, test, and monetize professional DeFi strategies on Sui.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={feature.className}
            >
              <PixelCard 
                variant={feature.variant} 
                className="h-full flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="font-pixel text-xl md:text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3L17 17L3 17" stroke="currentColor" strokeWidth="2" className="text-white/50"/>
                  </svg>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
