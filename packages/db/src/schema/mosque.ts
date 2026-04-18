import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.ts";

export const mosque = pgTable("mosque", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  about: text("about"),
  address: text("address"),
  street: text("street"),
  area: text("area"),
  city: text("city").notNull().default("Dhaka"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  rating: real("rating"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  open: boolean("open").notNull().default(true),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  facilities: text("facilities")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  photos: text("photos").array().notNull().default(sql`ARRAY[]::text[]`),
  status: text("status", { enum: ["approved", "pending", "hidden"] })
    .notNull()
    .default("approved"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const imam = pgTable("imam", {
  id: text("id").primaryKey(),
  mosqueId: text("mosque_id")
    .notNull()
    .references(() => mosque.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  since: integer("since"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const event = pgTable("event", {
  id: text("id").primaryKey(),
  mosqueId: text("mosque_id")
    .notNull()
    .references(() => mosque.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  when: text("when").notNull(),
  by: text("by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const review = pgTable("review", {
  id: text("id").primaryKey(),
  mosqueId: text("mosque_id")
    .notNull()
    .references(() => mosque.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  body: text("body"),
  status: text("status", { enum: ["pending", "approved", "hidden"] })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedMosque = pgTable(
  "saved_mosque",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mosqueId: text("mosque_id")
      .notNull()
      .references(() => mosque.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.mosqueId] }),
  }),
);

export const prayerTimesCache = pgTable(
  "prayer_times_cache",
  {
    latGrid: real("lat_grid").notNull(),
    lngGrid: real("lng_grid").notNull(),
    date: date("date").notNull(),
    method: integer("method").notNull(),
    school: integer("school").notNull(),
    data: jsonb("data").notNull(),
    fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.latGrid, t.lngGrid, t.date, t.method, t.school],
    }),
  }),
);
