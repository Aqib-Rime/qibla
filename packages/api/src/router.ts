import { publicProcedure } from "./router-base.ts";
import { mosquesRouter } from "./routers/mosques.ts";
import { prayerTimesRouter } from "./routers/prayer-times.ts";

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
  prayerTimes: prayerTimesRouter,
};

export type AppRouter = typeof appRouter;
