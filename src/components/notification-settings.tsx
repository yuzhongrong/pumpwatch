
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Wallet, BadgeCheck } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, getAccount } from '@solana/spl-token';

const formSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
});

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
const PLATFORM_WALLET_ADDRESS = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS!);
const PW_TOKEN_MINT_ADDRESS = new PublicKey(process.env.NEXT_PUBLIC_PW_TOKEN_MINT_ADDRESS!);
const SUBSCRIPTION_COST = parseInt(process.env.NEXT_PUBLIC_SUBSCRIPTION_COST!, 10);
const PW_TOKEN_DECIMALS = 6; // Assuming PW token has 6 decimals

type SubscriptionStatus = 'inactive' | 'active';

interface SubscriptionData {
  email: string;
  status: SubscriptionStatus;
}

export function NotificationSettings() {
  const { publicKey, connected, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [pwBalance, setPwBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscriptionAndBalance = useCallback(async () => {
    if (connected && publicKey) {
      setIsLoading(true);
      try {
        // Fetch subscription status
        const subResponse = await fetch(`/api/mails?walletAddress=${publicKey.toBase58()}`);
        if (subResponse.ok) {
          const data = await subResponse.json();
          setSubscription({ email: data.email, status: data.status });
        } else {
          setSubscription(null);
        }

        // Fetch PW token balance
        try {
            const tokenAccount = await getAssociatedTokenAddress(PW_TOKEN_MINT_ADDRESS, publicKey);
            const accountInfo = await connection.getAccountInfo(tokenAccount);
            if (accountInfo) {
                const accountData = await getAccount(connection, tokenAccount);
                const balance = Number(accountData.amount) / (10 ** PW_TOKEN_DECIMALS);
                setPwBalance(balance);
            } else {
                setPwBalance(0);
            }
        } catch (e) {
            console.error("Could not get token balance", e);
            setPwBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setSubscription(null);
        setPwBalance(0);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setSubscription(null);
      setPwBalance(0);
    }
  }, [connected, publicKey, connection]);

  useEffect(() => {
    fetchSubscriptionAndBalance();
  }, [fetchSubscriptionAndBalance]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!connected || !publicKey || !wallet?.adapter) {
      toast({ title: '错误', description: '请先连接钱包', variant: 'destructive' });
      return;
    }
    if (pwBalance < SUBSCRIPTION_COST) {
        toast({ title: '错误', description: 'PW 代币余额不足', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
        const fromTokenAccount = await getAssociatedTokenAddress(PW_TOKEN_MINT_ADDRESS, publicKey);
        const toTokenAccount = await getAssociatedTokenAddress(PW_TOKEN_MINT_ADDRESS, PLATFORM_WALLET_ADDRESS);

        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount,
                toTokenAccount,
                publicKey,
                SUBSCRIPTION_COST * (10 ** PW_TOKEN_DECIMALS)
            )
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();
        
        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      const response = await fetch('/api/mails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: values.email, 
            walletAddress: publicKey.toBase58(),
            txid: signature,
            pwAmount: SUBSCRIPTION_COST
        }),
      });

      if (!response.ok) {
        throw new Error('订阅失败，请重试');
      }

      await fetchSubscriptionAndBalance(); // Refresh data
      form.reset();
      toast({ title: '订阅成功', description: '您将收到新代币的通知' });
    } catch (error: any) {
      console.error(error);
      toast({
        title: '错误',
        description: error.message || '订阅时发生未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!subscription?.email || !publicKey) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mails/${publicKey.toBase58()}/${encodeURIComponent(subscription.email)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('取消订阅失败，请重试');
      }

      setSubscription(null);
      toast({ title: '取消订阅成功', description: '您已取消邮件通知' });
    } catch (error: any) {
      toast({
        title: '错误',
        description: error.message || '取消订阅时发生未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!connected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>连接您的钱包以管理邮件通知。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg border border-dashed">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground">未连接钱包</p>
            <p className="text-muted-foreground mt-2 text-sm">请先连接您的钱包以管理邮件通知。</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>正在加载您的订阅信息...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (subscription?.status === 'active') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-green-500" />
            <span>订阅已激活</span>
          </CardTitle>
          <CardDescription>您已成功订阅新代币通知。您的邮箱地址如下：</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <p className="font-medium">{subscription.email}</p>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
              <span className="sr-only">删除</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">您可以删除当前订阅，但代币不会退还。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>订阅通知</CardTitle>
        <CardDescription>注册您的邮箱地址以接收热门新代币的实时提醒。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 rounded-md bg-muted/50 border">
            <p className="text-sm font-medium text-foreground">订阅费用</p>
            <p className="text-lg font-bold text-primary">{new Intl.NumberFormat().format(SUBSCRIPTION_COST)} PW</p>
            <p className="text-xs text-muted-foreground mt-1">
                您的余额: <span className="font-mono">{new Intl.NumberFormat().format(pwBalance)} PW</span>
            </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱地址</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || pwBalance < SUBSCRIPTION_COST}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 正在订阅...</>
              ) : `支付并订阅`}
            </Button>
            {pwBalance < SUBSCRIPTION_COST && (
                <p className="text-sm text-destructive">您的PW代币余额不足以完成订阅。</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
