"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  isTyping: boolean;
  suggestions?: string[];
}

export function TypingIndicator({ isTyping, suggestions }: TypingIndicatorProps) {
  return (
    <div className="space-y-2">
      {/* Listening Status */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span>MarketMind is listening</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="w-1 h-3 bg-primary/60 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Inline Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/80 hover:bg-primary/20 transition"
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
