import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyPassword } from "@/lib/auth";
import { generateAdminToken } from "@/lib/admin-auth";

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
      // No password hash configured — require ADMIN_PASSWORD env var.
      const correct = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin123" : null);
      if (!correct) {
        console.error("ADMIN_PASSWORD env var not set and no password hash found.");
        return NextResponse.json(
          { error: "Admin login not configured" },
          { status: 503 }
        );
      }
      isValid = password === correct;
    }
  } catch {
    // Config file missing — fall back to env var or dev fallback
    const correct = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin123" : null);
    if (!correct) {
      return NextResponse.json(
        { error: "Admin login not configured" },
        { status: 503 }
      );
    }
    isValid = password === correct;
  }

  if (!isValid) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  // Issue a signed session token instead of the static string "authenticated"
  const token = generateAdminToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
