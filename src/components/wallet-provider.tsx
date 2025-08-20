
'use client';

import React, { useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { useToast } from '@/hooks/use-toast';

const network = WalletAdapterNetwork.Mainnet;

// The RPC endpoint. Use the one provided by the user for better performance.
const rpcEndpoint = "https://mainnet.helius-rpc.com/?api-key=0ad72fea-567e-4f87-ab99-2a1985319fec";

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
        <ConnectionProvider endpoint={rpcEndpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
