"use client";

import { SpaceshipHero } from "./SpaceshipHero";
import { NetworkStats } from "./NetworkStats";
import { TopStrategies } from "./TopStrategies";
import { ActionButtons, LandingFooter } from "./LandingShared";
import { Navbar } from "../Navbar"; // Reuse existing Navbar but might need tweaks
import { PixelStars } from "../ui/PixelStars";

export function LandingPage() {
    return (
        <main className="min-h-screen bg-[#020514] text-white selection:bg-walrus-mint selection:text-black font-sans relative overflow-x-hidden">
            <PixelStars />

            {/* Navbar Overlay */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 flex flex-col min-h-screen max-w-6xl">

                {/* Main "Console" Frame */}
                <div className="border-4 border-walrus-mint bg-black/80 p-6 md:p-8 relative">

                    {/* Grid Layout inside the console */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column (Hero content) - Spans 2 cols */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <SpaceshipHero />
                            <ActionButtons />
                        </div>

                        {/* Right Column (Stats) - Spans 1 col */}
                        <div className="flex flex-col gap-6">
                            <NetworkStats />
                            <TopStrategies />
                        </div>

                    </div>
                </div>

                <LandingFooter />
            </div>
        </main>
    );
}
