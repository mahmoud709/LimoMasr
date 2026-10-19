/* eslint-disable @typescript-eslint/no-require-imports -- Node configuration verification. */
const fs = require("node:fs");
const path = require("node:path");
function validateRuntimeConfig(env, hasAdminHash = false) {
  const errors = [], warnings = [];
  const strongEnough = value => typeof value === "string" && value.length >= 32 && !/^(change[-_ ]?me|replace|example|qa-only|test-only)/i.test(value);
  if (!/^mongodb(?:\+srv)?:\/\/.+/.test(env.MONGODB_URI || "")) errors.push("MONGODB_URI is missing or invalid.");
  if (!strongEnough(env.ADMIN_SECRET)) errors.push("ADMIN_SECRET needs a non-placeholder signing secret of at least 32 characters.");
  if (env.CUSTOMER_SESSION_SECRET && !strongEnough(env.CUSTOMER_SESSION_SECRET)) errors.push("CUSTOMER_SESSION_SECRET is invalid.");
  if (!env.CUSTOMER_SESSION_SECRET) warnings.push("Customer signing falls back to ADMIN_SECRET; a separate random secret is recommended.");
  if (!hasAdminHash && !env.ADMIN_PASSWORD) errors.push("An owner-approved admin password/hash is required.");
  if (hasAdminHash) warnings.push("The stored admin password hash takes precedence over ADMIN_PASSWORD; confirm the owner-approved credential.");
  if (!/^G-[A-Z0-9]+$/.test(env.NEXT_PUBLIC_GA4_ID || "")) errors.push("NEXT_PUBLIC_GA4_ID is missing or invalid.");
  let cloud = env.CLOUDINARY_CLOUD_NAME || env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  let key = env.CLOUDINARY_API_KEY || "", secret = env.CLOUDINARY_API_SECRET || "";
  if (env.CLOUDINARY_URL) { try { const url = new URL(env.CLOUDINARY_URL); if (url.protocol !== "cloudinary:") throw Error(); cloud ||= url.hostname; key ||= url.username; secret ||= url.password; } catch { errors.push("CLOUDINARY_URL is invalid."); } }
  if (!cloud || (!(key && secret) && !env.CLOUDINARY_UPLOAD_PRESET)) errors.push("Cloudinary upload configuration is missing.");
  if (env.CLOUDINARY_UPLOAD_PRESET && !(key && secret)) warnings.push("Unsigned uploads need an owner-approved preset and storage/privacy controls.");
  return { valid: errors.length === 0, errors, warnings };
}
if (require.main === module) {
  require("@next/env").loadEnvConfig(process.cwd(), false);
  let hasAdminHash = false;
  try { const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/admin-config.json"), "utf8")); hasAdminHash = typeof config.passwordHash === "string" && /^\d+:.*:.+$/.test(config.passwordHash); } catch { /* No configured hash. */ }
  const result = validateRuntimeConfig(process.env, hasAdminHash);
  console.log(JSON.stringify(result, null, 2)); // Never log values or connection strings.
  if (!result.valid) process.exitCode = 1;
}
module.exports = { validateRuntimeConfig };
