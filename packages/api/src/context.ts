import type { Session } from "@qibla/auth";

export interface AppContext {
  session: Session | null;
  headers: Headers;
}

export async function createContext(req: Request): Promise<AppContext> {
  const { auth } = await import("@qibla/auth");
  const session = await auth.api.getSession({ headers: req.headers });
  return { session, headers: req.headers };
}
