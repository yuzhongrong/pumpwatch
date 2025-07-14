'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { tokens as defaultTokens, newTokens, watchlistTokens, type TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Flame, Sparkles, Rocket, Star } from 'lucide-react';
import { useState } from 'react';

type MenuKey = 'hot' | 'new' | 'watchlist';

const menuConfig: Record<MenuKey, { title: string; tokens: TokenData[], icon: React.ElementType, label: string }> = {
  hot: {
    title: '热门监控',
    tokens: defaultTokens,
    icon: Sparkles,
    label: '热门监控'
  },
  new: {
    title: '新代币',
    tokens: newTokens,
    icon: Rocket,
    label: '新代币'
  },
  watchlist: {
    title: '我的关注',
    tokens: watchlistTokens,
    icon: Star,
    label: '我的关注'
  }
};

function PageContent({ title, tokens }: { title: string; tokens: TokenData[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">{title}</h2>
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border border-dashed">
            <p className="text-lg font-semibold text-foreground">列表为空</p>
            <p className="text-muted-foreground mt-2">这里还没有任何代币。</p>
          </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('hot');
  const { title, tokens } = menuConfig[activeMenu];

  return (
    <div className="flex">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
               <div className="grid place-content-center bg-primary text-primary-foreground rounded-lg w-10 h-10">
                <Flame className="h-6 w-6" />
              </div>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="text-2xl font-bold text-foreground">Pump Watch</h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-2">
            <SidebarMenu>
              {Object.keys(menuConfig).map((key) => {
                  const item = menuConfig[key as MenuKey];
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton 
                        onClick={() => setActiveMenu(key as MenuKey)} 
                        isActive={activeMenu === key}
                        tooltip={item.label}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-6 lg:p-8">
          <Header />
          <PageContent title={title} tokens={tokens} />
        </main>
      </SidebarInset>
    </div>
  );
}
