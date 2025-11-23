"use client";

import { useSuiClientContext } from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { useEffect, useRef } from "react";

export function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    if (!isEnokiNetwork(network)) {
      console.log("Enoki: Current network is not supported", network);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_ENOKI_API_KEY;
    if (!apiKey || apiKey.startsWith("YOUR_")) {
      console.error("Enoki: Invalid API Key configuration. Please check your .env.local file.");
      return;
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId.startsWith("YOUR_")) {
      console.error("Enoki: Invalid Google Client ID. Please check your .env.local file.");
      return;
    }

    console.log("Enoki: Registering wallets for network", network);
    
    try {
      const { unregister } = registerEnokiWallets({
        apiKey,
        providers: {
          google: {
            clientId: googleClientId,
            redirectUrl: typeof window !== "undefined" ? `${window.location.origin}/app` : undefined,
          },
          ...(process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID && !process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID.startsWith("YOUR_") ? {
            facebook: {
              clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
            },
          } : {}),
          ...(process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID && !process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID.startsWith("YOUR_") ? {
            twitch: {
              clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
            },
          } : {}),
        },
        client,
        network,
      });

      console.log("Enoki: Wallets registered successfully");
      return unregister;
    } catch (error) {
      console.error("Enoki: Failed to register wallets", error);
    }
  }, [client, network]);

  return null;
}
