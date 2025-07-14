// Summarize Token Trends
'use server';
/**
 * @fileOverview Summarizes recent token data trends on the Pump.fun platform.
 *
 * - summarizeTokenTrends - A function that generates summaries of token data trends.
 * - SummarizeTokenTrendsInput - The input type for the summarizeTokenTrends function.
 * - SummarizeTokenTrendsOutput - The return type for the summarizeTokenTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTokenTrendsInputSchema = z.object({
  timeframe: z
    .string()
    .describe(
      'The timeframe to summarize token trends for. Examples: 1 hour, 1 day, 1 week.'
    ),
});
export type SummarizeTokenTrendsInput = z.infer<typeof SummarizeTokenTrendsInputSchema>;

const SummarizeTokenTrendsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the recent token data trends on the Pump.fun platform.'
    ),
});
export type SummarizeTokenTrendsOutput = z.infer<typeof SummarizeTokenTrendsOutputSchema>;

export async function summarizeTokenTrends(input: SummarizeTokenTrendsInput): Promise<SummarizeTokenTrendsOutput> {
  return summarizeTokenTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTokenTrendsPrompt',
  input: {schema: SummarizeTokenTrendsInputSchema},
  output: {schema: SummarizeTokenTrendsOutputSchema},
  prompt: `You are an AI assistant that analyzes token data trends on the Pump.fun platform.

  Provide a summary of the token data trends on the Pump.fun platform for the past {{timeframe}}.
  Include information about which tokens are gaining traction and why.
  Focus on providing insights that would be valuable to users looking for new and interesting tokens to invest in.
  `,
});

const summarizeTokenTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeTokenTrendsFlow',
    inputSchema: SummarizeTokenTrendsInputSchema,
    outputSchema: SummarizeTokenTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
