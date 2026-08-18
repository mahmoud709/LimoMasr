import { NextResponse } from "next/server";
import { getBookings, addBooking, updateBooking } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { eventEmitter } from "@/lib/eventEmitter";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  return NextResponse.json(await getBookings());
}

// In-memory rate limiting store
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
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
  
  rateLimitMap.set(ip, now);

  const payload = await request.json();
  const booking: Booking = {
    id: crypto.randomUUID(),
    type: payload.type,
    customerName: payload.customerName,
    phone: payload.phone,
    serviceRefId: payload.serviceRefId,
    serviceName: payload.serviceName,
    date: payload.date,
    dateFrom: payload.dateFrom,
    dateTo: payload.dateTo,
    notes: payload.notes ?? "",
    passengers: Number(payload.passengers || 1),
    price: payload.price ? Number(payload.price) : undefined,
    totalPrice: payload.totalPrice ? Number(payload.totalPrice) : undefined,
    status: "new",
    source: payload.source ?? "web",
    createdAt: new Date().toISOString(),
  };
  await addBooking(booking);
  
  // Fire event to notify admin dashboard streams
  eventEmitter.emit("new_booking", booking);

  return NextResponse.json(booking, { status: 201 });
}

export async function PUT(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  await updateBooking(payload.id, payload);
  return NextResponse.json({ ok: true });
}
