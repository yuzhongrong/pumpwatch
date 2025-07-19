'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
});

const LOCAL_STORAGE_KEY = 'pump_watch_registered_email';

export function NotificationSettings() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEmail) {
      setRegisteredEmail(storedEmail);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/mails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error('订阅失败，请重试');
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, values.email);
      setRegisteredEmail(values.email);
      form.reset();
      toast({
        title: '订阅成功',
        description: '您将收到新代币的通知',
      });
    } catch (error: any) {
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
    if (!registeredEmail) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mails/${encodeURIComponent(registeredEmail)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('取消订阅失败，请重试');
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setRegisteredEmail(null);
      toast({
        title: '取消订阅成功',
        description: '您已取消邮件通知',
      });
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

  if (!isMounted) {
    return null; 
  }

  if (registeredEmail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>您已订阅新代币通知。您的邮箱地址如下：</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <p className="font-medium">{registeredEmail}</p>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <span className="sr-only">删除</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">您可以删除当前邮箱地址以重新注册或取消订阅。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>订阅通知</CardTitle>
        <CardDescription>注册您的邮箱地址以接收热门新代币的实时提醒。</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? '正在订阅...' : '订阅'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
