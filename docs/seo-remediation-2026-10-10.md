# Limo Egypt — SEO remediation and validation
Audit and implementation date: 10 October 2026. Repository: G:/mahmoud/LimoMasr. Baseline commit: 53ed792. Scope: repository implementation and local production-build validation; these changes have not been pushed or deployed.

## A. Executive summary

Implemented bilingual metadata coverage, typed JSON-LD, safe server-rendered article normalization and table of contents, responsive image improvements, reduced article payloads, and Cairo/Sphinx airport transport landing pages. Preserved all five booking services, the existing design, required phone validation, and Google tracking identifiers and loading strategy.

The final production build succeeds without an import-time MONGODB_URI crash. A valid production database connection is still required for live bookings and the database-backed sitemap. No production database was connected or modified. Tests used mocks and a read-only snapshot extracted from the public website.

68 generated bilingual pages passed unique title/description, canonical, hreflang, language and single-H1 checks. 56 pages contained syntactically valid JSON-LD. Ten real browser booking forms rejected a country code alone; selecting nationality left the phone empty. Successful booking tracking requires a saved booking, HTTP 201 and a nonempty booking ID.

Performance improved modestly on mobile; the 85+ score, 2.5-second LCP and 200-ms TBT targets have not been reached. Repository-wide lint still has existing failures. External account validation, editorial content decisions and post-deployment validation remain outstanding.

## B. Changes implemented

| Files | Problem and implemented solution | Validation |
| --- | --- | --- |
| lib/mongodb.ts | An eager database connection threw during route imports. Connect on demand, cache successful connections, clear failures and allow retry; preserve database name and runtime missing-URI errors. | Missing URI/import, cache and retry tests; production build passes without URI. |
| lib/seo.ts; app/stays/page.tsx; app/privacy/page.tsx; app/policies/page.tsx | Extend the existing bilingual metadata registry to stays, legal pages and the two confirmed airports. Existing sitemap automatically includes registry additions. | 28 static metadata variants; generated HTML audit covers all 68 URLs. |
| lib/sanitize.ts; app/blog/[slug]/page.tsx; components/ArticleClient.tsx | Stored rich-text HTML included inappropriate H1s and prose headings. Parse with parse5, allowlist tags/attributes and URL schemes, remove unsafe/empty content, demote article H1 to H2, convert prose headings to paragraphs, and generate deterministic heading IDs/TOC on the server. No database migration. | Parser, XSS, RTL/LTR content, preservation, ID/idempotence tests; article HTML has one primary H1; browser checks show no hydration exceptions. |
| app/blog/page.tsx; components/ArticleClient.tsx; components/ArticlesCarousel.tsx | Arabic React navigation used unprefixed URLs and raw slugs. Use explicit localized URLs and encoded article slugs; retain related-service links. | Build, generated URLs, bilingual blog/browser navigation checks. |
| lib/structured-data.ts; components/JsonLd.tsx; app/page.tsx; app/cars/[slug]/page.tsx; app/blog/[slug]/page.tsx; components/ServiceBookingGuide.tsx | Add typed Organization/WebSite, Service, BlogPosting and BreadcrumbList output with safe JSON serialization. Vehicle bookings use Service rather than a vehicle-sale Product. | TypeScript; type/date/escaping fixtures; JSON parsing and required graphs on 56 pages. External Google/Schema.org validation remains manual. |
| lib/airport-services.ts; components/AirportTransferPage.tsx; app/cairo-airport-transfer/page.tsx; app/sphinx-airport-transfer/page.tsx; components/PublicLayout.tsx; components/ServiceBookingGuide.tsx | Add Arabic/English CAI and SPX pickup/drop-off pages, reusable registry/template, visible breadcrumbs, related services, footer links and the shared required-phone booking form. | Both languages return 200 with unique metadata, canonical, hreflang, H1 and Service/breadcrumb schema; form rendered; CAI nationality check passed. |
| app/fast-track/FastTrackClient.tsx; app/cars/[slug]/page.tsx; app/layout.tsx | Optimize remaining raw service/vehicle images using the existing ResponsiveImage component; provide appropriate sizes and loading priority. Avoid preloading the Outfit font used below the initial viewport. Make Fast Track card selection keyboard accessible. | Build, strict lint, rendered pages and Lighthouse. Remaining image savings are not claimed eliminated. |
| lib/article-preview.ts; components/ArticlesSection.tsx; components/ArticlesCarousel.tsx; app/blog/[slug]/page.tsx | Carousel/related-card props carried entire article bodies. Send only previews; preserve complete content on article detail pages. Clean up carousel timers/listeners. | Preview payload tests, full article and carousel rendering, browser and build checks. |
| components/BookingForm.tsx | Lazy-load location/nationality modals only when opened. Add a synchronous submission lock. Require HTTP 201 and a returned booking ID before success UI, WhatsApp opening or booking conversion. Preserve required-phone and server validation. | Existing phone suite, new tracking-handler suite, ten browser forms and nationality modal. |
| lib/tracking-links.ts; components/GoogleAdsEvents.tsx | Recognize real WhatsApp hosts/protocols and tel links; delegated nested-link clicks work through client navigation. Check admin exclusion on each click rather than only at mount. | URL/admin/queue fixtures; browser WhatsApp/phone spies emit one custom event and one corresponding Ads conversion per link click. |
| package.json; package-lock.json; scripts/verify-seo-remediation.cjs; scripts/verify-booking-tracking.cjs; scripts/verify-public-seo.cjs | Add parse5 for actual HTML parsing and repeatable SEO, booking-event and read-only generated-HTML checks. | npm run verify:seo and local HTML audit pass; new scripts pass lint. |

