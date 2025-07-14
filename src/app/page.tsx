'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { tokens as defaultTokens, newTokens, watchlistTokens, type TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Flame, Sparkles, Rocket, Star } from 'lucide-react';
import { useState } from 'react';

type MenuKey = 'hot' | 'new' | 'watchlist';

const menuContent: Record<MenuKey, { title: string, tokens: TokenData[] }> = {
  hot: {
    title: '热门监控',
    tokens: defaultTokens
  },
  new: {
    title: '新代币',
    tokens: newTokens
  },
  watchlist: {
    title: '我的关注',
    tokens: watchlistTokens
  }
};

function PageContent({ title, tokens }: { title: string; tokens: TokenData[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">{title}</h2>
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg">
            <p className="text-lg font-semibold text-foreground">列表为空</p>
            <p className="text-muted-foreground mt-2">这里还没有任何代币。</p>
          </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('hot');
  const { title, tokens } = menuContent[activeMenu];

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
                <SidebarMenuButton onClick={() => setActiveMenu('hot')} isActive={activeMenu === 'hot'}>
                  <Sparkles />
                  <span>热门监控</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('new')} isActive={activeMenu === 'new'}>
                  <Rocket />
                  <span>新代币</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveMenu('watchlist')} isActive={activeMenu === 'watchlist'}>
                  <Star />
                  <span>我的关注</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Header />
          <PageContent title={title} tokens={tokens} />
        </main>
      </SidebarInset>
    </div>
  );
}
