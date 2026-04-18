import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

export function SignInOAuthRow() {
  return (
    <>
      <View className="gap-s-2">
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
    </>
  )
}
