import { IconStarFilled } from "@tabler/icons-react";

export function ReviewRatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled
          key={i}
          className={`size-3.5 ${
            i < rating ? "text-amber-500" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
