import { Repeat, ArrowDownLeft, ArrowUpRight, Zap } from "lucide-react";

export type BlockType = "swap" | "deposit" | "withdraw" | "flashloan";

export interface Block {
  id: string;
  type: BlockType;
  params: Record<string, string>;
}

export interface SimulationResult {
  success: boolean;
  estimated_gas: number;
  estimated_profit_loss: Array<{ token: string; amount: string }>;
  errors: Array<{ message: string }>;
}

export interface BlockTypeDef {
  type: BlockType;
  label: string;
  indicator: string;
  icon: any;
}

export const BLOCK_TYPES: BlockTypeDef[] = [
  { type: "swap", label: "SWAP", indicator: "bg-blue-600", icon: Repeat },
  { type: "deposit", label: "DEPOSIT", indicator: "bg-emerald-600", icon: ArrowDownLeft },
  { type: "withdraw", label: "WITHDRAW", indicator: "bg-rose-600", icon: ArrowUpRight },
  { type: "flashloan", label: "FLASH LOAN", indicator: "bg-amber-600", icon: Zap },
];

