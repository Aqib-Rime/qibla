import { useRouter } from "expo-router";
import { useEffect } from "react";
import { hasCompletedOnboarding } from "@/features/onboarding";
import { authClient } from "@/lib/auth";

const MIN_SPLASH_MS = 900;

export function useSplashRouting() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();

    (async () => {
      const [sessionResult, onboarded] = await Promise.all([
        authClient.getSession().catch(() => null),
        hasCompletedOnboarding(),
      ]);

      const elapsed = Date.now() - start;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise((r) => setTimeout(r, MIN_SPLASH_MS - elapsed));
      }
      if (cancelled) return;

      const hasSession = !!sessionResult?.data?.user;
      if (hasSession) {
        router.replace("/(tabs)/map");
      } else if (onboarded) {
        router.replace("/(auth)/sign-in");
      } else {
        router.replace("/onboard/1");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);
}
