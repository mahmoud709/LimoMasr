"use client";

import type { ImgHTMLAttributes } from "react";
import { responsiveImageProps } from "@/lib/responsive-image";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & { src: string; alt: string };

export function ResponsiveImage({ src, alt, sizes = "(min-width: 768px) 360px, 280px", loading = "lazy", onError, ...props }: Props) {
  return (
    // Cloudinary supplies responsive sizes, compression and format negotiation.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} {...responsiveImageProps(src)} alt={alt} sizes={sizes} loading={loading} decoding="async" onError={event => {
      if (onError) event.currentTarget.removeAttribute("srcset");
      onError?.(event);
    }} />
  );
}
