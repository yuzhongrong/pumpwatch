
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Check, Copy, LogOut, Wallet as WalletIcon, ChevronDown } from 'lucide-react';
import { WalletConnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { wallet, publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [isCopied, setIsCopied] = useState(false);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleCopy = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [publicKey]);

  if (!wallet || !publicKey) {
    return (
        <WalletModalButton>
            {connecting ? '正在连接...' : '连接钱包'}
        </WalletModalButton>
    );
  }

  const base58 = publicKey.toBase58();
  const shortAddress = `${base58.slice(0, 4)}...${base58.slice(-4)}`;

  return (
    <DropdownMenu onOpenChange={(open) => !open && setIsCopied(false)}>
      <DropdownMenuTrigger asChild>
        <Button>
          <WalletIcon className="mr-2 h-4 w-4" />
          <span>{shortAddress}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>我的钱包</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopy}>
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            <span>{isCopied ? '已复制!' : '复制地址'}</span>
          </DropdownMenuItem>
          <WalletModalButton>
            <WalletIcon className="mr-2 h-4 w-4" />
            <span>切换钱包</span>
          </WalletModalButton>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>断开连接</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
