
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const wallets = [
    new PhantomWalletAdapter(),
];

export const WalletContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

    if (!endpoint) {
        // This part will now only log an error to the console if the variable is missing,
        // preventing the app from crashing and showing a full-screen error.
        // The wallet features will simply not work until the env var is correctly loaded.
        console.error("Wallet Configuration Error: NEXT_PUBLIC_SOLANA_RPC_URL is not configured.");
        // We render children anyway to not break the whole app layout
        return <>{children}</>;
    }
    
    const memoizedWallets = useMemo(() => wallets, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={memoizedWallets}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
