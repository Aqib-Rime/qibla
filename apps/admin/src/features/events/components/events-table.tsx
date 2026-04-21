import { Skeleton } from "@qibla/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qibla/ui/components/table";
import { useEventList } from "@/features/events/hooks/use-events";
import type { ListEventsInput } from "@/features/events/lib/schemas";
import { EventActionsMenu } from "./event-actions-menu";

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventsTable({
  input,
  onEdit,
}: {
  input: ListEventsInput;
  onEdit: (id: string) => void;
}) {
  const { data, isLoading } = useEventList(input);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Mosque</TableHead>
            <TableHead>When</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, row index is stable
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, cell index is stable
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data?.data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No events yet. Create the first one.
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  {e.title}
                  {e.description && (
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {e.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>{e.mosqueName}</TableCell>
                <TableCell>{e.when}</TableCell>
                <TableCell className="text-muted-foreground">
                  {e.by ?? (
                    <span className="italic text-muted-foreground/60">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(e.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <EventActionsMenu id={e.id} onEdit={() => onEdit(e.id)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