Rendering normalization intentionally changes unsafe or unsuitable markup, not stored article text. The prose heuristic needs editorial review for unusually long legitimate headings. Existing H4–H6 and section meaning are preserved rather than guessed. Arabic human-readable publication dates and missing authors are not fabricated into machine-readable dates/authors. A malformed existing data/articles.json has valid content followed by trailing data; it was left untouched to avoid losing articles. Recover it only from an owner-approved complete export if offline fallback is required.

A provider-loading experiment was removed because it did not produce a reliable mobile improvement. The final change keeps the established query/toast providers and tracking loading behavior.

## C. SEO completion matrix

“Completed” below means verified in the local generated output, unless explicitly stated otherwise. It does not mean deployed, indexed or approved in an external account.

| # | Client-plan item | Status | Evidence or remaining work |
| --- | --- | --- | --- |
| 1 | Google Search Console | Requires account access | Inspect current ownership, indexing, coverage and sitemap submissions. |
| 2 | Google Analytics 4 | Requires account access | Code/loader/events verified locally; receipt, key events and attribution need account checks. |
| 3 | XML sitemap | Completed | Read-only fixture generates 68 unique canonical bilingual URLs with alternates; DB failure must not publish an incomplete sitemap. |
| 4 | Robots.txt | Completed | HTTP 200, public crawl allowed, API excluded and correct sitemap URL. Login/account/admin HTML carries noindex, nofollow. |
| 5 | HTTPS and redirects | Partially completed | Public HTTPS site observed; verify HTTP, non-www and legacy URL redirects after deployment. |
| 6 | Keyword-to-page mapping | Partially completed | Service/airport metadata assigned; volume, commercial intent and owner-approved content expansion remain. |
| 7 | Service landing pages | Partially completed | All five services retain localized metadata, booking and guides; richer factual content needs business input. |
| 8 | Individual vehicle pages | Completed | 14 vehicles / 28 language URLs tested, with metadata, H1, Service and breadcrumbs. |
| 9 | City/airport landing pages | Partially completed | CAI/SPX transport only implemented. Hurghada/Sharm airport claims require confirmation; wider city content remains. |
| 10 | Primary H1 and semantics | Completed | Exactly one nonempty H1 across 68 tested URLs, including six bilingual articles. |
| 11 | Titles and descriptions | Completed | All 68 titles and descriptions are unique in the public snapshot. Future catalogue entries must remain unique. |
| 12 | Arabic/English, canonical, hreflang | Completed | Language, explicit canonical and ar-EG/en/x-default alternates checked across 68 pages. |
| 13 | Image delivery and alt text | Partially completed | Additional responsive images implemented; decorative alt kept empty; compression/size opportunities remain. |
| 14 | Mobile speed and Core Web Vitals | Partially completed | Actual lab comparison below; targets not reached. Field data is a separate rolling measurement. |
| 15 | Google Business Profile | Requires account access | Verify ownership, real address/service areas and complete business details. |
| 16 | Customer reviews | Requires business information | Obtain real customer reviews and permission to publish; no invented ratings/reviews added. |
| 17 | Structured data | Partially completed | Typed, escaped and parsed graphs on 56 pages; external validator and editorial date/author checks remain. |
| 18 | Blog | Partially completed | Six bilingual articles preserved and normalized; editorial review and new commercial content remain. |
| 19 | Internal links | Partially completed | Localized article/service/airport links improved; full content link review and expansion remain. |
| 20 | Backlinks and monitoring | Not started | External outreach/authority campaign not executed; account/tool access needed for monitoring. |

