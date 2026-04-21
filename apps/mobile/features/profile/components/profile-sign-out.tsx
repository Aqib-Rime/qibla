import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { signOut } from "@/lib/auth";

export function ProfileSignOut() {
  const onPress = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/(auth)/sign-in");
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="mt-s-6 items-center py-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <Text variant="label" className="text-danger">
        Sign out
      </Text>
    </Pressable>
  );
}

export function ProfileVersion() {
  return (
    <View className="mt-s-3">
      <Text variant="caption" tone="muted" className="text-center">
        Qibla v1.0 · Dhaka
      </Text>
    </View>
  );
}
