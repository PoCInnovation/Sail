import { useState, useEffect } from "react";

export function useTokens() {
  const [tokenMap, setTokenMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://localhost:3000/api/tokens")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Tokens received from backend:", data);
        // S'assurer que SUI est toujours présent
        const tokens = data || {};
        if (!tokens.SUI && !tokens.sui) {
          tokens.SUI = "0x2::sui::SUI";
        }
        setTokenMap(tokens);
      })
      .catch(err => {
        console.error("Failed to fetch tokens from backend:", err);
        // Fallback: ensure SUI is always available
        setTokenMap({ SUI: "0x2::sui::SUI" });
      });
  }, []);

  return tokenMap;
}

