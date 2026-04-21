import { useState } from "react";
import { CreateEventSheet } from "./create-event-sheet";
import { EditEventSheet } from "./edit-event-sheet";
import { EventsTable } from "./events-table";

type Props = {
  page: number;
  pageSize: number;
};

export function EventsPage({ page, pageSize }: Props) {
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage events scoped per mosque. They appear on the mosque&rsquo;s
            Events tab in the app.
          </p>
        </div>
        <CreateEventSheet />
      </div>

      <EventsTable input={{ page, pageSize }} onEdit={(id) => setEditId(id)} />

      <EditEventSheet eventId={editId} onClose={() => setEditId(null)} />
    </div>
  );
}
