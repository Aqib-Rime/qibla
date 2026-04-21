import { z } from "zod";
import { publicProcedure } from "../router-base.ts";

// Legacy Places API — kept until GOOGLE_PLACES_API_KEY has Places API (New) enabled.
const PLACES_TEXTSEARCH =
  "https://maps.googleapis.com/maps/api/place/textsearch/json";

const searchInput = z.object({
  query: z.string().min(2).max(200),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().positive().max(50).optional().default(10),
  limit: z.number().int().min(1).max(20).optional().default(10),
});

type LegacyPlacesResponse = {
  status?: string;
  error_message?: string;
  results?: Array<{
    place_id?: string;
    name?: string;
    formatted_address?: string;
    geometry?: {
      location?: { lat?: number; lng?: number };
    };
  }>;
};

type PlaceResult = {
  placeId: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  distanceKm?: number;
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
  search: publicProcedure.input(searchInput).handler(async ({ input }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      // Dev without a key still returns a valid shape.
      return { data: [] as PlaceResult[] };
    }

    // Legacy Places API uses GET + query-string params. Location bias is
    // expressed as `location=LAT,LNG&radius=METERS`.
    const params = new URLSearchParams({
      query: input.query,
      key: apiKey,
    });
    if (input.lat != null && input.lng != null) {
      params.set("location", `${input.lat},${input.lng}`);
      params.set("radius", String(Math.round(input.radiusKm * 1000)));
    }

    let response: Response;
    try {
      response = await fetch(`${PLACES_TEXTSEARCH}?${params.toString()}`);
    } catch {
      return { data: [] as PlaceResult[] };
    }

    if (!response.ok) {
      return { data: [] as PlaceResult[] };
    }

    const json = (await response.json()) as LegacyPlacesResponse;

    // ZERO_RESULTS is success with no hits; everything else we log and bail
    // gracefully so a quota or auth issue doesn't break the mobile search UI.
    if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
      console.warn(
        "[places.search] google status:",
        json.status,
        json.error_message,
      );
      return { data: [] as PlaceResult[] };
    }

    const raw = json.results ?? [];
    const results: PlaceResult[] = raw
      .map((r) => {
        const lat = r.geometry?.location?.lat;
        const lng = r.geometry?.location?.lng;
        const name = r.name;
        const placeId = r.place_id;
        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          !name ||
          !placeId
        ) {
          return null;
        }
        const base: PlaceResult = {
          placeId,
          name,
          address: r.formatted_address ?? null,
          lat,
          lng,
        };
        if (input.lat != null && input.lng != null) {
          base.distanceKm = haversineKm(
            { lat: input.lat, lng: input.lng },
            { lat, lng },
          );
        }
        return base;
      })
      .filter((x): x is PlaceResult => x !== null)
      .slice(0, input.limit);

    return { data: results };
  }),
};
