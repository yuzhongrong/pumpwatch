'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { tokens as defaultTokens, type TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { AITrendAnalyzer } from '@/components/ai-trend-analyzer';
import { Flame } from 'lucide-react';
import { useState, useEffect, useActionState } from 'react';
import { getAITrendSummary } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

const initialState = {
  summary: undefined,
  tokens: defaultTokens,
  error: undefined,
  isTrendAnalysis: false,
};

export default function Home() {
  const [state, formAction] = useActionState(getAITrendSummary, initialState);
  const [displayedTokens, setDisplayedTokens] = useState<TokenData[]>(defaultTokens);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.isTrendAnalysis) {
      setDisplayedTokens(state.tokens || []);
    }
  }, [state]);

  const handleAnalysisStart = () => {
    setIsLoading(true);
  };

  const handleAnalysisFinish = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="grid place-content-center bg-primary/10 text-primary rounded-lg w-10 h-10">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="text-xl font-bold text-foreground font-headline">Pump Watch</h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-2">
            <AITrendAnalyzer 
              formAction={formAction} 
              formState={state}
              onAnalysisStart={handleAnalysisStart}
              onAnalysisFinish={handleAnalysisFinish}
            />
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Header />
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-3/5" />
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedTokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </div>
  );
}
