import { z } from "zod";

export const eventInputSchema = z.object({
  mosqueId: z.string().min(1, "Mosque is required"),
  title: z.string().min(1, "Title is required").max(200),
  when: z.string().min(1, "When is required").max(200),
  by: z.string().max(200).nullable(),
  description: z.string().max(2000).nullable(),
});

export type EventInput = z.infer<typeof eventInputSchema>;

export const createEventSchema = eventInputSchema;

export const updateEventSchema = eventInputSchema.extend({
  id: z.string().min(1),
});
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const listEventsSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  mosqueId: z.string().optional(),
});

export type ListEventsInput = z.infer<typeof listEventsSchema>;
