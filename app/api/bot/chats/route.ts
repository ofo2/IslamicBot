import { NextResponse } from "next/server";
import { getAllChats } from "@/lib/db";

export async function GET() {
  try {
    const chats = await getAllChats();
    return NextResponse.json({ ok: true, chats });
  } catch (error) {
    console.error("Error getting chats:", error);
    return NextResponse.json({ error: "Failed to get chats" }, { status: 500 });
  }
}
