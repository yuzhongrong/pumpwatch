
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Copy, LogOut, Wallet } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const shortAddress = useMemo(() => {
    if (!base58) return '连接钱包';
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [base58]);

  const copyAddress = () => {
    if (!base58) return;
    navigator.clipboard.writeText(base58);
    setIsCopied(true);
    toast({ title: '地址已复制' });
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (!connected || !base58) {
    return (
      <Button onClick={() => setVisible(true)}>
        <Wallet className="mr-2 h-4 w-4" />
        连接钱包
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          {shortAddress}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{isCopied ? '已复制!' : '复制地址'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>断开连接</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
