import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  
  let isValid = false;
  
  try {
    const configPath = path.join(process.cwd(), "data", "admin-config.json");
    const configContent = await fs.readFile(configPath, "utf8");
    const config = JSON.parse(configContent);
    
    if (config.passwordHash) {
      isValid = verifyPassword(password, config.passwordHash);
    } else {
      const correct = process.env.ADMIN_PASSWORD || "admin123";
      isValid = (password === correct);
    }
  } catch (err) {
    // If file doesn't exist or can't be parsed, fallback to default
    const correct = process.env.ADMIN_PASSWORD || "admin123";
    isValid = (password === correct);
  }

  if (!isValid) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin-token");
  return res;
}
