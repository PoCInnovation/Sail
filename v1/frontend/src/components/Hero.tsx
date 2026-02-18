"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BuilderMockup } from "./ui/BuilderMockup";
import { Particles } from "./ui/Particles";
import { PixelStars } from "./ui/PixelStars";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Hero() {
  // Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Typing Effect Logic
  const text = "WITHOUT CODE";
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); // Reset on mount
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#020514]">
      <Particles />
      <PixelStars />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-walrus-mint/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-walrus-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-walrus-mint"></span>
              </span>
              <span className="text-[10px] font-mono text-gray-300 tracking-widest">V1.0 LIVE ON SUI</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.9]">
                <span className="block font-pixel text-walrus-mint tracking-widest mb-2">BUILD</span>
                <span className="block">DEFI STRATEGIES</span>
                <span className="block text-gray-500 min-h-[1em] font-pixel tracking-wider text-3xl md:text-5xl mt-2">
                  {displayedText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-3 h-8 md:w-4 md:h-10 bg-walrus-mint ml-1 align-middle"
                  />
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              The first visual strategy builder on Sui. Drag, drop, and deploy institutional-grade farming strategies in seconds.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/app">
                <button className="group relative px-8 py-4 bg-white text-black font-pixel font-bold text-sm tracking-wider hover:bg-walrus-mint transition-colors duration-200">
                  <span className="relative z-10 flex items-center gap-2">
                    LAUNCH APP
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </Link>
              
              <button className="px-8 py-4 border-4 border-white/20 text-white font-pixel font-bold text-sm tracking-wider hover:bg-white/10 hover:border-walrus-mint transition-all duration-200">
                READ DOCS
              </button>
            </div>
          </motion.div>

          {/* Right Column: Builder Mockup with Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative perspective-1000"
          >
            {/* Decorative Elements around Mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-walrus-mint/20 to-walrus-purple/20 rounded-xl blur-lg opacity-50" />
            
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl transform-gpu">
              {/* Mockup Header */}
              <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <div className="ml-4 text-[10px] text-gray-500 font-mono">strategy_builder.exe</div>
              </div>
              
              {/* The Actual Mockup Component */}
              <div className="p-4 md:p-8 bg-white/5">
                <BuilderMockup />
              </div>
            </div>

            {/* Floating Stats/Tags - Parallax Effect */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ translateZ: 50 }}
              className="absolute -bottom-6 -right-6 bg-black border border-walrus-mint/30 p-4 shadow-xl"
            >
              <div className="text-[10px] text-gray-500 font-mono mb-1">APY PREDICTION</div>
              <div className="text-2xl font-pixel text-walrus-mint">24.5%</div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
