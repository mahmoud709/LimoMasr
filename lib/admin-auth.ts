import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

// ADMIN_SECRET must be set in your environment variables (Vercel dashboard).
// If missing, we derive from CLOUDINARY_API_SECRET as a temporary fallback.
const SECRET =
  process.env.ADMIN_SECRET ||
  process.env.CLOUDINARY_API_SECRET ||
  "fallback-insecure-secret";

/**
 * Generates a cryptographically signed admin session token.
 * Format: base64(payload).HMAC-SHA256(payload)
 */
export function generateAdminToken(): string {
  const payload = `admin:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("hex");
  return `${payloadB64}.${sig}`;
}

/**
 * Verifies a signed admin session token using timing-safe comparison.
 */
export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const payloadB64 = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payloadB64)
      .digest("hex");
    // Both buffers must be same length for timingSafeEqual
    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Call at the top of every admin API route handler.
 * Returns a 401 NextResponse if not authenticated, null if OK.
 *
 * Usage:
 *   const unauth = await requireAdminAuth();
 *   if (unauth) return unauth;
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
