
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

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
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

    // useMemo helps to avoid re-creating the adapter array on every render.
    const memoizedWallets = useMemo(() => wallets, []);

    if (!endpoint) {
        // This provides a fallback and a clear error message if the .env variable is not set.
        console.error("NEXT_PUBLIC_SOLANA_RPC_URL is not set in .env file. Please add it.");
        // Render children but with a clear error message in place of wallet functionality.
        // This prevents a hard crash of the entire application.
        return (
            <div>
                <div className="flex h-screen w-full items-center justify-center p-4">
                     <Alert variant="destructive" className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Configuration Error</AlertTitle>
                        <AlertDescription>
                            The Solana RPC URL is not configured. Please set the <code className="font-mono bg-destructive-foreground/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SOLANA_RPC_URL</code> in your environment file and restart the server. Wallet features are disabled.
                        </AlertDescription>
                    </Alert>
                </div>
                {/* We still render children so the rest of the page layout can be seen */}
                <div className="hidden">{children}</div>
            </div>
        );
    }
    
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={memoizedWallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
