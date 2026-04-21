import * as Linking from "expo-linking";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Share, View } from "react-native";
import { useHydrateSettings, useSettingsStore } from "@/features/settings";
import { useSession } from "@/lib/auth";
import { useProfileStats } from "../hooks/use-profile-stats";
import { ProfileHeader } from "./profile-header";
import { ProfileHeroCard } from "./profile-hero-card";
import { ProfileRow } from "./profile-row";
import { ProfileSection } from "./profile-section";
import { ProfileSignOut, ProfileVersion } from "./profile-sign-out";
import { ProfileStats } from "./profile-stats";

export function ProfileScreen() {
  useHydrateSettings();
  const { data: session } = useSession();
  const stats = useProfileStats();
  const prayerReminders = useSettingsStore((s) => s.prayerReminders);

  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "";

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <ProfileHeader />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeroCard name={name} email={email} />

        <ProfileStats
          stats={[
            { value: stats.savedCount, label: "Saved" },
            { value: stats.visitedCount, label: "Visited" },
            { value: stats.reviewsCount, label: "Reviews" },
          ]}
        />

        <ProfileSection title="My Qibla">
          <ProfileRow
            icon="compass"
            label="Find Qibla"
            onPress={() => router.push("/qibla")}
          />
          <ProfileRow
            icon="heart"
            label="Saved mosques"
            right={String(stats.savedCount)}
            onPress={() => router.push("/(tabs)/saved")}
          />
          <ProfileRow
            icon="clock"
            label="Prayer reminders"
            right={prayerReminders ? "On" : "Off"}
            onPress={() => router.push("/settings/email-preferences")}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="Contribute">
          <ProfileRow
            icon="pin"
            label="Submit a mosque"
            onPress={() => router.push("/submit")}
          />
          <ProfileRow
            icon="pencil"
            label="My submissions"
            onPress={() => router.push("/submissions")}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="Settings">
          <ProfileRow
            icon="settings"
            label="Preferences"
            onPress={() => router.push("/settings")}
          />
          <ProfileRow
            icon="user"
            label="Account"
            onPress={() => router.push("/settings/account")}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="About">
          <ProfileRow
            icon="book"
            label="Help & guides"
            onPress={() => router.push("/settings/help")}
          />
          <ProfileRow
            icon="star"
            label="Rate Qibla"
            onPress={() => {
              Linking.openURL("https://github.com/Aqib-Rime/qibla").catch(
                () => {},
              );
            }}
          />
          <ProfileRow
            icon="share"
            label="Invite friends"
            onPress={() => {
              Share.share({
                message: "Try Qibla — find nearby mosques and prayer times.",
              }).catch(() => {});
            }}
            isLast
          />
        </ProfileSection>

        <ProfileSignOut />
        <ProfileVersion />
      </ScrollView>
    </View>
  );
}
