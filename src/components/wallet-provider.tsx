
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
    rpcUrl,
}: {
    children: React.ReactNode;
    rpcUrl?: string;
}) => {
    // The RPC endpoint is now passed as a prop from a server component.
    const endpoint = rpcUrl;

    // useMemo helps to avoid re-creating the adapter array on every render.
    const memoizedWallets = useMemo(() => wallets, []);

    if (!endpoint) {
        // This provides a fallback and a clear error message if the prop is not passed.
        // This can happen if the .env variable is not set on the server.
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
