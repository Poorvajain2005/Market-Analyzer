"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Soft moving gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(33,38,61,0.05), rgba(24,26,42,0.08), rgba(38,42,66,0.05))",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* Faint radial glow behind main content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(60,66,104,0.08),rgba(12,14,24,0))]" />
    </div>
  );
}
