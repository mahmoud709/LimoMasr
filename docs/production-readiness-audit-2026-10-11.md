> Superseded by [the no-OTP readiness update](production-readiness-no-otp-2026-10-11.md). OTP is optional future work and is not required for this release. Dependency and customer-access findings below describe the earlier build, not the current tree.

# Limo Egypt — Final Production Readiness Audit

Audit date: 2026-10-11. Investigation and local fixes span October 10–11, 2026.
Repository verified: G:/mahmoud/LimoMasr. Branch: main. Baseline HEAD: 53ed7926d0de9cfa274e4c5d48a57ba6e6293791.
The declared E:/limo-masr directory was unavailable; the existing repository was inspected and edits used the required filesystem approvals.

## A. Executive Summary

**The working tree is not ready for production deployment.** The SEO remediation has a functioning foundation, but the audit found security problems outside SEO: credential literals, unsafe maintenance handlers, weak session validation, and access to bookings by an unverified phone number. Safe local fixes are implemented and tested. Remaining dependency, credential rotation, authentication workflow and environment checks are deployment gates.

No commit, push, Vercel deployment, production configuration change, production database mutation, real customer booking or fake Google conversion was performed. MongoDB tests use mocks; browser/runtime tests use a public catalogue snapshot with database writes prohibited. This audit establishes local behavior, not production database health or Google account configuration.

Final production build and focused regression checks pass. The full repository lint **fails** with 125 errors and 118 warnings. Mobile performance remains below the requested targets. Detailed machine-readable summaries accompany this report in production-readiness-validation-2026-10-11.json.

## B. Deployment Decision

**NO-GO.** Before production approval:

1. Upgrade the affected Next.js/dependency tree through a reviewed change and rerun build, security, booking, tracking and SEO QA. No dependency upgrade was performed by this audit.
2. Rotate the MongoDB and Cloudinary credentials previously embedded in source, configure replacements securely and assess exposure/history. Removing literals does not revoke credentials.
3. Configure and verify signing secrets and all required runtime settings in an isolated Preview environment.
4. Implement and test a trusted phone ownership verification or a redesigned booking ownership workflow. Customer booking retrieval/cancellation now intentionally denies accounts without verified ownership.
5. Prove actual persistence, authentication and authorized administration on an approved staging database; accept or replace the disabled maintenance/password-change features.
6. Review and approve the entire combined SEO and audit diff.

Mobile targets, noncritical schema/content work and existing lint debt remain important P2 work; they are not the reason to equate every warning with a P0 blocker.

## C. Findings by Severity

Line references point to current local source; live production behavior has not been changed.

