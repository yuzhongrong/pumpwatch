
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Wallets should be defined outside the component render cycle
const wallets = [
    new PhantomWalletAdapter(),
];

export const WalletContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // Hardcode the RPC endpoint to ensure the correct one is used, bypassing .env issues.
    const endpoint = "https://mainnet.helius-rpc.com/?api-key=0ad72fea-567e-4f87-ab99-2a1985319fec";

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