Initial keyword mapping: car/limousine booking → /cars and genuine vehicle pages; hotel booking → /hotels; serviced apartments → /hotel-apartments; Fast Track → /fast-track; flight enquiries → /flights; CAI pickup/drop-off → /cairo-airport-transfer; SPX pickup/drop-off → /sphinx-airport-transfer. This is intent mapping, not a claim about rankings or search volume.

The airport pages do not promise airport-specific Fast Track, meet-and-greet signs, waiting times, flight tracking, guarantees or invented prices. Reuse the template for another airport only after confirmation and enough distinct useful information.

## D. Performance comparison

| Device/version | Score | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile before | 61 | 1.917 s | 4.061 s | 848.0 ms | 0.000000 |
| Mobile after | 69 | 1.644 s | 3.781 s | 809.0 ms | 0.000000 |
| Desktop before | 94 | 0.445 s | 0.905 s | 146.0 ms | 0.000036 |
| Desktop after | 94 | 0.472 s | 0.822 s | 158.0 ms | 0.000040 |

Measurements use Lighthouse 13.5.0, installed Edge, production Next.js builds, identical public catalogue snapshots and the existing Google Ads/GA4 configuration. Each device's first run was warm-up and excluded. Mobile figures are medians of three complete non-warm-up runs; desktop figures are one complete non-warm-up run per version and should not be treated as statistically established improvements.

Baseline is commit 53ed792 with only the lazy database import adjustment needed to build it. The same read-only fixture, including 14 cars, six articles and seven hero images, was supplied to both versions. Partial site settings were reconstructed from public content; this is not a production database benchmark. Browser cache was cold per run and server/image caches were warmed. All reported runs had no failed HTTP resource requests. One final mobile attempt with a failed Google request was excluded and replaced; an earlier experiment with a failed Google Tag Manager request was also excluded. No Google tag was removed, delayed or blocked for score.

The mobile score is below 85, LCP remains above 2.5 seconds and TBT remains above 200 ms. Desktop TBT has some regression/measurement variation; the overall score is unchanged. Improvements in images alone cannot resolve all render/hydration/script delay. Next work should profile the final production build on a stable host, inspect main-thread work and critical CSS/font rendering, and review remaining image sizes/compression. Keep tracking active while evaluating each change.

These results do not replace PageSpeed production measurements or 28-day CrUX field data, and do not prove an SEO ranking improvement. Original full Lighthouse artifacts are in the local temporary folder under limo-valid-before-* and limo-valid-after-release-*; compact metrics are saved with this report.

## E. Tracking verification

