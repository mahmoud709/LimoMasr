import { parseFragment, serialize, type DefaultTreeAdapterMap } from "parse5";
type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
type Parent = DefaultTreeAdapterMap["parentNode"];
const allowed = new Set("p div span br hr h1 h2 h3 h4 h5 h6 ul ol li dl dt dd blockquote pre code strong b em i u s a img figure figcaption table thead tbody tfoot tr th td caption sub sup".split(" "));
const discard = new Set(["script", "style", "iframe", "object", "embed", "svg", "math", "template", "form", "input", "button"]);
const attributes = new Set(["class", "id", "dir", "lang", "title", "alt", "width", "height", "colspan", "rowspan", "scope", "start", "reversed", "type"]);
function isElement(node: Node): node is Element { return "tagName" in node; }
function safeUrl(value: string, image: boolean) {
  const url = value.trim().replace(/[\u0000-\u0020\u007f]/g, "");
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  if (!image && url.startsWith("#")) return true;
  try { return (image ? ["https:", "http:"] : ["https:", "http:", "mailto:", "tel:"]).includes(new URL(url).protocol); }
  catch { return false; }
}
function textContent(node: Node): string {
  if (node.nodeName === "#text") return (node as DefaultTreeAdapterMap["textNode"]).value;
  return "childNodes" in node ? node.childNodes.map(textContent).join(" ") : "";
}
function clean(parent: Parent, normalize: boolean) {
  const next: Node[] = [];
  for (const node of parent.childNodes) {
    if (node.nodeName === "#comment") continue;
    if (!isElement(node)) { next.push(node); continue; }
    if (discard.has(node.tagName)) continue;
    clean(node, normalize);
    if (!allowed.has(node.tagName)) {
      for (const child of node.childNodes) { child.parentNode = parent; next.push(child); }
      continue;
    }
    node.attrs = node.attrs.filter(attr => attributes.has(attr.name) ||
      ((attr.name === "href" || attr.name === "src") && safeUrl(attr.value, attr.name === "src")) ||
      (attr.name === "target" && ["_blank", "_self"].includes(attr.value)) || attr.name === "rel");
    if (node.tagName === "a" && node.attrs.some(a => a.name === "target" && a.value === "_blank")) {
      node.attrs = node.attrs.filter(a => a.name !== "rel");
      node.attrs.push({ name: "rel", value: "noopener noreferrer" });
    }
    if (node.tagName === "img") node.attrs.push({ name: "loading", value: "lazy" }, { name: "decoding", value: "async" });
    if (normalize && /^h[1-6]$/.test(node.tagName)) {
      const text = textContent(node).replace(/\s+/g, " ").trim();
      if (!text) {
        for (const child of node.childNodes) { child.parentNode = parent; next.push(child); }
        continue;
      }
      const prose = text.length > 140 || text.split(/\s+/).length > 22 || /[.!?؟]\s+\S/.test(text);
      node.tagName = prose ? "p" : node.tagName === "h1" ? "h2" : node.tagName;
      if (prose) node.attrs = node.attrs.filter(a => a.name !== "id");
    }
    next.push(node);
  }
  parent.childNodes = next as Parent["childNodes"];
}
/** Parse and allowlist article HTML, including URL schemes and attributes. */
export function sanitizeHtml(html: string): string {
  const fragment = parseFragment(html || ""); clean(fragment, false); return serialize(fragment);
}
/** Rendering only: no stored content or translation is modified. */
export function normalizeArticleHtml(html: string): string {
  const fragment = parseFragment(html || ""); clean(fragment, true); return serialize(fragment);
}

export type ArticleTocItem = { id: string; text: string; level: number };
/** Build heading IDs and the TOC once on the server; keep SSR and hydration identical. */
export function prepareArticleHtml(html: string, locale?: "ar" | "en"): { html: string; toc: ArticleTocItem[] } {
  const fragment = parseFragment(html || "");
  clean(fragment, true);
  const toc: ArticleTocItem[] = [];
  const used = new Set<string>();
  function reserve(parent: Parent) {
    for (const node of parent.childNodes) if (isElement(node)) {
      const id = node.attrs.find(a => a.name === "id")?.value;
      if (id) used.add(id);
      reserve(node);
    }
  }
  reserve(fragment);
  const seen = new Set<string>();
  function visit(parent: Parent) {
    for (const node of parent.childNodes) if (isElement(node)) {
      if (locale && node.tagName === "a") {
        const href = node.attrs.find(a => a.name === "href");
        if (href && !href.value.startsWith("#")) {
          try {
            const url = new URL(href.value, "https://www.limo-egypt.com");
            if (["https:", "http:"].includes(url.protocol) && ["www.limo-egypt.com", "limo-egypt.com"].includes(url.hostname) &&
              /^\/(?:$|cars(?:\/|$)|hotels(?:\/|$)|hotel-apartments(?:\/|$)|flights(?:\/|$)|fast-track(?:\/|$)|blog(?:\/|$)|contact(?:\/|$)|cairo-airport-transfer(?:\/|$)|sphinx-airport-transfer(?:\/|$))/.test(url.pathname)) {
              href.value = "/" + locale + (url.pathname === "/" ? "" : url.pathname) + url.search + url.hash;
            }
          } catch { /* Safe URL allowlisting already removed unsafe schemes. */ }
        }
      }
      if (node.tagName === "h2" || node.tagName === "h3") {
        const text = textContent(node).replace(/\s+/g, " ").trim();
        let id = node.attrs.find(a => a.name === "id")?.value || "";
        if (!id || seen.has(id)) {
          let index = toc.length + 1; id = "article-heading-" + index;
          while (used.has(id)) id = "article-heading-" + (++index);
          node.attrs = node.attrs.filter(a => a.name !== "id");
          node.attrs.push({ name: "id", value: id }); used.add(id);
        }
        seen.add(id); toc.push({ id, text, level: node.tagName === "h2" ? 2 : 3 });
      }
      visit(node);
    }
  }
  visit(fragment);
  return { html: serialize(fragment), toc };
}
