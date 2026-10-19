import { NextResponse } from "next/server";
import { CUSTOMER_BOOKING_DISABLED_CODE, customerBookingMessages } from "@/lib/customer-booking-access";

export const dynamic = "force-dynamic";

function disabled(request: Request) {
  const locale = request.headers.get("accept-language")?.toLowerCase().startsWith("en") ? "en" : "ar";
  return NextResponse.json({
    code: CUSTOMER_BOOKING_DISABLED_CODE,
    error: customerBookingMessages[locale].description,
    messages: { ar: customerBookingMessages.ar.description, en: customerBookingMessages.en.description },
  }, { status: 403, headers: { "Cache-Control": "no-store" } });
}

// No customer/session/phone/ID lookup. No independently proven ownership exists.
export async function GET(request: Request) { return disabled(request); }
export async function PUT(request: Request) { return disabled(request); }
