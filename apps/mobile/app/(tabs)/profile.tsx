import { Button } from "@/components/ui/button"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { signOut, useSession } from "@/lib/auth"
import { useRouter } from "expo-router"
import { View } from "react-native"

export default function ProfileScreen() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <Screen bg="cream">
      <View className="pt-s-6">
        <Text variant="display-lg">Profile</Text>
        {session?.user && (
          <Text variant="body" tone="muted" className="mt-s-2">
            Signed in as {session.user.email}
          </Text>
        )}
      </View>

      <View className="flex-1" />

      <View className="pb-s-6">
        <Button
          variant="outline"
          label="Sign out"
          onPress={async () => {
            await signOut()
            router.replace("/(auth)/sign-in")
          }}
        />
      </View>
    </Screen>
  )
}
