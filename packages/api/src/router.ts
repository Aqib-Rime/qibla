import { publicProcedure } from "./router-base.ts";
import { eventsRouter } from "./routers/events.ts";
import { mosquesRouter } from "./routers/mosques.ts";
import { placesRouter } from "./routers/places.ts";
import { prayerTimesRouter } from "./routers/prayer-times.ts";
import { reviewsRouter } from "./routers/reviews.ts";
import { uploadsRouter } from "./routers/uploads.ts";

export {
  adminProcedure,
  authedProcedure,
  publicProcedure,
} from "./router-base.ts";

export const appRouter = {
  health: publicProcedure.handler(() => ({
    ok: true,
    at: new Date().toISOString(),
  })),
  mosques: mosquesRouter,
  events: eventsRouter,
  prayerTimes: prayerTimesRouter,
  reviews: reviewsRouter,
  places: placesRouter,
  uploads: uploadsRouter,
};

export type AppRouter = typeof appRouter;
