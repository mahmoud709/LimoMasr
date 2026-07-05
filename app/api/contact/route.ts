import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/data";
import type { ContactMessage } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    await addContactMessage(newMessage);

    // Broadcast the new message event if needed for a global notification
    // If you have a notification system for messages, we can do it here

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
