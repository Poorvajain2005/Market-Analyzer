'use server';
/**
 * @fileOverview A flow for summarizing key insights from a market analysis.
 *
 * - summarizeKeyInsights - A function that summarizes key insights.
 * - SummarizeKeyInsightsInput - The input type for the summarizeKeyInsights function.
 * - SummarizeKeyInsightsOutput - The return type for the summarizeKeyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeKeyInsightsInputSchema = z.object({
  analysis: z.string().describe('The detailed market analysis.'),
});
export type SummarizeKeyInsightsInput = z.infer<typeof SummarizeKeyInsightsInputSchema>;

const SummarizeKeyInsightsOutputSchema = z.object({
  summary: z.string().describe('A one-line summary of the key insights.'),
});
export type SummarizeKeyInsightsOutput = z.infer<typeof SummarizeKeyInsightsOutputSchema>;

export async function summarizeKeyInsights(input: SummarizeKeyInsightsInput): Promise<SummarizeKeyInsightsOutput> {
  return summarizeKeyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeKeyInsightsPrompt',
  input: {schema: SummarizeKeyInsightsInputSchema},
  output: {schema: SummarizeKeyInsightsOutputSchema},
  prompt: `You are an expert market analyst. Given the following market analysis, provide a one-line summary of the key insights.\n\nMarket Analysis: {{{analysis}}}`,
});

const summarizeKeyInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeKeyInsightsFlow',
    inputSchema: SummarizeKeyInsightsInputSchema,
    outputSchema: SummarizeKeyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
