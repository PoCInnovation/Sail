"use client";

import { PixelCard } from "./PixelCard";
import Link from "next/link";

export function LandingFooter() {
    return (
        <div className="mt-8 border-t-2 border-walrus-mint/20 py-6 text-center">
            <p className="font-pixel text-[10px] text-walrus-mint/60 uppercase tracking-widest">
                © 2024 SAIL AUTOMATION
            </p>
        </div>
    );
}

export function ActionButtons() {
    return (
        <div className="flex gap-4 justify-center md:justify-center mt-4">
            <Link href="/app/dashboard">
                <button className="px-8 py-4 bg-[#0a0f1f] border-4 border-orange-500 text-orange-500 font-pixel text-sm hover:bg-orange-500 hover:text-black transition-none uppercase tracking-widest">
                    LAUNCH APP
                </button>
            </Link>
            <Link href="https://docs.sail.io">
                <button className="px-8 py-4 bg-[#0a0f1f] border-4 border-walrus-mint text-white font-pixel text-sm hover:bg-walrus-mint hover:text-black transition-none uppercase tracking-widest">
                    READ DOCS
                </button>
            </Link>
        </div>
    )
}
