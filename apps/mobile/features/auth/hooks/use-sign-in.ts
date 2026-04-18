import { signIn, signUp } from "@/lib/auth"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useState } from "react"

export type AuthMode = "in" | "up"

type Input = {
  mode: AuthMode
  email: string
  password: string
  name: string
}

export function useSignIn() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async ({ mode, email, password, name }: Input) => {
      setError(null)
      if (mode === "in") {
        const { error } = await signIn.email({ email, password })
        if (error) throw new Error(error.message ?? "Sign in failed")
      } else {
        const { error } = await signUp.email({ email, password, name })
        if (error) throw new Error(error.message ?? "Sign up failed")
      }
    },
    onSuccess: () => router.replace("/(tabs)/map"),
    onError: (err: Error) => setError(err.message),
  })

  return { ...mutation, error }
}
