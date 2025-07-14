import { Header } from '@/components/header';
import { TokenCard } from '@/components/token-card';
import { tokens } from '@/lib/data';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { AITrendAnalyzer } from '@/components/ai-trend-analyzer';
import { Flame } from 'lucide-react';

export default function Home() {
  const filteredTokens = tokens;

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
            <AITrendAnalyzer />
           </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Header />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
