import { getBookings, getReviews } from "@/lib/data";
import { CustomerDetailClient } from "./CustomerDetailClient";

export default async function CustomerDetailPage({ params }: { params: Promise<{ phone: string }> }) {
  const resolvedParams = await params;
  const targetPhone = decodeURIComponent(resolvedParams.phone);

  const [bookings, reviews] = await Promise.all([
    getBookings(),
    getReviews()
  ]);

  // Match customer bookings by clean phone digits
  const targetClean = targetPhone.replace(/\D/g, "");
  const customerBookings = bookings.filter(b => {
    const bClean = (b.phone || "").replace(/\D/g, "");
    return bClean === targetClean || b.phone === targetPhone;
  });

  const customerName = customerBookings[0]?.customerName || "عميل ليمو مصر";

  return (
    <CustomerDetailClient 
      phone={targetPhone}
      customerName={customerName}
      bookings={customerBookings}
      reviews={reviews}
    />
  );
}