| Severity / status | File and line / evidence | Problem and business impact | Fix or required action | Verification |
|---|---|---|---|---|
| P0, local containment; rotation OPEN | lib/cloudinary.ts:6; retired admin routes; eight maintenance scripts; Git history | Credential literals could authorize database or media-account access. Deleting source literals does not neutralize historical exposure. | Removed literal Mongo credentials from five API handlers/eight scripts and Cloudinary key/secret fallbacks. Owner must rotate MongoDB and Cloudinary credentials and review account activity/history. | Configuration tests reject missing upload credentials before network access; eight scripts syntax-checked only. No credential authentication/rotation attempted. |
| P0, dependency blocker OPEN | package.json:18 and npm audit production evidence | Installed Next 16.2.9 is flagged critical by the dependency audit. Actual exploitability is conditional on feature/runtime/hosting mitigations, which were not established. | Review an upgrade of Next and matching eslint-config-next plus transitive dependency remediation; npm suggested Next 16.4.0. Do not assume a major-version flag of false makes an upgrade risk-free. | Production and full npm audit completed with findings; no exploit attempted. |
| P0, FIXED locally | proxy.ts:47; lib/admin-auth.ts:4; app/admin/layout.tsx:20; maintenance routes | Cookie presence/header/query flags could bypass admin protection; maintenance endpoints could mutate data/files or expose diagnostics. | HMAC-signed, expiring role-specific sessions; server and API authorization; trusted path rewritten internally; 17 maintenance handlers retired with 410. | Forged headers/query/cookies rejected; 40 active admin handler guard checks; 17 retired handler executions with mocked I/O; HTTP redirect/401/410 checks. |
| P0 exposure FIXED; P1 workflow OPEN | app/api/customer/bookings/route.ts:26 | Registering a phone number did not establish ownership before returning all bookings matching it. Customer PII and cancellation rights were at risk. | Signed customer sessions plus a trusted phoneVerified === true check. Never set this flag from an untrusted request or mark all accounts verified. Implement an approved proof workflow. | Unverified signed fixture denied before booking reads; verified fixture allowed. Bare IDs/cross-role tokens rejected. No actual accounts modified. |
| P1, FIXED locally | lib/data.ts:471, 498; app/api/bookings/route.ts:21,50,77 | Read paths could seed collections or fall back to stale local bookings; missing validation or persistence failure could produce unsafe behavior. | Removed six read-triggered seeding writes; booking reads fail closed; bounded 32 KiB JSON and typed/length/date/range checks; persistence acknowledged before 201; storage failure 503. | Zero writes across seven empty-DB reads, offline reads rejected, invalid payloads rejected, storage failure emits no notification/success. |
| P1, FIXED locally | components/BookingForm.tsx, submission handler | Failure, timeout, malformed response or empty ID must not produce success/conversions; rapid submission must not duplicate. | Require 201 plus a trimmed nonempty ID, synchronous submit lock and 20-second request timeouts. | 55 failure/invalid-phone cases across five types; positive mocked flows; duplicate lock; native browser validation on 14 forms. |
| P1, environment / feature acceptance OPEN | lib/session-signing.ts:6; customer login/register:7; admin/auth/change-password:4 | Missing signing configuration now rejects authentication. Old unsigned sessions are intentionally invalid. Password changes through the deployment filesystem are not durable. | Cryptographically random signing secret, at least 32 characters; prefer separate customer secret. Missing config returns 503 before customer registration writes. Password-change API is authenticated but returns 503 until an approved durable credential store exists. | Missing/tampered/expired/cross-role session tests; HTTP 503 with absent signing settings; unauthenticated password change 401. Staging sign-in still required. |
| P2, FIXED locally | components/BookingForm.tsx; components/useModalAccessibility.ts; both search modals | Location selection used click-only divs; modal focus could escape or fail to return. | Three native buttons, dialog semantics, close labels, initial focus, Tab wrapping, Escape and trigger restoration. | Both modal types passed keyboard checks; 60 bilingual layout cases have no horizontal overflow. Screen-reader/hardware date-picker QA remains manual. |
| P2, OPEN | app/api/bookings/route.ts:17; app/api/upload/route.ts; auth/contact/review APIs | Per-process IP limits are not global Vercel protection; some endpoints lack equivalent throttling. Public uploads carry storage/privacy abuse risk. | Approved platform/distributed limits, trusted proxy/IP policy, upload content inspection and private-document retention/access policy. Existing MIME/5 MiB checks reject SVG but are not antivirus or file-signature verification. | Local rate-limit/size tests pass. Multi-instance abuse resistance, WAF settings and Cloudinary access controls unverified. |
| P2, OPEN | lib/auth.ts; lib/data.ts; customer routes; eventEmitter | Legacy password hashes, synchronous password work, missing verified unique-phone index, broad admin update payloads, process-local notifications and retry/idempotency gaps need follow-up. | Review rehash-on-login, durable ownership IDs, normalization/index migration, allowlisted admin updates, distributed notifications and idempotent booking retries. None of these migrations/account changes were run. | Source review; no claims about live indexes, cross-instance SSE or duplicate-proof retries. |
| P2, OPEN | Lighthouse artifacts / lib and public UI | Mobile execution/layout cost remains high despite image improvements. A catalogue image in the public fixture returned upstream 404 during browser QA. | Profile shared UI and long tasks; validate owner-approved replacement for the broken image. Do not modify catalogue data without approval or suppress Google scripts. | Measurements below; homepage Lighthouse resources loaded successfully. Other browser navigations include aborted prefetch/analytics requests and the separate image 404. |
| P2, OPEN | full ESLint result; data/articles.json | Existing lint debt remains. The local article fallback file has invalid trailing data; production content availability must not depend on silently trimming it. | Schedule focused cleanup and owner-reviewed data repair. Preserve original file rather than discard content. | Full lint fails; syntax/content review. No data-file repair or production article mutation performed. |

