'use client';

import Image from 'next/image';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TokenData } from '@/lib/data';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Separator } from './ui/separator';

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
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }
  return null;
};

export function TokenCard({ token }: { token: TokenData }) {
  const isPositive = token.priceChange24h >= 0;
  const primaryColor = 'hsl(var(--primary))';
  const destructiveColor = 'hsl(0 84.2% 60.2%)';
  const chartColor = isPositive ? primaryColor : destructiveColor;

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-card border-border/60 hover:border-primary/50">
       <div className="h-24 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={token.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${token.id}`} x1="0" y1="0" x2="0" y2="1">
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
                fill={`url(#color-${token.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      <CardHeader className="pt-4 px-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={`https://placehold.co/40x40.png`}
              data-ai-hint={token.aiHint}
              alt={`${token.name} logo`}
              width={40}
              height={40}
              className="rounded-full border"
            />
            <div>
              <CardTitle className="text-base font-bold font-headline leading-tight">{token.name}</CardTitle>
              <CardDescription className="text-sm">${token.symbol}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <div className="flex justify-between items-baseline">
            <p className="text-2xl font-semibold font-mono">{formatPrice(token.price)}</p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{token.priceChange24h.toFixed(1)}%</span>
            </div>
        </div>
      </CardContent>
       <CardFooter className="px-4 pb-4 text-xs pt-2 flex justify-between items-center text-muted-foreground">
         <div className="flex items-center gap-1">
            <span>MCap:</span>
            <span className="font-mono font-medium text-foreground/80">${formatNumber(token.marketCap)}</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <span>5m:</span>
                <span className="font-mono font-medium text-foreground/80">{token.rsi5m}</span>
            </div>
             <div className="flex items-center gap-1">
                <span>1h:</span>
                <span className="font-mono font-medium text-foreground/80">{token.rsi1h}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
