import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  PendingReviewBanner,
  useMyReviewsForMosque,
  WriteReviewButton,
} from "@/features/reviews"
import { useSession } from "@/lib/auth"
import { View } from "react-native"
import type { Review } from "../lib/types"

type Props = {
  mosqueId: string
  reviews: readonly Review[]
}

export function MosqueReviewsTab({ mosqueId, reviews }: Props) {
  const { data: session } = useSession()
  const isAuthed = Boolean(session?.user)
  const mine = useMyReviewsForMosque(mosqueId)

  const hasPending = Boolean(
    mine.data?.data.some((r) => r.status === "pending")
  )

  return (
    <View className="gap-s-3">
      {isAuthed && hasPending ? <PendingReviewBanner /> : null}
      {isAuthed ? <WriteReviewButton mosqueId={mosqueId} /> : null}

      {reviews.length === 0 ? (
        <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
          <Text variant="label" tone="muted">
            No reviews yet
          </Text>
        </View>
      ) : (
        reviews.map((r) => (
          <View key={r.id} className="rounded-md bg-white p-s-4">
            <View className="flex-row items-center justify-between">
              <Text variant="label">{r.userName}</Text>
              <View className="flex-row items-center gap-s-1">
                <Icon name="star" size={12} color="#b68a3c" />
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
  )
}
