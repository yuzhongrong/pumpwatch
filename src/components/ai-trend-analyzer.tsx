'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';

function SubmitButton({ onAnalysisStart, onAnalysisFinish }: { onAnalysisStart: () => void; onAnalysisFinish: () => void; }) {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      onAnalysisStart();
    } else {
      onAnalysisFinish();
    }
  }, [pending]);

  return (
    <SidebarMenuButton type="submit" disabled={pending} tooltip="热门监控">
      {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
      <span>热门监控</span>
    </SidebarMenuButton>
  );
}

export function AITrendAnalyzer({ formAction, formState, onAnalysisStart, onAnalysisFinish }: { 
    formAction: (payload: FormData) => void;
    formState: { summary?: string; error?: string };
    onAnalysisStart: () => void;
    onAnalysisFinish: () => void;
}) {
  const { toast } = useToast();
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: formState.error,
      });
    }
  }, [formState.error, toast]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <form action={formAction}>
            <SubmitButton onAnalysisStart={onAnalysisStart} onAnalysisFinish={onAnalysisFinish} />
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

      {formState.summary && !pending && (
        <div className="mt-4 rounded-lg border bg-secondary/50 p-3 mx-2 animate-in fade-in-50">
          <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{formState.summary}</p>
        </div>
      )}
    </>
  );
}
