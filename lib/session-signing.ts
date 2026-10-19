import { Buffer } from "node:buffer";
import crypto from "node:crypto";
type SessionKind = "admin" | "customer";
type Session = { kind: SessionKind; subject: string; issued: number; expires: number; nonce: string };
function secret(kind: SessionKind) {
  const value = kind === "admin" ? process.env.ADMIN_SECRET : (process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SECRET);
  return value && value.length >= 32 ? value : null;
}
export function sessionConfigured(kind: SessionKind) { return !!secret(kind); }
export function issueSession(kind: SessionKind, subject: string, lifetimeSeconds: number): string {
  const key = secret(kind);
  if (!key) throw new Error("Session signing is not configured.");
  const now = Date.now();
  const body = Buffer.from(JSON.stringify({ kind, subject, issued: now, expires: now + lifetimeSeconds * 1000, nonce: crypto.randomBytes(16).toString("hex") })).toString("base64url");
  return body + "." + crypto.createHmac("sha256", key).update(kind + ":" + body).digest("hex");
}
export function verifySession(kind: SessionKind, token: unknown): string | null {
  const key = secret(kind);
  if (!key || typeof token !== "string" || token.length > 2048) return null;
  const match = /^([A-Za-z0-9_-]+)\.([a-f0-9]{64})$/.exec(token);
  if (!match) return null;
  try {
    const expected = crypto.createHmac("sha256", key).update(kind + ":" + match[1]).digest();
    if (!crypto.timingSafeEqual(Buffer.from(match[2], "hex"), expected)) return null;
    const data = JSON.parse(Buffer.from(match[1], "base64url").toString("utf8")) as Session;
    if (data.kind !== kind || typeof data.subject !== "string" || !data.subject || !Number.isFinite(data.issued) || !Number.isFinite(data.expires) || data.issued > Date.now() + 60000 || data.expires <= Date.now() || data.expires <= data.issued) return null;
    return data.subject;
  } catch { return null; }
}
