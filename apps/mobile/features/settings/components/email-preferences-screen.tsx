import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useAppDialog } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useThemeScheme } from "@/features/theme/hooks/use-theme-scheme";
import {
  useHydrateSettings,
  useSettingsStore,
} from "../hooks/use-settings-store";
import {
  cancelPrayerReminders,
  ensureNotificationPermission,
} from "../lib/notifications";
import { SettingsHeader } from "./settings-header";
import { SettingsSection } from "./settings-section";
import { SettingsToggleRow } from "./settings-toggle-row";

export function EmailPreferencesScreen() {
  useHydrateSettings();
  const prayerReminders = useSettingsStore((s) => s.prayerReminders);
  const setPrayerReminders = useSettingsStore((s) => s.setPrayerReminders);
  const scheme = useThemeScheme();
  const dialog = useAppDialog();

  const onTogglePrayerReminders = async (next: boolean) => {
    if (!next) {
      setPrayerReminders(false);
      await cancelPrayerReminders();
      return;
    }
    const granted = await ensureNotificationPermission();
    if (!granted) {
      dialog.show({
        title: "Notifications disabled",
        body: "Enable notifications in Settings to get prayer reminders.",
        actions: [
          { label: "Not now", variant: "outline" },
          { label: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      });
      return;
    }
    setPrayerReminders(true);
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <SettingsHeader title="Email & notifications" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Notifications">
          <SettingsToggleRow
            icon="bell"
            label="Prayer reminders"
            description="Daily local notifications at each prayer time"
            value={prayerReminders}
            onValueChange={onTogglePrayerReminders}
            isLast
          />
        </SettingsSection>

        <View className="mt-s-3 px-s-2">
          <Text variant="caption" tone="muted">
            Event updates and weekly digests will arrive over email once mosque
            content broadcasts are enabled.
          </Text>
        </View>
      </ScrollView>

      {dialog.element}
    </View>
  );
}
