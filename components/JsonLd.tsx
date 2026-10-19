import { serializeStructuredData, type StructuredNode } from "@/lib/structured-data";
export function JsonLd({ nodes }: { nodes: StructuredNode[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(nodes) }} />;
}
