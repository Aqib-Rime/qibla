import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qibla/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/events/")({
  component: EventsPage,
});

function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
        <p className="text-sm text-muted-foreground">
          Manage mosque events (Jummah, tafseer circles, Ramadan programs).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Event management UI will ship in the next batch.
        </CardContent>
      </Card>
    </div>
  );
}
