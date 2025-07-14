'use server';

import { summarizeTokenTrends } from '@/ai/flows/summarize-token-trends';
import type { TokenData } from '@/lib/data';
import { z } from 'zod';

const formSchema = z.object({
  timeframe: z.string().min(1, 'Please select a timeframe.').optional(),
});

interface FormState {
  summary?: string;
  tokens?: (Omit<TokenData, 'chartData'> & { chartData: { time: string; value: number }[] })[];
  error?: string;
  isTrendAnalysis?: boolean;
}

export async function getAITrendSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // This server action now fetches both the summary and the hot tokens
  try {
    const result = await summarizeTokenTrends();
    if (result.summary && result.hotTokens) {
      return { 
        summary: result.summary, 
        tokens: result.hotTokens, 
        isTrendAnalysis: true 
      };
    }
    return { error: 'Failed to generate summary. The result was empty.' };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred while generating the trend summary.' };
  }
}
