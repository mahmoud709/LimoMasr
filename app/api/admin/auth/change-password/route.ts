import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), "data", "admin-config.json");
    const hashedPassword = hashPassword(newPassword);

    await fs.writeFile(configPath, JSON.stringify({ passwordHash: hashedPassword }), "utf8");

    return NextResponse.json({ ok: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تغيير كلمة المرور" }, { status: 500 });
  }
}
