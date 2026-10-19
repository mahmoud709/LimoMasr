"use client";
import { useEffect, useRef } from "react";
/** Keep keyboard focus in an open modal and restore its trigger on close. */
export function useModalAccessibility(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || []).filter(element => element.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => (ref.current?.querySelector<HTMLElement>("input") || focusable()[0] || ref.current)?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const elements = focusable(), first = elements[0], last = elements.at(-1);
      if (!first || !last) { event.preventDefault(); ref.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", keydown); document.body.style.overflow = overflow; trigger?.focus(); };
  }, [open, onClose]);
  return ref;
}
