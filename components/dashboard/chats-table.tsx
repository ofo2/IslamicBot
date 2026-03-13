"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Loader2, MessageSquare } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ChatsTable() {
  const { data, error, isLoading } = useSWR("/api/bot/chats", fetcher);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>المحادثات</CardTitle>
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
          <CardTitle>المحادثات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">فشل في تحميل المحادثات</p>
        </CardContent>
      </Card>
    );
  }

  const chats = data?.chats || [];

  const getChatTypeLabel = (type: string) => {
    switch (type) {
      case "private":
        return "خاص";
      case "group":
        return "مجموعة";
      case "supergroup":
        return "مجموعة فائقة";
      case "channel":
        return "قناة";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          المحادثات ({chats.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chats.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا يوجد محادثات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-2 font-medium">المعرف</th>
                  <th className="text-right py-3 px-2 font-medium">العنوان</th>
                  <th className="text-right py-3 px-2 font-medium">النوع</th>
                  <th className="text-right py-3 px-2 font-medium">الحالة</th>
                  <th className="text-right py-3 px-2 font-medium">تاريخ الإضافة</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat: any) => (
                  <tr key={chat.chat_id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">{chat.chat_id}</td>
                    <td className="py-3 px-2">{chat.chat_title || "محادثة خاصة"}</td>
                    <td className="py-3 px-2">
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                        {getChatTypeLabel(chat.chat_type)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          chat.status === "active"
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {chat.status === "active" ? "نشط" : "متوقف"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {chat.created_at ? new Date(chat.created_at).toLocaleDateString("ar-SA") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
