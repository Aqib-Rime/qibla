import { createQiblaClient } from "@qibla/api-client";
import { authClient } from "./auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = createQiblaClient({
  baseURL,
  headers: () => {
    const cookie = authClient.getCookie();
    return cookie ? { cookie } : {};
  },
});
