import { Skeleton } from "@qibla/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qibla/ui/components/table";
import type { ListReviewsInput } from "@/features/reviews/lib/schemas";
import { useReviewList } from "@/features/reviews/hooks/use-reviews";
import { ReviewActionsMenu } from "./review-actions-menu";
import { ReviewRatingStars } from "./review-rating-stars";
import { ReviewStatusBadge } from "./review-status-badge";

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReviewsTable({ input }: { input: ListReviewsInput }) {
  const { data, isLoading } = useReviewList(input);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reviewer</TableHead>
            <TableHead>Mosque</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data?.data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No reviews match this filter.
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.userName}
                  <div className="text-xs text-muted-foreground">
                    {r.userEmail}
                  </div>
                </TableCell>
                <TableCell>{r.mosqueName}</TableCell>
                <TableCell>
                  <ReviewRatingStars rating={r.rating} />
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-sm">
                    {r.body ?? (
                      <span className="text-muted-foreground italic">
                        No comment
                      </span>
                    )}
                  </p>
                </TableCell>
                <TableCell>
                  <ReviewStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(r.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <ReviewActionsMenu id={r.id} status={r.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
