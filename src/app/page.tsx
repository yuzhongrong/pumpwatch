'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar';
import { Flame, Sparkles, Rocket, Star, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

type MenuKey = 'hot' | 'new' | 'watchlist' | 'community';

const menuConfig: Record<MenuKey, { title: string; icon: React.ElementType, label: string }> = {
  hot: {
    title: '热门监控',
    icon: Sparkles,
    label: '热门监控'
  },
  new: {
    title: '新代币',
    icon: Rocket,
    label: '新代币'
  },
  watchlist: {
    title: '我的关注',
    icon: Star,
    label: '我的关注'
  },
  community: {
    title: '社区',
    icon: Users,
    label: '社区'
  }
};

function PageContent({ title, tokens }: { title: string; tokens: TokenData[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">{title}</h2>
      {tokens && tokens.length > 0 ? (
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
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('https://studio--api-navigator-1owsj.us-central1.hosted.app/api/rsi');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: TokenData[] = await response.json();
        
        // Simple filtering for different menus for demonstration
        if (activeMenu === 'hot') {
          setTokens(data);
        } else if (activeMenu === 'new') {
           setTokens(data.slice(0, 2));
        } else if (activeMenu === 'watchlist') {
           setTokens(data.slice(2, 4));
        } else {
          setTokens([]);
        }

      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeMenu]);

  const { title } = menuConfig[activeMenu];

  return (
    <div className="flex">
      <Sidebar collapsible="icon">
        <SidebarRail />
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
          {loading ? <p>Loading...</p> : <PageContent title={title} tokens={tokens} />}
        </main>
      </SidebarInset>
    </div>
  );
}