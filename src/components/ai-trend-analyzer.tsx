'use client';

import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';

function SubmitButton({ onAnalysisStart, onAnalysisFinish }: { onAnalysisStart: () => void; onAnalysisFinish: () => void; }) {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      onAnalysisStart();
    } else {
      onAnalysisFinish();
    }
  }, [pending, onAnalysisStart, onAnalysisFinish]);

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
    <SidebarMenu>
      <SidebarMenuItem>
        <form action={formAction}>
          <SubmitButton onAnalysisStart={onAnalysisStart} onAnalysisFinish={onAnalysisFinish} />
        </form>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
