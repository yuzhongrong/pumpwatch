
'use client';

import React, { useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

const network = WalletAdapterNetwork.Devnet;

// Use a list of stable and well-supported wallets.
const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
];

export const WalletContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { toast } = useToast();
    const endpoint = useMemo(() => clusterApiUrl(network), []);

    const onError = useCallback((error: WalletError) => {
        console.warn(error);
        if (error.message !== 'Wallet not selected') {
            toast({
                title: '钱包错误',
                description: error.message,
                variant: 'destructive',
            });
        }
    }, [toast]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