Dependency references: the official [Next.js AVIF/image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) lists a patched 16.3.3 release; the [Turbopack proxy advisory](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24) lists 16.2.11. These are relevant advisory/version evidence, not proof of exploitation on this Vercel deployment. Additional Next advisories have feature-specific exposure; do not infer use of next/og or a Windows production runtime from a Windows local build.

## D. MongoDB Assessment

The lazy connection utility creates a client only when getDb is called. The pending promise is reused by concurrent callers; successful connections are reused within a warm module/serverless instance. A failed connection clears the promise and closes the failed client, permitting retry. The database name remains **limo**. Development retains its local default URI; production with no MONGODB_URI throws at request time rather than unrelated import time.

Pool controls: min 0, max 10, idle 60 seconds, server selection 10 seconds, wait queue 10 seconds. These limit per-instance connections and waits, not the total fleet or every query duration. See MongoDB's [pool documentation](https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/) and [connection options](https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/).

Thirty concurrent mock callers opened one connection. Import/no-URI/retry tests pass. Seven empty-DB read journeys generated zero insert attempts. Catalogue/settings reads may use public JSON fallback or return empty results; alerting is still needed to detect degraded catalogue availability. Booking reads now return an error, never a local PII fallback.

The sitemap reads cars and published articles directly and is force-dynamic. Database failure rejects generation instead of returning a 200 response containing only static URLs. This is a tested failure policy; a last-known-good sitemap cache is not implemented.

Vehicle, hotel, apartment, flight, Fast Track, airport pages and sitemap were exercised with a public snapshot. Authentication/administration were checked with mocked and unauthenticated cases. Actual Mongo credentials, permissions, network allowlist, indexes, warm/cold instance behavior, approved admin mutations and booking persistence still require staging. A build without MongoDB is not that proof.

## E. Booking Assessment

All five supported types use POST /api/bookings: **car, hotel, apartment, flight, fast_track**. CAI and SPX reuse car with airport-specific service reference/name, rather than introduce an unsupported API type. Mock persistence tests preserve airport-transfer-CAI and airport-transfer-SPX identifiers.

Required phone validation is enforced in the form, API and persistence helper. Choosing a nationality does not fill a phone number. Native browser checks rejected +971 alone in 14 bilingual service/airport forms and accepted a complete number. This is format validation; it does not prove reachability or ownership.

Server checks include required name/service/reference, exact valid ISO dates, ordered date ranges, passenger integers, allowed source/type, bounded notes/other-person strings and nonnegative finite numeric amounts. Booking price/budget remains client input and must not be treated as an authoritative payment quote. Email is validated on the contact form; it is not an existing booking field.

The server waits for acknowledged persistence, responds 201 with a generated ID, then notifies administration. Notification failure cannot turn an already saved booking into a false storage error. The client requires that contract; malformed/missing/whitespace IDs, non-201 responses, timeout/network failure, unauthorized response and server error do not trigger success or conversion.

The submit lock is synchronous. A 20-second client timeout may occur after the server has persisted a booking; it is not a rollback. Durable idempotency remains follow-up work before encouraging automatic retries. Local one-minute rate limiting is not fleet-wide deduplication.

Successful tests were mocked; no actual booking record was inserted. A full staging journey must verify all service details, vehicle/date selection, airport identity, UI messages, saved record, admin receipt and ownership-authorized retrieval/cancellation.

## F. Google Ads and GA4 Assessment

Preserved Ads ID: AW-18470016597. GA4: G-MSXWFZ24ES when NEXT_PUBLIC_GA4_ID is configured. No account-side settings changed.

| Conversion | Preserved label |
|---|---|
| Booking saved | IOV4CMdqqu4oDENWsmOAE |
| WhatsApp click | 92vCCMPpvIodENWsmOdE |
| Phone click | sGzSCJugyYodENWsmOdE |

Source and regression checks verify initialization/configuration guards, queued events, URL recognition, admin exclusions, rapid-click duplicate guards, navigation behavior and booking-only success firing. Browser contact events were intercepted locally: whatsapp_click/conversion and phone_click/conversion. Failed booking tests emitted no success. Live Google conversions were not sent; normal tag loads/page views occurred in browser/performance tests.

