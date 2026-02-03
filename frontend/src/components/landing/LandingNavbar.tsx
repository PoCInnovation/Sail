"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "DOCS", href: "#docs", icon: "menu_book" },
];

function GlitchText({ text, isHovered }: { text: string; isHovered: boolean }) {
  const [glitchText, setGlitchText] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setGlitchText(text);
      return;
    }

    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789";
    let iterations = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setGlitchText(
        text
          .split("")
          .map((_, index) => {
            if (index < iterations / 3) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterations++;
      if (iterations > maxIterations) {
        clearInterval(interval);
        setGlitchText(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span>{glitchText}</span>;
}

function NavLink({
  name,
  href,
  index,
}: {
  name: string;
  href: string;
  icon?: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
    >
      <Link
        href={href}
        className="group relative flex items-center gap-2 px-4 py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background glow on hover */}
        <motion.div
          className="absolute inset-0 bg-cyan/10 rounded-sm"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{ originX: 0 }}
        />

        {/* Decorative brackets */}
        <span
          className={`text-cyan/30 transition-all duration-300 ${isHovered ? "text-cyan -translate-x-1" : ""
            }`}
        >
          [
        </span>

        {/* Text with glitch effect */}
        <span
          className={`font-mono text-xs tracking-[0.2em] transition-all duration-300 ${isHovered ? "text-cyan text-glow" : "text-cyan/70"
            }`}
        >
          <GlitchText text={name} isHovered={isHovered} />
        </span>

        {/* Decorative brackets */}
        <span
          className={`text-cyan/30 transition-all duration-300 ${isHovered ? "text-cyan translate-x-1" : ""
            }`}
        >
          ]
        </span>

        {/* Underline scanner effect */}
        {isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent"
            initial={{ width: 0, x: 0 }}
            animate={{ width: "100%", x: [0, 10, 0] }}
            transition={{
              width: { duration: 0.3 },
              x: { duration: 1, repeat: Infinity },
            }}
          />
        )}
      </Link>
    </motion.div>
  );
}

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center border border-cyan/30 rounded-sm hover:border-cyan hover:bg-cyan/10 transition-all"
      >
        <div className="flex flex-col gap-1.5">
          <motion.span
            className="w-5 h-0.5 bg-cyan block"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0,
            }}
          />
          <motion.span
            className="w-5 h-0.5 bg-cyan block"
            animate={{ opacity: isOpen ? 0 : 1 }}
          />
          <motion.span
            className="w-5 h-0.5 bg-cyan block"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0,
            }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-midnight/95 backdrop-blur-xl border-b border-cyan/20 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border border-cyan/10 hover:border-cyan/50 hover:bg-cyan/5 transition-all"
                >
                  <span className="material-symbols-outlined text-cyan/70">
                    {link.icon}
                  </span>
                  <span className="font-mono text-sm text-cyan/70">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LaunchButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/app">
      <motion.button
        className="relative px-6 py-2.5 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-sm">
          <div className="absolute inset-0 border border-cyan/50 rounded-sm" />
          <motion.div
            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent"
            animate={{ x: isHovered ? ["-100%", "100%"] : "0%" }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent"
            animate={{ x: isHovered ? ["100%", "-100%"] : "0%" }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
        </div>

        {/* Background fill on hover */}
        <motion.div
          className="absolute inset-0 bg-cyan rounded-sm"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />

        {/* Content */}
        <div
          className={`relative flex items-center gap-2 font-mono text-xs tracking-wider transition-colors duration-300 ${isHovered ? "text-black" : "text-cyan"
            }`}
        >
          <span className="font-bold">LAUNCH_APP</span>
          <span className="text-[10px] opacity-70">{">>>"}</span>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan" />
      </motion.button>
    </Link>
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
          ? "bg-midnight/90 backdrop-blur-xl border-b border-cyan/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]"
          : "bg-transparent"
        }`}
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative h-10 w-10 border border-cyan/30 rounded-sm p-1 group-hover:border-cyan group-hover:shadow-neon-sm transition-all duration-300"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/logo-simple.png"
                alt="Sail Logo"
                fill
                className="object-contain p-1"
                priority
              />
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan/50 group-hover:border-cyan transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyan/50 group-hover:border-cyan transition-colors" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-cyan/50 group-hover:border-cyan transition-colors" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan/50 group-hover:border-cyan transition-colors" />
            </motion.div>

            <div className="flex flex-col">
              <motion.span
                className="font-bold text-xl tracking-[0.3em] text-white group-hover:text-cyan transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SAIL
              </motion.span>
              <span className="text-[8px] font-mono text-cyan/50 tracking-[0.2em]">
                PROTOCOL_v2.1
              </span>
            </div>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <NavLink key={link.name} {...link} index={index} />
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <LaunchButton />
            <HamburgerMenu />
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

      {/* Scanline effect on scroll */}
      {scrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full w-20 bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.nav>
  );
}
