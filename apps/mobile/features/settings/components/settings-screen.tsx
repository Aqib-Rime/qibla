import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Share, View } from "react-native";
import { Text } from "@/components/ui/text";
import { signOut, useSession } from "@/lib/auth";
import {
  useHydrateSettings,
  useSettingsStore,
} from "../hooks/use-settings-store";
import {
  cancelPrayerReminders,
  ensureNotificationPermission,
} from "../lib/notifications";
import { SettingsHeader } from "./settings-header";
import { SettingsRow } from "./settings-row";
import { SettingsSection } from "./settings-section";
import { SettingsToggleRow } from "./settings-toggle-row";

export function SettingsScreen() {
  useHydrateSettings();
  const { data: session } = useSession();
  const prayerReminders = useSettingsStore((s) => s.prayerReminders);
  const setPrayerReminders = useSettingsStore((s) => s.setPrayerReminders);

  const [locationStatus, setLocationStatus] = useState<
    "granted" | "denied" | "unknown"
  >("unknown");

  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then((res) =>
        setLocationStatus(res.status === "granted" ? "granted" : "denied"),
      )
      .catch(() => setLocationStatus("unknown"));
  }, []);

  const onTogglePrayerReminders = async (next: boolean) => {
    if (!next) {
      setPrayerReminders(false);
      await cancelPrayerReminders();
      return;
    }
    const granted = await ensureNotificationPermission();
    if (!granted) {
      Alert.alert(
        "Notifications disabled",
        "Enable notifications in Settings to get prayer reminders.",
        [
          { text: "Not now", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    setPrayerReminders(true);
  };

  const onInvite = () => {
    Share.share({
      message: "Try Qibla — find nearby mosques and prayer times.",
    }).catch(() => {});
  };

  const onSignOut = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/(auth)/sign-in");
    }
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SettingsHeader />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Preferences">
          <SettingsRow
            icon="pin"
            label="Location"
            right={
              locationStatus === "granted"
                ? "Allowed"
                : locationStatus === "denied"
                  ? "Denied"
                  : ""
            }
            onPress={() => Linking.openSettings()}
          />
          <SettingsToggleRow
            icon="bell"
            label="Prayer reminders"
            description="Daily local notifications at each prayer time"
            value={prayerReminders}
            onValueChange={onTogglePrayerReminders}
          />
          <SettingsRow
            icon="compass"
            label="Recalibrate compass"
            onPress={() => router.push("/qibla")}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            icon="user"
            label="Account"
            right={session?.user?.email ?? ""}
          />
          <SettingsRow icon="mail" label="Email preferences" isLast />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon="book" label="Help & guides" />
          <SettingsRow icon="star" label="Rate Qibla" />
          <SettingsRow
            icon="share"
            label="Invite friends"
            onPress={onInvite}
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

        <View className="mt-s-3">
          <Text variant="caption" tone="muted" className="text-center">
            Qibla v1.0 · Dhaka
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
