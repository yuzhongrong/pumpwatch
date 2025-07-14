import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { AITrendAnalyzer } from '@/components/ai-trend-analyzer';
import { tokens } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  // In a real app, filtering logic would be implemented here.
  const filteredTokens = tokens;

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <AITrendAnalyzer />
      
      <div className="mb-6">
        <Tabs defaultValue="24h" className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="1h">1H</TabsTrigger>
            <TabsTrigger value="6h">6H</TabsTrigger>
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </main>
  );
}