A WhatsApp click is not a conversation; a tel link is not a completed call. A persisted booking is not payment or service fulfilment. A booking followed by WhatsApp can produce separate conversion actions. Account owners should review primary/secondary goal settings and counting rules to avoid optimizing campaigns for overlapping micro-conversions. This is advice, not an account change.

Tag Assistant, GA4 DebugView, Google Ads conversion receipt/labels, consent requirements/settings and account goals remain external checks. No consent-management integration was proven; no consent behavior was newly invented. GA4 must be configured in the actual Preview/Production environment; a local runtime ID does not prove Vercel configuration.

## G. SEO Assessment

The current public fixture contains 14 registry paths, 14 vehicle slugs and six published article slugs: 2 × (14 + 14 + 6) = **68 URLs**. This is the current computed count, not a permanent hardcoded requirement.

Final HTML validation passed all 68 URLs: 200 without redirects, unique titles/descriptions, canonical production URLs, Open Graph fields/locales, correct language, three exact alternates (ar-EG, en, x-default), no noindex, one primary H1 and required phone fields where a booking form exists. Sitemap XML also parsed in a browser XML parser without errors; every entry has three namespaced language links. No private, duplicate or redirect-only URLs were admitted.

Fifty-six pages contain locally validated JSON-LD. Organization/WebSite, Service, BlogPosting and BreadcrumbList graphs use absolute URLs and safe JSON escaping. No fabricated review ratings are added; optional dates are validated rather than invented. Business identifiers/address/author/publication data still depend on trustworthy source data and owner confirmation. Local validation is not a Google rich-results eligibility guarantee.

Article tests cover malformed HTML, headings containing prose, empty headings, preserved sections/paragraphs/lists/links and both languages. Actual bilingual article pages were included in HTML checks; the Sharm/Hurghada article has one primary H1 after normalization.

CAI/SPX pages describe only confirmed arrival/departure transportation. No airport-specific Fast Track, meet-and-greet procedures, signage, wait guarantees, flight tracking or fabricated prices are asserted. No Hurghada/SSH airport transfer landing pages were created. Search Console, live redirects, indexing, GBP, genuine reviews and backlinks remain account/business work.

## H. Security Assessment

Sanitization uses parse5 parsing and an allowlist, not regex-only removal. Regression payloads cover scripts, handlers, encoded javascript URLs, SVG/MathML, iframe/srcdoc, dangerous data images and malformed/nested elements. Sanitized output remains inert and idempotent after reparse in the tested contexts. Existing render sinks and JSON-LD escaping were reviewed; this is not a formal penetration test.

Session signatures use HMAC-SHA256 and timing-safe comparison, role namespaces, expiration and bounded tokens. Customer/admin cookies are HTTP-only, SameSite lax and secure in production. Secrets are server-only; old cookies require fresh sign-in. Signature validation is not phone verification. No OTP workflow or data migration was introduced.

Public booking/contact/review JSON bodies are bounded at 32 KiB. Internal booking lists and unapproved review listing now require admin authorization. Public review submissions remain unapproved. Production /api/log is unavailable. Uploads have local throttling, MIME/size restrictions and generic errors, but public Cloudinary document URLs, spoofable MIME and rate limits still need business/privacy controls.

**Production npm audit: six affected packages — one critical, four high, one moderate.** Next is direct; sharp, postcss, nanoid, source-map-js and baseline-browser-mapping are transitive production-tree findings. **Full audit: 17 affected packages — one critical, 12 high, four moderate**, including additional development/build tooling findings. Development-only lint/build advisories are distinguished from runtime exposure; they still matter for the build supply chain. Counts are packages reported by npm, not a count of independently proven exploits. No npm audit fix or unreviewed framework upgrade was run.

## I. Performance Results

Final-build Lighthouse 13.5.0 measurements used the local production server, default mobile throttling and desktop preset. Google resources were not blocked or hidden. Mobile and desktop warmups were excluded; one mobile run with failed Google requests was excluded and replaced. Three valid mobile samples and one valid desktop sample are reported.

| Metric | Historical before SEO | Historical after SEO | Current valid mobile median |
|---|---:|---:|---:|
| Performance | 61 | 69 | 69 |
| FCP | 1.917 s | 1.644 s | 1.519 s |
| LCP | 4.061 s | 3.781 s | 3.784 s |
| TBT | 848 ms | 809 ms | 786.8 ms |
| CLS | 0 | 0 | 0.0001 |

