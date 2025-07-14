'use server';

import { summarizeTokenTrends } from '@/ai/flows/summarize-token-trends';
import { z } from 'zod';

const formSchema = z.object({
  timeframe: z.string().min(1, 'Please select a timeframe.'),
});

interface FormState {
  summary?: string;
  error?: string;
}

export async function getAITrendSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    timeframe: formData.get('timeframe'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid timeframe provided.',
    };
  }

  try {
    const result = await summarizeTokenTrends({ timeframe: validatedFields.data.timeframe });
    if (result.summary) {
      return { summary: result.summary };
    }
    return { error: 'Failed to generate summary. The result was empty.' };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred while generating the trend summary.' };
  }
}
