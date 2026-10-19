import { issueSession, sessionConfigured } from "@/lib/session-signing";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sessionConfigured("customer")) return NextResponse.json({ error: "Customer login not configured" }, { status: 503 });
  try {
    const { phone, password } = await req.json();

    if (typeof phone !== "string" || !phone.trim() || phone.length > 80 || typeof password !== "string" || !password || password.length > 256) {
      return NextResponse.json({ error: "الرجاء إدخال رقم الهاتف وكلمة المرور" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("customers");

    const customer = await collection.findOne({ phone });
    if (!customer) {
      return NextResponse.json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const isMatch = verifyPassword(password, customer.password);
    if (!isMatch) {
      return NextResponse.json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: { id: customer._id.toString(), name: customer.name, phone: customer.phone },
    });

    // Set HTTP-only cookie
    response.cookies.set("customer-token", issueSession("customer", customer._id.toString(), 30 * 86400), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 });
  }
}
