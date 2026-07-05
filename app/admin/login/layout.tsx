import type { ReactNode } from "react";

// Login page uses a standalone layout — no sidebar
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
