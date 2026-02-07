"use client";

import React, { useState } from "react";
import type { MarketAnalysisOutput } from "@/ai/flows/generate-market-analysis-report";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketRadarChart } from "./market-radar-chart";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface AnalysisReportProps {
  data: MarketAnalysisOutput;
  ideaText: string;
  onReset: () => void;
  compact?: boolean;
}

const getRiskLevelVariant = (riskLevel: string): "default" | "secondary" | "destructive" => {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "default";
    case "medium":
      return "secondary";
    case "high":
      return "destructive";
    default:
      return "secondary";
  }
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="font-headline text-xl font-semibold">{title}</h3>
    <div className="text-muted-foreground">{children}</div>
  </div>
);

export function AnalysisReport({ data, ideaText, onReset, compact = false }: AnalysisReportProps) {
  const [showFullIdea, setShowFullIdea] = useState(false);
  const redactIdea = (text: string) => {
    if (!text) return "";
    // only show a short preview by default to avoid exposing the full user-submitted content
    const MAX_PREVIEW = 120;
    if (showFullIdea) return text;
    return text.length > MAX_PREVIEW
      ? `${text.slice(0, MAX_PREVIEW)}... (redacted)`
      : "(redacted)";
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Growth Score</p>
            <p className="text-2xl font-bold text-primary">{data.growthScore}/100</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verdict</p>
            <p className="font-semibold">{data.verdict}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Risk</p>
            <Badge variant={getRiskLevelVariant(data.riskLevel)}>{data.riskLevel}</Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1">Summary</h4>
            <p className="text-sm text-muted-foreground">{data.summary}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Key Insights</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.keyInsights.slice(0, 3).map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Next Action</h4>
            <p className="text-sm font-medium text-foreground">{data.nextAction}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={onReset} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Analyze Another Idea
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Analysis Report
          </CardTitle>
          <CardDescription className="italic">
            "{redactIdea(ideaText)}"
            {/* allow explicit reveal so the full user content isn't visible by default */}
            {ideaText && !showFullIdea && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullIdea(true)}
                className="ml-3"
              >
                Show full idea
              </Button>
            )}
            {showFullIdea && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullIdea(false)}
                className="ml-3"
              >
                Hide
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Verdict
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-headline text-primary">
                  {data.verdict}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Growth Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-headline text-primary">
                  {data.growthScore}/100
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={getRiskLevelVariant(data.riskLevel)}
                  className="text-lg"
                >
                  {data.riskLevel}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-6">
            <Section title="One-Line Summary">
              <p className="text-lg leading-relaxed break-words">
                {data.summary}
              </p>
            </Section>

            <Section title="Key Insights">
              <ul className="list-disc list-inside space-y-2">
                {data.keyInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </Section>

            <Section title="Detailed AI Explanation">
              <p className="whitespace-pre-wrap">{data.explanation}</p>
            </Section>

            <Section title="Profit Strategy">
              <p className="whitespace-pre-wrap">{data.profitStrategy}</p>
            </Section>

            <Section title="Competitor Landscape">
              <p className="whitespace-pre-wrap">{data.competitors}</p>
            </Section>

            <Section title="Next Recommended Action">
              <p className="font-semibold text-foreground">{data.nextAction}</p>
            </Section>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-xl font-semibold mb-4 text-center">
              Market Opportunity Snapshot
            </h3>
            <div className="h-[400px]">
              <MarketRadarChart data={data.visualData} />
            </div>
          </div>
        </CardContent>
      </Card>

      {data.footnote && (
        <p className="text-xs text-muted-foreground">{data.footnote}</p>
      )}
    </div>
  );
}
