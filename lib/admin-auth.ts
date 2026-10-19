import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { issueSession, verifySession } from "./session-signing";
export function generateAdminToken(): string { return issueSession("admin", "admin", 7 * 86400); }
export function verifyAdminToken(token: string): boolean { return verifySession("admin", token) === "admin"; }
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const token = (await cookies()).get("admin-token")?.value;
  return token && verifyAdminToken(token) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
