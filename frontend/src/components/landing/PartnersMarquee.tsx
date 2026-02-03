"use client";

import { motion } from "framer-motion";

const partners = [
  "SUI",
  "CETUS",
  "TURBOS",
  "NAVI",
  "SCALLOP",
];

export function PartnersMarquee() {
  // Duplicate array multiple times for seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="py-6 bg-midnight border-y border-cyan/20 overflow-hidden relative z-20">
      <div className="absolute inset-0 bg-cyan/5" />
      <motion.div
        className="inline-flex animate-marquee space-x-20 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {duplicatedPartners.map((partner, index) => (
          <span
            key={`${partner}-${index}`}
            className="text-3xl font-bold text-cyan/40 whitespace-nowrap"
            style={{ fontFamily: "var(--font-tech)" }}
          >
            {partner}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