- GA4: G-MSXWFZ24ES supplied during QA; the production environment variable must be checked in Vercel. One application loader configures the existing Ads property and optionally GA4. Loading remains afterInteractive.
- Google Ads: AW-18470016597 and the existing booking, WhatsApp and phone labels are unchanged; lib/gtag.ts was not edited.
- WhatsApp/tel links: nested-anchor clicks verified with a local gtag spy; genuine contact hosts are recognized, spoofed hosts excluded, and admin click conversions suppressed.
- Booking success: all five service types exercise real handlers with mocked I/O. HTTP failure, invalid phone, HTTP 200 or 201 without a booking ID cannot emit success events. HTTP 201 plus an ID emits booking_submit_success and its existing Ads conversion.
- WhatsApp booking: a confirmed save emits booking success and then the existing WhatsApp action before opening WhatsApp. Failed saving never opens it. Distinct booking/contact actions can represent one lead: review primary/secondary Ads conversions rather than deleting working events.
- Duplicate clicks/submits: listener cleanup and the submission ref lock are tested. GA4 enhanced form measurement, imported Ads conversions, multiple account tags and SPA page_view duplication require account-level checks. No additional manual page_view sender was introduced.
- Functional verification did not send fake Google conversions or save real bookings. Normal page-view/tag resource requests during performance tests were allowed. Some browser-navigation requests were aborted when changing pages; this is not presented as proof of account ingestion.

## F. Remaining manual actions

1. Search Console: verify ownership, submit sitemap after deployment, inspect representative Arabic/English service, vehicle, blog and airport URLs, and review canonical/indexing reports.
2. Analytics/Ads: use DebugView, Realtime and Tag Assistant on the deployed version; verify page views through client navigation, actual phone/WhatsApp events, confirmed-booking conversion receipts and primary/secondary attribution settings.
3. Business Profile: owner access, verified business details, service area and real reviews. Publish only authentic feedback with consent.
4. Business owner: confirm any future airport-specific services and reception details; supply factual service copy, valid publication dates and actual authors where applicable.
5. Editorial: review normalized long headings, existing CMS internal links and translations. Repair offline article fallback only from a complete approved export.
6. Outreach: obtain relevant genuine backlinks and monitor qualified leads rather than visits alone.
7. Engineering: address existing lint debt separately and continue measured mobile optimization. No removal of Ads/GA4 to achieve a benchmark.

