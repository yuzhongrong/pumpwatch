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
import { tokens, TokenData } from '@/lib/data';

const TokenSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  contractAddress: z.string(),
  price: z.number(),
  priceChange24h: z.number(),
  marketCap: z.number(),
  volume: z.number(),
  liquidity: z.number(),
  rsi5m: z.number(),
  rsi1h: z.number(),
  aiHint: z.string(),
});

const SummarizeTokenTrendsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the recent token data trends on the Pump.fun platform.'
    ),
  hotTokens: z.array(TokenSchema).describe('A list of the top 3-5 trending tokens.'),
});
export type SummarizeTokenTrendsOutput = z.infer<typeof SummarizeTokenTrendsOutputSchema>;

// Mock function to get token data
const getAvailableTokens = async (): Promise<TokenData[]> => {
  // In a real app, this would fetch data from an API or database.
  return Promise.resolve(tokens);
};

const getTrendingTokensTool = ai.defineTool(
    {
      name: 'getTrendingTokens',
      description: 'Get a list of available tokens to analyze for trends.',
      outputSchema: z.array(TokenSchema),
    },
    async () => {
      return getAvailableTokens();
    }
);


export async function summarizeTokenTrends(): Promise<SummarizeTokenTrendsOutput> {
  return summarizeTokenTrendsFlow();
}

const prompt = ai.definePrompt({
  name: 'summarizeTokenTrendsPrompt',
  output: {schema: SummarizeTokenTrendsOutputSchema},
  tools: [getTrendingTokensTool],
  prompt: `You are an AI assistant that analyzes token data trends on the Pump.fun platform.

  Use the getTrendingTokens tool to fetch the latest token data.
  From the provided token data, identify the top 3-5 most interesting or trending tokens.
  Provide a summary of the current token data trends on the Pump.fun platform.
  Include information about which tokens are gaining traction and why.
  Focus on providing insights that would be valuable to users looking for new and interesting tokens to invest in.
  Return the identified trending tokens in the hotTokens field.
  `,
});

const summarizeTokenTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeTokenTrendsFlow',
    outputSchema: SummarizeTokenTrendsOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    
    if (!output) {
      throw new Error('Failed to get a response from the AI.');
    }

    // Since the AI returns a plain object, we need to map chartData manually if needed.
    // For now, the client will handle generating chartData for simplicity.
    const hotTokensWithChartData = output.hotTokens.map(hotToken => {
        const originalToken = tokens.find(t => t.id === hotToken.id);
        return {
            ...hotToken,
            chartData: originalToken ? originalToken.chartData : [] 
        };
    });

    return {
        summary: output.summary,
        hotTokens: hotTokensWithChartData,
    };
  }
);
