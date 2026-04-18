import { z } from "zod";

export const reviewStatusEnum = z.enum(["pending", "approved", "hidden"]);
export type ReviewStatus = z.infer<typeof reviewStatusEnum>;

export const listReviewsSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  status: reviewStatusEnum.optional(),
});
export type ListReviewsInput = z.infer<typeof listReviewsSchema>;

export const setReviewStatusSchema = z.object({
  id: z.string().min(1),
  status: reviewStatusEnum,
});
export type SetReviewStatusInput = z.infer<typeof setReviewStatusSchema>;
