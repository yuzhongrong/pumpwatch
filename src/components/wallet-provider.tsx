
'use client';

import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
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
    // Read the RPC endpoint from environment variables.
    // IMPORTANT: When you change the .env file, you MUST restart the development server for the changes to take effect.
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;

    if (!endpoint) {
        // This provides a fallback and a clear error message if the .env variable is not set.
        console.error("NEXT_PUBLIC_SOLANA_RPC_URL is not set in .env file. Please add it.");
        return (
            <div>
                <h1>Configuration Error</h1>
                <p>RPC URL is not configured. Please set NEXT_PUBLIC_SOLANA_RPC_URL in your .env file and restart the server.</p>
            </div>
        );
    }
    
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
