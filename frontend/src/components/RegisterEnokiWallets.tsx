"use client";

import { useSuiClientContext } from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useEffect } from "react";

export function RegisterEnokiWallets() {
  // We force Testnet for Enoki as per requirement, even if app is on Mainnet
  const enokiNetwork = "testnet";
  
  // Create a dedicated client for Enoki on Testnet
  const enokiClient = new SuiClient({ url: getFullnodeUrl(enokiNetwork) });

  useEffect(() => {
    // We skip the isEnokiNetwork check since we are forcing a supported network (testnet)
    
    const apiKey = process.env.NEXT_PUBLIC_ENOKI_API_KEY;
    if (!apiKey || apiKey.startsWith("YOUR_")) {
      console.error("Enoki: Invalid API Key configuration. Please check your .env.local file.");
    }

    console.log("Enoki: Registering wallets for network", enokiNetwork);

    const { unregister } = registerEnokiWallets({
      apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY || "YOUR_PUBLIC_ENOKI_API_KEY",
      providers: {
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        },
        facebook: {
          clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "YOUR_FACEBOOK_CLIENT_ID",
        },
        twitch: {
          clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "YOUR_TWITCH_CLIENT_ID",
        },
      },
      client: enokiClient,
      network: enokiNetwork,
    });

    return unregister;
  }, []);

  return null;
}
