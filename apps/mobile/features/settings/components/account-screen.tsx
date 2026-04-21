import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { signOut, useSession } from "@/lib/auth";
import { SettingsHeader } from "./settings-header";
import { SettingsRow } from "./settings-row";
import { SettingsSection } from "./settings-section";

function formatJoinDate(input: Date | string | undefined) {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function AccountScreen() {
  const { data: session } = useSession();
  const user = session?.user;

  const onSignOut = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/(auth)/sign-in");
    }
  };

  const onDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "Account deletion is coming soon. For now, contact support via the repo's issue tracker and we'll remove your data.",
      [{ text: "OK", style: "default" }],
    );
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SettingsHeader title="Account" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Identity">
          <SettingsRow icon="user" label="Name" right={user?.name ?? ""} />
          <SettingsRow icon="mail" label="Email" right={user?.email ?? ""} />
          <SettingsRow
            icon="calendar"
            label="Joined"
            right={formatJoinDate(user?.createdAt)}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Manage">
          <SettingsRow
            icon="alert"
            label="Delete account"
            onPress={onDeleteAccount}
            isLast
          />
        </SettingsSection>

        <Pressable
          onPress={onSignOut}
          className="mt-s-6 items-center py-s-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text variant="label" className="text-[#b04a3a]">
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
