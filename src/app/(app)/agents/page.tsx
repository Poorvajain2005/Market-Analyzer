"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Agent = { id: string; name: string; role: "Macro" | "Sector" | "Risk" | "Competitor"; status: "Active" | "Paused"; reasoning?: string; signals?: string[] };

const agents: Agent[] = [
  { id: "a1", name: "Macro Alpha", role: "Macro", status: "Active", reasoning: "Tracking interest rates and inflation prints.", signals: ["CPI", "Fed Dot Plot", "PMI"] },
  { id: "a2", name: "Sector Beta", role: "Sector", status: "Paused", reasoning: "Monitoring AI tooling adoption.", signals: ["GitHub Stars", "Venture news", "Hiring trends"] },
  { id: "a3", name: "Risk Gamma", role: "Risk", status: "Active", reasoning: "Assessing regulatory vectors and liquidity.", signals: ["Reg filings", "Liquidity indices"] },
];

export default function AgentsPage() {
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="w-full border-b border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Agents</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map(a => (
            <Card key={a.id} className="border-border/40 bg-card/50 hover:shadow-md transition cursor-pointer" onClick={() => setSelected(a)}>
              <CardHeader>
                <CardTitle className="text-lg">{a.name}</CardTitle>
                <div className="text-xs text-muted-foreground">{a.role} • {a.status}</div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          {selected ? (
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Agent Detail: {selected.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div><span className="text-foreground">Current reasoning:</span> {selected.reasoning}</div>
                <div><span className="text-foreground">Signals monitored:</span> {selected.signals?.join(", ")}</div>
                <div className="rounded-xl border border-border/40 bg-background/60 p-3">
                  Agent debate / consensus visualization (placeholder)
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-xs text-muted-foreground">Select an agent to view reasoning and signals.</div>
          )}
        </div>
      </main>
    </div>
  );
}
