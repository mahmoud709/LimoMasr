import crypto from "crypto";

const CURRENT_ITERATIONS = 210000;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, CURRENT_ITERATIONS, 64, "sha512").toString("hex");
  return `${CURRENT_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  
  const parts = storedHash.split(":");
  let iterations = 1000; // Legacy default
  let salt, hash;

  if (parts.length === 3) {
    iterations = parseInt(parts[0], 10);
    salt = parts[1];
    hash = parts[2];
  } else if (parts.length === 2) {
    salt = parts[0];
    hash = parts[1];
  } else {
    return false;
  }

  const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
  // Use timingSafeEqual to prevent timing attacks
  try {
    const hashBuffer = Buffer.from(hash, "hex");
    const verifyHashBuffer = Buffer.from(verifyHash, "hex");
    if (hashBuffer.length !== verifyHashBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, verifyHashBuffer);
  } catch {
    return hash === verifyHash;
  }
}
