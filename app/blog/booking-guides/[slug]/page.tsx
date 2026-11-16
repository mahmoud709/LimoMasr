import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/data";
import { withLang } from "@/lib/i18n";
import { pageMetadata, seoLocale, serviceSeo, type SeoProps } from "@/lib/seo";
import { articleGraph } from "@/lib/structured-data";

type Section = { heading: string; body: string };
type GuideText = { title: string; intro: string; sections: Section[]; action: string };
type Guide = { path: keyof typeof serviceSeo; service: string; ar: GuideText; en: GuideText };
const guides: Record<string, Guide> = {
  "cairo-family-travel": {
    path: "/blog/booking-guides/cairo-family-travel", service: "/private-tours",
    ar: { title: "دليل زيارة القاهرة والجيزة للعائلات", intro: "تجمع القاهرة والجيزة بين الآثار والمتاحف وأماكن التنزه. التخطيط حسب أعمار الأطفال وموقع الإقامة يساعد الأسرة على الاستمتاع بالزيارة دون ازدحام الجدول.", sections: [
      { heading: "ابدأ بما يناسب أسرتك", body: "يمكن تخصيص زيارة لهضبة الجيزة ورؤية الأهرامات وأبي الهول، ويوم آخر لمتحف أو منطقة من القاهرة التاريخية. اختر الأنشطة حسب اهتمامات الأسرة، وتحقق مسبقًا من أوقات الزيارة وإمكانية دخول الأطفال والأسعار من الجهة الرسمية." },
      { heading: "اختر الإقامة حسب برنامجك", body: "قارن موقع الفندق أو الشقة الفندقية بمناطق الزيارة، وعدد غرف النوم وتوزيع الأسرّة والخدمات المطلوبة. اطلب السعر الإجمالي وشروط الدخول والإلغاء؛ لا تفترض أن الوجبات أو رسومًا معينة مشمولة." },
      { heading: "خطط للتنقل بين الزيارات", body: "اترك وقتًا كافيًا للتنقل والراحة، خصوصًا مع الأطفال. عند طلب سيارة بسائق حدد عدد الركاب والحقائب ومقاعد الأطفال إن لزمت، وأرسل خط السير لتأكيد ملاءمة السيارة والترتيبات." },
      { heading: "قبل الخروج", body: "جهز الماء ووسائل الحماية من الشمس، وراجع متطلبات الدخول وإمكانية الوصول لكل موقع. يمكنك سؤال فريق ليمو مصر عن النقل والإقامة أو مناقشة برنامج مرن؛ التذاكر والمرشد والخدمات الإضافية لا تُفترض ضمن العرض." },
    ], action: "ناقش رحلة خاصة" },
    en: { title: "A family guide to visiting Cairo and Giza", intro: "Cairo and Giza offer monuments, museums and places to explore. Planning around children's ages and your accommodation location can keep the schedule comfortable.", sections: [
      { heading: "Start with your family's interests", body: "Consider a visit to the Giza Plateau to see the pyramids and Sphinx, and another day for a museum or historic Cairo. Choose activities for your group and check official opening hours, child access and current tickets in advance." },
      { heading: "Choose accommodation around your plans", body: "Compare hotel or apartment locations with your intended visits, bedroom and bed arrangements, and facilities you need. Request the total price and check-in and cancellation terms; do not assume meals or fees are included." },
      { heading: "Plan travel between visits", body: "Allow time for travel and breaks, especially with children. When requesting a chauffeured car, specify passengers, luggage and any child-seat needs and share the itinerary to check vehicle suitability and arrangements." },
      { heading: "Before you set out", body: "Prepare water and sun protection, and check each attraction's access and entry requirements. You can ask Limo Egypt about transport and accommodation or discuss a flexible itinerary; tickets, guides and extra services should not be assumed included." },
    ], action: "Discuss a private trip" },
  },
  "egypt-seven-day-itinerary": {
    path: "/blog/booking-guides/egypt-seven-day-itinerary", service: "/private-tours",
    ar: { title: "برنامج مقترح لزيارة مصر في 7 أيام", intro: "هذا مثال مرن للتخطيط الشخصي، وليس باقة ثابتة أو عرض سعر. يمكن تعديل الوجهات والمدة بحسب مواعيد الوصول واهتمامات المسافرين والتوافر.", sections: [
      { heading: "اليومان الأول والثاني: القاهرة والجيزة", body: "خصص يوم الوصول للراحة حسب موعد الرحلة، ثم فكر في زيارة هضبة الجيزة أو أحد المتاحف. راجع المواعيد والتذاكر الرسمية، واترك وقتًا كافيًا للتنقل بدل جمع زيارات كثيرة في يوم واحد." },
      { heading: "اليوم الثالث: القاهرة التاريخية", body: "يمكن اختيار جولة في إحدى مناطق القاهرة التاريخية أو تجربة هادئة قرب النيل. راعِ ساعات الدخول وأيام عمل الأماكن والأنشطة التي تناسب المجموعة." },
      { heading: "اليومان الرابع والخامس: الأقصر", body: "إذا رغبت في إضافة الأقصر، خصص وقتًا للانتقال والإقامة، ثم اختر مواقع أثرية تناسب وقتك. تحقق من وسائل السفر والتوافر ومواعيد المعالم قبل تثبيت الخطة." },
      { heading: "اليومان السادس والسابع: البحر الأحمر أو العودة", body: "يمكن مناقشة التوجه إلى الغردقة أو شرم الشيخ إذا سمحت مواعيد الانتقال، أو قضاء الوقت المتبقي في القاهرة قبل المغادرة. تختلف ملاءمة المسار حسب نقطة العودة ووسيلة السفر؛ لا تفترض إمكانية جميع الزيارات دون مراجعة الجدول." },
      { heading: "كيف تطلب عرضًا يناسبك؟", body: "أرسل عدد المسافرين وتواريخ الرحلة ووجهاتك والإقامة المطلوبة وميزانيتك. يناقش الفريق البرنامج ومدته والسعر وما يشمله؛ التذاكر والطيران والإقامة والمرشد ليست مشمولة تلقائيًا." },
    ], action: "ناقش برنامج رحلتك" },
    en: { title: "A suggested seven-day Egypt itinerary", intro: "This is a flexible personal-planning example, not a fixed package or quote. Adapt the destinations and duration to arrival times, interests and availability.", sections: [
      { heading: "Days 1 and 2: Cairo and Giza", body: "Allow time to rest on arrival, then consider the Giza Plateau or a museum. Check official hours and tickets and allow sufficient travel time instead of packing too many visits into one day." },
      { heading: "Day 3: Historic Cairo", body: "Consider exploring an area of historic Cairo or spending a quieter period near the Nile. Check opening days and choose activities that suit your group." },
      { heading: "Days 4 and 5: Luxor", body: "If Luxor interests you, allow time for the journey and accommodation, then choose archaeological sites that fit your schedule. Check transport, availability and attraction hours before finalising plans." },
      { heading: "Days 6 and 7: Red Sea or return", body: "Consider Hurghada or Sharm El Sheikh if connections and timing allow, or spend the remaining time in Cairo before departure. The practical route depends on your return point and transport, so check the itinerary before committing." },
      { heading: "How to request a tailored quote", body: "Share your passenger count, dates, preferred destinations, accommodation and budget. The team can discuss the itinerary, duration, price and inclusions; tickets, flights, hotels and guides are not automatically included." },
    ], action: "Discuss your itinerary" },
  },
  "airport-fast-track": {
    path: "/blog/booking-guides/airport-fast-track", service: "/fast-track",
    ar: { title: "كيف تطلب خدمة فاست تراك بالمطار؟", intro: "تتوفر خدمة فاست تراك حصريًا في مطار القاهرة الدولي للمساعدة في ترتيبات الوصول أو المغادرة بحسب الباقة المتاحة؛ راجع نطاق الخدمة مع الفريق قبل الحجز.", sections: [
      { heading: "حدد المطار والرحلة", body: "أرسل اسم المطار وتاريخ ووقت الرحلة ورقمها إن كان متاحًا، وحدد إن كنت تصل أم تغادر. وجود باقة في الموقع لا يضمن توفرها في مطار أو موعد معين؛ اطلب التأكيد أولًا." },
      { heading: "جهز بيانات المسافرين", body: "حدد عدد المسافرين وأسماءهم واحتياجات المساعدة المطلوبة. راجع مع الفريق المستندات اللازمة وطريقة تقديمها، ولا تشارك صورًا إضافية قبل معرفة الحاجة إليها." },
      { heading: "قارن الباقات ونقطة اللقاء", body: "اسأل عما تتضمنه الباقة ونقطة الالتقاء والتوقيت والسعر الإجمالي، وشروط التعديل والإلغاء. قد تختلف المساعدة وفق المطار والباقة والجهات المختصة." },
      { heading: "النقل ومستندات السفر", body: "لا تفترض أن سيارة المطار ضمن الباقة؛ اطلب النقل منفصلًا عند الحاجة. خدمة المساعدة لا تحل محل جواز السفر أو التأشيرة أو قرارات الجهات المختصة. إرسال الطلب لا يؤكد التوافر أو الحجز." },
    ], action: "استعرض باقات فاست تراك" },
    en: { title: "How to request airport Fast Track assistance", intro: "Fast Track is available exclusively at Cairo International Airport for arrival or departure assistance according to the available package. Review its scope with the team before booking.", sections: [
      { heading: "Identify your airport and flight", body: "Share the airport, flight date and time, flight number if available, and whether you are arriving or departing. A listed package does not guarantee availability at a specific airport or time; ask the team to confirm." },
      { heading: "Prepare passenger details", body: "Provide the number and names of passengers and any assistance needs. Ask the team which documents are needed and how to provide them; avoid sharing additional copies before confirming the need." },
      { heading: "Compare packages and meeting arrangements", body: "Ask what is included, where and when to meet, the total price, and change and cancellation conditions. Assistance can vary by airport, package and the decisions of the relevant authorities." },
      { heading: "Transfers and travel documents", body: "Do not assume an airport car is included; request transport separately if needed. Assistance does not replace your passport, visa or official travel requirements. Sending a request does not confirm availability or a booking." },
    ], action: "Explore Fast Track packages" },
  },
  "flight-quote": {
    path: "/blog/booking-guides/flight-quote", service: "/flights",
    ar: { title: "كيف تطلب عرض حجز طيران مناسبًا لرحلتك؟", intro: "تجهيز خط السير وبيانات المسافرين يساعد الفريق على مراجعة خيارات الطيران وإرسال عرض للمقارنة.", sections: [
      { heading: "حدد خط السير والمواعيد", body: "اذكر مدينة أو مطار المغادرة والوصول، واختر ذهابًا فقط أو ذهابًا وعودة مع تواريخ السفر. وضح إذا كانت مواعيدك مرنة أو لديك تفضيل للرحلات المباشرة أو وقت الوصول." },
      { heading: "أرسل احتياجات المسافرين", body: "حدد عدد المسافرين، واذكر الأطفال أو الاحتياجات الخاصة والدرجة المفضلة والأمتعة المطلوبة. راجع أسماء المسافرين مع مستندات السفر قبل إصدار التذاكر." },
      { heading: "قارن العرض الكامل", body: "راجع المطارات ومواعيد الرحلات والتوقفات والعملة والسعر الإجمالي، وما يشمله العرض من أمتعة وخدمات. اسأل عن مدة صلاحية السعر وشروط الدفع والإصدار لدى مقدم العرض." },
      { heading: "قبل التأكيد", body: "استفسر عن شروط التعديل والإلغاء والاسترداد الخاصة بالتذكرة وشركة الطيران، وتحقق بنفسك من مستندات السفر المطلوبة. إرسال طلب العرض لا يعني إصدار تذكرة أو تثبيت السعر." },
    ], action: "اطلب عرض طيران" },
    en: { title: "How to request a flight quote for your trip", intro: "Preparing your itinerary and passenger details helps the team review flight options and provide an offer to compare.", sections: [
      { heading: "Set your route and dates", body: "Provide your departure and destination cities or airports and choose one-way or return travel with your dates. Mention flexible dates and any preference for direct flights or arrival times." },
      { heading: "Share passenger needs", body: "Give the passenger count and mention children, assistance needs, preferred cabin and required baggage. Check passenger names against travel documents before tickets are issued." },
      { heading: "Compare the complete offer", body: "Review airports, schedules, connections, currency and total price, along with baggage and services included. Ask the provider how long the quote is valid and about payment and ticket issuance." },
      { heading: "Before confirming", body: "Ask about the ticket and airline's change, cancellation and refund rules, and independently check required travel documents. A quote request does not issue a ticket or lock in a fare." },
    ], action: "Request a flight quote" },
  },
  "serviced-apartment": {
    path: "/blog/booking-guides/serviced-apartment", service: "/hotel-apartments",
    ar: { title: "كيف تختار شقة فندقية مناسبة لإقامتك في مصر؟", intro: "ابدأ بمكان الإقامة والمدة وعدد الضيوف، ثم قارن تفاصيل كل شقة مع العرض المقدم قبل التأكيد.", sections: [
      { heading: "حدد المنطقة والمدة", body: "اختر المنطقة المناسبة لبرنامجك، وشارك تاريخ الوصول وعدد الليالي. اسأل عن العنوان الفعلي ووسائل الوصول إليه قبل اعتماد الاختيار، خصوصًا إذا كنت تخطط لتنقلات يومية." },
      { heading: "راجع السعة وتوزيع الغرف", body: "اذكر عدد البالغين والأطفال وغرف النوم المطلوبة. اسأل عن توزيع الأسرّة والسعة المسموح بها وأي احتياجات خاصة؛ عدد الغرف وحده لا يوضح ملاءمة كل وحدة." },
      { heading: "اسأل عن المرافق والخدمات", body: "حدد احتياجاتك مثل المطبخ والإنترنت والمصعد والتنظيف أو موقف السيارة، ثم راجع توفرها في الشقة المعروضة. تختلف المرافق والخدمات من وحدة لأخرى." },
      { heading: "راجع السعر والشروط", body: "اطلب إجمالي السعر والعملة، وتوضيح أي تأمين أو رسوم ومواعيد الدخول والخروج وشروط الدفع والإلغاء. أرسل ميزانيتك ورقم تواصل كاملًا؛ الاستفسار لا يؤكد التوافر." },
    ], action: "اطلب عرض شقة فندقية" },
    en: { title: "How to choose a serviced apartment in Egypt", intro: "Start with your preferred location, stay length and guest count, then compare each apartment against the offer before confirming.", sections: [
      { heading: "Choose an area and stay length", body: "Select an area that suits your plans and share your arrival date and number of nights. Ask for the actual address and how to reach it before choosing, especially if you plan daily trips." },
      { heading: "Review capacity and room layout", body: "Specify adults, children and the number of bedrooms needed. Ask about bed arrangements, permitted occupancy and accessibility needs; room count alone does not establish whether a unit fits your party." },
      { heading: "Ask about amenities and services", body: "Identify needs such as a kitchen, internet, lift, cleaning or parking, then confirm each is available in the offered apartment. Amenities and services vary between units." },
      { heading: "Review price and terms", body: "Ask for the total and currency, any deposit or extra charges, check-in and check-out times, and payment and cancellation terms. Provide your budget and a complete contact number; an enquiry does not confirm availability." },
    ], action: "Request an apartment quote" },
  },
  "cairo-airport-transfer": {
    path: "/blog/booking-guides/cairo-airport-transfer", service: "/cairo-airport-transfer",
    ar: { title: "دليل طلب استقبال أو توصيل مطار القاهرة", intro: "تحديد اتجاه الرحلة وتفاصيل المسافرين يساعد فريق الحجز على مراجعة طلب النقل وإعداد عرض يناسب رحلتك.", sections: [
      { heading: "حدد اتجاه النقل والمطار", body: "للوصول، اذكر مطار القاهرة ووجهتك بعد الخروج. للمغادرة، اذكر عنوان الانطلاق ومطار القاهرة كوجهة. إذا كان لديك أكثر من رحلة أو مطار، راجع الرمز المكتوب على تذكرتك لتجنب اختيار مطار مختلف." },
      { heading: "جهز الموعد والركاب والأمتعة", body: "أرسل تاريخ ووقت الرحلة وعدد الركاب والحقائب، وأضف رقم الرحلة في الملاحظات إن كان متاحًا. اذكر احتياجات الأطفال أو الأمتعة الكبيرة حتى يسهل على الفريق مراجعة ملاءمة السيارة." },
      { heading: "راجع التفاصيل قبل التأكيد", body: "اسأل الفريق عن التوافر والسعر النهائي ونقطة اللقاء ومدة الانتظار وأي رسوم أو شروط تعديل وإلغاء. لا تفترض أن خدمة فاست تراك مشمولة؛ تأكد من توفرها منفصلة إن احتجتها." },
      { heading: "بعد إرسال الطلب", body: "أرسل رقم هاتف كاملًا يمكن التواصل عليه واحتفظ بتفاصيل رحلتك. إرسال النموذج طلب لمراجعة الخدمة، ويؤكد الفريق التوافر والترتيبات معك قبل اعتماد الحجز." },
    ], action: "اطلب نقل مطار القاهرة" },
    en: { title: "How to request a Cairo Airport pickup or drop-off", intro: "Sharing your direction of travel and passenger details helps the booking team review your transfer request and prepare a suitable quote.", sections: [
      { heading: "Identify the airport and direction", body: "For arrivals, name Cairo Airport and your destination afterwards. For departures, provide your pickup address and Cairo Airport as the destination. If your itinerary includes more than one airport, check the code on your ticket to avoid selecting the wrong one." },
      { heading: "Prepare your time, passengers and luggage", body: "Share the travel date and time, number of passengers and bags, and add your flight number in the notes if available. Mention children or oversized luggage so the team can check vehicle suitability." },
      { heading: "Review the offer before confirming", body: "Ask the team about availability, the final price, meeting point, waiting time, extra charges and change or cancellation terms. Do not assume Fast Track is included; check its availability separately if needed." },
      { heading: "After sending your request", body: "Provide a complete phone number and keep your itinerary handy. Submitting the form is an enquiry; the team confirms availability and arrangements with you before the booking is agreed." },
    ], action: "Request a Cairo Airport transfer" },
  },
  "car-with-driver": {
    path: "/blog/booking-guides/car-with-driver", service: "/car-with-driver",
    ar: { title: "كيف تطلب سيارة بسائق في مصر؟", intro: "ابدأ بخطة تنقلك وعدد الركاب، ثم قارن السيارات وراجع تفاصيل العرض مع الفريق قبل تأكيد الطلب.", sections: [
      { heading: "حدد خط السير والمدة", body: "اكتب مكان الانطلاق والوجهة والموعد وأي توقفات ترغب فيها. إذا احتجت السيارة لأكثر من يوم، حدد تواريخ البداية والنهاية وخطة التنقل المتوقعة لمراجعة العرض المناسب." },
      { heading: "اختر السيارة المناسبة", body: "راجع عدد المقاعد ونوع السيارة في صفحة الأسطول، واذكر عدد الحقائب والأطفال وأي احتياجات إضافية. عدد المقاعد وحده لا يضمن مساحة كافية للأمتعة، لذا اطلب التأكد من ملاءمة السيارة." },
      { heading: "افهم السعر وما يشمله", body: "راجع وحدة السعر المعروضة، ثم اسأل عن السعر الإجمالي حسب المسار والمدة، وما إذا كانت الطرق أو التوقفات الإضافية داخلة في العرض. تختلف التفاصيل حسب الرحلة والعرض الذي يقدمه الفريق." },
      { heading: "أرسل طلبك وراجع الشروط", body: "اختر السيارة وأرسل بيانات الرحلة ورقم تواصل كاملًا. قبل التأكيد راجع التوافر ومكان الالتقاء وشروط الانتظار والتعديل والإلغاء؛ حفظ الطلب لا يساوي تأكيد الحجز." },
    ], action: "استعرض خدمة السيارة بسائق" },
    en: { title: "How to request a car with a driver in Egypt", intro: "Start with your itinerary and passenger count, compare vehicles, and review the offer with the team before confirming.", sections: [
      { heading: "Define your route and duration", body: "Provide the pickup, destination, time and any planned stops. For more than one day, share the start and end dates and your expected itinerary so the team can review a suitable quote." },
      { heading: "Choose a suitable vehicle", body: "Check the seat count and vehicle type in the fleet. Mention bags, children and any additional needs. Seat count alone does not guarantee luggage space, so ask the team to confirm the vehicle fits your party." },
      { heading: "Understand the price and inclusions", body: "Check the displayed pricing unit, then ask for the total based on your route and duration and whether road charges or extra stops are included. Details depend on the trip and the team's offer." },
      { heading: "Submit and review the terms", body: "Choose a vehicle and send your itinerary and a complete contact number. Before confirming, check availability, meeting point and waiting, change and cancellation terms. Saving a request does not confirm the booking." },
    ], action: "Explore car with driver service" },
  },
  "hotel-apartment-quotes": {
    path: "/blog/booking-guides/hotel-apartment-quotes", service: "/hotels",
    ar: { title: "كيف تقارن عروض الفنادق والشقق الفندقية؟", intro: "تساعدك بيانات الإقامة الواضحة على طلب عروض قابلة للمقارنة، سواء كنت تبحث عن فندق أو شقة فندقية.", sections: [
      { heading: "جهز التواريخ وعدد الضيوف", body: "حدد منطقة الإقامة وتاريخ الوصول وعدد الليالي وعدد الضيوف، وأعمار الأطفال إن كانت مؤثرة في العرض. وضّح عدد الغرف أو غرف النوم المطلوبة وأي احتياجات وصول أو أسرة إضافية." },
      { heading: "قارن الموقع والمرافق", body: "راجع الموقع الفعلي ونوع الغرفة أو الشقة والسعة والمرافق المهمة لك. في الشقق، اسأل عن المطبخ والتنظيف والإنترنت أو المصعد إذا كانت ضرورية؛ لا تفترض أن كل وحدة تشملها." },
      { heading: "راجع إجمالي العرض وشروطه", body: "اطلب السعر الإجمالي للمدة والعملة، وما إذا كانت الضرائب والوجبات وأي تأمين أو رسوم إضافية مشمولة. تأكد من شروط الدفع والإلغاء والتعديل ومواعيد الدخول والخروج لكل عرض." },
      { heading: "اطلب العرض ثم أكد التفاصيل", body: "أرسل ميزانيتك وتفضيلاتك ورقم هاتف كاملًا. التوافر والسعر النهائي يحددهما العرض المؤكد، وإرسال الاستفسار وحده لا يضمن توفر الغرفة أو الشقة." },
    ], action: "اطلب عرض فندق" },
    en: { title: "How to compare hotel and serviced apartment quotes", intro: "Clear stay details make it easier to request comparable offers, whether you need a hotel or a serviced apartment.", sections: [
      { heading: "Prepare dates and guest details", body: "Choose an area, arrival date, number of nights and guests, including children's ages where relevant. Specify the number of rooms or bedrooms and any accessibility or extra-bed needs." },
      { heading: "Compare location and amenities", body: "Check the actual location, room or apartment type, capacity and amenities that matter to you. For apartments, ask about kitchen facilities, cleaning, internet or a lift where needed; do not assume every unit includes them." },
      { heading: "Review the full quote and terms", body: "Request the total for your stay and its currency, and ask whether taxes, meals, deposits or other charges are included. Check payment, cancellation and change conditions and the check-in and check-out times for each offer." },
      { heading: "Request a quote and confirm details", body: "Share your budget, preferences and a complete phone number. Availability and final pricing depend on the confirmed offer; sending an enquiry alone does not reserve a room or apartment." },
    ], action: "Request a hotel quote" },
  },
};

