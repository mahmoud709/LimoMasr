/** Customer self-service stays disabled until booking ownership is independently proven.
 * A phone, account/session, ID or phoneVerified flag is not booking ownership.
 * Public booking creation and authorized admin management do not use this policy.
 */
export const CUSTOMER_BOOKING_DISABLED_CODE = "CUSTOMER_SELF_SERVICE_DISABLED";
export const customerBookingMessages = {
  ar: {
    title: "إدارة الحجوزات عبر حساب العميل غير متاحة مؤقتًا",
    description: "عرض الحجوزات وإلغاؤها عبر حساب العميل غير متاحين مؤقتًا. للاستفسار عن حجز قائم أو طلب تعديله أو إلغائه، تواصل مع فريق ليمو مصر عبر صفحة التواصل. يمكنك إرسال حجز جديد دون تسجيل الدخول.",
    contact: "تواصل مع فريق ليمو مصر",
    book: "تصفح الخدمات والحجز",
  },
  en: {
    title: "Customer booking management is temporarily unavailable",
    description: "Viewing or cancelling bookings through a customer account is temporarily unavailable. For an existing booking enquiry or a change or cancellation request, contact the Limo Egypt team through the contact page. You can make a new booking without signing in.",
    contact: "Contact the Limo Egypt team",
    book: "Browse services and book",
  },
} as const;
