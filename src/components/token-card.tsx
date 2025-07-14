'use client';

import Image from 'next/image';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TokenData } from '@/lib/data';
import { TrendingUp, TrendingDown, BarChart, Droplets, CircleDollarSign } from 'lucide-react';

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const formatPrice = (price: number): string => {
  if (price > 0 && price < 0.0001) {
    return `$${price.toExponential(2)}`;
  }
  if (price < 1) {
    return `$${price.toPrecision(3)}`;
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
  const primaryColor = 'hsl(278 88% 56%)';
  const destructiveColor = 'hsl(0 84.2% 60.2%)';
  const chartColor = isPositive ? primaryColor : destructiveColor;

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-card">
      <CardHeader>
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
              <CardTitle className="text-lg font-headline">{token.name}</CardTitle>
              <CardDescription>${token.symbol}</CardDescription>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-semibold">{formatPrice(token.price)}</p>
            <div className="flex justify-end">
                <Badge variant={isPositive ? 'default' : 'destructive'} className="flex items-center gap-1">
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{token.priceChange24h.toFixed(1)}%</span>
                </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={token.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={0.1}
                fill={chartColor}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 text-xs pt-4 border-t">
        <div className="flex flex-col items-center text-center gap-1">
            <CircleDollarSign className="h-4 w-4 text-muted-foreground"/>
            <span className="font-semibold text-muted-foreground">MCap</span>
            <span className="font-mono font-medium text-foreground">${formatNumber(token.marketCap)}</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
            <BarChart className="h-4 w-4 text-muted-foreground"/>
            <span className="font-semibold text-muted-foreground">Volume</span>
            <span className="font-mono font-medium text-foreground">${formatNumber(token.volume)}</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
            <Droplets className="h-4 w-4 text-muted-foreground"/>
            <span className="font-semibold text-muted-foreground">Liquidity</span>
            <span className="font-mono font-medium text-foreground">${formatNumber(token.liquidity)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
