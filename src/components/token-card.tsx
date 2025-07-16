'use client';

import Image from 'next/image';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TokenData } from '@/lib/data';
import { TrendingUp, TrendingDown, Copy, Check, Eye, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const formatPrice = (price: number): string => {
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

export function TokenCard({ token }: { token: TokenData }) {
  const isPositive = token.priceChange.h24 >= 0;
  const chartColor = isPositive ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';
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

  const chartData = token['rsi_200_5m']
    .map(d => ({ time: parseInt(d[0]), value: parseFloat(d[4]) }))
    .sort((a, b) => a.time - b.time);

  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1].value : parseFloat(token.priceUsd);

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-card border-border/60 hover:border-primary/50">
       <div className="h-24 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${token.tokenContractAddress}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${token.tokenContractAddress})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      <CardHeader className="pt-4 px-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={token.info.imageUrl || `https://placehold.co/40x40.png`}
              alt={`${token.symbol} logo`}
              width={40}
              height={40}
              className="rounded-full border"
              unoptimized
            />
            <div>
              <CardTitle className="text-base font-bold leading-tight">{token.symbol}</CardTitle>
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
                <span>{token.priceChange.h24.toFixed(1)}%</span>
            </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
              {token.tokenContractAddress.slice(0, 6)}...{token.tokenContractAddress.slice(-4)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyAddress}
              aria-label="Copy contract address"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
        </div>
      </CardContent>
       <CardFooter className="px-4 pb-4 text-xs pt-0 flex justify-between items-center text-muted-foreground">
         <div className="flex items-center gap-1">
            <span>MCap:</span>
            <span className="font-mono font-medium text-foreground/80">${formatNumber(token.marketCap)}</span>
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
    </Card>
  );
}
