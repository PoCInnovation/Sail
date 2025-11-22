"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navLinks = [
    { name: "HOW IT WORKS", href: "#how-it-works" },
    { name: "DOCS", href: "#docs" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "flex w-full items-center justify-between px-6 md:px-8 py-4",
        "bg-gradient-to-b from-walrus-bg via-walrus-bg to-transparent backdrop-blur-xl border-b border-walrus-mint/20"
      )}
    >
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative h-12 w-12">
          <Image
            src="/logo-simple.png"
            alt="Sail Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="font-pixel text-xl md:text-2xl tracking-widest text-white group-hover:text-walrus-mint transition-all duration-300">
          SAIL
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="font-pixel text-xs tracking-widest text-gray-300 hover:text-walrus-mint transition-all duration-300 relative group"
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-walrus-mint to-walrus-purple group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app">
          <button className="px-6 py-3 bg-white text-black font-pixel font-bold text-xs tracking-wider hover:bg-walrus-mint transition-colors duration-200">
            LAUNCH APP
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}
