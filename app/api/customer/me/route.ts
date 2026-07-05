import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const db = await getDb();
    const collection = db.collection("customers");

    let queryId;
    try {
      queryId = new ObjectId(token);
    } catch {
      return NextResponse.json({ user: null });
    }

    const customer = await collection.findOne({ _id: queryId });
    if (!customer) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: customer._id.toString(),
        name: customer.name,
        phone: customer.phone,
        createdAt: customer.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: "حدث خطأ" }, { status: 500 });
  }
}
