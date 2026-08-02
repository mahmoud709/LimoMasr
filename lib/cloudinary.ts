import crypto from "crypto";

/**
 * Get Cloudinary configuration parameters from environment variables
 */
function getCloudinaryConfig() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  let apiKey = process.env.CLOUDINARY_API_KEY || "";
  let apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";

  // Parse CLOUDINARY_URL if present (e.g. cloudinary://api_key:api_secret@cloud_name)
  if (process.env.CLOUDINARY_URL && (!cloudName || !apiKey || !apiSecret)) {
    try {
      const url = new URL(process.env.CLOUDINARY_URL);
      cloudName = cloudName || url.hostname;
      apiKey = apiKey || url.username;
      apiSecret = apiSecret || url.password;
    } catch (e) {
      console.error("Error parsing CLOUDINARY_URL:", e);
    }
  }

  return { cloudName, apiKey, apiSecret, uploadPreset };
}

/**
 * Extract Cloudinary public_id from a full image URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1573753818/limo-masr/car_123.jpg => limo-masr/car_123
 */
export function getCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const uploadSplit = url.split("/upload/");
    if (uploadSplit.length < 2) return null;

    let pathAfterUpload = uploadSplit[1];
    // Remove version prefix (e.g., v1628472910/)
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

    // Strip extension (.jpg, .png, .webp, etc.)
    const lastDot = pathAfterUpload.lastIndexOf(".");
    if (lastDot !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDot);
    }

    return pathAfterUpload;
  } catch (err) {
    console.error("Failed to parse Cloudinary public_id:", err);
    return null;
  }
}

/**
 * Upload an image file buffer or base64 string to Cloudinary
 */
export async function uploadToCloudinary(
  fileInput: Buffer | string, 
  mimeType: string = "image/jpeg",
  folder: string = "limo-masr"
): Promise<string> {
  const { cloudName, apiKey, apiSecret, uploadPreset } = getCloudinaryConfig();

  if (!cloudName) {
    throw new Error("Missing Cloudinary Cloud Name. Please configure CLOUDINARY_CLOUD_NAME in .env");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Build payload
  const formData = new FormData();

  if (Buffer.isBuffer(fileInput)) {
    const blob = new Blob([fileInput as any], { type: mimeType });
    formData.append("file", blob);
  } else if (typeof fileInput === "string") {
    formData.append("file", fileInput);
  }

  formData.append("folder", folder);

  // Use signed upload if API Key and Secret are present
  if (apiKey && apiSecret) {
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
  } else if (uploadPreset) {
    // Unsigned upload preset fallback
    formData.append("upload_preset", uploadPreset);
  } else {
    throw new Error("Cloudinary requires either (CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET) or CLOUDINARY_UPLOAD_PRESET");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error("Cloudinary upload error response:", errorData);
    throw new Error(`Cloudinary Upload Failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.secure_url;
}

/**
 * Delete an image from Cloudinary using its URL
 */
export async function deleteFromCloudinary(url: string): Promise<boolean> {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) {
    console.warn("URL is not a Cloudinary image or public_id could not be parsed:", url);
    return false;
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary API Key or Secret to destroy image:", publicId);
    return false;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudinary destroy error response:", errText);
      return false;
    }

    const data = await res.json();
    console.log(`Cloudinary image deleted successfully (${publicId}):`, data.result);
    return data.result === "ok";
  } catch (err) {
    console.error("Error destroying image on Cloudinary:", err);
    return false;
  }
}
