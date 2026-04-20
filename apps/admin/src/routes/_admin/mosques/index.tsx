import { Badge } from "@qibla/ui/components/badge";
import { Button } from "@qibla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qibla/ui/components/dropdown-menu";
import { Input } from "@qibla/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qibla/ui/components/select";
import { Skeleton } from "@qibla/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qibla/ui/components/table";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CreateMosqueSheet } from "@/features/mosques/components/create-mosque-sheet";
import { EditMosqueSheet } from "@/features/mosques/components/edit-mosque-sheet";
import {
  useDeleteMosque,
  useMosqueList,
} from "@/features/mosques/hooks/use-mosques";

const searchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  search: z.string().optional(),
  status: z.enum(["approved", "pending", "hidden"]).optional(),
});

export const Route = createFileRoute("/_admin/mosques/")({
  validateSearch: searchSchema,
  component: MosquesPage,
});

function MosquesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [editId, setEditId] = useState<string | null>(null);

  const { data, isLoading } = useMosqueList({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 20,
    search: search.search,
    status: search.status,
  });

  const deleteMutation = useDeleteMosque();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Deleted ${name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Mosques</h2>
          <p className="text-sm text-muted-foreground">
            Manage the directory of mosques. {data?.total ?? 0} total.
          </p>
        </div>
        <CreateMosqueSheet />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search by name, area, address…"
          value={search.search ?? ""}
          onChange={(e) =>
            navigate({
              search: (prev) => ({
                ...prev,
                search: e.target.value || undefined,
                page: 1,
              }),
            })
          }
          className="max-w-sm"
        />
        <Select
          value={search.status ?? "all"}
          onValueChange={(v) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: v === "all" ? undefined : (v as typeof search.status),
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
              <TableHead className="w-[60px]"></TableHead>
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
                  No mosques match your filters.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((m) => (
                <TableRow key={m.id} className="cursor-pointer">
                  <TableCell
                    onClick={() => setEditId(m.id)}
                    className="font-medium"
                  >
                    {m.name}
                    {m.subtitle && (
                      <div className="text-xs text-muted-foreground">
                        {m.subtitle}
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => setEditId(m.id)}>
                    {m.area ?? "—"}
                  </TableCell>
                  <TableCell onClick={() => setEditId(m.id)}>
                    <Badge
                      variant={
                        m.status === "approved"
                          ? "default"
                          : m.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    onClick={() => setEditId(m.id)}
                    className="text-right tabular-nums"
                  >
                    {m.rating?.toFixed(1) ?? "—"}
                  </TableCell>
                  <TableCell
                    onClick={() => setEditId(m.id)}
                    className="text-right tabular-nums"
                  >
                    {m.reviewsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDots className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditId(m.id)}>
                          <IconEdit className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(m.id, m.name)}
                        >
                          <IconTrash className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditMosqueSheet mosqueId={editId} onClose={() => setEditId(null)} />
    </div>
  );
}
