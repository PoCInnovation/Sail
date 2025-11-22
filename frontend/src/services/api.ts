const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  getTokens: async () => {
    const res = await fetch(`${API_BASE_URL}/api/tokens`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  validateStrategy: async (strategy: any) => {
    const res = await fetch(`${API_BASE_URL}/api/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Validation failed: ${res.status} - ${text}`);
    }
    return res.json();
  },

  simulateStrategy: async (strategy: any, sender: string) => {
    const res = await fetch(`${API_BASE_URL}/api/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy, sender }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Simulation failed: ${res.status} - ${text}`);
    }
    return res.json();
  }
};
