import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getBookings, updateBooking } from "@/lib/data";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

// Helper to get logged-in customer phone
async function getCustomerPhone() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer-token")?.value;
  if (!token) return null;

  const db = await getDb();
  let queryId;
  try {
    queryId = new ObjectId(token);
  } catch {
    return null;
  }

  const customer = await db.collection("customers").findOne({ _id: queryId });
  return customer ? customer.phone : null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const phone = await getCustomerPhone();
    if (!phone) {
      return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });
    }

    const bookings = await getBookings();
    // Filter bookings that match the customer's phone number
    const customerBookings = bookings.filter(b => b.phone === phone);

    // Sort bookings by date/createdAt descending (newest bookings first)
    const sortedBookings = [...customerBookings].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime();
      const dateB = new Date(b.createdAt || b.date).getTime();
      return dateB - dateA;
    });

    const startIndex = (page - 1) * limit;
    const paginatedBookings = sortedBookings.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      bookings: paginatedBookings,
      total: sortedBookings.length,
      page,
      limit,
      totalPages: Math.ceil(sortedBookings.length / limit)
    });
  } catch (err) {
    return NextResponse.json({ error: "حدث خطأ أثناء تحميل الحجوزات" }, { status: 500 });
  }
}

// Allow customer to cancel their own booking
export async function PUT(req: Request) {
  try {
    const phone = await getCustomerPhone();
    if (!phone) {
      return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (status !== "cancelled") {
      return NextResponse.json({ error: "إجراء غير مصرح به" }, { status: 400 });
    }

    const bookings = await getBookings();
    const booking = bookings.find(b => b.id === id);

    if (!booking) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    // Ensure the booking belongs to the current logged-in customer
    if (booking.phone !== phone) {
      return NextResponse.json({ error: "غير مصرح لك بتعديل هذا الحجز" }, { status: 403 });
    }

    // Only allow cancelling if it's new
    if (booking.status !== "new") {
      return NextResponse.json({ error: "لا يمكن إلغاء الحجز بعد تأكيده من الإدارة" }, { status: 400 });
    }

    await updateBooking(id, { status: "cancelled" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "حدث خطأ أثناء تعديل الحجز" }, { status: 500 });
  }
}
