# Limo Egypt — 20-point SEO completion, 11 October 2026

Repository: G:/mahmoud/LimoMasr. Next.js / eslint-config-next 16.4.0 retained. Scope: local implementation and read-only public checks. No commit, push, deployment, production data/configuration mutation or Google account change.

## Counting rules and baseline discrepancies
The original plan is reconstructed from the client's 20-row audit, docs/seo-roadmap.md, docs/service-content-review.md, the October 10 remediation report and both October 11 readiness reports. This is not a new 20-phase plan.

The October 10 matrix actually contains **six completed local items, nine partial items and five account/business/not-started items**. An 8/9/3 estimate cannot be reproduced from those classifications. Counting historical Search Console and GA4 screenshots as complete could make eight, but would hide current account verification requirements; that still does not justify calling every remaining item locally implementable.

Earlier service-content-review.md records verified Search Console ownership, an accepted 58-URL sitemap and observed GA4 visits/WhatsApp/phone events. Those are historical positive evidence, not “never implemented”. They do not establish current indexing, new 67-URL catalogue submission, booking-success receipt or duplicate-free SPA measurement.

“Completed locally” means the current code and generated fixture output meet a bounded technical criterion; it does not mean deployed or indexed. Airport completion is limited to confirmed CAI/SPX transport. No unknown airport/city service is counted as delivered.

## Original plan: before and after
| # | Original item | Before (Oct 10) | Current classification | Evidence / exact remaining action |
|---|---|---|---|---|
| 1 | Google Search Console | Requires account | Requires external account | Historical ownership/sitemap acceptance recorded. Current ownership, URL Inspection and indexing need manual checks after deployment. |
| 2 | Google Analytics 4 | Requires account | Requires external account | Existing loader, contact events and persistence-gated booking sender tested. Current SPA page views, ingestion, key events and Ads attribution need account validation. |
| 3 | XML sitemap | Completed locally | Completed locally; requires deployment | Database-backed, unique canonical entries. Excludes unavailable/placeholder English articles; no partial sitemap on DB failure. |
| 4 | Robots and noindex | Completed locally | Completed locally; requires deployment | Public crawl, private noindex and incomplete-English noindex policy validated. Authorization remains independent of robots. |
| 5 | HTTPS / redirects | Partial | Verified on current live host | HTTP www and HTTPS apex redirect to HTTPS www; apex HTTP uses two hops. Locale-free URLs redirect; no observed loop. Host configuration unchanged. |
| 6 | Keyword distribution | Partial | Completed locally | 44 bilingual intent/page mappings, including 14 real fixture vehicles; primary category, airport and vehicle intent separated. No volume/difficulty invented. |
| 7 | Five service landing pages | Partial | Partially completed | Bilingual preparation, booking steps, enquiry/confirmation distinction, FAQs, contact and cross-service links implemented. Supplier-specific inclusions/terms still require owner facts. |
| 8 | Independent vehicle pages | Completed locally | Completed locally; requires deployment | Existing 14 cars /28 language URLs retain unique metadata, one H1, Service/breadcrumbs and booking safeguards. |
| 9 | Airport / city pages | Partial | Completed locally for confirmed scope; requires deployment | CAI/SPX pickup/drop-off pages have distinct request guidance, FAQs and reciprocal links. Further airport/city briefs remain unpublished pending confirmation. Both live airport URLs still 404. |
| 10 | Main H1 | Completed locally | Completed locally; requires deployment | One meaningful H1 for every indexable generated page; article prose headings normalized without changing stored content. |
| 11 | Titles / descriptions | Completed locally | Completed locally; requires deployment | Unique generated titles/descriptions; incomplete EN remains accessible with noindex and a clear notice. |
| 12 | Arabic / English + hreflang | Completed locally | Completed locally; requires deployment | Canonical and reciprocal alternates reflect only indexable translations; RTL/LTR retained. No hreflang advertises an unavailable EN article as indexable. |
| 13 | Image SEO / delivery | Partial | Partially completed | Responsive delivery, appropriate alt, bounded hero source/quality, reserved containers and below-fold lazy images checked. Compression/size opportunities and live cold-CDN checks remain. |
| 14 | Mobile speed / CWV | Partial | Partially completed | Repeated local Lighthouse results below; targets are acceptance goals, not claimed successes. Field CWV requires deployment and rolling real-user data. |
| 15 | Google Business Profile | Requires account | Requires external account | Verify ownership, real business details, service area and approved hours/photos. |
| 16 | Genuine customer reviews | Requires business | Requires business confirmation | No invented testimonials/ratings. Obtain actual feedback and consent, then publish approved reviews. |
| 17 | Structured data | Partial | Completed locally; requires deployment / live validator | Typed escaped Organization/WebSite/Service/BlogPosting/BreadcrumbList parsed in generated output; no invented author/date/reviews. External validation still required after release. |
| 18 | Blog | Partial | Partially completed | Existing AR/EN render, headings, metadata, links and recommendations improved. One EN placeholder now excluded from indexing; complete translation/editorial review required. |
| 19 | Internal links | Partial | Completed locally; requires deployment | Crawl/reachability and broken-target audit, localized legacy article links, descriptive anchors, contextual service links and related-category recommendations. Recheck each new catalogue entry. |
| 20 | Backlinks / monitoring | Not started | Not started; requires external action | Real outreach, Search Console/Analytics monitoring and qualified lead reporting remain manual. |

