import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ReviewsPage } from "@/features/reviews/components/reviews-page";

const searchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  status: z.enum(["approved", "pending", "hidden"]).optional().default("pending"),
});

export const Route = createFileRoute("/_admin/reviews/")({
  validateSearch: searchSchema,
  component: ReviewsRoute,
});

function ReviewsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ReviewsPage
      page={search.page ?? 1}
      pageSize={search.pageSize ?? 20}
      status={search.status}
      onStatusChange={(status) =>
        navigate({
          search: (prev) => ({ ...prev, status, page: 1 }),
        })
      }
    />
  );
}
