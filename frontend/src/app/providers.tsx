"use client";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getJsonRpcFullnodeUrl as getFullnodeUrl } from "@mysten/sui/jsonRpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";
import { WalletPersistenceManager } from "@/components/WalletPersistenceManager";
import { WalletLoadingGate } from "@/components/WalletLoadingGate";
import { RegisterEnokiWallets } from "@/components/RegisterEnokiWallets";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet"), network: "localnet" },
  devnet: { url: getFullnodeUrl("devnet"), network: "devnet" },
  testnet: { url: getFullnodeUrl("testnet"), network: "testnet" },
  mainnet: { url: getFullnodeUrl("mainnet"), network: "mainnet" },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider>
          <WalletPersistenceManager>
            {children}
          </WalletPersistenceManager>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