Current individual mobile samples: 69 (run 2), 70 (run 3), 67 (run 4). Desktop: 99, FCP 0.397 s, LCP 0.822 s, TBT 58.5 ms, CLS 0.000001057987520380781. Historical desktop score was 94; a single current sample is not a statistically established improvement. Earlier readiness measurements were 71/71/65 before the final keyboard-control patch; they are retained as supplementary evidence, not mixed into this final median. Every included final sample has both gtag script requests at HTTP 200 and no recorded failed/HTTP >=400 resources.

The median mobile target is still missed: Performance ≥85, LCP ≤2.5 seconds and TBT ≤200 ms. The final mobile median CLS is approximately 0.0001 versus historical 0: a very small regression, not an exact zero. Layout stability remains good. Historical and new runs use a local production server with public catalogue fixtures; they do not establish worldwide Vercel response time or field Core Web Vitals. Differences between days, caches and CPU scheduling prevent attributing small score changes solely to code.

Profiling final mobile run 2: 8 long tasks; 1579 ms script evaluation and 1221 ms style/layout. Script transfer total: 552 KiB. Bootup detail attributes work to the document, the shared application chunk and two Google tag scripts. These measured categories overlap related page work and should not be added together as independent causes.

The evidence supports prioritizing shared JavaScript/hydration work, long tasks and style/layout cost. Hero image delivery and responsive Cloudinary transformations were reviewed; fonts/CSS can still delay text rendering. The audit does not establish one exact font or CSS rule as the sole LCP cause. No speculative UI rewrite or tag suppression was performed.

## J. Testing Matrix

| Executed command / method | Final result | Limits |
|---|---|---|
| Git status/branch/HEAD and full relevant diff/source review | PASS; main/53ed792 verified; pre-existing dirty work identified | Combined working tree includes prior SEO work; no commit/push |
| npm run verify:production | PASS, exit 0 | Runs verify:seo plus new isolated production-safety script; all writes/conversions mocked |
| verify:seo included checks | PASS: 28 metadata variants; parser/schema/preview/tracking/Mongo retry/sitemap; 170 invalid requests, 10 valid requests, 10 rendered form fixtures; 55 submission failure cases | Fixture/unit coverage, not real customer/staging transactions |
| scripts/verify-production-readiness.cjs | PASS: signed/expired/tampered/missing-secret sessions, 17 retired/40 guarded handlers, proxy bypass, seven zero-write reads, 30 concurrent callers, offline storage, CAI/SPX contract, sanitizer and Cloudinary config | Mock I/O; verified phone flag comes from trusted fixture, not a deployed verification flow |
| npm run build, final build after keyboard fix | PASS, exit 0; compilation and TypeScript completed | No Mongo runtime settings; expected generic fallback warnings. Runtime route health is separately tested |
| tsc --noEmit --incremental false | PASS | Normal incremental command encountered EPERM writing tsbuildinfo; no-incremental rerun checks types without that cache |
| eslint selected security utilities/APIs/proxy/new test --max-warnings 0 | PASS, exit 0 | Only listed selected files; does not clear inherited BookingForm/data/modal lint debt |
| Full eslint JSON report | FAIL, exit 1: 125 errors /118 warnings | Previous SEO 172/123; baseline 177/127. Per-file comparison found no increased error/warning counts after new regressions were fixed; this is not proof every legacy violation is harmless |
| npm audit --omit=dev --json / npm audit --json | FAIL security gate: 6 production /17 full-tree packages | Initial sandbox network failure was rerun with approved network access; affected features/hosting mitigations need review |
| node scripts/verify-public-seo.cjs http://localhost:3110 | PASS: 68 generated pages, 56 schema pages, metadata/canonical/alternates/OG/robots/redirect/H1 checks | Uses public read-only catalogue fixtures and production canonicals |
| Browser native form / contact spies | PASS: 14 ar/en service forms; country code rejected/full number accepted; zero booking requests; zero runtime/hydration exceptions | No real submissions; normal tags load, conversion calls replaced by spies |
| Browser context/navigation checks | PASS: nine checks including empty phone after nationality, client navigation, account/admin-login rendering and representative articles | No actual login/account operation |
| Browser responsive and keyboard checks | PASS: 60 layouts at 390/768/1440 px, ar/en, home/five services/two airports/car/article; no horizontal overflow; two modal focus/Tab/Escape/restore checks | Automated DOM/geometry checks; no screen-reader, hardware-native date-picker or exhaustive visual contrast audit |
| Browser sitemap XML DOMParser | PASS: zero parser errors; 68 URLs, three namespaced alternates each | Current fixture; live database outage tested through module regressions rather than a live outage |
| Local production HTTP authorization/error checks | PASS: 13 cases; private 401, retired DELETE 410, log POST 404, forged admin requests 307, invalid booking 400, unconfigured customer auth 503 | Correct HTTP methods; no authenticated production mutation |
| Repeated Lighthouse 13.5.0 / Edge | Completed; measured results in section I and validation JSON | Google scripts retained; warmups excluded; targets unmet, desktop limited sample |
| node --check on eight credential-bearing maintenance scripts | PASS | Syntax only; scripts never executed |
| git diff --check on audit files | PASS with unrelated prior app/blog/page.tsx and middleware_debug.log excluded | Whole working-tree check still includes pre-existing whitespace; those files were preserved |

