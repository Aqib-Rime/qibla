import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { usePullToRefresh } from "@/lib/use-pull-to-refresh";
import { useMySubmissions } from "../hooks/use-submissions";

type SubmissionRow = NonNullable<
  ReturnType<typeof useMySubmissions>["data"]
>["data"][number];

export function MySubmissionsScreen() {
  const { data, isLoading } = useMySubmissions();
  const submissions = data?.data ?? [];
  const { refreshing, onRefresh } = usePullToRefresh();

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-cream">
        <View className="flex-row items-center justify-between px-s-5 py-s-2">
          <IconButton
            icon="back"
            size="sm"
            variant="ghost"
            onPress={() => router.back()}
            accessibilityLabel="Back"
          />
          <Text variant="display-sm">My submissions</Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2e5d45"
            colors={["#2e5d45"]}
          />
        }
      >
        {isLoading ? (
          <View className="gap-s-3">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, index is stable
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </View>
        ) : submissions.length === 0 ? (
          <View className="mt-s-8 items-center gap-s-3 rounded-md bg-white px-s-5 py-s-8">
            <Icon name="pin" size={32} color="#6b7a70" />
            <Text variant="label" tone="muted">
              You haven't submitted any mosques yet.
            </Text>
            <Text variant="caption" tone="muted" className="text-center">
              Know a mosque that isn't on Qibla? Submit it in a few seconds.
            </Text>
            <View className="mt-s-2">
              <Button
                label="Submit a mosque"
                onPress={() => router.push("/submit")}
              />
            </View>
          </View>
        ) : (
          <View className="gap-s-3">
            {submissions.map((s) => (
              <SubmissionRowCard key={s.id} submission={s} />
            ))}
            <View className="mt-s-3">
              <Button
                label="Submit another"
                variant="outline"
                onPress={() => router.push("/submit")}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SubmissionRowCard({ submission }: { submission: SubmissionRow }) {
  return (
    <Pressable
      onPress={() => router.push(`/submissions/${submission.id}`)}
      className="flex-row items-center gap-s-3 rounded-md bg-white p-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
        <Icon name="pin" size={16} color="#2e5d45" />
      </View>
      <View className="flex-1">
        <Text variant="label" numberOfLines={1}>
          {submission.name}
        </Text>
        {submission.area ? (
          <Text variant="caption" tone="muted" className="mt-s-1">
            {submission.area}
          </Text>
        ) : null}
      </View>
      <StatusPill status={submission.status} />
      <Icon name="chevron" size={14} color="#6b7a70" />
    </Pressable>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles = (() => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-tint", fg: "green" as const, label: "Approved" };
      case "hidden":
        return { bg: "bg-[#f8e4df]", fg: "muted" as const, label: "Hidden" };
      default:
        return {
          bg: "bg-[#f4ead0]",
          fg: "muted" as const,
          label: "Pending",
        };
    }
  })();

  return (
    <View className={`rounded-pill px-s-3 py-s-1 ${styles.bg}`}>
      <Text variant="caption" tone={styles.fg} className="text-[10px]">
        {styles.label}
      </Text>
    </View>
  );
}