Service schema is not a promise of Google rich-result eligibility. Validate deployed representative pages with Schema.org Validator and Google Rich Results Test. See [Schema.org Service](https://schema.org/Service) and [Google Article documentation](https://developers.google.com/search/docs/appearance/structured-data/article) for supported semantics and recommended article fields.

## G. Testing results

| Check | Actual result |
| --- | --- |
| TypeScript | Final production build TypeScript phase passed; standalone no-emit check also passed earlier. |
| Production build | Exit 0; no import-time MongoDB crash. Existing fallback reads log missing-URI warnings locally. Runtime data still requires valid configuration. |
| Full repository lint | 172 errors / 123 warnings, compared with baseline 177 / 127. Full lint is not green. BookingForm retains its baseline 7 errors / 7 warnings. |
| Targeted strict lint | 0 errors / 0 warnings across changed SEO/render/data files and new scripts; BookingForm is excluded from this clean subset because of its documented baseline violations. |
| Metadata tests | 28 service metadata variants passed. |
| Remediation tests | Parser/XSS/prose/heading IDs, schema escaping/date/types, preview payload, tracking queues/URLs/admin exclusions, lazy Mongo/retry and 68 sitemap entries passed. |
| Phone regression tests | 170 invalid requests rejected, ten valid requests accepted, ten rendered forms checked; persistence/admin/customer guards, malformed-body handling and rate limiting passed with mocked I/O. |
| Booking-event tests | 25 invalid/failure cases across five types; confirmed success, WhatsApp flow and concurrent submission lock passed. |
| Generated HTML | 68 URLs passed title/description uniqueness, canonical, three alternates, language, one H1 and required booking phone checks; 56 pages contained parsed JSON-LD. |
| Browser checks | Ten Arabic/English service forms reject +971 alone and accept a complete test number; zero booking POSTs and zero runtime/hydration exceptions. Nine additional modal/navigation/account/blog checks passed. |
| Robots/indexing directives | Public robots.txt HTTP 200; admin/login/register/my-bookings noindex,nofollow; airport pages not noindexed. |
| Performance | Real before/after measurements in D; targets not reached. |
| External validators/accounts | Not executed against these unpublished changes; remain manual. |

Repeat automated checks from the repository using npm run verify:seo, npm run build, and npm run verify:seo:html -- http://localhost:3000. The HTML audit requires a correctly configured read-only catalogue/database and will fail if the sitemap cannot be generated. Browser success/API tests use mocks; these checks do not establish production database persistence or actual customer delivery.

## H. Files modified or created

- app/blog/[slug]/page.tsx
- app/blog/page.tsx
- app/cairo-airport-transfer/page.tsx
- app/cars/[slug]/page.tsx
- app/fast-track/FastTrackClient.tsx
- app/layout.tsx
- app/page.tsx
- app/policies/page.tsx
- app/privacy/page.tsx
- app/sphinx-airport-transfer/page.tsx
- app/stays/page.tsx
- components/AirportTransferPage.tsx
- components/ArticleClient.tsx
- components/ArticlesCarousel.tsx
- components/ArticlesSection.tsx
- components/BookingForm.tsx
- components/GoogleAdsEvents.tsx
- components/JsonLd.tsx
- components/PublicLayout.tsx
- components/ServiceBookingGuide.tsx
- docs/seo-remediation-2026-10-10.md
- docs/seo-remediation-validation-2026-10-10.json
- lib/airport-services.ts
- lib/article-preview.ts
- lib/mongodb.ts
- lib/sanitize.ts
- lib/seo.ts
- lib/structured-data.ts
- lib/tracking-links.ts
- package-lock.json
- package.json
- scripts/verify-booking-tracking.cjs
- scripts/verify-public-seo.cjs
- scripts/verify-seo-remediation.cjs

The existing dirty middleware_debug.log was preserved and is not part of this implementation. Existing phone/API safeguards, sitemap/robots logic, shared responsive-image utility and gtag constants were validated but not rewritten. No credential values, database migrations, fake testimonials or production booking records were added.

## I. Deployment notes

1. Review the diff and this report. Preserve unrelated local work and keep a backup of real data. Do not include middleware_debug.log in the change.
2. Configure existing Vercel environment names, especially MONGODB_URI, NEXT_PUBLIC_GA4_ID and GOOGLE_SITE_VERIFICATION where used. Keep actual values in the environment manager. The lazy connection fix does not provision a database.
3. Run npm ci, npm run verify:seo and npm run build. Full lint remains a documented pre-existing failure; do not present it as passing.
4. Create a preview deployment manually. Confirm its environment/database before interacting with booking forms. Do not submit real test bookings or seed/migrate production data without the owner's authorization.
5. On preview, verify all five services in both languages, the two airport pages, nationality/modal behavior, blank/country-code-only/full phone handling, failed/successful booking responses, client navigation and actual catalogue display. Do not auto-fill a phone from nationality.
6. Check canonical/hreflang point to the intended www.limo-egypt.com production URLs. Run node scripts/verify-public-seo.cjs against an accessible preview or production base URL; Vercel deployment protection may require access first.
7. Publish manually only after review. Recheck /robots.txt and /sitemap.xml, actual redirects, representative rich results/schema, conversion receipt and page views. Submit the sitemap and inspect URLs in Search Console.
8. Run PageSpeed mobile/desktop several times on the same deployed version with complete Google resources. Compare medians and monitor field data over its rolling window. Keep the performance task open until targets are measured.
9. If a regression appears, revert the reviewed deployment using Vercel's deployment controls. There are no database migrations to roll back in this change.

No automatic deployment, commit, push, Search Console submission or external account write was performed.