Initial test-harness failures were corrected and rerun: missing FormData globals in the isolated upload VM, a location selector exposing the click-only control defect, and HTTP expectations using unsupported methods (405). The table reports the successful corrected runs, not those failed attempts as passes.

New lint regressions from unused error bindings/explicit-any catches and mutable declarations were fixed. Remaining errors are primarily inherited typing/hook/render debt, not newly added session/request/keyboard utilities. Critical existing authorization/storage problems were fixed independently of lint counts. BookingForm retains existing lint violations; the full lint gate is not green.

## K. Files Changed During This Audit

The list below separates this audit's 58 files from earlier SEO changes already present. package-lock.json, airport content, metadata/schema/sanitizer files and prior SEO documents were not newly changed by this audit. Existing middleware_debug.log and malformed article data were preserved.

| File | Purpose |
|---|---|
| [lib/session-signing.ts](../lib/session-signing.ts) | New bounded, expiring, role-specific HMAC sessions. |
| [lib/request-json.ts](../lib/request-json.ts) | New streamed 32 KiB JSON request limit. |
| [components/useModalAccessibility.ts](../components/useModalAccessibility.ts) | Dialog semantics, close labels, focus trapping/restoration. |
| [scripts/verify-production-readiness.cjs](../scripts/verify-production-readiness.cjs) | Focused booking/SEO/security regressions and dynamic metadata checks. |
| [lib/admin-auth.ts](../lib/admin-auth.ts) | Require verified signed admin session. |
| [lib/mongodb.ts](../lib/mongodb.ts) | Preserve lazy/retry behavior; bound connection pool/waits. |
| [lib/data.ts](../lib/data.ts) | Remove read-triggered seeds; fail-closed booking reads/persistence; generic logs. |
| [lib/cloudinary.ts](../lib/cloudinary.ts) | Remove credential fallbacks; require configured uploads; redact errors. |
| [proxy.ts](../proxy.ts) | Server admin protection; remove forged bypass flags. |
| [app/admin/layout.tsx](../app/admin/layout.tsx) | Server admin protection; remove forged bypass flags. |
| [app/api/admin/auth/route.ts](../app/api/admin/auth/route.ts) | Require signing configuration and validated password input. |
| [app/api/admin/auth/change-password/route.ts](../app/api/admin/auth/change-password/route.ts) | Authorize, then disable nondurable password changes. |
| [app/api/admin/cloudinary/list/route.ts](../app/api/admin/cloudinary/list/route.ts) | Protect private media listing. |
| [app/api/admin/list-cloudinary-images/route.ts](../app/api/admin/list-cloudinary-images/route.ts) | Protect private media listing. |
| [app/api/admin/articles/seed/route.ts](../app/api/admin/articles/seed/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/clean-unsplash/route.ts](../app/api/admin/clean-unsplash/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/clear-all-cars/route.ts](../app/api/admin/clear-all-cars/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/cloudinary/migrate/route.ts](../app/api/admin/cloudinary/migrate/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/debug-db/route.ts](../app/api/admin/debug-db/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/delete-middleware/route.ts](../app/api/admin/delete-middleware/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/fix-all-collections/route.ts](../app/api/admin/fix-all-collections/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/force-atlas-sync/route.ts](../app/api/admin/force-atlas-sync/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/inspect-dbs/route.ts](../app/api/admin/inspect-dbs/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/master-cloudinary-sync/route.ts](../app/api/admin/master-cloudinary-sync/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/replace-limo/route.ts](../app/api/admin/replace-limo/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/restore-all/route.ts](../app/api/admin/restore-all/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/restore-cars/route.ts](../app/api/admin/restore-cars/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/seed-get/route.ts](../app/api/admin/seed-get/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/upload-flights-cloudinary/route.ts](../app/api/admin/upload-flights-cloudinary/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/admin/upload-hotels-cloudinary/route.ts](../app/api/admin/upload-hotels-cloudinary/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/migrate-db/route.ts](../app/api/migrate-db/route.ts) | Retire unsafe maintenance handler with 410. |
| [app/api/customer/login/route.ts](../app/api/customer/login/route.ts) | Signed sessions, input/config checks; reject bare-ID cookies. |
| [app/api/customer/register/route.ts](../app/api/customer/register/route.ts) | Signed sessions, input/config checks; reject bare-ID cookies. |
| [app/api/customer/me/route.ts](../app/api/customer/me/route.ts) | Signed sessions, input/config checks; reject bare-ID cookies. |
| [app/api/customer/bookings/route.ts](../app/api/customer/bookings/route.ts) | Verify signed session and trusted phone ownership. |
| [app/api/bookings/route.ts](../app/api/bookings/route.ts) | Bound/validate requests; persist before 201; safe storage/notification errors. |
| [app/api/contact/route.ts](../app/api/contact/route.ts) | Bound and validate contact/email/phone input. |
| [app/api/reviews/route.ts](../app/api/reviews/route.ts) | Bound review input; authorize unapproved listing. |
| [app/api/upload/route.ts](../app/api/upload/route.ts) | Local throttling, file restrictions and generic errors. |
| [app/api/log/route.ts](../app/api/log/route.ts) | Disable debug filesystem writes outside development. |
| [components/BookingForm.tsx](../components/BookingForm.tsx) | Timeout and submission contract/lock; native keyboard location controls. |
| [components/LocationSearchModal.tsx](../components/LocationSearchModal.tsx) | Dialog semantics, close labels, focus trapping/restoration. |
| [components/NationalitySearchModal.tsx](../components/NationalitySearchModal.tsx) | Dialog semantics, close labels, focus trapping/restoration. |
| [scripts/verify-booking-phone.cjs](../scripts/verify-booking-phone.cjs) | Focused booking/SEO/security regressions and dynamic metadata checks. |
| [scripts/verify-booking-tracking.cjs](../scripts/verify-booking-tracking.cjs) | Focused booking/SEO/security regressions and dynamic metadata checks. |
| [scripts/verify-seo-remediation.cjs](../scripts/verify-seo-remediation.cjs) | Focused booking/SEO/security regressions and dynamic metadata checks. |
| [scripts/verify-public-seo.cjs](../scripts/verify-public-seo.cjs) | Focused booking/SEO/security regressions and dynamic metadata checks. |
| [scripts/check-all-dbs.mjs](../scripts/check-all-dbs.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/check-cars-db.mjs](../scripts/check-cars-db.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/fix-car-prices-usd.mjs](../scripts/fix-car-prices-usd.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/master-cloudinary-db-sync.mjs](../scripts/master-cloudinary-db-sync.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/restore-cloudinary-cars.mjs](../scripts/restore-cloudinary-cars.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/sync-all-to-atlas.mjs](../scripts/sync-all-to-atlas.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/sync-db.js](../scripts/sync-db.js) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [scripts/upload-hotels-to-cloudinary.mjs](../scripts/upload-hotels-to-cloudinary.mjs) | Remove embedded Mongo URI; require environment at execution. Syntax tested only. |
| [package.json](../package.json) | Add verify:production script; no dependency upgrade. |
| [docs/production-readiness-audit-2026-10-11.md](../docs/production-readiness-audit-2026-10-11.md) | Audit report or sanitized validation evidence. |
| [docs/production-readiness-validation-2026-10-11.json](../docs/production-readiness-validation-2026-10-11.json) | Audit report or sanitized validation evidence. |

