
'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  return (
    <WalletMultiButton className="bg-primary text-primary-foreground hover:bg-primary/90" />
  );
}
