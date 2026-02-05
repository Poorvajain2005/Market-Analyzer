"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Strategy = { id: string; title: string; type: "Growth" | "Defensive" | "Expansion"; risk: "Low" | "Medium" | "High"; roi: string; details?: string };

const mock: Strategy[] = [
  { id: "s1", title: "Land-and-expand B2B", type: "Growth", risk: "Medium", roi: "18–24%/yr", details: "Assumptions, steps, and risks…" },
  { id: "s2", title: "Vertical niche wedge", type: "Expansion", risk: "Low", roi: "22–30%/yr", details: "Assumptions, steps, and risks…" },
  { id: "s3", title: "Defensive pricing moat", type: "Defensive", risk: "Medium", roi: "12–16%/yr", details: "Assumptions, steps, and risks…" },
];

export default function StrategiesPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="w-full border-b border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Strategies</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mock.map(s => (
            <Card key={s.id} className="border-border/40 bg-card/50 hover:shadow-md transition" onClick={() => setOpenId(openId === s.id ? null : s.id)}>
              <CardHeader>
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <div className="text-xs text-muted-foreground">{s.type} • Risk {s.risk} • ROI {s.roi}</div>
              </CardHeader>
              {openId === s.id && (
                <CardContent className="text-sm text-muted-foreground">
                  {s.details}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button>Generate New Strategy</Button>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">Select a card to view assumptions, steps, and risks.</div>
      </main>
    </div>
  );
}
