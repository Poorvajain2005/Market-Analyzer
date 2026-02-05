'use server';

/**
 * @fileOverview Provides a detailed AI explanation of the market analysis.
 *
 * - explainMarketAnalysis - A function that explains the market analysis based on the provided idea text.
 * - ExplainMarketAnalysisInput - The input type for the explainMarketAnalysis function.
 * - ExplainMarketAnalysisOutput - The return type for the explainMarketAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMarketAnalysisInputSchema = z.object({
  ideaText: z.string().describe('The product idea text to analyze.'),
});
export type ExplainMarketAnalysisInput = z.infer<typeof ExplainMarketAnalysisInputSchema>;

const ExplainMarketAnalysisOutputSchema = z.object({
  explanation: z.string().describe('A detailed AI explanation of the market analysis.'),
});
export type ExplainMarketAnalysisOutput = z.infer<typeof ExplainMarketAnalysisOutputSchema>;

export async function explainMarketAnalysis(input: ExplainMarketAnalysisInput): Promise<ExplainMarketAnalysisOutput> {
  return explainMarketAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMarketAnalysisPrompt',
  input: {schema: ExplainMarketAnalysisInputSchema},
  output: {schema: ExplainMarketAnalysisOutputSchema},
  prompt: `You are an expert market analyst. Based on the following product idea, provide a detailed explanation of the market analysis, including market potential, competitive landscape, and potential challenges and opportunities.\n\nProduct Idea: {{{ideaText}}}`,
});

const explainMarketAnalysisFlow = ai.defineFlow(
  {
    name: 'explainMarketAnalysisFlow',
    inputSchema: ExplainMarketAnalysisInputSchema,
    outputSchema: ExplainMarketAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
