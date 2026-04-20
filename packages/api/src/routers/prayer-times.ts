import { db } from "@qibla/db";
import { prayerTimesCache } from "@qibla/db/schema/mosque";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../router-base.ts";

const METHOD = 1; // Karachi — D-009
const SCHOOL = 1; // Hanafi Asr — D-009

const input = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type Timings = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

function roundGrid(n: number) {
  return Math.round(n * 100) / 100;
}

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toAladhanDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}-${m}-${y}`;
}

function stripOffset(s: string) {
  const v = s?.split(" ")[0] ?? s;
  return typeof v === "string" ? v : "";
}

async function fetchFromAlAdhan(
  lat: number,
  lng: number,
  ymd: string,
): Promise<Timings> {
  const url = `https://api.aladhan.com/v1/timings/${toAladhanDate(
    ymd,
  )}?latitude=${lat}&longitude=${lng}&method=${METHOD}&school=${SCHOOL}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AlAdhan ${res.status}`);
  const json = (await res.json()) as {
    data?: { timings?: Record<string, string> };
  };
  const t = json?.data?.timings;
  if (!t) throw new Error("AlAdhan: missing timings");
  return {
    fajr: stripOffset(t.Fajr ?? ""),
    sunrise: stripOffset(t.Sunrise ?? ""),
    dhuhr: stripOffset(t.Dhuhr ?? ""),
    asr: stripOffset(t.Asr ?? ""),
    maghrib: stripOffset(t.Maghrib ?? ""),
    isha: stripOffset(t.Isha ?? ""),
  };
}

export const prayerTimesRouter = {
  byCoordinates: publicProcedure.input(input).handler(async ({ input }) => {
    const ymd = input.date ?? todayYmd();
    const latGrid = roundGrid(input.lat);
    const lngGrid = roundGrid(input.lng);

    const [cached] = await db
      .select()
      .from(prayerTimesCache)
      .where(
        and(
          eq(prayerTimesCache.latGrid, latGrid),
          eq(prayerTimesCache.lngGrid, lngGrid),
          eq(prayerTimesCache.date, ymd),
          eq(prayerTimesCache.method, METHOD),
          eq(prayerTimesCache.school, SCHOOL),
        ),
      )
      .limit(1);

    if (cached) {
      return { timings: cached.data as Timings, date: ymd };
    }

    const timings = await fetchFromAlAdhan(input.lat, input.lng, ymd);

    await db
      .insert(prayerTimesCache)
      .values({
        latGrid,
        lngGrid,
        date: ymd,
        method: METHOD,
        school: SCHOOL,
        data: timings,
      })
      .onConflictDoNothing();

    return { timings, date: ymd };
  }),
};
