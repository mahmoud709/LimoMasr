import { issueSession, sessionConfigured } from "@/lib/session-signing";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sessionConfigured("customer")) return NextResponse.json({ error: "Customer login not configured" }, { status: 503 });
  try {
    const { name, phone, password } = await req.json();

    if (typeof name !== "string" || !name.trim() || name.length > 150 || typeof phone !== "string" || !phone.trim() || phone.length > 80 || typeof password !== "string" || password.length < 8 || password.length > 256) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("customers");

    // Check if customer already exists
    const existing = await collection.findOne({ phone });
    if (existing) {
      return NextResponse.json({ error: "رقم الهاتف مسجل بالفعل" }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);
    const newCustomer = {
      name,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newCustomer);

    const response = NextResponse.json({
      success: true,
      user: { id: result.insertedId.toString(), name, phone },
    });

    // Set HTTP-only cookie
    response.cookies.set("customer-token", issueSession("customer", result.insertedId.toString(), 30 * 86400), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 });
  }
}
