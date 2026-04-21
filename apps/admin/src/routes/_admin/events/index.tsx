import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EventsPage } from "@/features/events";

const searchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

export const Route = createFileRoute("/_admin/events/")({
  validateSearch: searchSchema,
  component: EventsRoute,
});

function EventsRoute() {
  const search = Route.useSearch();

  return (
    <EventsPage page={search.page ?? 1} pageSize={search.pageSize ?? 20} />
  );
}
