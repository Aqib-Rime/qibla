import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionFn, getUserCountFn } from "@/lib/session";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const userCount = await getUserCountFn();
    if (userCount === 0) {
      throw redirect({ to: "/initial-setup" });
    }
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({ to: "/sign-in" });
    }
    throw redirect({ to: "/dashboard" });
  },
});
