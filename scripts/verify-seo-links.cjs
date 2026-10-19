/* eslint-disable @typescript-eslint/no-require-imports -- Read-only generated HTML/link audit. */
const fs = require("node:fs");
const base = process.argv[2] || "http://localhost:3110";
const output = process.argv[3];
const walk = (node, test) => [...(test(node) ? [node] : []), ...(node.childNodes || []).flatMap(child => walk(child, test))];
const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
const norm = path => decodeURIComponent(path).replace(/\/$/, "") || "/";
(async () => {
  const { parse } = await import("parse5");
  const response = await fetch(base + "/sitemap.xml");
  if (response.status !== 200) throw Error("Sitemap unavailable");
  const xml = await response.text();
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), m => m[1].replace(/&amp;/g, "&"));
  const pages = [], targets = new Set(), edges = new Map();
  let mixedContent = 0, images = 0, missingAlt = 0;
  for (const url of urls) {
    const route = new URL(url).pathname, response = await fetch(base + route), html = await response.text(), tree = parse(html);
    const internal = [];
    for (const a of walk(tree, n => n.tagName === "a")) {
      const href = attr(a, "href");
      if (!href) continue;
      let target;
      try { target = new URL(href, url); } catch { continue; }
      if (target.origin === new URL(url).origin) { const p = norm(target.pathname); internal.push(p); targets.add(p); }
    }
    edges.set(norm(route), internal);
    for (const n of walk(tree, n => ["img", "script", "link"].includes(n.tagName))) {
      const src = attr(n, "src") || (["stylesheet", "preload"].includes(attr(n, "rel")) ? attr(n, "href") : "");
      if (src?.startsWith("http://")) mixedContent++;
      if (n.tagName === "img") { images++; if (attr(n, "alt") === undefined) missingAlt++; }
    }
    pages.push({ route: norm(route), status: response.status, internalLinks: internal.length });
  }
  const reachable = new Set(["/ar", "/en"]), queue = [...reachable];
  while (queue.length) for (const target of edges.get(queue.shift()) || []) if (!reachable.has(target)) { reachable.add(target); queue.push(target); }
  const orphans = pages.filter(p => !reachable.has(p.route)).map(p => p.route);
  const known = new Set(pages.map(p => p.route)), extraTargets = [];
  for (const route of targets) if (!known.has(route)) {
    const response = await fetch(base + encodeURI(route), { redirect: "manual" });
    extraTargets.push({ route, status: response.status, location: response.headers.get("location") });
  }
  const report = { checkedAt: new Date().toISOString(), base, pages: pages.length, orphanPages: orphans, brokenTargets: extraTargets.filter(p => p.status >= 400), extraTargets, mixedContent, images, missingAlt };
  if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
  if (orphans.length || report.brokenTargets.length || mixedContent || missingAlt) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
