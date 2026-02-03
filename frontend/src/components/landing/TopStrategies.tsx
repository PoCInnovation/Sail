"use client";

import { PixelCard } from "./PixelCard";

const strategies = [
    { rank: 1, name: "SUI-YIELD-ALPHA", score: "98,765 PTS" },
    { rank: 2, name: "AUTO-COMPOUNDER", score: "89,432 PTS" },
    { rank: 3, name: "STABLE-FARM", score: "76,543 PTS" },
];

export function TopStrategies() {
    return (
        <PixelCard variant="accent" title="Top Strategies" className="h-full">
            <div className="space-y-4">
                {strategies.map((strategy) => (
                    <div key={strategy.rank} className="flex items-center gap-3 group cursor-pointer">
                        <div className={`
              flex items-center justify-center w-8 h-8 border-2 font-pixel text-sm
              ${strategy.rank === 1 ? "border-yellow-400 text-yellow-400 bg-yellow-400/10" :
                                strategy.rank === 2 ? "border-gray-300 text-gray-300 bg-gray-300/10" :
                                    "border-orange-700 text-orange-700 bg-orange-700/10"}
            `}>
                            {strategy.rank}
                        </div>

                        <div className="flex-1">
                            <div className="font-pixel text-xs text-white group-hover:text-walrus-mint transition-colors">
                                {strategy.name}
                            </div>
                            <div className="font-pixel text-[10px] text-green-400">
                                {strategy.score}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PixelCard>
    );
}
