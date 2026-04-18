import { createQiblaAuthClient } from "@qibla/auth/client";

export const authClient = createQiblaAuthClient({
  baseURL:
    (typeof window !== "undefined" && window.location.origin) ||
    import.meta.env.VITE_APP_URL ||
    "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, admin } = authClient;
