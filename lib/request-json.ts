import { TextDecoder } from "node:util";
export async function readRequestJson(request: Request, limit = 32768): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > limit) throw new Error("REQUEST_TOO_LARGE");
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("REQUEST_TOO_LARGE"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
}
