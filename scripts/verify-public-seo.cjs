/* eslint-disable @typescript-eslint/no-require-imports -- Standalone read-only HTML audit. */
const fs = require("node:fs"), assert = require("node:assert/strict");
let parse;
const base = process.argv[2] || "http://localhost:3110";
const output = process.argv[3];
function nodes(root, predicate) { const result = []; function visit(node) { if (predicate(node)) result.push(node); for (const child of node.childNodes || []) visit(child); } visit(root); return result; }
function attr(node, key) { return node.attrs?.find(a => a.name === key)?.value; }
function text(node) { return node.nodeName === "#text" ? node.value : (node.childNodes || []).map(text).join(""); }
(async () => {
 ({ parse } = await import("parse5"));
 const response = await fetch(base + "/sitemap.xml");
 assert.equal(response.status, 200, "Sitemap requires a configured database");
 const xml = await response.text();
 const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), match => match[1].replace(/&amp;/g, "&"));
 assert(urls.length > 0); assert.equal(new Set(urls).size, urls.length);
 const results = []; let cursor = 0;
 async function worker() {
  while (cursor < urls.length) {
   const url = urls[cursor++], route = new URL(url).pathname;
   const response = await fetch(base + route);
   const html = await response.text(), document = parse(html);
   const links = nodes(document, n => n.tagName === "link");
   const canonical = links.filter(n => attr(n, "rel") === "canonical");
   const alternates = links.filter(n => attr(n, "rel") === "alternate" && attr(n, "hreflang"));
   const title = text(nodes(document, n => n.tagName === "title")[0] || {});
   const description = attr(nodes(document, n => n.tagName === "meta" && attr(n, "name") === "description")[0] || {}, "content");
   const h1s = nodes(document, n => n.tagName === "h1");
   const locale = route.startsWith("/en") ? "en" : "ar";
   const language = attr(nodes(document, n => n.tagName === "html")[0], "lang");
   const scripts = nodes(document, n => n.tagName === "script" && attr(n, "type") === "application/ld+json");
   const graphs = scripts.flatMap(script => { const object = JSON.parse(text(script)); assert.equal(object["@context"], "https://schema.org"); return object["@graph"]; });
   const phones = /\/(cars(?:\/.*)?|fast-track|hotels|hotel-apartments|flights|stays|cairo-airport-transfer|sphinx-airport-transfer)$/.test(route) ? nodes(document, n => n.tagName === "input" && attr(n, "name") === "phone") : [];
   assert.equal(response.status, 200, route); assert.equal(response.redirected, false, route + " redirect-only URL"); assert(title && description, route + " metadata");
   const meta = (key, property = "property") => attr(nodes(document, n => n.tagName === "meta" && attr(n, property) === key)[0] || {}, "content");
   assert(!/noindex/i.test(meta("robots", "name") || ""), route + " sitemap must exclude noindex");
   assert.equal(meta("og:url"), url); assert.equal(meta("og:title"), title); assert.equal(meta("og:description"), description); assert.equal(meta("og:locale"), locale === "ar" ? "ar_EG" : "en_US");
   const expectedAlternates = { "ar-EG": url.replace(/\/(ar|en)(?=\/|$)/, "/ar"), en: url.replace(/\/(ar|en)(?=\/|$)/, "/en"), "x-default": url.replace(/\/(ar|en)(?=\/|$)/, "/ar") };
   if (!urls.includes(expectedAlternates.en)) delete expectedAlternates.en;
   for (const link of alternates) assert.equal(attr(link, "href"), expectedAlternates[attr(link, "hreflang")]);
   assert.equal(canonical.length, 1, route + " canonical count"); assert.equal(attr(canonical[0], "href"), url);
   assert.equal(alternates.length, Object.keys(expectedAlternates).length, route + " indexable hreflang"); assert.equal(language, locale);
   assert.equal(h1s.length, 1, route + " H1");
   assert.equal(h1s.every(h => text(h).trim()), true);
   for (const phone of phones) { assert.notEqual(attr(phone, "required"), undefined); assert.equal(attr(phone, "type"), "tel"); assert.equal(attr(phone, "minlength"), "7"); }
   const footer = nodes(document, n => n.tagName === "footer")[0];
   assert(footer, route + " footer");
   const footerLinks = nodes(footer, n => n.tagName === "a").map(n => attr(n, "href"));
   const category = "/" + locale + "/airports";
   assert.equal(footerLinks.filter(href => href === category).length, 1, route + " airport category");
   assert(footerLinks.indexOf("/" + locale + "/cars") < footerLinks.indexOf(category));
   assert(footerLinks.indexOf(category) < footerLinks.indexOf("/" + locale + "/fast-track"));
   assert(!footerLinks.includes("/" + locale + "/cairo-airport-transfer"));
   assert(!footerLinks.includes("/" + locale + "/sphinx-airport-transfer"));
   if (/\/(cairo|sphinx)-airport-transfer$/.test(route)) {
    const nav = nodes(document, n => n.tagName === "nav" && ["Breadcrumbs", "مسار الصفحة"].includes(attr(n, "aria-label")))[0];
    const parents = nodes(nav, n => n.tagName === "a").map(n => attr(n, "href"));
    assert.deepEqual(parents, ["/" + locale, category]);
    const breadcrumb = graphs.find(n => n["@type"] === "BreadcrumbList");
    assert.equal(breadcrumb.itemListElement[1].item, "https://www.limo-egypt.com" + category);
   }
   const needsSchema = /^\/(?:ar|en)(?:$|\/(?:cars(?:\/|$)|blog\/|fast-track$|hotels$|hotel-apartments$|flights$|airports$|cairo-airport-transfer$|sphinx-airport-transfer$))/.test(route);
   if (needsSchema) assert(graphs.length > 0, route + " schema");
   results.push({ route, status: response.status, title, description, canonical: url, hreflangCount: alternates.length, h1Count: h1s.length, schemaTypes: graphs.map(n => n["@type"]), requiredPhones: phones.length, bytes: Buffer.byteLength(html) });
  }
 }
 await Promise.all(Array.from({ length: 4 }, worker));
 assert.equal(new Set(results.map(x => x.title)).size, results.length, "Unique titles");
 assert.equal(new Set(results.map(x => x.description)).size, results.length, "Unique descriptions");
 const excludedTranslations = [];
 for (const url of urls.filter(url => new URL(url).pathname.startsWith("/ar/blog/"))) {
  const englishUrl = url.replace("/ar/blog/", "/en/blog/");
  if (urls.includes(englishUrl)) continue;
  const response = await fetch(base + new URL(englishUrl).pathname), tree = parse(await response.text());
  const robots = attr(nodes(tree, n => n.tagName === "meta" && attr(n, "name") === "robots")[0] || {}, "content") || "";
  assert.equal(response.status, 200); assert(/noindex/.test(robots));
  assert.equal(nodes(tree, n => n.tagName === "link" && attr(n, "hreflang") === "en").length, 0);
  assert(text(tree).includes("English version of this guide is being prepared"));
  excludedTranslations.push({ url: englishUrl, status: response.status, robots });
 }
 const report = { excludedTranslations, checkedAt: new Date().toISOString(), base, count: results.length, schemaPages: results.filter(x => x.schemaTypes.length).length, results: results.sort((a,b) => a.route.localeCompare(b.route)) };
 if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2));
 console.log("PASS: " + results.length + " generated HTML pages; unique titles/descriptions, canonical, indexable language alternates, language, one H1, required phone fields; " + report.schemaPages + " pages with valid JSON-LD.");
})().catch(error => { console.error(error); process.exitCode = 1; });
