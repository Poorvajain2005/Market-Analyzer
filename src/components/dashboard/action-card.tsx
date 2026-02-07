"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "orange";
  recommended?: boolean;
  contextHint?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20",
};

const glowClasses = {
  blue: "shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40",
  purple: "shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40",
  green: "shadow-lg shadow-green-500/20 hover:shadow-green-500/40",
  orange: "shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
};

export function ActionCard({
  title,
  description,
  icon: Icon,
  color,
  recommended = false,
  contextHint,
  onClick,
}: ActionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Card
        className={cn(
          "group cursor-pointer border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300",
          glowClasses[color],
        )}
      >
        <CardContent className="relative px-6 pb-6 pt-4 space-y-4">
          {/* Header with badges */}
          <div className="flex items-center justify-between gap-3">
            <div
              className={cn(
                "inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                colorClasses[color],
              )}
            >
              <Icon className="h-7 w-7" />
            </div>

            {/* Micro-labels */}
            <div className="flex items-center gap-2">
              {recommended && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-2 py-1 rounded-full bg-primary/20 text-xs text-primary font-medium"
                >
                  Recommended
                </motion.div>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Context Hint (appears on hover) */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2"
            >
              {contextHint || "Click to get started"}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
