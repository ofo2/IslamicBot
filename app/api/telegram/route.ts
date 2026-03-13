import { NextRequest, NextResponse } from "next/server";

// Dynamic import for the bot module
let botInstance: any = null;

async function getBot() {
  if (!botInstance) {
    const botModule = await import("@/src/bot.mjs");
    botInstance = botModule.getBot();
  }
  return botInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bot = await getBot();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Islamic Bot Webhook is active",
    message: "This endpoint receives updates from Telegram",
  });
}
