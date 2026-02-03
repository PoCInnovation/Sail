"use client";

import { PixelCard } from "./PixelCard";
import { motion } from "framer-motion";
import Image from "next/image";

export function SpaceshipHero() {
    return (
        <PixelCard variant="primary" className="h-full relative overflow-hidden bg-[#0a0f1f] border-0 p-0! flex flex-col gap-4">
            {/* Title Section - Separated like in the image */}
            <div className="border-b-4 border-walrus-mint pb-4 md:pb-6">
                <h1 className="font-pixel text-3xl md:text-5xl leading-tight text-white mb-2 tracking-tighter">
                    BUILD DEFI STRATEGIES
                </h1>
                <h1 className="font-pixel text-3xl md:text-5xl leading-tight text-white tracking-widest relative">
                    <span className="relative z-10 glitch-text" data-text="WITHOUT CODE">WITHOUT CODE</span>
                    <span className="absolute left-0 top-0 text-walrus-mint opacity-50 -translate-x-1">WITHOUT CODE</span>
                    <span className="absolute left-0 top-0 text-red-500 opacity-50 translate-x-1">WITHOUT CODE</span>
                </h1>
            </div>

            {/* Spaceship Visual Placeholder - Large Image Box */}
            <div className="flex-1 min-h-[300px] border-4 border-walrus-mint relative bg-black overflow-hidden group">

                {/* Static Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:30px_30px]" />

                {/* Tunnel Circles - Simple CSS Borders */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border-2 border-walrus-mint/40"
                            style={{
                                width: `${i * 100 + 50}px`,
                                height: `${i * 100 + 50}px`,
                            }}
                        />
                    ))}
                </div>

                {/* Spaceship Sprite Placeholder */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 relative">
                        {/* Body */}
                        <div className="w-full h-1/2 bg-white top-1/4 absolute rounded-none" />
                        {/* Wings */}
                        <div className="w-1/2 h-full bg-walrus-mint left-1/4 absolute top-0 skew-x-12 opacity-80" />
                        {/* Text Label */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-2 border border-walrus-mint text-walrus-mint font-pixel text-[10px]">
                            SPACESHIP_SPRITE
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .glitch-text {
          position: relative;
        }
      `}</style>
        </PixelCard>
    );
}
