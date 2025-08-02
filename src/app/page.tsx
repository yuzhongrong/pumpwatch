

'use client';

import { Header } from '@/components/header';
import { TokenCard, TokenCardSkeleton } from '@/components/token-card';
import { TokenData } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Flame, Sparkles, Bell, Droplets, Users, RefreshCw, ShoppingCart, ShieldCheck, Eye, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '@/components/notification-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type MenuKey = 'hot' | 'notifications' | 'liquidity' | 'community';
type SuggestionType = '买入' | '保守买入' | '观望';

const REFRESH_INTERVAL = 60; // 60 seconds

const menuConfig: Record<MenuKey, { title: string; icon: React.ElementType, label: string }> = {
  hot: {
    title: '热门监控',
    icon: Sparkles,
    label: '热门监控'
  },
  notifications: {
    title: '通知',
    icon: Bell,
    label: '通知'
  },
  liquidity: {
    title: '夜晚挂机',
    icon: Droplets,
    label: '夜晚挂机'
  },
  community: {
    title: '社区',
    icon: Users,
    label: '社区'
  }
};

const getTradingSuggestionText = (token: TokenData): SuggestionType => {
    const rsi5m = token['rsi-5m'];
    const rsi1h = token['rsi-1h'];
    if (rsi5m !== null && rsi1h !== null) {
        if (rsi5m < 30 && rsi1h < 30) {
          return '买入';
        }
        if (rsi5m < 30 && rsi1h > 30) {
          return '保守买入';
        }
    }
    return '观望';
};

const suggestionConfig: Record<SuggestionType, { title: string; icon: React.ElementType }> = {
    '买入': { title: '买入', icon: ShoppingCart },
    '保守买入': { title: '保守买入', icon: ShieldCheck },
    '观望': { title: '观望', icon: Eye }
};

function LiquidityMiningManager() {
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>夜晚挂机</CardTitle>
            <CardDescription>触发条件1h rsi &lt;30 &amp;&amp;4h rsi&lt;30</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>功能开发中</AlertTitle>
                <AlertDescription>
                    查询和管理流动性头寸的功能即将推出，敬请期待。
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
  );
}


function PageContent({ onRefresh, isRefreshing, countdown, groupedTokens, activeMenu }: { onRefresh: () => void, isRefreshing: boolean, countdown: number, groupedTokens: Record<SuggestionType, TokenData[]>, activeMenu: MenuKey }) {
  const hasHotTokens = Object.values(groupedTokens).some(group => group.length > 0);
  const { title } = menuConfig[activeMenu];
  
  const renderContent = () => {
    switch(activeMenu) {
      case 'hot':
        return hasHotTokens ? (
           <div className="space-y-8">
            {(Object.keys(suggestionConfig) as SuggestionType[]).map((groupName) => {
              const groupTokens = groupedTokens[groupName];
              if (groupTokens.length === 0) return null;
              const Icon = suggestionConfig[groupName].icon;
              return (
                <div key={groupName}>
                  <div className="flex items-center gap-2 mb-4">
                     <Icon className="h-6 w-6 text-muted-foreground" />
                     <h3 className="text-xl font-semibold text-foreground">{suggestionConfig[groupName].title} ({groupTokens.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupTokens.map((token) => (
                      <TokenCard key={token.id} token={token} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border border-dashed">
            <p className="text-lg font-semibold text-foreground">列表为空</p>
            <p className="text-muted-foreground mt-2">这里还没有任何代币。</p>
          </div>
        );
      case 'notifications':
        return <NotificationSettings />;
      case 'liquidity':
        return <LiquidityMiningManager />;
      case 'community':
         return (
           <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border border-dashed">
            <p className="text-lg font-semibold text-foreground">功能开发中</p>
            <p className="text-muted-foreground mt-2">社区功能即将推出，敬请期待。</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        {activeMenu === 'hot' && (
           <Button onClick={onRefresh} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '正在刷新...' : `刷新 (${countdown}s)`}
          </Button>
        )}
      </div>
      {renderContent()}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TokenCardSkeleton />
          <TokenCardSkeleton />
          <TokenCardSkeleton />
          <TokenCardSkeleton />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TokenCardSkeleton />
          <TokenCardSkeleton />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('hot');
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const { toast } = useToast();

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch('/api/tokens');
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
      if (allTokens.length === 0) { 
        toast({
          title: "错误",
          description: "无法获取代币数据，请稍后再试。",
          variant: "destructive",
        });
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
      setIsRefreshing(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, [toast, allTokens.length]);

  useEffect(() => {
    fetchData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeMenu === 'hot' && !isRefreshing) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            fetchData();
            return REFRESH_INTERVAL;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMenu, fetchData, isRefreshing]);

  const groupedTokens = useMemo(() => {
    const groups: Record<SuggestionType, TokenData[]> = {
        '买入': [],
        '保守买入': [],
        '观望': [],
    };
    if (activeMenu === 'hot') {
        allTokens.forEach(token => {
            const suggestion = getTradingSuggestionText(token);
            groups[suggestion].push(token);
        });
    }
    return groups;
  }, [activeMenu, allTokens]);

  const isLoading = loading && activeMenu === 'hot';

  return (
    <div className="grid grid-cols-[auto_1fr] w-full">
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
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          {isLoading ? <LoadingSkeleton /> : <PageContent onRefresh={fetchData} isRefreshing={isRefreshing} countdown={countdown} groupedTokens={groupedTokens} activeMenu={activeMenu}/>}
        </main>
      </div>
    </div>
  );
}
