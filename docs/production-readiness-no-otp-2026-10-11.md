# Limo Egypt — Updated Production Readiness: No OTP

Date: 2026-10-11. Repository: G:/mahmoud/LimoMasr, branch main.
Baseline HEAD remains 53ed7926d0de9cfa274e4c5d48a57ba6e6293791. The combined working tree is still uncommitted.
This report supersedes the customer ownership/OTP release requirements and dependency findings in [the earlier audit](production-readiness-audit-2026-10-11.md). Historical measurements in that audit remain historical evidence.

## A. Executive Summary

The owner's no-OTP decision is implemented. Public booking creation remains available without registration or sign-in. Customer self-service retrieval and cancellation are disabled for everyone because no independently proven booking ownership mechanism exists. Arabic and English pages explain the disabled feature, link to contact and allow browsing/new bookings without requiring login.

Customer APIs cannot use a phone, account ID, signed session, supplied booking ID or phoneVerified flag to read/change bookings. They return 403 with CUSTOMER_SELF_SERVICE_DISABLED, bilingual messages and no-store caching. They perform no account lookup, booking read or mutation. A signed account session is not proof of ownership.

Next.js and eslint-config-next were upgraded from 16.2.9 to stable 16.4.0, then compatible dependency fixes were applied without --force. Production npm audit now reports zero vulnerabilities. Seven development-tool findings remain; no breaking framework downgrade was imposed.

No OTP/SMS provider or verification infrastructure was implemented. No commit, push, deployment, production configuration change, production DB write, actual customer booking or fake Google conversion was performed.

## B. Deployment Decision

**NO-GO for production approval at present. OTP is not a release requirement.**

The customer's self-service restriction is now a completed business decision, not an outstanding OTP implementation blocker. The remaining release gates are:

1. Owner rotation of historically exposed MongoDB and Cloudinary credentials, followed by secure configuration and exposure review. Removing literals cannot revoke old credentials.
2. Verification of the actual Preview/Production MongoDB, admin signing/credential, Cloudinary and GA4 configuration. Local configuration checks currently fail because required settings are absent. This does not prove Vercel settings are absent.
3. Actual staging connection and persistence/admin validation. The owner confirmed that no staging database currently exists. Mocked persistence tests cannot replace this check.
4. Review of the combined diff and deliberate feature restrictions, including the previously retired maintenance endpoints and unavailable filesystem password-change feature.

Development advisories, mobile performance and inherited lint debt require review/acceptance and follow-up. They are not described as unresolved OTP work.

## C. Findings and Status Changes

| Priority | Finding | Current status and evidence |
|---|---|---|
| P0 | Old MongoDB/Cloudinary credentials in history | Literals removed by the earlier audit; rotation/exposure review still unconfirmed. Do not restore them in a rollback. |
| P0, locally resolved | Vulnerable production dependency tree | Next/eslint-config 16.4.0 plus compatible lockfile updates; npm audit --omit=dev exits 0 with zero findings. This is an npm advisory result, not a complete penetration-test guarantee. |
| P0, locally resolved | Weak sessions/admin bypass/maintenance mutations | Prior signed-session and per-handler authorization fixes retained; 17 retired handlers and 40 admin handler guards still pass regression checks. |
| P0, locally resolved | Phone/session-based customer booking exposure | Entire self-service API disabled. Twenty-six read/change/cancellation attempts across both languages, anonymous/malformed/raw-ID/signed customer/admin-cookie cases return 403 without I/O. |
| P1, locally resolved | Broken customer feature UX after restriction | Replaced fetching/cancellation client with a static server-rendered bilingual notice; no auth redirect, loading loop, booking list or cancel mutation. Contact/new-booking links remain available. |
| P1, externally unverified | Signing/runtime configuration | Added secret-safe verify:config check and blank .env.example. Missing/invalid settings fail the check. Admin login remains fail-closed if signing is absent. Existing stored admin hash takes precedence over ADMIN_PASSWORD; owner must confirm the actual approved credential. |
| P1, blocked by unavailable environment | Staging persistence validation | Owner confirmed no staging. verify:staging performs read-only checks only against explicit STAGING_MONGODB_URI, rejects the configured application cluster and never writes. Local run correctly refused absent configuration. |
| P2 | Development dependencies | Seven package findings: five high and two moderate, originating in braces and postcss-selector-parser. Automatic proposed fixes would downgrade eslint-config-next to 14.2.35 and typography to 0.5.4. No --force or speculative override was applied. |
| P2 | Full lint | 117 errors /116 warnings remain; selected changed files pass strict lint. Prior audit was 125/118. Removing the obsolete customer UI reduced debt; full lint is still not green. |
| P2 | Performance/operational debt | Historical mobile 69/desktop 99, weak distributed throttling, upload privacy/content inspection, process-local notifications, durable retries and malformed article fallback remain documented. New framework build has not been remeasured by Lighthouse. |

