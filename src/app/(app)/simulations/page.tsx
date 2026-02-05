"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function SimulationsPage() {
  const [sector, setSector] = useState<string>("macro");
  const [horizon, setHorizon] = useState<string>("12m");
  const [risk, setRisk] = useState<string>("medium");

  return (
    <div className="flex h-full flex-col">
      <header className="w-full border-b border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Simulations</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Scenario Builder */}
          <Card className="lg:col-span-1 border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Scenario Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Market / Sector</label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macro">Macro (Global)</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="fin">Fintech</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="us">US</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Time Horizon</label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 months</SelectItem>
                    <SelectItem value="6m">6 months</SelectItem>
                    <SelectItem value="12m">12 months</SelectItem>
                    <SelectItem value="24m">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Risk Level</label>
                <Select value={risk} onValueChange={setRisk}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-2">Run Simulation</Button>
            </CardContent>
          </Card>

          {/* Right: Results */}
          <Card className="lg:col-span-2 border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/40 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Line Chart (Probability ranges)</p>
                </div>
                <div className="rounded-xl border border-border/40 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Key Insights</p>
                </div>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">Scenario summary and assumptions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty-state copy */}
        <div className="mt-6 text-xs text-muted-foreground">
          Build a scenario and click “Run Simulation” to see outcomes and probability ranges.
        </div>
      </main>
    </div>
  );
}
