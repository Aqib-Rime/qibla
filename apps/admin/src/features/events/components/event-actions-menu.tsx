import { Button } from "@qibla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qibla/ui/components/dropdown-menu";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDeleteEvent } from "@/features/events/hooks/use-events";

type Props = {
  id: string;
  onEdit: () => void;
};

export function EventActionsMenu({ id, onEdit }: Props) {
  const deleteMutation = useDeleteEvent();

  const handleDelete = async () => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={deleteMutation.isPending}>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <IconPencil className="mr-2 size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <IconTrash className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
