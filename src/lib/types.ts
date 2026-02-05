
import type { MarketAnalysisOutput } from "@/ai/flows/generate-market-analysis-report";
import type { Timestamp } from "firebase/firestore";

export interface AnalysisRecord extends MarketAnalysisOutput {
  userId: string;
  ideaText: string;
  createdAt: Timestamp;
}
