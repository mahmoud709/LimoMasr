const widths = [320, 480, 640, 960, 1280];

export function cloudinaryImageUrl(src: string, width: number): string | null {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return null;
    const marker = "/image/upload/";
    if (!url.pathname.includes(marker)) return null;
    // Signed transformation URLs cannot be changed without a new signature.
    if (/\/s--[^/]+--\//.test(url.pathname)) return null;
    url.pathname = url.pathname.replace(marker, `${marker}f_auto,q_auto,c_limit,w_${width}/`);
    return url.toString();
  } catch {
    return null;
  }
}

export function responsiveImageProps(src: string) {
  const optimized = cloudinaryImageUrl(src, 640);
  if (!optimized) return { src };
  return {
    src: optimized,
    srcSet: widths.map(width => `${cloudinaryImageUrl(src, width)} ${width}w`).join(", "),
  };
}
