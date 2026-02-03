"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function FloatingElement({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.5, duration: 1 }}
    />
  );
}

function HeroButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <Link href={href}>
      <motion.button
        className={`group relative px-8 py-4 font-mono text-sm tracking-wider overflow-hidden ${
          isPrimary
            ? "bg-cyan text-black font-bold"
            : "bg-transparent text-cyan border border-cyan/50"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background for secondary */}
        {!isPrimary && (
          <motion.div
            className="absolute inset-0 bg-cyan/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Glowing border effect for primary */}
        {isPrimary && (
          <div className="absolute inset-0 bg-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-3">
          {children}
        </span>

        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isPrimary ? "border-black/30" : "border-cyan"}`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isPrimary ? "border-black/30" : "border-cyan"}`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isPrimary ? "border-black/30" : "border-cyan"}`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isPrimary ? "border-black/30" : "border-cyan"}`} />

        {/* Hover glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPrimary ? "shadow-[0_0_30px_rgba(0,240,255,0.5)]" : "shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        }`} />
      </motion.button>
    </Link>
  );
}

export function LandingHero() {
  return (
    <header className="relative h-screen overflow-hidden flex flex-col justify-center items-center text-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-sea-gradient z-0" />

      {/* SUI Logo Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="relative w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]">
          <Image
            src="/SUI.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Animated holographic sea grid */}
      <div className="absolute bottom-0 w-full h-[120%] holographic-sea animate-undulate opacity-30 z-0" />

      {/* Floating decorative elements */}
      
      <div className="absolute top-20 right-20 w-32 h-32 border border-cyan/20 rounded-full animate-spin-slow opacity-20" />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto pt-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Main headline */}
        <motion.h1
          className="font-bold text-6xl md:text-8xl lg:text-9xl mb-8 leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan/50 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          STEER YOUR <br />
          <span className="text-white text-glow">DEFI DESTINY</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-xl text-cyan-100/70 font-light leading-relaxed tracking-wide"
          style={{ fontFamily: "var(--font-tech)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Construct advanced on-chain strategies with the Node Navigator.{" "}
          <br />
          The deep sea of liquidity awaits your command.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="mt-16 flex flex-wrap gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <HeroButton href="/app" variant="primary">
            LAUNCH THE APP
          </HeroButton>
          <HeroButton href="#docs" variant="secondary">
            DOCS
          </HeroButton>
        </motion.div>
      </motion.div>
    </header>
  );
}
