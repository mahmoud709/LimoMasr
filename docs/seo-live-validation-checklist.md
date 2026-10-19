# Live SEO / measurement checklist — 11 October 2026

This is a manual checklist. No Google account or hosting configuration was changed. Historical screenshots/report statements establish earlier activity, not receipt of unpublished changes.

## Before a preview or production release
- Rotate historically exposed MongoDB/Cloudinary credentials and confirm secure runtime settings.
- Provision an isolated staging database. The owner confirmed none currently exists. Never substitute production.
- Review combined diff; retain Next.js 16.4.0, signed admin sessions, retired endpoints and disabled customer self-service.
- Run verify:production, build and TypeScript. Targeted lint is green only for its stated subset; full inherited lint is not green.
- Test staging booking persistence, notifications and authorized admin access after environment approval. No OTP is required.

## Search Console
1. Open the existing property; verify Domain/URL-prefix scope and current ownership. Do not recreate a verified property needlessly.
2. Fetch production robots.txt and sitemap.xml. Record HTTP status, date and deployed commit; count actual catalogue URLs rather than assuming the fixture's 68.
3. Confirm only 200, indexable, canonical AR/EN pages appear. Check dynamic cars and published articles; failed DB reads must not return a partial success sitemap.
4. Submit the canonical sitemap URL in Sitemaps; record last read, status and discovered count. Submission acceptance does not prove indexing.
5. URL Inspection + live test: both language homepages, all five services, CAI/SPX, one vehicle and one published article per language. Record crawl allowed, fetch status, indexing allowed, declared and selected canonical, rendered content and last crawl.
6. Inspect login, register, my-bookings and admin login for noindex. Booking APIs remain private/disabled by authorization, not robots.
7. Check Page indexing and hreflang reciprocity on actual rendered pages. Request indexing for appropriate changed URLs once; do not repeatedly resubmit.
8. Review sitemap/catalogue changes and errors weekly; compare equal 28-day periods for clicks, impressions and qualified enquiries by service/language.

## GA4 and Google Ads
- Confirm the deployed build has the existing G-MSXWFZ24ES and AW-18470016597 settings; never publish credential values in reports.
- One application gtag loader/config is implemented. No manual page_view sender was added. For direct gtag history navigation, review Enhanced measurement > Page views > advanced browser-history setting.
- In Tag Assistant / DebugView, navigate home → service → vehicle → another language → Back. Verify one page_view for each intended screen and correct page_location/referrer. Check initial load separately; GA4 account settings may still cause duplication.
- Audit extra GTM/container tags, imported GA4 conversions and native Ads actions for duplicates. Enhanced form_submit is not booking_submit_success.
- Local tests use spies/interception only. For actual receipt verification use an approved staging property or an owner-approved genuine production enquiry; do not manufacture production leads.
- Confirm one whatsapp_click / phone_click per real action. Confirm booking_submit_success only after saved booking, HTTP 201 and nonempty ID. Failed/timeout/repeated submits must emit none.
- Keep the existing three Ads labels. A saved enquiry followed by WhatsApp may emit two distinct conversion actions; choose primary/secondary account settings according to the business lead definition to avoid double-counting.
- Never send names, phone numbers, free-text notes or travel/customer records to Analytics.
- Mark events as key events only after actual receipt and owner agreement. Record account evidence separately from local sender tests.

Official SPA measurement guidance: https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications

## Redirect / indexability checks
- Read-only live tests on 11 October: HTTP apex → HTTPS apex → HTTPS www (308+308), HTTP www → HTTPS www (308), HTTPS apex → HTTPS www (308). No loop found.
- Root and unprefixed cars redirect temporarily (307) to /ar without a language cookie. /ar/cars and /en/cars return 200.
- Live /ar/cairo-airport-transfer and /ar/sphinx-airport-transfer currently return 404: unpublished implementation must not be called live complete.
- /ar/apartments was a candidate alias test, not a proven historical route; it returns 404. The actual /ar/hotel-apartments returns 200. Do not invent redirects for undocumented historical URLs; obtain real old links from Search Console/server logs.
- After approved deployment repeat HTTP/non-www/locale routing, inspect cookies/query preservation and every canonical/hreflang target. Keep www as primary host; discuss a one-hop apex HTTP redirect with the host if supported.

## Translation and image checks
- Current fixture sitemap has67 indexable URLs. The English Sharm/Hurghada placeholder is deliberately excluded, noindexed and absent from Arabic hreflang; retain this until an approved full translation exists.
- Repair/restore the approved Cairo/Giza article image source after the observed404; do not replace it arbitrarily.

## Other manual checks
- Validate deployed JSON-LD with Schema.org Validator and applicable Google Rich Results Test. Service schema alone does not imply rich-result eligibility.
- Verify real GBP ownership, business details/service area and owner-approved hours/photos. Do not invent an address.
- Request authentic reviews and publishing consent; do not invent testimonials or ratings.
- Obtain genuine relevant partner links, then monitor referred qualified enquiries.
- Run repeated mobile/desktop Lighthouse on the same deployed build, with Google resources loaded. Report median and all exclusions; monitor separate rolling CrUX field data.
