"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  status: "active" | "reasoning" | "idle";
  role: string;
}

interface AgentPresenceProps {
  agents?: Agent[];
}

const defaultAgents: Agent[] = [
  { id: "1", name: "Macro", status: "active", role: "Market Analysis" },
  { id: "2", name: "Sector", status: "idle", role: "Sector Intelligence" },
  { id: "3", name: "Risk", status: "reasoning", role: "Risk Assessment" },
];

export function AgentPresence({ agents = defaultAgents }: AgentPresenceProps) {
  const [expanded, setExpanded] = useState(false);

  const activeAgents = agents.filter((a) => a.status !== "idle");

  return (
    <motion.div
      className="fixed bottom-32 right-6 z-30"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Expanded View */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-4 space-y-2 bg-card/60 backdrop-blur border border-border/40 rounded-2xl p-3"
        >
          {activeAgents.map((agent) => (
            <motion.div
              key={agent.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/40 text-sm"
            >
              <motion.div
                animate={{
                  scale: agent.status === "reasoning" ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: agent.status === "reasoning" ? Infinity : 0,
                }}
                className={`w-2 h-2 rounded-full ${
                  agent.status === "active"
                    ? "bg-green-500"
                    : agent.status === "reasoning"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              />
              <div>
                <p className="font-medium text-xs">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Badge */}
      <motion.div
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {activeAgents.length}
      </motion.div>
    </motion.div>
  );
}
