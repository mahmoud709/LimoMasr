import type { Locale, ServiceType } from "./types";

type Guide = { title: string; intro: string; checklist: string[]; faqs: { question: string; answer: string }[] };

export const serviceContent: Record<ServiceType, Record<Locale, Guide>> = {
  car: {
    ar: {
      title: "اختيار سيارة أو ليموزين لرحلتك في مصر",
      intro: "ابدأ بعدد الركاب ومسار الرحلة، ثم استعرض الموديلات والمقاعد والسعر ووحدة التسعير في صفحة كل سيارة. اختر بين طلب توصيلة وخدمة يومية حسب خطة تنقلك.",
      checklist: ["مكان الانطلاق والوصول وتاريخ ووقت الرحلة.", "عدد الركاب والحقائب لاختيار السعة المناسبة.", "للحجز اليومي: مكان الإقامة وتاريخ بداية الخدمة ونهايتها."],
      faqs: [
        { question: "كيف أختار السيارة المناسبة؟", answer: "قارن عدد المقاعد والموديلات المعروضة، وأرسل عدد الحقائب مع طلبك. عدد المقاعد وحده لا يحدد مساحة الأمتعة؛ راجع ملاءمة السيارة قبل تأكيد الحجز." },
        { question: "هل السعر للرحلة أم لليوم؟", answer: "تظهر وحدة التسعير بجوار السعر في تفاصيل السيارة. وضّح مسار الرحلة أو مدة الخدمة اليومية عند إرسال الطلب لمراجعة السعر المطلوب." },
        { question: "ما المعلومات المطلوبة لتوصيلة المطار؟", answer: "حدد المطار ونقطة الوصول وعدد الركاب والحقائب وموعد الرحلة. أضف رقم الرحلة في الملاحظات، واسأل عن نقطة اللقاء ومدة الانتظار قبل التأكيد." },
      ],
    },
    en: {
      title: "Choosing a car or limousine for your Egypt trip",
      intro: "Start with your passenger count and route, then compare models, seats, prices and pricing units on each car page. Choose a transfer request or daily service to match your plans.",
      checklist: ["Pickup and destination, travel date and time.", "Passenger and luggage counts to check capacity.", "For daily service: accommodation location and start and end dates."],
      faqs: [
        { question: "How do I choose the right car?", answer: "Compare the listed seats and models and include your luggage count. Seats alone do not determine luggage capacity; check suitability before confirming the booking." },
        { question: "Is the price per trip or per day?", answer: "The pricing unit is shown beside the price on the car details page. Include your route or daily service duration so the requested price can be reviewed." },
        { question: "What details should I send for an airport transfer?", answer: "Specify the airport, destination, passengers, luggage and travel time. Add your flight number in the notes and ask about the meeting point and waiting time before confirmation." },
      ],
    },
  },
  hotel: {
    ar: {
      title: "كيف تطلب عرض حجز فندق في مصر؟",
      intro: "اختيار الفندق يبدأ بالمدينة ومدة الإقامة وعدد الضيوف. أرسل طلبك بالميزانية المناسبة لك، وراجع تفاصيل الغرفة والعرض عبر واتساب قبل تأكيد الإقامة.",
      checklist: ["المدينة أو الفندق المطلوب وتاريخ الوصول وعدد الليالي.", "عدد الضيوف، مع أعمار الأطفال إن وجدوا في الملاحظات.", "الميزانية وتفضيلات الغرف والوجبات أو أي متطلبات خاصة."],
      faqs: [
        { question: "هل إرسال النموذج يؤكد حجز الفندق؟", answer: "النموذج يرسل طلب حجز للمراجعة. راجع توافر الغرفة والسعر وتفاصيل الإقامة مع الفريق قبل اعتبار الحجز مؤكدًا." },
        { question: "هل عرض الإقامة يشمل الوجبات والضرائب؟", answer: "راجع هذه البنود في عرض الفندق المحدد. اسأل عن نوع الغرفة والوجبات والضرائب والرسوم وأي مبالغ تُدفع في الفندق قبل الموافقة على العرض." },
        { question: "هل يمكن تعديل الإقامة أو إلغاؤها؟", answer: "اطلب شروط التعديل والإلغاء الخاصة بعرضك قبل التأكيد؛ لا تفترض أن جميع الغرف والعروض لها الشروط نفسها." },
      ],
    },
    en: {
      title: "How to request a hotel booking quote in Egypt",
      intro: "Start with the city, stay duration and guest count. Send your request with a suitable budget and review the room and offer details via WhatsApp before confirming your stay.",
      checklist: ["Preferred city or hotel, arrival date and number of nights.", "Guest count, with children's ages in the notes where applicable.", "Budget, room and meal preferences, and any special requirements."],
      faqs: [
        { question: "Does submitting the form confirm my hotel booking?", answer: "The form sends a booking request for review. Check room availability, price and stay details with the team before treating it as confirmed." },
        { question: "Does the offer include meals and taxes?", answer: "Check these items in your specific hotel offer. Ask about room type, meals, taxes, fees and amounts payable at the hotel before accepting." },
        { question: "Can I change or cancel my stay?", answer: "Request the change and cancellation terms for your offer before confirmation; different rooms and offers can have different terms." },
      ],
    },
  },
  apartment: {
    ar: {
      title: "اختيار شقة فندقية تناسب مدة إقامتك",
      intro: "حدد المنطقة ومدة الإقامة وعدد الضيوف، ثم قارن عدد الغرف والسعة والمرافق في الخيارات المعروضة. وضّح احتياجات الأسرة أو المجموعة عند طلب عرض الإقامة.",
      checklist: ["المنطقة المطلوبة وتاريخ الوصول وعدد الليالي.", "عدد الضيوف وعدد غرف النوم المطلوب.", "الميزانية والمرافق المهمة لك، مثل المطبخ أو المصعد."],
      faqs: [
        { question: "كيف أعرف إن الشقة مناسبة لعدد الضيوف؟", answer: "راجع السعة وعدد الغرف في تفاصيل الشقة، واسأل عن توزيع الأسرّة وأي احتياجات خاصة قبل التأكيد." },
        { question: "هل التنظيف والخدمات مشمولة؟", answer: "المرافق والخدمات تختلف حسب الشقة. اطلب توضيح التنظيف والإنترنت والمرافق والمبالغ الإضافية في عرض الإقامة." },
        { question: "ماذا أراجع قبل تأكيد الإقامة؟", answer: "راجع العنوان ومواعيد الدخول والخروج والسعر الإجمالي وأي تأمين وشروط الدفع والإلغاء الخاصة بالشقة المختارة." },
      ],
    },
    en: {
      title: "Choosing a serviced apartment for your stay",
      intro: "Specify your area, stay duration and guest count, then compare rooms, capacity and amenities in the listed options. Include family or group requirements when requesting a quote.",
      checklist: ["Preferred area, arrival date and number of nights.", "Guest count and required bedrooms.", "Budget and important amenities, such as a kitchen or lift."],
      faqs: [
        { question: "How do I check whether an apartment fits my group?", answer: "Review its listed capacity and room count, and ask about bed arrangements and any special requirements before confirmation." },
        { question: "Are cleaning and other services included?", answer: "Amenities and services vary by apartment. Ask for cleaning, internet, utilities and extra charges to be clarified in the stay offer." },
        { question: "What should I check before confirming?", answer: "Review the address, check-in and check-out times, total price, any deposit, and payment and cancellation terms for your chosen apartment." },
      ],
    },
  },
  fast_track: {
    ar: {
      title: "طلب فاست تراك ومساعدة بالمطار",
      intro: "استعرض الباقات حسب المطار، ثم أرسل موعد الرحلة وعدد المسافرين. راجع نطاق المساعدة ونقطة اللقاء مع الفريق حتى تختار الخدمة المناسبة لرحلة الوصول أو المغادرة.",
      checklist: ["المطار وتاريخ ووقت الرحلة ورقمها.", "عدد المسافرين والأسماء والجنسية المطلوبة في نموذج الباقة.", "توضيح وصول أو مغادرة وأي احتياجات للمساعدة في الملاحظات."],
      faqs: [
        { question: "هل خدمة فاست تراك تشمل سيارة من المطار؟", answer: "لا تفترض أن النقل مشمول في الباقة. راجع تفاصيلها، ويمكنك إرسال طلب سيارة منفصل إذا كنت تحتاج الانتقال من المطار أو إليه." },
        { question: "كيف أعرف الخدمة المتاحة في مطاري؟", answer: "راجع اسم المطار ووصف كل باقة، ثم تأكد من التوافر للموعد المطلوب ونقطة اللقاء وما تشمله المساعدة قبل التأكيد." },
        { question: "هل المساعدة بالمطار تُغني عن مستندات السفر؟", answer: "جهّز مستندات السفر المطلوبة لرحلتك؛ خدمة المساعدة لا تستبدل متطلبات السفر أو قرارات الجهات المختصة." },
      ],
    },
    en: {
      title: "Requesting airport fast track and assistance",
      intro: "Explore packages by airport and send your flight time and passenger count. Review the scope of assistance and meeting point with the team to choose a service for arrival or departure.",
      checklist: ["Airport, flight date, time and flight number.", "Passenger count, names and nationality requested in the package form.", "Arrival or departure and any assistance needs in the notes."],
      faqs: [
        { question: "Does fast track include an airport car transfer?", answer: "Do not assume transport is included. Check the package details and send a separate car request if you need a transfer to or from the airport." },
        { question: "How do I check the service available at my airport?", answer: "Review each package's airport and description, then confirm availability for your date, the meeting point and the included assistance." },
        { question: "Does airport assistance replace travel documents?", answer: "Prepare the documents required for your journey. Assistance does not replace travel requirements or decisions by the relevant authorities." },
      ],
    },
  },
  flight: {
    ar: {
      title: "طلب عرض طيران يناسب وجهتك ومواعيدك",
      intro: "حدد مدينتي المغادرة والوصول وتواريخ السفر، واختَر ذهابًا فقط أو ذهابًا وعودة. أرسل عدد المسافرين والتفضيلات في الملاحظات لمراجعة خيارات الرحلة قبل التأكيد.",
      checklist: ["مدينتا المغادرة والوصول وتاريخ السفر والعودة إن وجدت.", "نوع الرحلة وعدد المسافرين، مع أعمار الأطفال في الملاحظات.", "تفضيلات المواعيد والأمتعة وأي مرونة في تواريخ السفر."],
      faqs: [
        { question: "هل تقديم الطلب يعني إصدار تذكرة؟", answer: "تقديم النموذج هو طلب حجز للمراجعة. تأكد من مسار الرحلة والسعر وإجراءات التأكيد والإصدار مع الفريق قبل اعتبار التذكرة صادرة." },
        { question: "كيف أعرف الأمتعة المشمولة؟", answer: "اطلب تفاصيل الأمتعة لكل جزء من الرحلة وفئة التذكرة المقترحة، بما يشمل حقيبة المقصورة والحقائب المشحونة وأي رسوم إضافية." },
        { question: "ما شروط تغيير التذكرة أو استردادها؟", answer: "راجع شروط شركة الطيران وفئة التذكرة المعروضة ورسوم التغيير والاسترداد قبل التأكيد، لأنها قد تختلف من عرض لآخر." },
      ],
    },
    en: {
      title: "Requesting a flight quote for your destination and dates",
      intro: "Specify your departure and arrival cities and travel dates, then choose one-way or return travel. Include passenger count and preferences in the notes to review flight options before confirmation.",
      checklist: ["Departure and arrival cities, travel date and return date if applicable.", "Trip type and passenger count, with children's ages in the notes.", "Preferred times, luggage needs and flexibility in your dates."],
      faqs: [
        { question: "Does submitting a request issue a ticket?", answer: "Submitting the form sends a booking request for review. Confirm the itinerary, price and confirmation and issuance steps with the team before treating the ticket as issued." },
        { question: "How do I check the baggage allowance?", answer: "Request baggage details for each flight segment and proposed fare, including cabin bags, checked bags and extra fees." },
        { question: "What are the change and refund terms?", answer: "Review the airline's terms, proposed fare rules and change and refund fees before confirmation, as these can differ between offers." },
      ],
    },
  },
};
