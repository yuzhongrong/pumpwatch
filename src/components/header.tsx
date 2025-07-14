import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="mb-6 flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tokens..." className="pl-9" />
      </div>
      <div className="ml-auto">
        <Button>
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
