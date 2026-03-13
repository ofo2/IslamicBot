import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function getStats() {
  const [usersCount] = await sql`SELECT COUNT(*) as count FROM users`;
  const [chatsCount] = await sql`SELECT COUNT(*) as count FROM chats`;
  const [privateChats] = await sql`SELECT COUNT(*) as count FROM chats WHERE chat_type = 'private'`;
  const [groupChats] = await sql`SELECT COUNT(*) as count FROM chats WHERE chat_type != 'private'`;

  return {
    totalUsers: Number(usersCount.count),
    totalChats: Number(chatsCount.count),
    privateChats: Number(privateChats.count),
    groupChats: Number(groupChats.count),
  };
}

export async function getRecentUsers(limit = 10) {
  const users = await sql`
    SELECT user_id, username, first_name, last_name, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
  return users;
}

export async function getRecentChats(limit = 10) {
  const chats = await sql`
    SELECT chat_id, chat_title, chat_type, status, created_at 
    FROM chats 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
  return chats;
}

export async function getAllUsers() {
  const users = await sql`
    SELECT user_id, username, first_name, last_name, is_bot, created_at 
    FROM users 
    ORDER BY created_at DESC
  `;
  return users;
}

export async function getAllChats() {
  const chats = await sql`
    SELECT chat_id, chat_title, chat_username, chat_type, scheduled_enabled, status, created_at 
    FROM chats 
    ORDER BY created_at DESC
  `;
  return chats;
}

export async function getBotInfo(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch {
    return null;
  }
}

export async function getWebhookInfo(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch {
    return null;
  }
}

export async function setWebhook(token: string, url: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data;
  } catch {
    return { ok: false, description: "Failed to set webhook" };
  }
}

export async function deleteWebhook(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    const data = await response.json();
    return data;
  } catch {
    return { ok: false, description: "Failed to delete webhook" };
  }
}
