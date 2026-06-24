import { NextResponse } from "next/server";
import { getBookings, saveBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getBookings());
}

export async function POST(request: Request) {
  const payload = await request.json();
  const bookings = await getBookings();
  const booking: Booking = {
    id: crypto.randomUUID(),
    type: payload.type,
    customerName: payload.customerName,
    phone: payload.phone,
    serviceRefId: payload.serviceRefId,
    serviceName: payload.serviceName,
    date: payload.date,
    notes: payload.notes ?? "",
    passengers: Number(payload.passengers || 1),
    price: payload.price ? Number(payload.price) : undefined,
    status: "new",
    source: payload.source ?? "web",
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(booking);
  await saveBookings(bookings);
  return NextResponse.json(booking, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  const bookings = await getBookings();
  const updated = bookings.map((booking) => booking.id === payload.id ? { ...booking, ...payload } : booking);
  await saveBookings(updated);
  return NextResponse.json({ ok: true });
}
