import { NextResponse } from "next/server";
import { getBookings, addBooking, updateBooking } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { eventEmitter } from "@/lib/eventEmitter";

export async function GET() {
  return NextResponse.json(await getBookings());
}

export async function POST(request: Request) {
  const payload = await request.json();
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
  await addBooking(booking);
  
  // Fire event to notify admin dashboard streams
  eventEmitter.emit("new_booking", booking);

  return NextResponse.json(booking, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  await updateBooking(payload.id, payload);
  return NextResponse.json({ ok: true });
}
