import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tokens..." className="pl-9 w-full max-w-md" />
      </div>
      <WalletMultiButton 
        style={{
          '--wma-background': 'hsl(var(--primary))',
          '--wma-text': 'hsl(var(--primary-foreground))',
          '--wma-border-radius': '0.375rem',
        } as React.CSSProperties}
      />
    </header>
  );
}
