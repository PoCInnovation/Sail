"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const updates = [
  {
    id: "LOG_001",
    date: "2024-05-20",
    time: "14:30:00",
    type: "SYSTEM",
    message: "Sail Protocol v1.0 initialized on Sui Testnet",
    status: "SUCCESS"
  },
  {
    id: "LOG_002",
    date: "2024-05-21",
    time: "09:15:22",
    type: "UPDATE",
    message: "New integration added: Cetus AMM Support",
    status: "ACTIVE"
  },
  {
    id: "LOG_003",
    date: "2024-05-22",
    time: "11:45:10",
    type: "ALERT",
    message: "Hackathon submission deadline approaching",
    status: "WARNING"
  },
  {
    id: "LOG_004",
    date: "2024-05-23",
    time: "16:20:05",
    type: "FEATURE",
    message: "Flash Loan module optimization complete",
    status: "DONE"
  }
];

export function News() {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-black font-mono text-green-500 overflow-hidden border-t border-green-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-green-700">{">"}</span>
          <h2 className="text-2xl font-bold tracking-wider">SYSTEM_LOGS</h2>
          <span className={`inline-block w-3 h-5 bg-green-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        <div className="bg-black border border-green-900/50 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative">
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <div className="space-y-4 relative z-0">
            {updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 border-b border-green-900/30 pb-4 last:border-0 last:pb-0 hover:bg-green-900/10 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3 text-xs text-green-700 shrink-0">
                  <span>[{update.date} {update.time}]</span>
                  <span className="text-green-600 font-bold">#{update.id}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      update.type === 'SYSTEM' ? 'bg-green-900 text-green-300' :
                      update.type === 'ALERT' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900/50 text-green-400'
                    }`}>
                      {update.type}
                    </span>
                    <span className="text-sm md:text-base">{update.message}</span>
                  </div>
                </div>

                <div className="text-xs font-bold shrink-0">
                  [{update.status}]
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
