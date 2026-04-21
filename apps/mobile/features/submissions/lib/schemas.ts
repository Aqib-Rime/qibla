import { z } from "zod";

export const FACILITY_OPTIONS = [
  { label: "Wudu", value: "wudu" },
  { label: "Women's section", value: "women" },
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

export const mosqueSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  subtitle: z.string().max(200).nullable(),
  about: z.string().max(2000).nullable(),
  address: z.string().max(300).nullable(),
  street: z.string().max(200).nullable(),
  area: z.string().max(100).nullable(),
  city: z.string().min(1).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  open: z.boolean(),
  tags: z.array(z.string()),
  facilities: z.array(z.string()),
  photos: z.array(z.string().url()),
});

export type MosqueSubmissionInput = z.infer<typeof mosqueSubmissionSchema>;

export const EMPTY_SUBMISSION: MosqueSubmissionInput = {
  name: "",
  subtitle: null,
  about: null,
  address: null,
  street: null,
  area: null,
  city: "Dhaka",
  lat: 0,
  lng: 0,
  open: true,
  tags: [],
  facilities: [],
  photos: [],
};
