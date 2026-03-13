"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WebhookControl() {
  const { data, error, isLoading, mutate } = useSWR("/api/bot/status", fetcher, {
    refreshInterval: 30000,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSetWebhook = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/bot/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set" }),
      });
      const result = await response.json();
      if (result.ok) {
        mutate();
      } else {
        alert("فشل في تفعيل Webhook: " + result.description);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteWebhook = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/bot/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      const result = await response.json();
      if (result.ok) {
        mutate();
      } else {
        alert("فشل في إلغاء Webhook: " + result.description);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>حالة Webhook</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>حالة Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">فشل في تحميل حالة البوت</p>
        </CardContent>
      </Card>
    );
  }

  const webhookActive = data?.webhook?.url && data.webhook.url.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          حالة Webhook
          {webhookActive ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
        </CardTitle>
        <CardDescription>
          {webhookActive ? "البوت يعمل ويستقبل الرسائل" : "البوت متوقف - يحتاج لتفعيل Webhook"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.bot && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">معلومات البوت:</p>
            <p className="text-sm text-muted-foreground">
              الاسم: {data.bot.first_name} (@{data.bot.username})
            </p>
          </div>
        )}
        {webhookActive && data?.webhook?.url && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">عنوان Webhook:</p>
            <p className="text-sm text-muted-foreground break-all">{data.webhook.url}</p>
            {data.webhook.pending_update_count > 0 && (
              <p className="text-sm text-accent mt-2">
                تحديثات معلقة: {data.webhook.pending_update_count}
              </p>
            )}
          </div>
        )}
        <div className="flex gap-2">
          {!webhookActive ? (
            <Button onClick={handleSetWebhook} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              تفعيل البوت
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => mutate()} disabled={isUpdating}>
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </Button>
              <Button variant="destructive" onClick={handleDeleteWebhook} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                إيقاف البوت
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
