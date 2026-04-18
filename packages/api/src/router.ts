import { publicProcedure } from "./router-base.ts";
import { mosquesRouter } from "./routers/mosques.ts";

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
};

export type AppRouter = typeof appRouter;
