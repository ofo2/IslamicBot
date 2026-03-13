import { NextRequest, NextResponse } from "next/server";
import { setWebhook, deleteWebhook } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, description: "TELEGRAM_TOKEN not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "set") {
      // Get the base URL from the request or environment
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

      const webhookUrl = `${baseUrl}/api/telegram`;
      const result = await setWebhook(token, webhookUrl);
      return NextResponse.json(result);
    } else if (action === "delete") {
      const result = await deleteWebhook(token);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ ok: false, description: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing webhook:", error);
    return NextResponse.json({ ok: false, description: "Internal server error" }, { status: 500 });
  }
}
