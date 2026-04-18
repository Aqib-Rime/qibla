import { MosqueMark } from "@/components/ui/mosque-mark"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

type Props = {
  mode: "in" | "up"
}

export function SignInHero({ mode }: Props) {
  return (
    <View className="items-center pt-s-5">
      <MosqueMark size="md" />
      <Text variant="display-lg" className="mt-s-3 text-center">
        Welcome to{" "}
        <Text variant="display-lg" tone="green">
          Qibla
        </Text>
      </Text>
      <Text variant="body-sm" tone="muted" className="mt-s-1">
        {mode === "in"
          ? "Sign in to find mosques nearby"
          : "Create an account to save your favourite mosques"}
      </Text>
    </View>
  )
}