**Verified count: 10 locally completed technical items + 1 live HTTPS/redirect item = 11/20 within the confirmed scope.** Four partial items (#7,#13,#14,#18) and five account/business/outreach items remain. This is not 11 newly deployed items and is not a 17/20 claim.

## Nine original partial items: work performed
- #5: read-only HTTP/HTTPS, apex/www and locale redirect chains checked. Candidate /ar/apartments is 404; this is not proof it was a historical URL. Actual /ar/hotel-apartments is 200. Obtain real obsolete URLs before adding permanent mappings.
- #6: delivered CSV with intent, primary/supporting terms, URL, title/H1 suggestions and factual gaps. Homepage stays broad; airport-specific intent belongs to dedicated pages; vehicle models belong to their actual detail pages.
- #7: improved all five shared booking guides with guest booking steps, saved-enquiry distinction and existing-booking contact guidance. Existing forms/layout remain operational.
- #9: added airport-specific guidance/FAQs and reciprocal links. No airport-specific Fast Track, signs, waiting times, flight monitoring, prices or guarantees added.
- #13: hero input is Cloudinary-limited to 1920px before Next optimization, quality60 explicitly allowed alongside75. Other source hosts/signed URLs preserve fallback behavior. Recommended-article images now declare sizes. No assets replaced and no guessed intrinsic image dimensions added: existing fixed-size/fill containers reserve layout.
- #14: profiled script/layout work and added content-visibility:auto to five offscreen homepage carousel wrappers, preserving SSR links, content and controls. Print renders normally. Hero transition specifies opacity/transform. Google scripts, loading strategy and event identifiers remain.
- #17: retained safe graph semantics and removed unsupported visible verified-author/editorial attribution. No BlogPosting schema is emitted for the incomplete English article.
- #18: related-category ranking, localized category/read time, descriptive reading anchors, server-rendered service planning links. Found a 42-character English placeholder for guide-sharm-hurghada versus its full Arabic body. Added generic missing/placeholder-English publication checks: noindex,follow, clear notice and Arabic link; omit from sitemap/hreflang. Stored content was not edited.
- #19: audited indexable sitemap pages and their internal links; unprefixed known-service article links now use the current locale, preserving queries/fragments, explicit-language links and external links.

## Measurement and tracking
One gtag loader configures the preserved Ads property and optional GA4 setting. No second manual page_view implementation was added. Google history-based enhanced measurement is an account setting, so local History API navigation alone cannot establish receipt or eliminate account-side duplication.

Contact click spies, queued tracking, listener cleanup/admin exclusions and successful/failed/concurrent booking regression cases ran locally with mocked I/O. A saved booking plus a WhatsApp action can emit distinct booking and contact conversions; primary/secondary Ads treatment needs owner/account review. There were no fake production conversions.

See seo-live-validation-checklist.md for exact DebugView/Tag Assistant/account actions and preserved Ads-label verification. Official guidance: https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications

## Final validation and performance
| Check | Executed result |
|---|---|
| npm run verify:production | PASS: 28 service metadata variants; sanitizer/schema/localized-link/publication/sitemap regressions; 170 invalid and10 valid booking requests;55 failure/invalid-phone tracking cases;26 customer self-service denials with zero I/O; signed sessions,17 retired handlers,40 admin guards and Mongo retry/concurrency safeguards. All mutation/notification tests mocked. |
| npm run build | PASS on Next16.4.0, including TypeScript and64 build routes. Catalogue URL count is separate. Missing local DB fallback warnings remain; this does not validate a real connection. |
| Standalone TypeScript | tsc --noEmit --incremental false: PASS. |
| Targeted lint |15 changed source/scripts including ArticleClient: PASS, zero warnings. Full inherited repository lint was not rerun; latest readiness report remains117 errors/116 warnings. |
| Generated HTML |67 indexable pages, unique metadata, canonical/indexable alternates, locale and one H1;55 pages with parsed JSON-LD. English placeholder separately returns200 with noindex,follow, no English hreflang and preparation notice. |
| Robots/private indexability |robots200 with sitemap declaration;8 bilingual login/register/my-bookings/admin-login pages carry noindex. |
| Internal-link crawl |67 pages, zero unreachable/orphan indexable pages, zero broken internal targets, zero mixed-content assets and zero missing alt attributes among260 rendered img elements. Alt presence does not prove that every CMS description is editorially ideal. |
| Browser booking QA |14 AR/EN service+airport forms: code-only phone rejected, complete test phone accepted; zero booking POSTs and zero hydration/runtime exceptions. Contact events captured by local spy; navigation-aborted RSC prefetches recorded separately. |
| Responsive/browser accessibility |60 cases at390/768/1440px in both languages; zero horizontal overflow. Nationality/destination dialogs: initial focus, Tab wrap, Escape and focus restoration pass. Browser XML parser sees67 URLs and two/three applicable alternates with zero XML errors. |
| SPA/contact duplication |Actual Next Link home→cars navigation retains the same document; one phone_click+conversion per local spied click before/after navigation. No duplicate listener/event and no real conversion call. Account page_view receipt remains unverified. |
| Public redirect checks |13 initial URLs tested read-only: valid HTTP/HTTPS/www/locale chains; two airport pages404 on current live host; sitemap/robots200. Candidate alias is not assumed to be a historical URL. |
| Source image checks |44 unique public catalogue/hero/article sources checked by HEAD:43 returned200, one404. Affected article: cairo-giza-best-places; Cloudinary source rjgu1yaareu56eyj33re.png. Do not replace it without approved asset/owner repair. Three transformed car headers returned200; format negotiation included WebP and JPEG, not guaranteed AVIF. |
| Hero delivery |14 optimized image requests (7 heroes ×750/1920 output widths) returned200 after upstream size limit and quality60. No asset replacement. Warm-cache check does not establish cold live CDN reliability. |
| Whitespace |Changed-file git diff --check: exit0 after removing one introduced trailing space. |

### Lighthouse: repeated comparable local lab tests
| Version/device | Included runs | Score median | FCP | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|
| Current-task baseline, Next16.4/mobile |1,2,3 |68 |1.539s |3.617s |1134.5ms |0 |
| Final build/mobile |1,5,6 |70 |1.530s |3.424s |918.0ms |0 |
| Final build/desktop |1,2,3 |99 |0.392s |0.853s |63.5ms |0 |

Historical reviewed mobile69 is a separate earlier build measurement, not the current-task baseline. The measured score change68→70 is modest; targets85+, LCP≤2.5s and TBT≤200ms remain unmet. This does not prove a production or ranking improvement.

Lighthouse13.5.0, installed Edge, production Next16.4, same public catalogue/settings fixture and existing Ads/GA4 loading configuration. Chrome cache cold per run; server/image cache warm. Final hero derivatives were explicitly warmed because intermediate attempts saw image optimizer504/unfinished requests. This is a warm-server lab comparison, not first-request/CDN validation. The machine is a shared workstation, so variance remains material.

Warm-up run0 excluded per device. Final mobile2/3/4 had unfinished /g/collect analytics fetches at cutoff; excluded under the conservative complete-request comparison rule. These are not proof of failed analytics receipt. Included mobile1/5/6 and desktop1/2/3 contain no HTTP error or unfinished HTTP request under that rule. All attempts remain in temporary Lighthouse artifacts; no result was silently replaced or chosen solely for score. Intermediate experiments are not included as final acceptance results.

The baseline profile showed ~1704ms script evaluation and1412ms style/layout work. Reducing image weight and skipping offscreen paint/layout cannot remove all React hydration or third-party script execution. Continue profiling main-thread tasks, hydration and critical styles/fonts on a controlled staging/host with Google scripts retained. Fonts keep swap behavior; no unmeasured font redesign or artificial tag blocking was applied.

Artifacts: docs/seo-20-point-validation-2026-10-11.json records compact measurements, exclusions, image/redirect findings and current counts. Full local Lighthouse JSON files are under TEMP/limo-seo-baseline-* and TEMP/limo-seo-verified-*. Browser/public HTML reports are under TEMP/limo-seo-completion-*, limo-readiness-browser-results.json and limo-readiness-responsive.json. The browser scripts used CDP9333 and a dedicated QA profile; all booking writes were disabled/mocked.


The QA catalogue is an isolated read-only public snapshot, not production/staging persistence. Real staging does not exist. No production database was used.

## Exact files changed in this request
- components/ServiceBookingGuide.tsx
- components/AirportTransferPage.tsx
- components/ArticleServiceLinks.tsx (new)
- components/ArticleClient.tsx
- components/HeroCarousel.tsx
- app/page.tsx
- app/globals.css
- app/blog/[slug]/page.tsx
- app/sitemap.ts
- lib/airport-services.ts
- lib/article-publication.ts (new)
- lib/sanitize.ts
- next.config.ts
- scripts/verify-seo-links.cjs (new)
- scripts/verify-seo-remediation.cjs
- scripts/verify-public-seo.cjs
- docs/seo-keyword-map.csv (new)
- docs/seo-content-gaps.md (new)
- docs/seo-live-validation-checklist.md (new)
- docs/seo-20-point-completion-2026-10-11.md (new)
- docs/seo-20-point-validation-2026-10-11.json (new)

Earlier security/SEO dirty files belong to prior work. No unrelated middleware log was edited. package.json and package-lock were not changed by this SEO task.

## Production release blockers
The latest no-OTP readiness report remains the source of release gates: historically exposed credential rotation, actual secure runtime configuration, an isolated staging database and real persistence/notification/admin validation, followed by review/approval of the combined diff. OTP is not required. Customer self-service remains disabled; all public booking services remain guest forms. Development advisories and inherited full lint remain documented, without a framework downgrade.

**Production readiness remains NO-GO pending those gates.** SEO implementation completion cannot authorize deployment.

## Prioritized route to 17/20
1. Owner: rotate credentials and provision isolated staging; confirm settings. Engineer: perform actual staging persistence/notification/admin QA and review combined diff. Approval is required for commit/push/deploy/production mutation.
2. Owner/editor: supply actual service inclusions/terms and review content (#7), provide the complete approved English Sharm/Hurghada translation and factual article review (#18).
3. Engineer: finish image delivery/visual validation (#13); profile final mobile JS, hydration and layout on a stable controlled host, retaining Google scripts. Reach measured targets or keep #14 partial.
4. After approved deployment: recheck all generated URLs, redirects, image resources, noindex/hreflang and structured data. Submit current sitemap and verify indexing in Search Console (#1).
5. Account owner: verify GA4 SPA page views and actual event receipt, duplication/key events and Ads primary/secondary attribution (#2).
6. Completing the four partial items plus #1/#2 would move this bounded count from11 to17. GBP (#15), genuine reviews (#16) and backlinks/monitoring (#20) still need real external work; they cannot be invented in code.

No indexing, ranking improvement, real booking delivery or 17/20 outcome is claimed without evidence.
