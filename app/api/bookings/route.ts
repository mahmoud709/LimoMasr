import { readRequestJson } from "@/lib/request-json";
import { NextResponse } from "next/server";
import { getBookings, addBooking, updateBooking } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { eventEmitter } from "@/lib/eventEmitter";
import { requireAdminAuth } from "@/lib/admin-auth";
import { normalizeBookingPhone } from "@/lib/booking-phone";

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  try { return NextResponse.json(await getBookings()); }
  catch { return NextResponse.json({ error: "Booking storage is unavailable." }, { status: 503 }); }
}

// In-memory rate limiting store
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  const payload = await readRequestJson(request).catch(() => null) as Record<string, unknown> | null;
  const phone = normalizeBookingPhone(payload?.phone);
  if (!phone) {
    return NextResponse.json({
      error: "أدخل رقم هاتف / واتساب كاملًا وصحيحًا للتواصل، وليس كود الدولة فقط.",
      code: "PHONE_INVALID",
    }, { status: 400 });
  }

  // Basic IP-based rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);

  if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "الرجاء الانتظار قليلاً قبل إضافة حجز آخر" }, { status: 429 });
  }

  // Cleanup old entries randomly to prevent memory leak
  if (Math.random() < 0.1) {
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (now - timestamp > RATE_LIMIT_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  const validText = (value: unknown, max: number, required = false) => (value === undefined && !required) || (typeof value === "string" && value.length <= max && (!required || !!value.trim()));
  const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!payload || !["car", "hotel", "apartment", "flight", "fast_track"].includes(String(payload.type)) || !validText(payload.customerName, 150, true) || !validText(payload.serviceName, 300, true) || !validText(payload.serviceRefId, 200, true) || !validDate(payload.date) || (payload.dateFrom !== undefined && !validDate(payload.dateFrom)) || (payload.dateTo !== undefined && !validDate(payload.dateTo)) || (payload.dateFrom && payload.dateTo && String(payload.dateTo) < String(payload.dateFrom)) || !validText(payload.notes, 8000) || !validText(payload.otherPersonName, 150) || !validText(payload.otherPersonPhone, 80) || !validText(payload.otherPersonLocation, 500) || (payload.source !== undefined && !["web", "whatsapp"].includes(String(payload.source))) || !Number.isInteger(Number(payload.passengers ?? 1)) || Number(payload.passengers ?? 1) < 1 || Number(payload.passengers ?? 1) > 100 || ["price", "totalPrice"].some(key => payload[key] !== undefined && (!Number.isFinite(Number(payload[key])) || Number(payload[key]) < 0))) {
    return NextResponse.json({ error: "Invalid booking details", code: "BOOKING_INVALID" }, { status: 400 });
  }
  rateLimitMap.set(ip, now);

  const booking: Booking = {
    id: crypto.randomUUID(),
    type: payload!.type as Booking["type"],
    customerName: (payload!.customerName as string).trim(),
    phone,
    serviceRefId: payload!.serviceRefId as string,
    serviceName: payload!.serviceName as string,
    date: payload!.date as string,
    dateFrom: payload!.dateFrom as string | undefined,
    dateTo: payload!.dateTo as string | undefined,
    notes: payload!.notes as string || "",
    passengers: Number(payload!.passengers || 1),
    price: payload!.price ? Number(payload!.price) : undefined,
    totalPrice: payload!.totalPrice ? Number(payload!.totalPrice) : undefined,
    isForOther: Boolean(payload!.isForOther),
    otherPersonName: payload!.otherPersonName as string | undefined,
    otherPersonPhone: payload!.otherPersonPhone as string | undefined,
    otherPersonLocation: payload!.otherPersonLocation as string | undefined,
    status: "new",
    source: payload!.source as Booking["source"] || "web",
    createdAt: new Date().toISOString(),
  };
  try { await addBooking(booking); }
  catch { return NextResponse.json({ error: "Booking storage is unavailable. Please try again.", code: "BOOKING_UNAVAILABLE" }, { status: 503 }); }

  // Fire event to notify admin dashboard streams
  try { eventEmitter.emit("new_booking", booking); } catch { console.error("Booking notification failed."); }

  return NextResponse.json(booking, { status: 201 });
}

export async function PUT(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  if (Object.prototype.hasOwnProperty.call(payload, "phone")) {
    const phone = normalizeBookingPhone(payload!.phone);
    if (!phone) return NextResponse.json({ error: "رقم الهاتف مطلوب ويجب أن يكون كاملًا.", code: "PHONE_INVALID" }, { status: 400 });
    payload!.phone = phone;
  }
  await updateBooking(payload!.id, payload);
  return NextResponse.json({ ok: true });
}
