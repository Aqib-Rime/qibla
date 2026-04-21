import { db } from "@qibla/db";
import { mosque } from "@qibla/db/schema/mosque";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../router-base.ts";

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
// How close a Places result must be to an existing DB row (in degrees, approx)
// before we consider it a duplicate. 0.0005 deg ≈ 55 metres.
const DEDUP_DEGREES = 0.0005;

const searchInput = z.object({
  query: z.string().min(2).max(200),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().positive().max(50).optional().default(10),
  limit: z.number().int().min(1).max(20).optional().default(10),
});

type PlacesApiResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    types?: string[];
  }>;
};

type ExternalMosque = {
  placeId: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  external: true;
};

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export const placesRouter = {
  searchMosques: publicProcedure
    .input(searchInput)
    .handler(async ({ input }) => {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        // Dev without a key should not error — the mobile search still works with local results.
        return { data: [] as ExternalMosque[] };
      }

      const body: Record<string, unknown> = {
        textQuery: input.query,
        includedType: "mosque",
        maxResultCount: input.limit,
      };

      if (input.lat != null && input.lng != null) {
        body.locationBias = {
          circle: {
            center: { latitude: input.lat, longitude: input.lng },
            radius: input.radiusKm * 1000,
          },
        };
      }

      let response: Response;
      try {
        response = await fetch(PLACES_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.location,places.types",
          },
          body: JSON.stringify(body),
        });
      } catch {
        return { data: [] as ExternalMosque[] };
      }

      if (!response.ok) {
        return { data: [] as ExternalMosque[] };
      }

      const json = (await response.json()) as PlacesApiResponse;
      const raw = json.places ?? [];

      const candidates: ExternalMosque[] = raw
        .filter((p) => p.types?.includes("mosque"))
        .map((p) => {
          const lat = p.location?.latitude;
          const lng = p.location?.longitude;
          const name = p.displayName?.text;
          const placeId = p.id;
          if (
            typeof lat !== "number" ||
            typeof lng !== "number" ||
            !name ||
            !placeId
          ) {
            return null;
          }
          return {
            placeId,
            name,
            address: p.formattedAddress ?? null,
            lat,
            lng,
            external: true as const,
          };
        })
        .filter((x): x is ExternalMosque => x !== null);

      if (candidates.length === 0) {
        return { data: [] };
      }

      // Dedupe against DB — pull the bounding box of candidates and check each.
      // Small n; a single SELECT on approved rows across the area is fine.
      const existing = await db
        .select({ lat: mosque.lat, lng: mosque.lng })
        .from(mosque)
        .where(eq(mosque.status, "approved"));

      const filtered = candidates.filter((c) => {
        const isDuplicate = existing.some(
          (e) =>
            Math.abs(e.lat - c.lat) < DEDUP_DEGREES &&
            Math.abs(e.lng - c.lng) < DEDUP_DEGREES,
        );
        return !isDuplicate;
      });

      // Attach distance if the caller provided coordinates.
      const withDistance = filtered.map((c) =>
        input.lat != null && input.lng != null
          ? {
              ...c,
              distanceKm: haversineKm(
                { lat: input.lat, lng: input.lng },
                { lat: c.lat, lng: c.lng },
              ),
            }
          : c,
      );

      return { data: withDistance };
    }),
};
