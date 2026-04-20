import { Button } from "@qibla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qibla/ui/components/dropdown-menu";
import {
  IconCheck,
  IconDots,
  IconEyeOff,
  IconRotate,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useSetReviewStatus } from "@/features/reviews/hooks/use-reviews";
import type { ReviewStatus } from "@/features/reviews/lib/schemas";

type Props = {
  id: string;
  status: ReviewStatus;
};

export function ReviewActionsMenu({ id, status }: Props) {
  const mutation = useSetReviewStatus();

  const setStatus = async (next: ReviewStatus) => {
    if (next === status) return;
    try {
      await mutation.mutateAsync({ id, status: next });
      toast.success(`Marked ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={mutation.isPending}>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={status === "approved"}
          onClick={() => setStatus("approved")}
        >
          <IconCheck className="mr-2 size-4" /> Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={status === "hidden"}
          onClick={() => setStatus("hidden")}
        >
          <IconEyeOff className="mr-2 size-4" /> Hide
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={status === "pending"}
          onClick={() => setStatus("pending")}
        >
          <IconRotate className="mr-2 size-4" /> Mark pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
