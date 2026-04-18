import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ListReviewsInput,
  SetReviewStatusInput,
} from "@/features/reviews/lib/schemas";
import {
  listReviewsFn,
  reviewCountsFn,
  setReviewStatusFn,
} from "@/features/reviews/server/reviews";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (input: ListReviewsInput) => [...reviewKeys.lists(), input] as const,
  counts: () => [...reviewKeys.all, "counts"] as const,
};

export function useReviewList(input: ListReviewsInput) {
  return useQuery({
    queryKey: reviewKeys.list(input),
    queryFn: () => listReviewsFn({ data: input }),
  });
}

export function useReviewCounts() {
  return useQuery({
    queryKey: reviewKeys.counts(),
    queryFn: () => reviewCountsFn(),
  });
}

export function useSetReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: SetReviewStatusInput) =>
      setReviewStatusFn({ data: value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
