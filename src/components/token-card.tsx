
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TokenData } from '@/lib/data';
import { TrendingUp, TrendingDown, Copy, Check, Eye, ShoppingCart, ShieldCheck, ExternalLink, AlertTriangle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formatNumber = (num: number | null | undefined, decimals = 2) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '...';
  }
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
};

const formatPrice = (price: number): string => {
  if (isNaN(price) || price === null) {
    return '$...';
  }
  if (price > 0 && price < 0.000001) {
    return `$${price.toExponential(2)}`;
  }
  if (price < 1) {
    return `$${price.toPrecision(4)}`;
  }
  return `$${price.toFixed(2)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/90 p-2 shadow-sm animate-in fade-in-50">
        <p className="text-sm font-bold text-foreground">{formatPrice(payload[0].value)}</p>
        <p className="text-xs text-muted-foreground">{new Date(label).toLocaleTimeString()}</p>
      </div>
    );
  }
  return null;
};

const getTradingSuggestion = (rsi5m: number | null, rsi1h: number | null) => {
    if (rsi5m !== null && rsi1h !== null) {
        if (rsi5m < 30 && rsi1h < 30) {
          return { text: '买入', variant: 'success' as const, icon: ShoppingCart };
        }
        if (rsi5m < 30 && rsi1h > 30) {
          return { text: '保守买入', variant: 'warning' as const, icon: ShieldCheck };
        }
    }
    return { text: '观望', variant: 'outline' as const, icon: Eye };
};

type Suggestion = ReturnType<typeof getTradingSuggestion>;
type Timeframe = 'm5' | 'h1' | 'h6' | 'h24';

const timeframes: { key: Timeframe, label: string }[] = [
    { key: 'm5', label: '5分钟' },
    { key: 'h1', label: '1小时' },
    { key: 'h6', label: '4小时' },
    { key: 'h24', label: '24小时' },
];

function StatRow({ label, value, buys, sells }: { label: string; value: string; buys: string; sells: string }) {
    const buyValue = parseFloat(buys.replace(/[^0-9.]/g, '')) || 0;
    const sellValue = parseFloat(sells.replace(/[^0-9.]/g, '')) || 0;
    const total = buyValue + sellValue;
    const buyPercentage = total > 0 ? (buyValue / total) * 100 : 50;

    return (
        <div>
            <div className="flex justify-between items-end">
                <div className="text-left">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-foreground text-base">{value}</p>
                </div>
                <div className="text-right">
                    <div className="flex gap-4">
                        <div>
                            <p className="text-xs text-green-400">买入</p>
                            <p className="text-sm font-medium">{buys}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-400">卖出</p>
                            <p className="text-sm font-medium">{sells}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-1">
                <Progress value={buyPercentage} className="h-1.5 [&>div]:bg-green-500" style={{backgroundColor: 'hsl(var(--destructive))'}}/>
            </div>
        </div>
    );
}

function TradeInfo({ token }: { token: TokenData }) {
    const [activeTab, setActiveTab] = useState<Timeframe>('h24');
    
    if (!token.txns || !token.volume) {
      return null;
    }

    const buys = token.txns?.[activeTab]?.buys ?? 0;
    const sells = token.txns?.[activeTab]?.sells ?? 0;
    const totalTxns = buys + sells;
    const volume = token.volume?.[activeTab] ?? 0;
    const buyVolume = totalTxns > 0 ? (volume * buys) / totalTxns : 0;
    const sellVolume = totalTxns > 0 ? (volume * sells) / totalTxns : 0;

    return (
        <div className="bg-card/50 px-3 pt-2 pb-3 mt-2">
             <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-border"></div>
                <div className="rounded-full border border-border p-1">
                    <Plus className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex-1 h-px bg-border"></div>
            </div>
             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Timeframe)} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto bg-transparent p-0">
                    {timeframes.map(({ key, label }) => {
                        const currentPriceChange = token.priceChange?.[key];
                        const isPriceChangeValid = typeof currentPriceChange === 'number';
                        const isCurrentPositive = isPriceChangeValid && currentPriceChange >= 0;

                        return (
                            <TabsTrigger key={key} value={key} className="flex-col data-[state=active]:bg-muted/80 data-[state=active]:shadow-none rounded-md p-1.5 text-xs h-full whitespace-normal">
                                <span>{label}</span>
                                <span className={`font-semibold mt-1 text-sm ${isCurrentPositive ? 'text-green-500' : 'text-red-500'}`}>
                                     {isPriceChangeValid ? `${currentPriceChange.toFixed(2)}%` : '...'}
                                </span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                <div className="mt-4 space-y-4">
                     <StatRow
                        label="交易笔数"
                        value={formatNumber(totalTxns, 0)}
                        buys={formatNumber(buys, 0)}
                        sells={formatNumber(sells, 0)}
                    />
                    <StatRow
                        label="成交额"
                        value={`$${formatNumber(volume, 2)}`}
                        buys={`$${formatNumber(buyVolume, 2)}`}
                        sells={`$${formatNumber(sellVolume, 2)}`}
                    />
                </div>
            </Tabs>
        </div>
    );
}


export function TokenCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pt-4 px-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
             <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-12 mt-1" />
            </div>
          </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <Skeleton className="h-7 w-24" />
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Skeleton className="h-5 w-full" />
        </div>
      </CardContent>
       <CardFooter className="px-4 pb-4 text-xs pt-0 flex justify-between items-center text-muted-foreground">
         <Skeleton className="h-5 w-20" />
         <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  )
}

export function TokenCard({ token }: { token: TokenData }) {
  const isPositive = token.priceChange && typeof token.priceChange.h24 === 'number' ? token.priceChange.h24 >= 0 : true;
  const [isCopied, setIsCopied] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSuggestion(getTradingSuggestion(token['rsi-5m'], token['rsi-1h']));
  }, [token]);


  const copyAddress = () => {
    navigator.clipboard.writeText(token.tokenContractAddress);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const SuggestionIcon = suggestion?.icon;

  const latestPrice = token.current_price ?? parseFloat(token.priceUsd);
  
  const lowVolume = token.volume?.h24 != null && token.volume.h24 < 1000000;

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-card border-border/60 hover:border-primary/50">
      <CardHeader className="pt-4 px-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={token.info?.imageUrl || `https://placehold.co/40x40.png`}
              alt={`${token.symbol} logo`}
              width={40}
              height={40}
              className="rounded-full border"
              unoptimized
            />
            <div>
              <CardTitle className="text-base font-bold leading-tight flex items-center gap-1.5">
                <span>{token.symbol}</span>
                {lowVolume && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>交易量低，请注意风险</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
              <CardDescription className="text-sm">${token.symbol}</CardDescription>
            </div>
          </div>
            {isMounted && suggestion && SuggestionIcon && (
                <Badge variant={suggestion.variant} className="flex items-center gap-1.5 shrink-0">
                    <SuggestionIcon className="h-3.5 w-3.5" />
                    {suggestion.text}
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <div className="flex justify-between items-baseline">
            <p className="text-2xl font-semibold font-mono">{formatPrice(latestPrice)}</p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{token.priceChange && typeof token.priceChange.h24 === 'number' ? `${token.priceChange.h24.toFixed(1)}%` : '...'}</span>
            </div>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded truncate">
              {token.tokenContractAddress}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={copyAddress}
              aria-label="Copy contract address"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <a href={`https://gmgn.ai/sol/token/${token.tokenContractAddress}`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                aria-label="View on gmgn.ai"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
        </div>
      </CardContent>
       <CardFooter className="px-4 pb-4 text-xs pt-0 flex justify-between items-center text-muted-foreground">
         <div className="flex items-center gap-1">
            <span>MCap:</span>
            <span className="font-mono font-medium text-foreground/80">${formatNumber(token.marketCap, 0)}</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <span className="text-muted-foreground/80">5m:</span>
                <span className="font-mono font-medium text-foreground/80">{isMounted && token['rsi-5m'] !== null ? token['rsi-5m'].toFixed(0) : '...'}</span>
            </div>
             <div className="flex items-center gap-1">
                <span className="text-muted-foreground/80">1h:</span>
                <span className="font-mono font-medium text-foreground/80">{isMounted && token['rsi-1h'] !== null ? token['rsi-1h'].toFixed(0) : '...'}</span>
            </div>
        </div>
      </CardFooter>
      <TradeInfo token={token} />
    </Card>
  );
}
