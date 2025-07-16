'use client';

import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Flame, Sparkles, Rocket, Star, Users, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

type MenuKey = 'hot' | 'new' | 'watchlist' | 'community';

const REFRESH_INTERVAL = 60; // 60 seconds

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

function PageContent({ title, tokens, onRefresh, isRefreshing, countdown }: { title: string; tokens: TokenData[], onRefresh: () => void, isRefreshing: boolean, countdown: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        {title === '热门监控' && (
           <Button onClick={onRefresh} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '正在刷新...' : `刷新 (${countdown}s)`}
          </Button>
        )}
      </div>
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
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const fetchData = useCallback(async () => {
    if (isRefreshing) return;
    
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/proxy');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const transformedData = data.map((token: any) => ({
        ...token,
        id: token._id, 
      }));
      setAllTokens(transformedData);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setAllTokens([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, [isRefreshing]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeMenu === 'hot') {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            fetchData();
            return REFRESH_INTERVAL;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeMenu, fetchData]);

  useEffect(() => {
    if (activeMenu === 'hot') {
      setTokens(allTokens);
    } else if (activeMenu === 'new') {
       setTokens(allTokens.slice(0, 2));
    } else if (activeMenu === 'watchlist') {
       setTokens(allTokens.slice(2, 4));
    } else {
      setTokens([]);
    }
  }, [activeMenu, allTokens]);

  const { title } = menuConfig[activeMenu];
  const isLoading = loading && !isRefreshing;

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
          {isLoading ? <p>Loading...</p> : <PageContent title={title} tokens={tokens} onRefresh={fetchData} isRefreshing={isRefreshing} countdown={countdown} />}
        </main>
      </SidebarInset>
    </div>
  );
}
