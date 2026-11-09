# Content gaps and unpublished briefs — 11 October 2026

These briefs are not routes, sitemap entries or promises of service availability. Existing public booking forms remain guest forms. A saved enquiry is not confirmation.

## Owner confirmation — 9 November 2026

The owner confirmed car transfers at Hurghada, Sharm El Sheikh and Borg El Arab airports; local landing pages are now prepared. The owner also confirmed Fast Track and reception/waiting in general but did not specify per-airport packages, inclusions or a waiting duration. Car prices include trip costs including roads, bridges, waiting and additional stops. Private trip enquiries include Cairo/Giza, Alexandria, Sharm, Hurghada and Luxor; programme and duration are discussed with the customer. Local changes require deployment. Older briefs below record the earlier state and are superseded where they conflict.

## Car with driver — local implementation, 4 November 2026

A dedicated Arabic/English `/car-with-driver` page now explains how to prepare an enquiry, choose a vehicle and review a quote. It links to the fleet, the confirmed Cairo and Sphinx airport transfer pages, and contact. The car service guide links back to it. Metadata, canonical, hreflang and Service/Breadcrumb JSON-LD are generated for both languages, and the sitemap derives the new URLs from the service metadata map. The page avoids promising particular routes, waiting times, prices or cancellation terms. It remains local until deployed and verified on the public site.

## Client data confirmation — 3 November 2026

The client confirmed that the vehicle, hotel, apartment and service information supplied for this SEO work is client-provided and accurate. Use those supplied facts in page copy; do not keep those supplied facts blocked for another approval round. This does not authorize inventing details that were not supplied, such as route coverage, luggage limits, waiting/cancellation terms, or supplier-specific inclusions.

The car detail template now includes the approved vehicle type, seats, year and notes in its metadata/specifications, and hides the empty model list. Hotel and apartment cards now render their existing localized descriptions. These are local changes and require deployment before production/Search Console can reflect them.

## Existing five services

Three bilingual practical guides have been prepared locally at `/blog/booking-guides/cairo-airport-transfer`, `/blog/booking-guides/car-with-driver`, and `/blog/booking-guides/hotel-apartment-quotes`. They are linked from the blog and use page-specific metadata and BlogPosting structured data without invented dates or authors. They require review and deployment; they do not change the database-backed articles. Other proposed articles and the existing incomplete English Sharm/Hurghada translation remain open.

Three additional bilingual guides are prepared locally at `/blog/booking-guides/airport-fast-track`, `/blog/booking-guides/flight-quote`, and `/blog/booking-guides/serviced-apartment`. The six guides have distinct topics and link to existing services. They make no airport-specific Fast Track promise and do not change stored articles. Review and deployment remain necessary.
Bilingual guides now explain preparation, submission, quote review and contacting the team for existing bookings. Public FAQs ask the customer to confirm terms rather than asserting supplier terms.

Additional operational facts not present in the supplied records:
- Cars: Current records provide vehicle type, seats, year, price unit and notes. Add driver inclusion, routes, luggage capacity, waiting, extra-stop or cancellation details only when provided for the product.
- Hotels: Current records provide descriptions, features, city and price. Keep room-specific meals, taxes, dates and payment/cancellation terms tied to the approved offer.
- Apartments: Current records provide location, rooms, capacity, features and descriptions. Add deposits, utility charges and check-in/out details only when supplied.
- Flights: Keep fare-specific baggage, payment, issuance and change terms tied to the actual airline and offer.
- Fast Track: Use the supplied package descriptions as approved. Do not infer named-airport availability or meeting arrangements beyond the package's recorded airport and inclusions.

## Airport expansion — NOT PUBLISHED
CAI and SPX pickup/drop-off are confirmed and have distinct bilingual pages, forms, airport-identification guidance, FAQs and reciprocal links. Signs, flight tracking, waiting times and guaranteed pickup arrangements remain unconfirmed.

Hurghada Airport brief: confirm airport-specific pickup/drop-off separately from city trips; then confirm service area, request details and inclusions. Ask the same questions for Sharm El Sheikh Airport. Until approval, do not create either airport route or add airport-specific Fast Track claims.
Additional city-service briefs: request confirmed routes, actual service boundaries, available booking options and original useful local detail. Do not generate city-name substitutions.

## Existing articles
All six public-snapshot articles in both languages undergo HTML sanitation, heading/TOC preparation, metadata/schema checks and link review. Stored article meaning and translations are preserved. Related articles prioritize the same stored category; service planning links are server rendered. Unprefixed links to known services are localized, while deliberate language links and external links are preserved.

No named author exists in the current article model. Removed the unsupported “Verified Author” badge and editorial authorship wording. Do not add author schema until a real author is supplied. ISO dates may enter schema only when supplied; localized dates do not justify fabricated ISO dates. Existing read-time/date text still needs editorial approval. The malformed local articles.json fallback needs a complete approved export, not destructive trimming.

## New article briefs — editorial approval needed
1. AR/EN: How to prepare a CAI transfer request. Intent: practical planning; link to CAI and car selection. Use confirmed pickup/drop-off; obtain actual reception details before describing them.
2. AR/EN: SPX versus CAI in a transport request. Intent: avoid booking the wrong airport; link to both confirmed pages. Review airport facts before adding terminal/location details.
3. AR/EN: Hotel quote checklist. Cover dates, guests, room preferences and questions to ask; link to hotels. Obtain supplier terms before asserting meals/taxes/refunds.
4. AR/EN: Serviced apartment enquiry checklist. Cover party size, stay duration and amenities to clarify; link to apartments. No invented amenities or deposits.
5. AR/EN: Flight quote checklist. Cover itinerary, dates and baggage questions; link to flights. No visa advice, guaranteed fare or invented airline policy.
6. AR/EN: Selecting a listed vehicle for passengers and luggage. Link to cars and verified vehicle details. Seats do not prove luggage capacity.

Acceptance: editorial approval, independent title/description, one H1, real image alt, accurate language, reciprocal canonical/hreflang, safe HTML, relevant descriptive internal links, no invented service facts. Publishing new content requires separate approval.

## Exact missing translation found in public snapshot
The English body of guide-sharm-hurghada is only “Content about Sharm and Hurghada...”, not a full translation. The Arabic body remains intact. Local publication policy excludes this English version from sitemap/hreflang, applies noindex,follow, and displays an English preparation notice linking to the full Arabic guide. Supply the approved full translation before restoring English indexability; neither author nor publication date should be invented.

## Observed image source problem
Final HEAD check: the source image for cairo-giza-best-places returned404: https://res.cloudinary.com/b2tqubbe/image/upload/v1788897277/limo-masr/rjgu1yaareu56eyj33re.png . Owner action: investigate/restore the original asset or supply an approved replacement. No image was replaced and no production data was changed. Forty-three of44 checked sources returned200; a successful HEAD does not prove visual quality or cold live delivery.