No unrelated whole-project refactor, package upgrade, index migration or credential rotation was performed. Retired maintenance routes and disabled password updates are deliberate operational changes that need review.

## L. Remaining Manual Checks

**Account/infrastructure checks:** rotate exposed MongoDB/Cloudinary credentials; inspect access history; verify least-privilege DB/media access; confirm Vercel Node version, build command, environment scopes and deployment protection; approve staging database and Cloudinary upload policy; validate GA4/Ads goals, labels, conversion receipt/consent and Search Console sitemap/indexing; check WAF/distributed throttling, error monitoring and booking notification delivery.

Required configuration names: MONGODB_URI; ADMIN_SECRET (cryptographically random, ≥32 characters); CUSTOMER_SESSION_SECRET (prefer separate ≥32-character value, otherwise explicit ADMIN_SECRET fallback); approved admin password/configuration; NEXT_PUBLIC_GA4_ID; Cloudinary cloud name/key/secret or valid CLOUDINARY_URL (and an explicitly approved upload preset when used); GOOGLE_SITE_VERIFICATION if relying on HTML verification. No secret values are included. Inspected shell settings were absent; that does not assert Vercel settings are absent. Local QA supplied GA4 separately.

Local Node 24.21.0 meets installed Next's >=20.9.0 requirement; Vercel's actual runtime pin was not verified. vercel.json selects nextjs without an explicit Node engine/build override. Production runtime secrets must not use NEXT_PUBLIC names.

