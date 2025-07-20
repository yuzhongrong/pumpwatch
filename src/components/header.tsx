
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Copy, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from './wallet-button';
import { useState, useMemo } from 'react';

function PlatformTokenDisplay() {
  const [isCopied, setIsCopied] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_PW_TOKEN_MINT_ADDRESS;

  const buyLink = useMemo(() => {
    if (!contractAddress) return '#';
    return `https://gmgn.ai/sol/token/${contractAddress}`;
  }, [contractAddress]);

  const copyAddress = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (!contractAddress) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4 bg-background border rounded-lg px-3 py-1.5 text-sm">
      <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-muted-foreground">合约地址:</span>
          <span className="font-mono text-xs sm:text-sm text-foreground truncate max-w-[100px] sm:max-w-[150px]">
          {contractAddress}
          </span>
          <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={copyAddress}
              aria-label="复制合约地址"
          >
              {isCopied ? (
              <Check className="h-4 w-4 text-primary" />
              ) : (
              <Copy className="h-4 w-4" />
              )}
          </Button>
      </div>
      <a href={buyLink} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Button size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              购买 PW
          </Button>
      </a>
    </div>
  );
}


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 sm:px-6 backdrop-blur-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-4 mr-auto">
        <PlatformTokenDisplay />
      </div>
      <div className="flex items-center gap-4">
        <WalletButton />
      </div>
    </header>
  );
}
