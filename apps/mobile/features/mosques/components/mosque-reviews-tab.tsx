import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PendingReviewBanner } from "@/features/reviews/components/pending-review-banner";
import { WriteReviewButton } from "@/features/reviews/components/write-review-button";
import { useMyReviewsForMosque } from "@/features/reviews/hooks/use-reviews";
import { useSession } from "@/lib/auth";
import { useThemeColors } from "@/lib/theme";
import type { Review } from "../lib/types";

type Props = {
  mosqueId: string;
  reviews: readonly Review[];
};

export function MosqueReviewsTab({ mosqueId, reviews }: Props) {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user);
  const mine = useMyReviewsForMosque(mosqueId);
  const colors = useThemeColors();

  const hasPending = Boolean(
    mine.data?.data.some((r) => r.status === "pending"),
  );

  return (
    <View className="gap-s-3">
      {isAuthed && hasPending ? <PendingReviewBanner /> : null}
      {isAuthed ? <WriteReviewButton mosqueId={mosqueId} /> : null}

      {reviews.length === 0 ? (
        <View className="items-center gap-s-2 rounded-md bg-surface px-s-5 py-s-8">
          <Text variant="label" tone="muted">
            No reviews yet
          </Text>
        </View>
      ) : (
        reviews.map((r) => (
          <View key={r.id} className="rounded-md bg-surface p-s-4">
            <View className="flex-row items-center justify-between">
              <Text variant="label">{r.userName}</Text>
              <View className="flex-row items-center gap-s-1">
                <Icon name="star" size={12} color={colors.gold} />
                <Text variant="caption">{r.rating}</Text>
              </View>
            </View>
            {r.body ? (
              <Text variant="body-sm" tone="muted" className="mt-s-2">
                {r.body}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </View>
  );
}
