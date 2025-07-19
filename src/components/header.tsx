
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { useCallback } from 'react';

function CustomWalletButton() {
  const { wallet, connect, connected, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = useCallback(() => {
    if (wallet) {
      connect().catch(() => {});
    } else {
      setVisible(true);
    }
  }, [wallet, connect, setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {});
  }, [disconnect]);

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    return (
      <Button onClick={handleDisconnect} variant="secondary" className="font-mono">
        {shortAddress}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} >
      连接钱包
    </Button>
  );
}


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tokens..." className="pl-9 w-full max-w-md" />
      </div>
      <CustomWalletButton />
    </header>
  );
}
