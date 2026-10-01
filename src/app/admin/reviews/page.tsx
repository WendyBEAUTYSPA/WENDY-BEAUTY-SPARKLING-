import { prisma } from "@/lib/prisma";
import ReviewModerationRow from "./ReviewModerationRow";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: { select: { name: true } } } });
  return (
    <div>
      <h2 className="text-xl">Reviews ({reviews.length})</h2>
      <div className="mt-6 space-y-3">
        {reviews.map((r) => (
          <ReviewModerationRow key={r.id} review={{ id: r.id, name: r.name, rating: r.rating, text: r.text, approved: r.approved, verified: r.verified, productName: r.product.name }} />
        ))}
        {reviews.length === 0 && <p className="text-inkInverseSoft">No reviews submitted yet.</p>}
      </div>
    </div>
  );
}