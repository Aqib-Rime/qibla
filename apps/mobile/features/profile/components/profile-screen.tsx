import { Text } from "@/components/ui/text"
import { useSession } from "@/lib/auth"
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
  const { data: session } = useSession()
  const stats = useProfileStats()

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
            icon="heart"
            label="Saved mosques"
            right={String(stats.savedCount)}
          />
          <ProfileRow icon="clock" label="Prayer reminders" right="On" />
          <ProfileRow icon="calendar" label="Calendar sync" right="Off" isLast />
        </ProfileSection>

        <ProfileSection title="Settings">
          <ProfileRow icon="locate" label="Location" right="Allowed" />
          <ProfileRow icon="bell" label="Notifications" />
          <ProfileRow icon="user" label="Account" isLast />
        </ProfileSection>

        <ProfileSection title="About">
          <ProfileRow icon="book" label="Help & guides" />
          <ProfileRow icon="star" label="Rate Qibla" />
          <ProfileRow icon="share" label="Invite friends" isLast />
        </ProfileSection>

        <ProfileSignOut />
        <ProfileVersion />
      </ScrollView>
    </View>
  )
}
