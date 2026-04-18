import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { MosqueMark } from "@/components/ui/mosque-mark"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { signIn, signUp } from "@/lib/auth"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

type Tab = "in" | "up"

export default function SignInScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const authMutation = useMutation({
    mutationFn: async () => {
      setError(null)
      if (tab === "in") {
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

  return (
    <Screen bg="cream" padded={false}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-s-5">
          <MosqueMark size="md" />
          <Text variant="display-lg" className="mt-s-3 text-center">
            Welcome to <Text variant="display-lg" tone="green">Qibla</Text>
          </Text>
          <Text variant="body-sm" tone="muted" className="mt-s-1">
            {tab === "in"
              ? "Sign in to find mosques nearby"
              : "Create an account to save your favourite mosques"}
          </Text>
        </View>

        <View className="mt-s-5 flex-row rounded-pill bg-[#ece3c9] p-1">
          {(["in", "up"] as const).map((k) => {
            const active = tab === k
            return (
              <Pressable
                key={k}
                onPress={() => setTab(k)}
                className={`flex-1 rounded-pill py-s-2 ${active ? "bg-white" : ""}`}
                style={
                  active
                    ? {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : undefined
                }
              >
                <Text
                  variant="label"
                  tone={active ? "ink" : "muted"}
                  className="text-center"
                >
                  {k === "in" ? "Sign in" : "Sign up"}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <View className="mt-s-5 gap-s-2">
          <Button variant="outline" label="Continue with Google" disabled />
          <Button
            variant="outline"
            label="Continue with phone"
            disabled
            leading={<Icon name="phone" size={16} color="#1a2a22" />}
          />
        </View>

        <View className="mt-s-5 flex-row items-center gap-s-3">
          <View className="h-px flex-1 bg-line" />
          <Text variant="eyebrow" tone="muted">
            or email
          </Text>
          <View className="h-px flex-1 bg-line" />
        </View>

        <View className="mt-s-4 gap-s-3">
          {tab === "up" && (
            <Field
              icon="user"
              placeholder="Full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          )}
          <Field
            icon="mail"
            placeholder="Email address"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            icon="clock"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error && (
            <Text variant="body-sm" className="text-[#b42318]">
              {error}
            </Text>
          )}
        </View>

        <View className="mt-s-4">
          <Button
            label={tab === "in" ? "Sign in" : "Create account"}
            trailing={<Icon name="arrow" size={16} color="#fff" />}
            loading={authMutation.isPending}
            onPress={() => authMutation.mutate()}
          />
        </View>

        <View className="flex-1" />
        <Text variant="body-sm" tone="muted" className="pb-s-6 pt-s-6 text-center">
          By continuing you agree to our{" "}
          <Text variant="body-sm" tone="ink" className="underline">Terms</Text>{" "}
          and{" "}
          <Text variant="body-sm" tone="ink" className="underline">Privacy</Text>
        </Text>
      </KeyboardAwareScrollView>
    </Screen>
  )
}
