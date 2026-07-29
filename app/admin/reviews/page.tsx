import { getReviews } from "@/lib/data";
import { ReviewsAdminClient } from "@/components/admin/ReviewsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  // Fetch all reviews, including unapproved ones
  const reviews = await getReviews(false);
  
  return <ReviewsAdminClient initialReviews={reviews} />;
}
