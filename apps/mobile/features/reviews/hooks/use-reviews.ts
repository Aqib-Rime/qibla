import { api } from "@/lib/api"
import { useSession } from "@/lib/auth"
import { mosquesKeys } from "@/features/mosques"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const reviewsKeys = {
  all: ["reviews"] as const,
  mine: (mosqueId: string) =>
    [...reviewsKeys.all, "mine", mosqueId] as const,
}

export function useMyReviewsForMosque(mosqueId: string | undefined) {
  const { data: session } = useSession()
  return useQuery({
    queryKey: reviewsKeys.mine(mosqueId ?? ""),
    queryFn: () =>
      api.reviews.myForMosque({ mosqueId: mosqueId as string }),
    enabled: Boolean(mosqueId) && Boolean(session?.user),
  })
}

export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      mosqueId: string
      rating: number
      body?: string
    }) => api.reviews.create(input),
    onSuccess: (_row, input) => {
      qc.invalidateQueries({ queryKey: reviewsKeys.mine(input.mosqueId) })
      qc.invalidateQueries({ queryKey: mosquesKeys.detail(input.mosqueId) })
    },
  })
}
