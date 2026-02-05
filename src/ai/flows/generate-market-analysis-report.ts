'use server';

/**
 * @fileOverview Generates a market analysis report based on a product idea.
 *
 * - generateMarketAnalysisReport - A function that generates the market analysis report.
 * - MarketAnalysisInput - The input type for the generateMarketAnalysisReport function.
 * - MarketAnalysisOutput - The return type for the generateMarketAnalysisReport function.
 */

import {ai, isGoogleAIEnabled} from '@/ai/genkit';
import {z} from 'genkit';

const MarketAnalysisInputSchema = z.object({
  ideaText: z.string().describe('The product idea to analyze (1-2 lines).'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
  verdict: z.string().describe('Overall verdict of the product idea.'),
  growthScore: z.number().describe('Growth score (0-100) of the product idea.'),
  growthScoreBreakdown: z.object({
    marketSize: z.object({
      score: z.number().min(0).max(20).describe('Market Size score (0-20)'),
      explanation: z.string().describe('Short explanation for Market Size score')
    }),
    competitionPressure: z.object({
      score: z.number().min(0).max(20).describe('Competition Pressure score (0-20)'),
      explanation: z.string().describe('Short explanation for Competition Pressure score')
    }),
    technicalFeasibility: z.object({
      score: z.number().min(0).max(20).describe('Technical Feasibility score (0-20)'),
      explanation: z.string().describe('Short explanation for Technical Feasibility score')
    }),
    differentiation: z.object({
      score: z.number().min(0).max(20).describe('Differentiation/Uniqueness score (0-20)'),
      explanation: z.string().describe('Short explanation for Differentiation score')
    }),
    monetizationPotential: z.object({
      score: z.number().min(0).max(20).describe('Monetization Potential score (0-20)'),
      explanation: z.string().describe('Short explanation for Monetization Potential score')
    })
  }).describe('Breakdown of the 5 Growth Score components'),
  riskLevel: z.string().describe('Risk level of the product idea.'),
  summary: z.string().describe('One-line summary of the product idea.'),
  keyInsights: z.array(z.string()).describe('Key insights about the product idea.'),
  explanation: z.string().describe('Detailed AI explanation of the market analysis.'),
  profitStrategy: z.string().describe('Profit strategy for the product idea.'),
  competitors: z.string().describe('Competitor landscape for the product idea.'),
  nextAction: z.string().describe('Next recommended action for the product idea.'),
  visualData: z
    .array(
      z.object({
        name: z.string(),
        value: z.number(),
      })
    )
    .describe(
      'Visual data for the radar chart (Market Demand, Competitive Pressure, Differentiation Potential, Profitability Potential, Execution Complexity).'
    ),
  footnote: z.string().optional().describe('Optional post-report note (e.g., heuristic analysis notice).'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

export async function generateMarketAnalysisReport(
  input: MarketAnalysisInput
): Promise<MarketAnalysisOutput> {
  return generateMarketAnalysisReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: {schema: MarketAnalysisInputSchema},
  output: {schema: MarketAnalysisOutputSchema},
  prompt: `You are MarketMind, an AI market analyst. You MUST follow the exact Growth Score format.

CRITICAL RULES:
1. NEVER generate random numbers or guess scores
2. If information is missing to score any component, ASK the user for clarification
3. ALWAYS show the calculation breakdown in this exact format:

Growth Score: X/100
Breakdown:
- Market Size: X/20 (specific reason based on provided info)
- Competition Pressure: X/20 (specific reason based on provided info)
- Technical Feasibility: X/20 (specific reason based on provided info)
- Differentiation: X/20 (specific reason based on provided info)
- Monetization Potential: X/20 (specific reason based on provided info)

4. Only calculate Growth Score when ALL 5 components can be evaluated from the provided information
5. Do NOT output verdict, risk level, or final score without the breakdown calculation

SCORING GUIDELINES (use ONLY information provided):

Market Size (0-20):
- 16-20: Clear mass market indicators (millions of users, global reach)
- 11-15: Medium market with defined segments
- 6-10: Small but viable market
- 0-5: Very niche or unclear market

Competition Pressure (0-20):
- 16-20: No direct competitors mentioned or clear blue ocean
- 11-15: Few competitors or differentiated space
- 6-10: Some competition but room for new players
- 0-5: Highly competitive with major players

Technical Feasibility (0-20):
- 16-20: Uses standard technology, straightforward implementation
- 11-15: Moderate complexity, established patterns
- 6-10: Complex but achievable with current technology
- 0-5: Requires breakthrough technology or very difficult

Differentiation (0-20):
- 16-20: Highly unique approach, clear innovation
- 11-15: Notable differences from existing solutions
- 6-10: Some improvements over current options
- 0-5: Similar to existing solutions

Monetization Potential (0-20):
- 16-20: Clear revenue model with strong pricing power
- 11-15: Good monetization options
- 6-10: Basic revenue potential
- 0-5: Unclear or weak monetization

If you cannot score any component due to missing information, respond with:
"I need more information to provide an accurate Growth Score. Please clarify: [specific questions about missing details]"

Idea to analyze: {{{ideaText}}}

Provide the analysis with the required Growth Score breakdown format.`,
});

// Helpers
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
const cleanse = (s: string) => {
  const v = (s ?? '').trim();
  return (!v || /^n\/?a$/i.test(v) || /^null$/i.test(v) || /^undefined$/i.test(v)) ? '' : v;
};
const sanitizeOutput = (o: z.infer<typeof MarketAnalysisOutputSchema>) => {
  // Calculate growth score from breakdown if available
  let calculatedGrowthScore = 0;
  let breakdown = o.growthScoreBreakdown;
  
  if (breakdown) {
    calculatedGrowthScore = 
      (breakdown.marketSize?.score || 0) +
      (breakdown.competitionPressure?.score || 0) +
      (breakdown.technicalFeasibility?.score || 0) +
      (breakdown.differentiation?.score || 0) +
      (breakdown.monetizationPotential?.score || 0);
  }
  
  return {
    verdict: cleanse(o.verdict),
    growthScore: calculatedGrowthScore || (typeof o.growthScore === 'number' ? o.growthScore : 0),
    growthScoreBreakdown: breakdown || {
      marketSize: { score: 0, explanation: 'Not analyzed' },
      competitionPressure: { score: 0, explanation: 'Not analyzed' },
      technicalFeasibility: { score: 0, explanation: 'Not analyzed' },
      differentiation: { score: 0, explanation: 'Not analyzed' },
      monetizationPotential: { score: 0, explanation: 'Not analyzed' }
    },
    riskLevel: cleanse(o.riskLevel) || 'Medium',
    summary: cleanse(o.summary),
    keyInsights: Array.isArray(o.keyInsights) ? o.keyInsights.filter(Boolean).map(cleanse) : [],
    explanation: cleanse(o.explanation),
    profitStrategy: cleanse(o.profitStrategy),
    competitors: cleanse(o.competitors),
    nextAction: cleanse(o.nextAction),
    visualData: Array.isArray(o.visualData) && o.visualData.length
      ? o.visualData.map(d => ({ name: cleanse(d.name), value: Number.isFinite(d.value) ? d.value : 0 }))
      : [
          { name: 'Market Demand', value: 0 },
          { name: 'Competitive Pressure', value: 0 },
          { name: 'Differentiation Potential', value: 0 },
          { name: 'Profitability Potential', value: 0 },
          { name: 'Execution Complexity', value: 0 },
        ],
    footnote: cleanse((o as any).footnote || ''),
  };
};

// Deterministic scoring function - only scores if sufficient information is available
function calculateDeterministicScore(ideaText: string): {
  marketSize: { score: number; explanation: string } | null;
  competitionPressure: { score: number; explanation: string } | null;
  technicalFeasibility: { score: number; explanation: string } | null;
  differentiation: { score: number; explanation: string } | null;
  monetizationPotential: { score: number; explanation: string } | null;
  canCalculate: boolean;
  missingInfo: string[];
} {
  const t = ideaText.toLowerCase();
  const has = (keywords: string[]) => keywords.some(w => t.includes(w));
  const missingInfo: string[] = [];

  // Market Size - only score if clear indicators present
  let marketSize = null;
  if (has(['enterprise', 'b2b', 'business', 'corporate', 'companies'])) {
    marketSize = { score: 15, explanation: 'B2B/Enterprise market with significant addressable size' };
  } else if (has(['consumer', 'personal', 'individual', 'users', 'people', 'everyone'])) {
    if (has(['global', 'worldwide', 'international'])) {
      marketSize = { score: 18, explanation: 'Large consumer market with global reach potential' };
    } else {
      marketSize = { score: 14, explanation: 'Consumer market with substantial user base' };
    }
  } else if (has(['niche', 'specific', 'specialized'])) {
    marketSize = { score: 8, explanation: 'Niche market with limited but defined audience' };
  } else {
    missingInfo.push('target market size and user base');
  }

  // Competition Pressure - only score if competitive landscape is mentioned
  let competitionPressure = null;
  if (has(['google', 'amazon', 'microsoft', 'meta', 'apple', 'openai', 'chatgpt'])) {
    competitionPressure = { score: 3, explanation: 'High competition from major tech companies' };
  } else if (has(['competitors', 'competing', 'similar', 'existing solutions'])) {
    competitionPressure = { score: 8, explanation: 'Moderate competition with existing players' };
  } else if (has(['unique', 'first', 'novel', 'new approach', 'no one else'])) {
    competitionPressure = { score: 17, explanation: 'Limited competition with unique positioning' };
  } else {
    missingInfo.push('competitive landscape and existing solutions');
  }

  // Technical Feasibility - only score if technology complexity is clear
  let technicalFeasibility = null;
  if (has(['ai', 'machine learning', 'blockchain', 'quantum', 'complex algorithm'])) {
    technicalFeasibility = { score: 8, explanation: 'Complex technology requiring specialized expertise' };
  } else if (has(['web app', 'mobile app', 'website', 'platform', 'simple'])) {
    technicalFeasibility = { score: 16, explanation: 'Standard technology stack, straightforward to build' };
  } else if (has(['api', 'integration', 'automation', 'software'])) {
    technicalFeasibility = { score: 13, explanation: 'Moderate complexity using established technologies' };
  } else {
    missingInfo.push('technical implementation details and complexity');
  }

  // Differentiation - only score if uniqueness is described
  let differentiation = null;
  if (has(['breakthrough', 'revolutionary', 'never been done', 'first of its kind'])) {
    differentiation = { score: 19, explanation: 'Highly innovative with breakthrough differentiation' };
  } else if (has(['unique', 'novel', 'different approach', 'innovative'])) {
    differentiation = { score: 15, explanation: 'Notable differentiation from existing solutions' };
  } else if (has(['better', 'faster', 'easier', 'improved'])) {
    differentiation = { score: 10, explanation: 'Incremental improvements over current options' };
  } else if (has(['similar', 'like', 'copy', 'clone'])) {
    differentiation = { score: 4, explanation: 'Limited differentiation from existing solutions' };
  } else {
    missingInfo.push('unique value proposition and differentiation');
  }

  // Monetization - only score if revenue model is mentioned
  let monetizationPotential = null;
  if (has(['subscription', 'saas', 'monthly fee', 'recurring revenue'])) {
    monetizationPotential = { score: 17, explanation: 'Strong recurring revenue model' };
  } else if (has(['enterprise sales', 'b2b sales', 'high price', 'premium'])) {
    monetizationPotential = { score: 16, explanation: 'High-value B2B sales model' };
  } else if (has(['marketplace', 'commission', 'transaction fee'])) {
    monetizationPotential = { score: 14, explanation: 'Transaction-based revenue with scaling potential' };
  } else if (has(['ads', 'advertising', 'freemium'])) {
    monetizationPotential = { score: 9, explanation: 'Ad-based model with moderate revenue potential' };
  } else {
    missingInfo.push('revenue model and monetization strategy');
  }

  const canCalculate = marketSize !== null && competitionPressure !== null && 
                     technicalFeasibility !== null && differentiation !== null && 
                     monetizationPotential !== null;

  return {
    marketSize,
    competitionPressure,
    technicalFeasibility,
    differentiation,
    monetizationPotential,
    canCalculate,
    missingInfo
  };
}

// Lightweight offline heuristic fallback (no external API)
function localHeuristicAnalysis(ideaText: string): MarketAnalysisOutput {
  const scoreResult = calculateDeterministicScore(ideaText);
  
  // If we can't calculate all components, ask for more information
  if (!scoreResult.canCalculate) {
    return sanitizeOutput({
      verdict: 'Needs Definition',
      growthScore: 0,
      growthScoreBreakdown: {
        marketSize: { score: 0, explanation: 'Insufficient information' },
        competitionPressure: { score: 0, explanation: 'Insufficient information' },
        technicalFeasibility: { score: 0, explanation: 'Insufficient information' },
        differentiation: { score: 0, explanation: 'Insufficient information' },
        monetizationPotential: { score: 0, explanation: 'Insufficient information' }
      },
      riskLevel: 'High',
      summary: 'Incomplete idea description',
      keyInsights: [`I need more information to provide an accurate Growth Score. Please clarify: ${scoreResult.missingInfo.join(', ')}`],
      explanation: `To properly evaluate this idea, I need more details about: ${scoreResult.missingInfo.join(', ')}. Please provide this information so I can calculate an accurate Growth Score with the required breakdown.`,
      profitStrategy: 'Cannot determine without revenue model details',
      competitors: 'Cannot assess without competitive landscape information',
      nextAction: 'Provide missing information for proper evaluation',
      visualData: [
        { name: 'Market Demand', value: 0 },
        { name: 'Competitive Pressure', value: 0 },
        { name: 'Differentiation Potential', value: 0 },
        { name: 'Profitability Potential', value: 0 },
        { name: 'Execution Complexity', value: 0 },
      ],
      footnote: `Missing information: ${scoreResult.missingInfo.join(', ')}`,
    });
  }

  // Calculate growth score from valid components
  const growthScore = 
    scoreResult.marketSize!.score +
    scoreResult.competitionPressure!.score +
    scoreResult.technicalFeasibility!.score +
    scoreResult.differentiation!.score +
    scoreResult.monetizationPotential!.score;

  const riskLevel = growthScore >= 70 ? 'Low' : growthScore >= 50 ? 'Medium' : 'High';
  const verdict =
    growthScore >= 75
      ? 'Strong Opportunity'
      : growthScore >= 55
      ? 'Viable with Risks'
      : 'Needs Validation';

  const explanation = `Growth Score: ${growthScore}/100\n\nBreakdown:\n- Market Size: ${scoreResult.marketSize!.score}/20 (${scoreResult.marketSize!.explanation})\n- Competition Pressure: ${scoreResult.competitionPressure!.score}/20 (${scoreResult.competitionPressure!.explanation})\n- Technical Feasibility: ${scoreResult.technicalFeasibility!.score}/20 (${scoreResult.technicalFeasibility!.explanation})\n- Differentiation: ${scoreResult.differentiation!.score}/20 (${scoreResult.differentiation!.explanation})\n- Monetization Potential: ${scoreResult.monetizationPotential!.score}/20 (${scoreResult.monetizationPotential!.explanation})`;

  return sanitizeOutput({
    verdict,
    growthScore,
    growthScoreBreakdown: {
      marketSize: scoreResult.marketSize!,
      competitionPressure: scoreResult.competitionPressure!,
      technicalFeasibility: scoreResult.technicalFeasibility!,
      differentiation: scoreResult.differentiation!,
      monetizationPotential: scoreResult.monetizationPotential!
    },
    riskLevel,
    summary: ideaText.length > 120 ? ideaText.slice(0, 117) + '...' : ideaText,
    keyInsights: [
      `Growth Score calculated as sum of 5 components: ${growthScore}/100`,
      `Strongest factor: ${[scoreResult.marketSize!, scoreResult.competitionPressure!, scoreResult.technicalFeasibility!, scoreResult.differentiation!, scoreResult.monetizationPotential!].sort((a, b) => b.score - a.score)[0].explanation}`,
      `Key consideration: Based on provided information only`
    ],
    explanation,
    profitStrategy: scoreResult.monetizationPotential!.explanation,
    competitors: scoreResult.competitionPressure!.explanation,
    nextAction: 'Validate assumptions with target users and market research',
    visualData: [
      { name: 'Market Demand', value: Math.round(scoreResult.marketSize!.score * 5) },
      { name: 'Competitive Pressure', value: Math.round((20 - scoreResult.competitionPressure!.score) * 5) },
      { name: 'Differentiation Potential', value: Math.round(scoreResult.differentiation!.score * 5) },
      { name: 'Profitability Potential', value: Math.round(scoreResult.monetizationPotential!.score * 5) },
      { name: 'Execution Complexity', value: Math.round((20 - scoreResult.technicalFeasibility!.score) * 5) },
    ],
    footnote: 'Growth Score = Market Size + Competition Pressure + Technical Feasibility + Differentiation + Monetization Potential',
  });
}

const generateMarketAnalysisReportFlow = ai.defineFlow(
  {
    name: 'generateMarketAnalysisReportFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async input => {
    // Enforce GEMINI-only mode: if provider isn't configured, surface an error
    if (!isGoogleAIEnabled) {
      throw new Error('Google AI is not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY in .env.local and restart the server.');
    }

    // Try Gemini with small retry/backoff
    const maxAttempts = 3;
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        const {output} = await prompt(input);
        const parsed = MarketAnalysisOutputSchema.parse(output);
        return sanitizeOutput(parsed);
      } catch (err: any) {
        const msg = String(err?.message || '');
        const transient =
          msg.includes('429') ||
          msg.toLowerCase().includes('quota') ||
          msg.toLowerCase().includes('rate limit') ||
          msg.toLowerCase().includes('temporarily') ||
          msg.toLowerCase().includes('unavailable') ||
          msg.toLowerCase().includes('not found') || // model unavailable
          msg.toLowerCase().includes('api key') ||    // bad/missing key
          msg.toLowerCase().includes('failed to fetch');

        // If not transient, break to fallback immediately.
        if (!transient) break;

        // Exponential backoff: 1s, 2s, 4s
        const delays = [1000, 2000, 4000];
        await sleep(delays[Math.min(attempt, delays.length - 1)]);
        attempt++;
      }
    }

    // Fallback: return a valid report if remote errors persist
    return localHeuristicAnalysis(input.ideaText);
  }
);