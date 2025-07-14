'use server';

import { summarizeTokenTrends } from '@/ai/flows/summarize-token-trends';
import { z } from 'zod';

const formSchema = z.object({
  timeframe: z.string().min(1, 'Please select a timeframe.').optional(),
});

interface FormState {
  summary?: string;
  error?: string;
}

export async function getAITrendSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Timeframe is no longer needed, but we keep the structure for now.
  const validatedFields = formSchema.safeParse({
    timeframe: formData.get('timeframe') || 'general',
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid request.',
    };
  }

  try {
    const result = await summarizeTokenTrends();
    if (result.summary) {
      return { summary: result.summary };
    }
    return { error: 'Failed to generate summary. The result was empty.' };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred while generating the trend summary.' };
  }
}
