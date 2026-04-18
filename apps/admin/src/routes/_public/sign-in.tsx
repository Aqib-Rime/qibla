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
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getUserCountFn } from "@/lib/session";

export const Route = createFileRoute("/_public/sign-in")({
  beforeLoad: async () => {
    const userCount = await getUserCountFn();
    if (userCount === 0) {
      throw redirect({ to: "/initial-setup" });
    }
  },
  component: SignInPage,
});

function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInMutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email({
        email: input.email,
        password: input.password,
      });
      if (error) throw new Error(error.message ?? "Sign in failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Signed in");
      router.navigate({ to: "/dashboard" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Welcome back to Qibla Admin. Enter your credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            signInMutation.mutate({ email, password });
          }}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={signInMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={signInMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
          <div className="flex flex-col gap-2 pt-2">
            <Button type="button" variant="outline" className="w-full" disabled>
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled>
              Continue with phone
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Google & phone sign-in coming in V2
            </p>
          </div>
          <p className="pt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/initial-setup" className="underline">
              Create the first admin
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