type Props = SeoProps & { params: Promise<{ slug: string }> };
export async function generateMetadata(props: Props) {
  const [{ slug }, locale] = await Promise.all([props.params, seoLocale(props)]);
  const guide = guides[slug];
  if (!guide) notFound();
  const [title, description] = serviceSeo[guide.path][locale];
  return { ...pageMetadata(guide.path, locale, title, description), openGraph: { ...pageMetadata(guide.path, locale, title, description).openGraph, type: "article" as const } };
}
export default async function BookingGuidePage(props: Props) {
  const [{ slug }, locale, settings] = await Promise.all([props.params, seoLocale(props), getSiteSettings()]);
  const guide = guides[slug];
  if (!guide) notFound();
  const text = guide[locale];
  const en = locale === "en";
  return <PublicLayout settings={settings} locale={locale}>
    <JsonLd nodes={articleGraph(guide.path, locale, { title: text.title, excerpt: text.intro, image: "", date: "" })} />
    <main className="mx-auto max-w-4xl px-6 md:px-8 pt-32 pb-20" dir={en ? "ltr" : "rtl"}>
      <nav aria-label={en ? "Breadcrumbs" : "مسار الصفحة"} className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link className="underline" href={withLang("/", locale)}>{en ? "Home" : "الرئيسية"}</Link><span aria-hidden="true">/</span>
        <Link className="underline" href={withLang("/blog", locale)}>{en ? "Blog" : "المدونة"}</Link><span aria-hidden="true">/</span><span aria-current="page">{text.title}</span>
      </nav>
      <article><h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] leading-tight">{text.title}</h1>
        <p className="mt-6 leading-8">{text.intro}</p>
        {text.sections.map(section => <section key={section.heading} className="mt-10"><h2 className="text-2xl font-bold text-[#1a2b3c]">{section.heading}</h2><p className="mt-3 leading-8">{section.body}</p></section>)}
      </article>
      {(slug === "cairo-family-travel" || slug === "egypt-seven-day-itinerary") && <p className="mt-8 leading-7 text-sm">{en ? "Check current visitor information with " : "راجع معلومات الزيارة الحالية على "}<a className="underline" href="https://egymonuments.gov.eg/archaeological-sites/giza-plateau/" target="_blank" rel="noreferrer">{en ? "Egypt's Ministry of Tourism and Antiquities" : "موقع وزارة السياحة والآثار"}</a>{en ? " and " : " و"}<a className="underline" href="https://www.experienceegypt.eg/en/attraction-details/292/historic-cairo" target="_blank" rel="noreferrer">Experience Egypt</a>.</p>}
      <div className="mt-10 flex flex-wrap gap-5"><Link href={withLang(guide.service, locale)} className="rounded-xl bg-[#1a2b3c] px-6 py-3 font-bold text-white">{text.action}</Link>
        {slug === "hotel-apartment-quotes" && <Link href={withLang("/hotel-apartments", locale)} className="self-center underline">{en ? "Request an apartment quote" : "اطلب عرض شقة فندقية"}</Link>}
        <Link href={withLang("/blog", locale)} className="self-center underline">{en ? "More travel guides" : "المزيد من أدلة السفر"}</Link></div>
    </main>
  </PublicLayout>;
}
