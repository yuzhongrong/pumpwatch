// Summarize Token Trends
'use server';
/**
 * @fileOverview Summarizes recent token data trends on the Pump.fun platform.
 *
 * - summarizeTokenTrends - A function that generates summaries of token data trends.
 * - SummarizeTokenTrendsOutput - The return type for the summarizeTokenTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTokenTrendsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the recent token data trends on the Pump.fun platform.'
    ),
});
export type SummarizeTokenTrendsOutput = z.infer<typeof SummarizeTokenTrendsOutputSchema>;

export async function summarizeTokenTrends(): Promise<SummarizeTokenTrendsOutput> {
  return summarizeTokenTrendsFlow();
}

const prompt = ai.definePrompt({
  name: 'summarizeTokenTrendsPrompt',
  output: {schema: SummarizeTokenTrendsOutputSchema},
  prompt: `You are an AI assistant that analyzes token data trends on the Pump.fun platform.

  Provide a summary of the current token data trends on the Pump.fun platform.
  Include information about which tokens are gaining traction and why.
  Focus on providing insights that would be valuable to users looking for new and interesting tokens to invest in.
  `,
});

const summarizeTokenTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeTokenTrendsFlow',
    outputSchema: SummarizeTokenTrendsOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
