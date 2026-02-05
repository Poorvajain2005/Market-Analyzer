"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SignalIndicatorProps {
  confidence: "low" | "medium" | "high";
  trend?: "up" | "down" | "neutral";
  label?: string;
}

export function SignalIndicator({
  confidence,
  trend = "neutral",
  label,
}: SignalIndicatorProps) {
  const confidenceConfig = {
    low: { color: "bg-red-500", opacity: 0.5 },
    medium: { color: "bg-yellow-500", opacity: 0.7 },
    high: { color: "bg-green-500", opacity: 0.9 },
  };

  const config = confidenceConfig[confidence];

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Confidence Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: i < Object.keys(confidenceConfig).indexOf(confidence) + 1 ? config.opacity : 0.2,
            }}
            transition={{ duration: 0.3 }}
            className={`w-2 h-2 rounded-full ${config.color}`}
          />
        ))}
      </div>

      {/* Trend Arrow */}
      {trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
      {trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}

      {/* Label */}
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </motion.div>
  );
}
