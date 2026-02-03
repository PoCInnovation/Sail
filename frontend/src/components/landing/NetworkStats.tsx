"use client";

import { PixelCard } from "./PixelCard";
import { motion } from "framer-motion";

export function NetworkStats() {
    return (
        <PixelCard variant="primary" title="Network Stats" className="h-full">
            <div className="space-y-6">
                <div>
                    <p className="font-pixel text-[10px] text-gray-400 mb-1">TOTAL VALUE LOCKED</p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-pixel text-green-400"
                    >
                        1,234,567 SUI
                    </motion.div>
                </div>

                <div>
                    <p className="font-pixel text-[10px] text-gray-400 mb-1">ACTIVE STRATEGIES</p>
                    <div className="text-xl md:text-2xl font-pixel text-walrus-mint">
                        512
                    </div>
                </div>

                <div>
                    <p className="font-pixel text-[10px] text-gray-400 mb-1">TOTAL USERS</p>
                    <div className="text-xl md:text-2xl font-pixel text-walrus-mint">
                        128
                    </div>
                </div>
            </div>
        </PixelCard>
    );
}
