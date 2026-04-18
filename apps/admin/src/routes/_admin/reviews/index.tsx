import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qibla/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/reviews/")({
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          Moderate user-submitted mosque reviews.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Review moderation UI will ship in the next batch.
        </CardContent>
      </Card>
    </div>
  );
}
