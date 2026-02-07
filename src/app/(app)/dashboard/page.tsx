"use client";

import { useState } from "react";
import { IdeaInputForm } from "@/components/dashboard/idea-input-form";
import { AnalysisReport } from "@/components/dashboard/analysis-report";
import { ActionCard } from "@/components/dashboard/action-card";
import { IntelligenceStatusBar } from "@/components/dashboard/intelligence-status-bar";
import { AmbientBackground } from "@/components/dashboard/ambient-background";
import { AgentPresence } from "@/components/dashboard/agent-presence";
import type { MarketAnalysisOutput } from "@/ai/flows/generate-market-analysis-report";
import { Target, Lightbulb, BarChart3, Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  analysisData?: MarketAnalysisOutput;
  timestamp: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewAnalysis = (
    ideaText: string,
    analysisData: MarketAnalysisOutput,
  ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: ideaText,
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "Analysis complete",
      analysisData,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    setLoading(false);
  };

  // When the page loads, check for an intent query and seed the chat accordingly
  useEffect(() => {
    if (messages.length > 0) return; // don't overwrite existing conversation
    const intent = searchParams?.get("intent");
    const prefill = searchParams?.get("prefill");
    if (!intent) return;

    const now = Date.now();
    const userPromptMap: Record<string, string> = {
      run_simulation:
        prefill ||
        "I want to run a market simulation. Start by asking me for parameters.",
      generate_strategy:
        prefill ||
        "Generate an actionable growth strategy for my product idea.",
      analyze_data:
        prefill || "Analyze this market dataset and summarize key trends.",
      create_agent:
        prefill ||
        "Help me create an AI agent to monitor market signals and run experiments.",
    };

    const assistantReplyMap: Record<string, string> = {
      run_simulation:
        "Sure — what market, timeframe, and parameters should I use for the simulation?",
      generate_strategy:
        "Got it — please provide the product details, target audience, and constraints.",
      analyze_data:
        "Please upload the dataset or point me to the data source, and tell me which KPIs to focus on.",
      create_agent:
        "What tasks should the agent perform and what data sources should it use?",
    };

    const userMsg: ChatMessage = {
      id: now.toString(),
      type: "user",
      content: userPromptMap[intent] || prefill || "Hello",
      timestamp: new Date(),
    };

    const assistantMsg: ChatMessage = {
      id: (now + 1).toString(),
      type: "assistant",
      content: assistantReplyMap[intent] || "How can I help?",
      timestamp: new Date(),
    };

    setMessages([userMsg, assistantMsg]);
    // Clean up the URL so refresh doesn't re-seed
    try {
      router.replace("/dashboard");
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  if (messages.length > 0) {
    return (
      <div className="flex h-full flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-8">
            <div className="mx-auto max-w-4xl space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "user" ? (
                    <Card className="max-w-[80%] bg-primary text-primary-foreground">
                      <CardContent className="p-4">
                        <p>{message.content}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="w-full space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            MarketMind Analysis
                          </p>
                          {message.analysisData && (
                            <AnalysisReport
                              data={message.analysisData}
                              ideaText={
                                messages.find(
                                  (m) =>
                                    m.id ===
                                    (parseInt(message.id) - 1).toString(),
                                )?.content || ""
                              }
                              onReset={handleReset}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Sticky Bottom Input */}
        <footer className="border-t bg-background p-4">
          <div className="mx-auto max-w-4xl">
            <IdeaInputForm
              onAnalysis={handleNewAnalysis}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
            />
          </div>
        </footer>

        <AgentPresence />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col relative">
      {/* Ambient Background */}
      <AmbientBackground />

      {/* Intelligence Status Bar */}
      <IntelligenceStatusBar agentCount={4} marketCondition="stable" />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-3xl space-y-12 text-center">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-headline text-5xl font-bold tracking-tight">
              Welcome to MarketMind
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simulate markets, predict outcomes, and generate growth strategies
              using autonomous AI agents.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              title="Run Market Simulation"
              description="Simulate market scenarios"
              icon={Target}
              color="blue"
              recommended
              onClick={() => router.push(`/dashboard?intent=run_simulation`)}
              contextHint="Recommended based on market volatility"
            />
            <ActionCard
              title="Generate Strategy"
              description="AI-powered growth plans"
              icon={Lightbulb}
              color="purple"
              contextHint="Get actionable growth tactics"
              onClick={() => router.push(`/dashboard?intent=generate_strategy`)}
            />
            <ActionCard
              title="Analyze Market Data"
              description="Deep insights & trends"
              icon={BarChart3}
              color="green"
              contextHint="Dive into competitive intelligence"
              onClick={() => router.push(`/dashboard?intent=analyze_data`)}
            />
            <ActionCard
              title="Create AI Agent"
              description="Build custom agents"
              icon={Bot}
              color="orange"
              contextHint="Deploy autonomous market intelligence"
              onClick={() => router.push(`/dashboard?intent=create_agent`)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Input Bar */}
      <footer className="sticky bottom-0 w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-t border-border/40 relative z-20">
        <div className="mx-auto max-w-6xl">
          <IdeaInputForm
            onAnalysis={handleNewAnalysis}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
          />
        </div>
      </footer>

      {/* Agent Presence Floating */}
      <AgentPresence />
    </div>
  );
}