Remaining development advisories: [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [selector parsing complexity](https://github.com/advisories/GHSA-rj75-hqrm-r3gf). These findings are outside the audited production dependency tree, but matter when build/lint tools process untrusted inputs. Restrict untrusted build input and track upstream fixes; do not hide them by downgrading the framework.

## D. MongoDB and Staging

The application's lazy MongoDB utility and database name limo are preserved. Thirty concurrent mock callers share one pending connection; retry/no-URI tests still pass. Empty catalogue/settings/booking reads do not seed collections. Booking reads fail rather than disclose local fallback PII; acknowledgement remains required before booking success.

The disabled customer API no longer imports MongoDB, cookies, session verification or booking data helpers. Neither a registration record nor an arbitrary phoneVerified field can reopen historical booking access. There is no implicit enable flag.

The staging script validates an explicitly configured, separate cluster with ping and collection-name inspection only. Actual collection names include fast-track and hotel_apartments. It does not copy data, seed collections, create indexes, insert bookings or validate persistence by pretending a read-only connection is a write test.

Missing and shared-cluster scenarios reject before a client is created in regression tests; the positive staging scenario uses a mocked client and zero writes. Real staging connection/persistence remains NOT VALIDATED. No production connection was substituted.

## E. Booking and Ownership Policy

All five existing public types still use POST /api/bookings: car, hotel, apartment, flight and fast_track. CAI/SPX continue to reuse car with airport-specific identifiers. No OTP, account or login prerequisite was added to the public submission path.

Required complete phone validation remains in form/API/storage. Nationality selection does not invent a phone. Persistence, event notification and the 201/nonempty-ID success contract remain unchanged. Failed requests, timeout, malformed response, missing/whitespace ID and repeated submission cannot trigger successful-booking UI/conversions in tested fixtures.

The disabled customer route's GET and PUT both return 403 without parsing the body, reading customer information, fetching bookings or updating status. Unsupported methods are not implemented. A caller-supplied ID, matching phone or valid signed session has no effect. Admin access uses the separate authorized /api/bookings management handlers; positive mocked admin listing/status changes still pass.

The customer page explicitly says that viewing/cancelling through the account is temporarily unavailable, directs existing-booking enquiries/change/cancellation requests to the team and says that new bookings do not require sign-in. It does not guarantee that every requested cancellation will be approved.

## F. Google Ads/GA4 and Notifications

Preserved identifiers: Ads AW-18470016597 and configured GA4 G-MSXWFZ24ES.
Preserved conversion labels:
- Booking: IOV4CMdqqu4oDENWsmOAE.
- WhatsApp: 92vCCMPpvIodENWsmOdE.
- Phone: sGzSCJugyYodENWsmOdE.

The public submit/persistence/notification/tracking implementation was not removed or moved into customer authentication. Existing regression checks validate 55 failure/invalid-phone cases, successful saved-booking flows, WhatsApp flow and the synchronous duplicate-submit lock. Notification tests still assert success after storage and no emission on storage failure.

Browser checks on Next 16.4.0 cover 14 guest service/airport forms, country-code rejection, complete number acceptance and locally intercepted WhatsApp/phone event pairs. No booking POST or fake conversion was sent. Normal browser page views/tag loading occurred. Admin exclusion, queued tracking and rapid-click guards remain regression-tested.

Clicks remain clicks, not confirmed conversations/calls. Account-side goals/primary-secondary settings, conversion receipt, consent and DebugView/Tag Assistant checks are still unverified. NEXT_PUBLIC_GA4_ID must be set in the actual environment; verify:config does not silently accept its absence.

## G. SEO and Bilingual Content

Final Next 16.4.0 HTML checks pass all 68 dynamically generated current-fixture pages and 56 JSON-LD pages, including unique metadata, canonical, language alternates, Open Graph, robots, one primary H1 and required booking phone fields. The count remains data-derived, not permanently hardcoded.

The customer information page remains outside the public sitemap and now explicitly has noindex/nofollow metadata. Locale is constrained to ar/en before selecting the shared messages. Server-rendered Arabic and English notice content/contact links are covered by automated regression tests.

Confirmed CAI/SPX transport-only content, structured-data escaping and sanitized article behavior are preserved. Airport-specific Fast Track/meet-and-greet/waiting guarantees were not invented. Owner/account tasks for Search Console, actual business details and rich-results checks remain unchanged.

## H. Security and Configuration

Customer policy is defined in lib/customer-booking-access.ts. It contains only public copy and the disabled-state code; no customer data or credentials. The route fails closed independently of account flags. The server-rendered information component has no booking query, mutation or login redirect.

Production dependencies are updated through a pinned framework upgrade and compatible fixes; the lockfile is committed-ready for review but has not been committed. Native/module/build compatibility is checked by strict lint, production build and regression tests. Remaining seven development findings are disclosed.

verify:config reports only configuration names and generic reasons. It rejects missing/short/obvious-placeholder signing secrets, missing Mongo/GA4/upload configuration and absence of approved admin credentials. Separate random customer signing is recommended; secure role-separated ADMIN_SECRET fallback remains available. Checks cannot establish secret entropy, account access or owner approval simply from a string.

The blank .env.example includes no credential values. .gitignore permits this exact example while populated .env files remain ignored. No production environment setting or password was changed.

## I. Performance

Previous measured medians: mobile 69, FCP 1.519 s, LCP 3.784 s, TBT 786.8 ms, CLS approximately 0.0001; desktop score 99 from a single valid sample. Those measurements belong to the earlier Next 16.2.9 readiness build, not the new Next 16.4.0 build.

No fresh Lighthouse result is claimed here. Re-measure the reviewed Preview build with complete Google resources, repeated samples and no tag suppression. The prior mobile targets remain unmet; do not promise a score from a security upgrade or from removing the customer portal alone.

## J. Executed Verification

| Command/method | Result | Scope/limit |
|---|---|---|
| npm install --save-exact next@16.4.0 eslint-config-next@16.4.0 | Completed; 11 package changes | Stable version verified against npm dist-tags/engine requirement. No production deployment. |
| npm audit fix --ignore-scripts | Applied 17 compatible package updates; exited 1 for remaining findings | No force; retained framework version. Newly added third-party install scripts not broadly approved. |
| npm run verify:production | PASS | SEO, parser/schema/tracking/Mongo, 170 invalid/10 valid booking requests, 10 rendered fixtures and 55 submission failures; all write/conversion tests mocked. |
| New ownership/admin/portal tests within verify:production | PASS | 26 denied customer cases, zero customer I/O, bilingual server-rendered notice, positive authorized admin listing/update. |
| Config/staging regressions within verify:production | PASS | Missing/invalid/redacted configuration, absent/shared-cluster rejection, mocked read-only positive staging. |
| npm run build | PASS on Next 16.4.0 | Compilation and TypeScript pass. Expected generic public fallback warnings without Mongo settings; does not prove runtime persistence. |
| tsc --noEmit --incremental false; node --check on new scripts | PASS | No staging/account access. |
| Strict eslint on changed policy, portal/page/API and verification scripts | PASS, zero warnings | Full repository still fails. |
| Full eslint | FAIL: 117 errors/116 warnings | Inherited debt remains; earlier audit 125/118. |
| npm audit --omit=dev --json | PASS: zero findings, exit 0 | npm production tree only; not a complete security guarantee. |
| npm audit --json | FAIL: seven findings (five high/two moderate), exit 1 | Development/build/lint dependency paths described above. |
| verify:config in current local environment | FAIL as expected | Missing Mongo/admin signing/GA4/Cloudinary settings. No values printed; Vercel settings not inspected. |
| verify:staging in current local environment | NOT VALIDATED / exit 1 | No staging URI/database available; no connection/write performed. |
| Final production fixture HTML checks | PASS: 68 pages/56 schema pages | Public read-only snapshot; no production DB mutation. |
| Browser guest form/contact spies | PASS: 14 forms; zero booking requests/runtime hydration exceptions | Normal tag loads/page views, locally intercepted contact conversions; no fake conversions. |
| Additional browser portal/API scenarios | NOT EXECUTED | Permission request to run the additional browser command was rejected; not reported as passed. Server-rendered/handler regressions did pass separately. |
| Audit diff whitespace | PASS | Unrelated prior app/blog/page.tsx and middleware_debug.log excluded/preserved. |

An early verification run overlapped package replacement and could not resolve next/server; it was rerun successfully after installation. New script escaping was corrected before final syntax/config tests. No setup failure is counted as a successful application test.

## K. Files Changed for This Business Decision

| File | Purpose |
|---|---|
| app/api/customer/bookings/route.ts | Unconditional disabled GET/PUT response; zero ownership inference/I/O. |
| lib/customer-booking-access.ts | Shared Arabic/English public notice and stable disabled code. |
| components/MyBookingsClient.tsx | Static server-rendered notice and contact/new-booking links instead of self-service queries/mutations. |
| app/my-bookings/page.tsx | Validated ar/en locale, explicit noindex and locale passed to notice. |
| scripts/verify-booking-phone.cjs | Replace obsolete phone-matched self-service positive test with no-access regressions. |
| scripts/verify-production-readiness.cjs | Twenty-six denials, admin continuity, portal messages, secret-safe config/staging tests. |
| scripts/verify-runtime-config.cjs | Redacted runtime configuration validation. |
| scripts/verify-staging-db.cjs | Explicit separate-cluster read-only validation; no writes. |
| .env.example | Blank, documented environment template. |
| .gitignore | Permit only the blank environment example, keep real .env files ignored. |
| package.json | Pin Next/eslint-config 16.4.0, expose verify:config and verify:staging. |
| package-lock.json | Framework and compatible dependency resolution updates. |
| docs/production-readiness-no-otp-2026-10-11.md | This updated decision/report. |
| docs/production-readiness-no-otp-validation-2026-10-11.json | Sanitized current validation evidence. |
| docs/production-readiness-audit-2026-10-11.md | Mark earlier report as superseded by this update. |

Earlier audit fixes and unrelated local work are retained. The file list describes this follow-up, not a claim that all dirty files originated in it.

## L. Remaining External Checks

Owner/account:
- Rotate exposed MongoDB/Cloudinary credentials and review access/history; securely configure replacements.
- Confirm the actual admin credential/hash precedence and random signing secrets in Preview/Production.
- Verify Cloudinary document access/retention/preset policy, GA4/Ads/consent/goals and Vercel environment scopes/runtime.
- Review remaining development advisories/trusted-build policy and operational feature removals.

Staging:
- Provision a separate database/cluster with owner-approved fixtures. No existing staging is available.
- Run read-only verify:staging, then explicitly authorized staging persistence and admin notification/management tests.
- Confirm guest bookings across all services/airports, failed persistence, no false conversions, authenticated admin access and permanently denied customer retrieval/cancellation.
- Complete the additional browser notice checks, responsive/native-device/accessibility QA and Google account-side validation.

Future optional work: OTP or another independent ownership mechanism may be considered later. Re-enabling customer self-service requires a reviewed ownership design and new tests; it is not part of this release and no existing flag should bypass the disabled API.

## M. Safe Release Checklist

1. Review the combined source/lockfile changes and no-OTP policy; retain the retired insecure paths and session safeguards.
2. Rotate owner-controlled exposed credentials; configure secure Preview variables without posting values in chat. Run verify:config and confirm actual admin password/hash precedence.
3. Prepare an isolated staging-backed Preview after explicit deployment approval. Never substitute production for absent staging.
4. Run npm ci, verify:production, build, strict lint, dependency checks, HTML and browser QA; separately demonstrate real staging persistence/authorized administration.
5. Review/accept P2 debt, close external P0/P1 verification gates and obtain production approval for the concrete tested build.
6. Deploy only through the approved workflow. This task has not committed/pushed/deployed.
7. Recheck guest booking persistence/notifications/Ads-GA4 receipt, customer 403/clear notices, admin authorization, sitemap/canonicals and runtime error monitoring.
8. Roll back only to a reviewed secure build with compatible environment settings. Do not restore exposed credentials or phone/session-only ownership access. No production data/schema migration was performed here.

## N. Final Recommendation

**NO-GO until credential rotation, real environment verification and isolated staging persistence/admin QA are completed.** OTP is explicitly optional future work and is not a blocker. Public booking continuity and customer feature containment are locally implemented and tested. Production dependency findings are cleared in npm; remaining development findings and full lint debt are disclosed. Do not present mocked persistence, a successful build or a disabled feature as proof of an actual staging/production database connection.
