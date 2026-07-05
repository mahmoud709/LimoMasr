import { eventEmitter } from "@/lib/eventEmitter";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send an initial heartbeat to establish the connection immediately
      controller.enqueue(encoder.encode(": heartbeat\n\n"));

      // Define the listener
      const onNewBooking = (booking: any) => {
        // SSE format: data: {json}\n\n
        const data = `data: ${JSON.stringify(booking)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Subscribe to the global 'new_booking' event
      eventEmitter.on("new_booking", onNewBooking);

      // Keep connection alive to prevent timeouts (every 30 seconds)
      const intervalId = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 30000);

      // Clean up when the client disconnects
      request.signal.addEventListener("abort", () => {
        eventEmitter.off("new_booking", onNewBooking);
        clearInterval(intervalId);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
