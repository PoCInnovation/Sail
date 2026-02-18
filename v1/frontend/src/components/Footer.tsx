"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-12 relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/logo-simple.png"
              alt="Sail Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-pixel text-xl font-bold text-white tracking-widest leading-none">SAIL</span>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">DEFI STRATEGY BUILDER</span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {['twitter', 'discord', 'github'].map((social) => (
            <a 
              key={social}
              href="#" 
              className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-walrus-mint hover:border-walrus-mint hover:bg-walrus-mint/10 transition-all rounded-sm"
            >
              <span className="sr-only">{social}</span>
              <div className="w-4 h-4 bg-current" />
            </a>
          ))}
        </div>

        {/* Copyright & Legal */}
        <div className="flex flex-col md:items-end gap-1 text-xs text-gray-500 font-mono">
          <p>© {currentYear} SAIL PROTOCOL</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
