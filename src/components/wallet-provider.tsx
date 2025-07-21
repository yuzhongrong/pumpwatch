
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

const wallets = [
    new PhantomWalletAdapter(),
];

export const WalletContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

    const memoizedWallets = useMemo(() => wallets, []);

    if (!endpoint) {
        return (
            <div className="flex h-screen w-full items-center justify-center p-4 bg-background">
                 <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet Configuration Error</AlertTitle>
                    <AlertDescription>
                        The Solana RPC URL is not configured. Please set the <code className="font-mono bg-destructive-foreground/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SOLANA_RPC_URL</code> in your environment file and restart the server. Wallet features are disabled.
                    </AlertDescription>
                </Alert>
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
