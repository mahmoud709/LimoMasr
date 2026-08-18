import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/admin-auth";

const targetFiles = [
  "lib/utils.ts",
  "lib/i18n.ts",
  "data/site-settings.json",
  "components/PublicLayout.tsx",
  "components/FloatingWhatsApp.tsx",
  "components/CorporateSection.tsx",
  "components/ArticlesCarousel.tsx",
  "app/register/page.tsx",
  "app/privacy/page.tsx",
  "app/policies/page.tsx",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/flights/page.tsx",
  "app/contact/page.tsx",
  "app/cars/page.tsx",
  "app/about/page.tsx"
];

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const rootDir = process.cwd();
    let changed = 0;
    
    for (const relPath of targetFiles) {
      const filePath = path.join(/*turbopackIgnore: true*/ rootDir, relPath);
      try {
        const content = await fs.readFile(filePath, "utf8");
        if (content.includes("Limo Masr")) {
          const newContent = content.replace(/Limo Masr/g, "Limo Egypt");
          await fs.writeFile(filePath, newContent, "utf8");
          changed++;
        }
      } catch (err) {
        console.error("Skipping", relPath, err);
      }
    }
    
    return NextResponse.json({ ok: true, changed, total: targetFiles.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
