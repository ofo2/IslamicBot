"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Loader2, User } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UsersTable() {
  const { data, error, isLoading } = useSWR("/api/bot/users", fetcher);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>المستخدمين</CardTitle>
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
          <CardTitle>المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">فشل في تحميل المستخدمين</p>
        </CardContent>
      </Card>
    );
  }

  const users = data?.users || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          المستخدمين ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا يوجد مستخدمين بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-2 font-medium">المعرف</th>
                  <th className="text-right py-3 px-2 font-medium">اسم المستخدم</th>
                  <th className="text-right py-3 px-2 font-medium">الاسم</th>
                  <th className="text-right py-3 px-2 font-medium">تاريخ الانضمام</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.user_id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">{user.user_id}</td>
                    <td className="py-3 px-2">{user.username || "-"}</td>
                    <td className="py-3 px-2">
                      {user.first_name} {user.last_name || ""}
                    </td>
                    <td className="py-3 px-2">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "-"}
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
