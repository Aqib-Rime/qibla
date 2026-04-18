import { useHydrateSettings, useSettingsStore } from "@/features/settings"
import { useSession } from "@/lib/auth"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ScrollView, View } from "react-native"
import { useProfileStats } from "../hooks/use-profile-stats"
import { ProfileHeader } from "./profile-header"
import { ProfileHeroCard } from "./profile-hero-card"
import { ProfileRow } from "./profile-row"
import { ProfileSection } from "./profile-section"
import { ProfileSignOut, ProfileVersion } from "./profile-sign-out"
import { ProfileStats } from "./profile-stats"

export function ProfileScreen() {
  useHydrateSettings()
  const { data: session } = useSession()
  const stats = useProfileStats()
  const prayerReminders = useSettingsStore((s) => s.prayerReminders)

  const name = session?.user?.name ?? "Guest"
  const email = session?.user?.email ?? ""

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
            onPress={() => router.push("/settings")}
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
            onPress={() => router.push("/settings")}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="About">
          <ProfileRow
            icon="book"
            label="Help & guides"
            onPress={() => router.push("/settings")}
          />
          <ProfileRow
            icon="star"
            label="Rate Qibla"
            onPress={() => router.push("/settings")}
          />
          <ProfileRow
            icon="share"
            label="Invite friends"
            onPress={() => router.push("/settings")}
            isLast
          />
        </ProfileSection>

        <ProfileSignOut />
        <ProfileVersion />
      </ScrollView>
    </View>
  )
}
