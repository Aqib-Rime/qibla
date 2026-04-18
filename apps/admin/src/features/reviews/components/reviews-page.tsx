import { useReviewCounts } from "@/features/reviews/hooks/use-reviews";
import type { ReviewStatus } from "@/features/reviews/lib/schemas";
import { ReviewStatusFilter } from "./review-status-filter";
import { ReviewsTable } from "./reviews-table";

type Props = {
  status: ReviewStatus | undefined;
  page: number;
  pageSize: number;
  onStatusChange: (status: ReviewStatus | undefined) => void;
};

export function ReviewsPage({
  status,
  page,
  pageSize,
  onStatusChange,
}: Props) {
  const counts = useReviewCounts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          Moderate user-submitted mosque reviews.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ReviewStatusFilter
          value={status ?? "pending"}
          onChange={(v) => onStatusChange(v === "all" ? undefined : v)}
          counts={counts.data}
        />
      </div>

      <ReviewsTable input={{ page, pageSize, status }} />
    </div>
  );
}
