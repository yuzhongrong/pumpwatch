'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { tokens as defaultTokens, type TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Flame, Sparkles } from 'lucide-react';
import { useState } from 'react';

function PageContent({ tokens }: { tokens: TokenData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tokens.map((token) => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  );
}

export default function Home() {
  const [displayedTokens] = useState<TokenData[]>(defaultTokens);

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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <Sparkles />
                  <span>热门监控</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Header />
          <PageContent tokens={displayedTokens} />
        </main>
      </SidebarInset>
    </div>
  );
}
