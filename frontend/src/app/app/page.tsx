"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { motion } from "framer-motion";

export default function AppPage() {
  const currentAccount = useCurrentAccount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-wider">
          BLOCK BUILDER
        </h1>
        <p className="text-gray-400 text-lg font-mono">
          Connected: {currentAccount?.address.slice(0, 6)}...{currentAccount?.address.slice(-4)}
        </p>
        <div className="pt-8">
          <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-8 max-w-2xl mx-auto">
            <p className="text-white font-pixel text-sm">
              BLOCK BUILDER COMING SOON
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
