import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { Link, useRouter } from "expo-router"
import { Pressable, View } from "react-native"

type Props = {
  step: 1 | 2 | 3
  title: string
  body: string
  art: React.ReactNode
}

const NEXT = {
  1: "/onboard/2",
  2: "/onboard/3",
  3: "/onboard/permission",
} as const

export function OnboardLayout({ step, title, body, art }: Props) {
  const router = useRouter()
  const next = NEXT[step]

  return (
    <Screen bg="cream">
      <View className="pt-s-4 flex-row items-center justify-between">
        <View className="flex-row gap-s-1">
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              className={`h-1.5 rounded-full ${n === step ? "w-6 bg-green" : "w-1.5 bg-line"}`}
            />
          ))}
        </View>
        <Link href="/onboard/permission" asChild>
          <Pressable>
            <Text variant="label" tone="muted">
              Skip
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="mt-s-5 h-[340px] rounded-xl overflow-hidden border border-line bg-white">
        {art}
      </View>

      <View className="mt-s-7">
        <Text variant="display-lg" className="max-w-[320px]">
          {title}
        </Text>
        <Text variant="body" tone="muted" className="mt-s-3 max-w-[320px]">
          {body}
        </Text>
      </View>

      <View className="flex-1" />
      <View className="pb-s-8">
        <Button
          variant="dark"
          label={step < 3 ? "Continue" : "Get started"}
          trailing={<Icon name="arrow" size={16} color="#fff" />}
          onPress={() => router.push(next)}
        />
      </View>
    </Screen>
  )
}
