import { Badge } from "@qibla/ui/components/badge";
import type { ReviewStatus } from "@/features/reviews/lib/schemas";

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <Badge
      variant={
        status === "approved"
          ? "default"
          : status === "pending"
            ? "secondary"
            : "outline"
      }
    >
      {status}
    </Badge>
  );
}
