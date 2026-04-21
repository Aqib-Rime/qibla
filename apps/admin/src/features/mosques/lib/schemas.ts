import { z } from "zod";

export const mosqueInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subtitle: z.string().nullable(),
  about: z.string().nullable(),
  address: z.string().nullable(),
  street: z.string().nullable(),
  area: z.string().nullable(),
  city: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  open: z.boolean(),
  status: z.enum(["approved", "pending", "hidden"]),
  tags: z.array(z.string()),
  facilities: z.array(z.string()),
  photos: z.array(z.string().url()),
});

export type MosqueInput = z.infer<typeof mosqueInputSchema>;

export const createMosqueSchema = mosqueInputSchema;

export const updateMosqueSchema = mosqueInputSchema.extend({
  id: z.string().min(1),
});
export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;

export const listMosquesSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  status: z.enum(["approved", "pending", "hidden"]).optional(),
});

export type ListMosquesInput = z.infer<typeof listMosquesSchema>;

export const FACILITY_OPTIONS = [
  { label: "Wudu", value: "wudu" },
  { label: "Women", value: "women" },
  { label: "Parking", value: "parking" },
  { label: "AC", value: "ac" },
  { label: "Bookstore", value: "book" },
  { label: "Elevator", value: "elevator" },
] as const;

export const TAG_OPTIONS = [
  "Jummah",
  "Women",
  "Parking",
  "Open",
  "24/7",
  "Historic",
  "Madrasa",
] as const;
