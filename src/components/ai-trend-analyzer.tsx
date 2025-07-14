'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getAITrendSummary } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';

const initialState = {
  summary: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <SidebarMenuButton type="submit" disabled={pending} tooltip="热门监控">
      <Sparkles />
      <span>热门监控</span>
    </SidebarMenuButton>
  );
}

export function AITrendAnalyzer() {
  const [state, formAction] = useFormState(getAITrendSummary, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { pending } = useFormStatus();

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
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <form action={formAction} ref={formRef}>
            <SubmitButton />
          </form>
        </SidebarMenuItem>
      </SidebarMenu>
      
      {pending && (
        <div className="mt-4 px-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {state.summary && !pending && (
        <div className="mt-4 rounded-lg border bg-secondary/50 p-3 mx-2 animate-in fade-in-50">
          <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{state.summary}</p>
        </div>
      )}
    </>
  );
}
