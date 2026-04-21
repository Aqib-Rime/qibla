import { z } from "zod";
import { publicProcedure } from "../router-base.ts";

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

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

    // No includedType filter — this is a general place picker so the map
    // can recenter on neighbourhoods, landmarks, addresses, and POIs.
    const body: Record<string, unknown> = {
      textQuery: input.query,
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
            "places.id,places.displayName,places.formattedAddress,places.location",
        },
        body: JSON.stringify(body),
      });
    } catch {
      return { data: [] as PlaceResult[] };
    }

    if (!response.ok) {
      return { data: [] as PlaceResult[] };
    }

    const json = (await response.json()) as PlacesApiResponse;
    const raw = json.places ?? [];

    const results: PlaceResult[] = raw
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
        const base: PlaceResult = {
          placeId,
          name,
          address: p.formattedAddress ?? null,
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
      .filter((x): x is PlaceResult => x !== null);

    return { data: results };
  }),
};
