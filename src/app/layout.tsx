import type {Metadata} from 'next';
import './globals.css';
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { Inter } from 'next/font/google';
import { WalletContextProvider } from '@/components/wallet-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pump Watch',
  description: "The best place to watch tokens on pump.fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <WalletContextProvider rpcUrl={solanaRpcUrl}>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </WalletContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
