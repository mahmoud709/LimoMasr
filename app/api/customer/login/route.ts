import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
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
    response.cookies.set("customer-token", customer._id.toString(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 });
  }
}
