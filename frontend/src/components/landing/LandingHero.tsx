"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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
        className={`group relative px-8 py-4 font-mono text-sm tracking-wider overflow-hidden ${isPrimary
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
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isPrimary ? "shadow-[0_0_30px_rgba(0,240,255,0.5)]" : "shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          }`} />
      </motion.button>
    </Link>
  );
}

// Cockpit HUD element - Top Left
function HUDTopLeft() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute top-6 left-6 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="relative">
        {/* Corner bracket */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan/60" />
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan" />

        <div className="pl-4 pt-2">
          <div className="font-mono text-xs text-cyan/40 tracking-widest">SYS.STATUS</div>
          <div className="font-mono text-sm text-cyan mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            ONLINE
          </div>
          <div className="font-mono text-xs text-cyan/60 mt-2">{time} UTC</div>

          {/* Decorative lines */}
          <svg className="mt-3 w-32 h-8" viewBox="0 0 128 32">
            <path d="M0 16 L20 16 L25 8 L35 24 L45 8 L55 24 L60 16 L128 16"
              stroke="rgba(0,240,255,0.3)" strokeWidth="1" fill="none" />
            <path d="M0 20 L40 20 L50 12 L60 20 L128 20"
              stroke="rgba(0,240,255,0.15)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// Cockpit HUD element - Top Right
function HUDTopRight() {
  return (
    <motion.div
      className="absolute top-6 right-6 z-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="relative">
        {/* Corner bracket */}
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan/60" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan" />

        <div className="pr-4 pt-2 text-right">
          <div className="font-mono text-xs text-cyan/40 tracking-widest">NETWORK</div>
          <div className="font-mono text-sm text-cyan mt-1">SUI MAINNET</div>
          <div className="font-mono text-xs text-cyan/60 mt-2">BLOCK: 127,849,201</div>

          {/* Signal bars */}
          <div className="flex justify-end gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1.5 bg-cyan/60"
                style={{ height: `${i * 4}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Cockpit HUD element - Bottom Left
function HUDBottomLeft() {
  return (
    <motion.div
      className="absolute bottom-6 left-6 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="relative">
        {/* Corner bracket */}
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan/60" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan" />

        <div className="pl-4 pb-2">
          {/* Artificial horizon indicator */}
          <div className="w-24 h-24 relative mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer circle */}
              <circle cx="50" cy="50" r="45" stroke="rgba(0,240,255,0.3)" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="rgba(0,240,255,0.15)" strokeWidth="1" fill="none" />

              {/* Tick marks */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={50 + 38 * Math.cos((angle * Math.PI) / 180)}
                  y1={50 + 38 * Math.sin((angle * Math.PI) / 180)}
                  x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
                  stroke="rgba(0,240,255,0.5)"
                  strokeWidth="2"
                />
              ))}

              {/* Center crosshair */}
              <line x1="35" y1="50" x2="45" y2="50" stroke="rgba(0,240,255,0.8)" strokeWidth="2" />
              <line x1="55" y1="50" x2="65" y2="50" stroke="rgba(0,240,255,0.8)" strokeWidth="2" />
              <line x1="50" y1="35" x2="50" y2="45" stroke="rgba(0,240,255,0.8)" strokeWidth="2" />
              <line x1="50" y1="55" x2="50" y2="65" stroke="rgba(0,240,255,0.8)" strokeWidth="2" />

              {/* Horizon line */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(0,240,255,0.2)" strokeWidth="1" strokeDasharray="4 2" />
            </svg>
          </div>

          <div className="font-mono text-xs text-cyan/40 tracking-widest">HEADING</div>
          <div className="font-mono text-lg text-cyan">270° W</div>
        </div>
      </div>
    </motion.div>
  );
}

// Cockpit HUD element - Bottom Right
function HUDBottomRight() {
  const [values] = useState({
    altitude: 35000,
    speed: 847,
    fuel: 78,
  });

  return (
    <motion.div
      className="absolute bottom-6 right-6 z-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="relative">
        {/* Corner bracket */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan/60" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan" />

        <div className="pr-4 pb-2 text-right">
          {/* Stats display */}
          <div className="space-y-2">
            <div>
              <div className="font-mono text-xs text-cyan/40 tracking-widest">TVL</div>
              <div className="font-mono text-lg text-cyan">${(values.altitude * 1000).toLocaleString()}</div>
            </div>

            <div>
              <div className="font-mono text-xs text-cyan/40 tracking-widest">24H VOLUME</div>
              <div className="font-mono text-lg text-cyan">${(values.speed * 10000).toLocaleString()}</div>
            </div>

            <div>
              <div className="font-mono text-xs text-cyan/40 tracking-widest">EFFICIENCY</div>
              <div className="flex items-center justify-end gap-2">
                <div className="w-20 h-2 bg-cyan/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${values.fuel}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
                <span className="font-mono text-sm text-cyan">{values.fuel}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Frame overlay for cockpit effect
function CockpitFrame() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Top edge line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      {/* Bottom edge line */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      {/* Left edge */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      {/* Right edge */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      {/* Corner vignettes */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-black/40 to-transparent" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-black/40 to-transparent" />

      {/* Scanline effect */}
      <div className="absolute inset-0 scanlines opacity-[0.03]" />
    </div>
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
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1
            className="font-bold text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="inline-block text-white/90">Build.</span>{" "}
            <span className="inline-block text-cyan text-glow">Connect.</span>{" "}
            <span className="inline-block text-white/90">Execute.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-cyan-100/60 font-light leading-relaxed"
          style={{ fontFamily: "var(--font-tech)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Build your own DeFi strategy with SAIL
        </motion.p>

        {/* Action button */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <HeroButton href="/app" variant="primary">
            USE SAIL
          </HeroButton>
        </motion.div>
      </motion.div>
    </header>
  );
}
