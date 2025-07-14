'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getAITrendSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const initialState = {
  summary: undefined,
  error: undefined,
};

function AnalyzerForm({ summary }: { summary?: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-4">
        <Select name="timeframe" defaultValue="1 hour" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1 hour">Last Hour</SelectItem>
            <SelectItem value="6 hours">Last 6 Hours</SelectItem>
            <SelectItem value="1 day">Last 24 Hours</SelectItem>
            <SelectItem value="1 week">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Trends
            </>
          )}
        </Button>
      </div>
      {pending && !summary && (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}
    </>
  );
}

export function AITrendAnalyzer() {
  const [state, formAction] = useFormState(getAITrendSummary, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="overflow-hidden border-0 bg-transparent shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          AI Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <form action={formAction}>
          <AnalyzerForm summary={state.summary} />
        </form>
        {state.summary && (
          <div className="mt-4 rounded-lg border bg-secondary/50 p-3 animate-in fade-in-50">
            <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{state.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
