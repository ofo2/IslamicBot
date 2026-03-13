import { NextResponse } from "next/server";
import { getBotInfo, getWebhookInfo } from "@/lib/db";

export async function GET() {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "TELEGRAM_TOKEN not configured" }, { status: 500 });
    }

    const [bot, webhook] = await Promise.all([getBotInfo(token), getWebhookInfo(token)]);

    return NextResponse.json({
      ok: true,
      bot,
      webhook,
    });
  } catch (error) {
    console.error("Error getting bot status:", error);
    return NextResponse.json({ error: "Failed to get bot status" }, { status: 500 });
  }
}
