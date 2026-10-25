const widths = [320, 360, 480, 640, 960, 1280];
export type CloudinaryCompression = "auto" | "auto:eco";

export function cloudinaryImageUrl(src: string, width: number, compression: CloudinaryCompression = "auto"): string | null {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return null;
    const marker = "/image/upload/";
    if (!url.pathname.includes(marker)) return null;
    // Signed transformation URLs cannot be changed without a new signature.
    if (/\/s--[^/]+--\//.test(url.pathname)) return null;
    url.pathname = url.pathname.replace(marker, `${marker}f_auto,q_${compression},c_limit,w_${width}/`);
    return url.toString();
  } catch {
    return null;
  }
}

export function responsiveImageProps(src: string, compression: CloudinaryCompression = "auto") {
  const optimized = cloudinaryImageUrl(src, 640, compression);
  if (!optimized) return { src };
  return {
    src: optimized,
    srcSet: widths.map(width => `${cloudinaryImageUrl(src, width, compression)} ${width}w`).join(", "),
  };
}
