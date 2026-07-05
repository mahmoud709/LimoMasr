import { NextResponse } from "next/server";
import { getContactMessages, deleteContactMessage, updateContactMessage } from "@/lib/data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    
    const result = await getContactMessages(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, read } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    
    await updateContactMessage(id, { read });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await deleteContactMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
