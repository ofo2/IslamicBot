import { Suspense } from "react";
import { Users, MessageSquare, UserCheck, UsersRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/stats-card";
import { WebhookControl } from "@/components/dashboard/webhook-control";
import { UsersTable } from "@/components/dashboard/users-table";
import { ChatsTable } from "@/components/dashboard/chats-table";
import { getStats } from "@/lib/db";

async function DashboardStats() {
  const stats = await getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={Users} description="المستخدمين المسجلين" />
      <StatsCard title="إجمالي المحادثات" value={stats.totalChats} icon={MessageSquare} description="جميع المحادثات" />
      <StatsCard title="المحادثات الخاصة" value={stats.privateChats} icon={UserCheck} description="رسائل مباشرة" />
      <StatsCard title="المجموعات" value={stats.groupChats} icon={UsersRound} description="مجموعات وقنوات" />
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-lg border bg-card animate-pulse" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">لوحة تحكم البوت الإسلامي</h1>
          <p className="text-muted-foreground mt-1">إدارة ومراقبة بوت تلغرام الإسلامي</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Suspense fallback={<StatsLoading />}>
          <DashboardStats />
        </Suspense>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <WebhookControl />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">المستخدمين</TabsTrigger>
                <TabsTrigger value="chats">المحادثات</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <UsersTable />
              </TabsContent>
              <TabsContent value="chats">
                <ChatsTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          البوت الإسلامي - خدمات إسلامية متكاملة لكل مسلم
        </div>
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic";
