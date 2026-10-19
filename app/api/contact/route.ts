import { readRequestJson } from "@/lib/request-json";
import { normalizeBookingPhone } from "@/lib/booking-phone";
import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/data";
import type { ContactMessage } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const data = await readRequestJson(req).catch(() => null) as Record<string, unknown> | null;
    if (!data) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { name, email, phone, message } = data;

    if (typeof name !== "string" || !name.trim() || name.length > 150 || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== "string" || !message.trim() || message.length > 5000 || (phone !== undefined && phone !== "" && !normalizeBookingPhone(phone))) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: typeof phone === "string" ? phone : undefined,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    await addContactMessage(newMessage);

    // Broadcast the new message event if needed for a global notification
    // If you have a notification system for messages, we can do it here

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch {
    console.error("Contact message storage failed.");
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