**Owner/business checks:** choose trusted phone ownership verification and approve customer retrieval/cancellation behavior; approve a durable admin credential process; confirm customer-facing contact numbers, prices, services, policies, author/date information and document handling; replace the broken catalogue image with an approved asset. CAI/SPX transportation only is confirmed. Fast Track at a named airport, airport reception specifics and HRG/SSH airport transfers remain unconfirmed. Genuine reviews/GBP/backlinks remain business work.

**Staging QA:** all five services plus CAI/SPX, ar/en, full saved-record assertions, customer registration/sign-in/ownership, approved admin changes, expiry/logout, duplicate/retry behavior, error monitoring, mobile menu/language switcher, native date picking, screen-reader labels and real device visuals. Rich Results/Schema validator and account-side tracking checks are not reported as passed.

## M. Safe Deployment Checklist

1. Review the combined dirty diff, separately identifying prior SEO changes and this audit's containment changes. Do not commit incidental log/data changes. Review dependency upgrade and operational feature removals.
2. Rotate exposed credentials through the owner; configure new least-privilege Preview secrets without displaying values. Choose phone verification and durable admin credential ownership. Old sessions will need sign-in again.
3. After approval, create an isolated Preview deployment backed by an approved staging database/media configuration. Verify environment scope before booking tests; do not accidentally point tests at production.
4. Run npm ci, verify:production, final build, selected strict lint, full-lint assessment, dependency audit, public HTML/sitemap checks and browser QA on Preview. Demonstrate real staging persistence/ownership/admin paths. Block fake live conversion events with test spies or approved account test mode.
5. Resolve P0/P1 blockers and document accepted P2 debt. Obtain explicit production approval for the reviewed concrete build and environment.
6. Deploy the approved version manually or through the approved release workflow. This audit did not deploy.
7. Verify runtime catalogue, booking error handling, sign-in, restricted routes, robots/sitemap, CAI/SPX, live redirect/canonical behavior and authorized tracking receipt. Run repeated PageSpeed tests on the same version and monitor real-user metrics/booking failures.
8. Prepare a rollback to a reviewed secure, environment-compatible build. Do not restore exposed credentials or vulnerable maintenance/session behavior. There are no schema/data migrations to reverse in this audit; credential rotation is not rolled back. Preserve submitted bookings, audit events and owner-approved data.

## N. Final Recommendation

**Do not deploy this working tree to production yet.** Local containment and SEO/booking tests are useful evidence, but they cannot close the dependency vulnerabilities, credential rotation, missing staging authentication/persistence proof or the incomplete customer phone ownership workflow.

Next action: review the dependency/security diff, rotate exposed credentials, implement the approved ownership and credential process, then complete isolated Preview QA. Reissue the deployment decision against that exact reviewed build. Mobile performance and inherited lint debt remain explicitly open; successful build output alone is insufficient.
