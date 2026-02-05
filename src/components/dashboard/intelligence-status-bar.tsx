"use client";

import { motion } from "framer-motion";

interface IntelligenceStatusBarProps {
  agentCount?: number;
  marketCondition?: "stable" | "volatile" | "high_risk";
}

const conditionConfig = {
  stable: { label: "Stable", color: "bg-green-500/20 text-green-400" },
  volatile: { label: "Volatile", color: "bg-yellow-500/20 text-yellow-400" },
  high_risk: { label: "High Risk", color: "bg-red-500/20 text-red-400" },
};

export function IntelligenceStatusBar({
  agentCount = 4,
  marketCondition = "stable",
}: IntelligenceStatusBarProps) {
  const condition = conditionConfig[marketCondition];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-40 flex items-center gap-3 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur border border-border/40 shadow-lg shadow-primary/5"
    >
      {/* Pulse Indicator */}
      <div className="relative flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-2 h-2 rounded-full bg-green-400 blur-sm"
        />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-muted-foreground">
          {agentCount} Agents Active
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-border/40" />

      {/* Market Condition Badge */}
      <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${condition.color}`}>
        {condition.label}
      </div>
    </motion.div>
  );
}
