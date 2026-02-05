"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "r1", title: "AI Fitness Market Snapshot", source: "Simulation", date: "2026-01-12" },
  { id: "r2", title: "B2B Pricing Strategy Brief", source: "Strategy", date: "2026-01-14" },
];

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="w-full border-b border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="space-y-4">
          {reports.map(r => (
            <Card key={r.id} className="border-border/40 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <div className="text-xs text-muted-foreground">{r.source} • {r.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">View</Button>
                  <Button variant="outline">Download PDF</Button>
                  <Button variant="outline">Export PPT</Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Investor-ready output with clean layout and structured sections.
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">No reports yet? Generate one from Simulations or Strategies.</div>
      </main>
    </div>
  );
}
