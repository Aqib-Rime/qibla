import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import { Button } from "@qibla/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qibla/ui/components/card";
import { Input } from "@qibla/ui/components/input";
import { Label } from "@qibla/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { getUserCountFn } from "@/lib/session";

const promoteFirstUserToAdminFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, data.email));
    return { ok: true };
  });

export const Route = createFileRoute("/_public/initial-setup")({
  beforeLoad: async () => {
    const userCount = await getUserCountFn();
    if (userCount > 0) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: InitialSetupPage,
});

function InitialSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setupMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      password: string;
    }) => {
      const { data, error } = await authClient.signUp.email({
        name: input.name,
        email: input.email,
        password: input.password,
      });
      if (error) throw new Error(error.message ?? "Sign up failed");
      await promoteFirstUserToAdminFn({ data: { email: input.email } });
      return data;
    },
    onSuccess: () => {
      toast.success("Admin account created");
      router.navigate({ to: "/dashboard" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create the first admin</CardTitle>
        <CardDescription>
          No users exist yet. This form creates the first account and promotes
          it to admin. You will only see this page once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setupMutation.mutate({ name, email, password });
          }}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={setupMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={setupMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={setupMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={setupMutation.isPending}
          >
            {setupMutation.isPending ? "Creating…" : "Create admin account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
