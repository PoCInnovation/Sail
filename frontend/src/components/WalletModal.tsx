"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import { motion, AnimatePresence } from "framer-motion";

interface WalletModalProps {
  isOpen: boolean;
}

export function WalletModal({ isOpen }: WalletModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0f1e] z-50"
            style={{
              backgroundImage: `
                linear-gradient(rgba(78, 222, 174, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(78, 222, 174, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-w-2xl w-full">
              {/* Step Label */}
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-walrus-mint/30" />
                <span className="font-pixel text-sm text-walrus-mint tracking-widest">
                  WALLET_CONNECTION
                </span>
                <div className="h-px flex-1 bg-walrus-mint/30" />
              </div>

              {/* Main Container */}
              <div className="relative border-2 border-walrus-mint/40 bg-[#0a0f1e]/95 backdrop-blur-xl p-8 md:p-12">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-walrus-mint" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-walrus-mint" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-walrus-mint" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-walrus-mint" />

                {/* Content */}
                <div className="space-y-8">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="relative w-24 h-24"
                    >
                      <div className="absolute inset-0 border-2 border-walrus-mint/40 flex items-center justify-center">
                        <div className="w-3 h-3 bg-walrus-mint rounded-full" />
                      </div>
                      <div className="absolute inset-2 border border-walrus-mint/20" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-4xl font-pixel text-white tracking-wider">
                      CONNECT WALLET
                    </h2>
                    <p className="text-walrus-mint/80 font-mono text-sm">
                      Authentication required to access the application
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-walrus-mint/20" />
                    <div className="w-2 h-2 bg-walrus-mint/40" />
                    <div className="h-px flex-1 bg-walrus-mint/20" />
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {[
                      'Secure SUI wallet integration',
                      'Non-custodial authentication',
                      'Protected application access'
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-gray-400 font-mono text-sm"
                      >
                        <div className="w-2 h-2 bg-walrus-mint" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Connect Button */}
                  <div className="pt-4">
                    <div className="font-pixel text-base flex justify-center">
                      <ConnectButton />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="text-center pt-4 border-t border-walrus-mint/20">
                    <p className="text-xs text-gray-500 font-mono">
                      SYSTEM_STATUS: AWAITING_WALLET_CONNECTION
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
