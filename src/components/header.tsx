
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Copy, LogOut, Wallet, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function CustomWalletButton() {
  const { connected, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {});
  }, [disconnect]);
  
  const handleChangeWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleCopyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [publicKey]);

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    
    return (
       <DropdownMenu onOpenChange={(open) => !open && setIsCopied(false)}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="font-mono">
            {shortAddress}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
           <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">已连接钱包</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{shortAddress}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleCopyAddress}>
                  {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  <span>{isCopied ? '已复制!' : '复制地址'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>更换钱包</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>断开连接</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleConnect}>
      连接钱包
    </Button>
  );
}


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tokens..." className="pl-9 w-full" />
        </div>
        <div className="flex-1" />
        <CustomWalletButton />
      </div>
    </header>
  );
}
