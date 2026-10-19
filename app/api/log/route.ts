import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Not available" }, { status: 404 });
  try {
    const { message } = await req.json();
    const logPath = path.join(process.cwd(), "middleware_debug.log");
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
