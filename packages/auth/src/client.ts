import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export function createQiblaAuthClient(options?: { baseURL?: string }) {
  return createAuthClient({
    baseURL: options?.baseURL,
    plugins: [adminClient()],
  });
}

export type QiblaAuthClient = ReturnType<typeof createQiblaAuthClient>;
