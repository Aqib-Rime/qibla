import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qibla/ui/components/select";
import type { ReviewStatus } from "@/features/reviews/lib/schemas";

type Props = {
  value: ReviewStatus | "all";
  onChange: (value: ReviewStatus | "all") => void;
  counts?: Record<ReviewStatus, number>;
};

export function ReviewStatusFilter({ value, onChange, counts }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as typeof value)}>
      <SelectTrigger className="w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          Pending{counts ? ` (${counts.pending})` : ""}
        </SelectItem>
        <SelectItem value="approved">
          Approved{counts ? ` (${counts.approved})` : ""}
        </SelectItem>
        <SelectItem value="hidden">
          Hidden{counts ? ` (${counts.hidden})` : ""}
        </SelectItem>
        <SelectItem value="all">All reviews</SelectItem>
      </SelectContent>
    </Select>
  );
}
