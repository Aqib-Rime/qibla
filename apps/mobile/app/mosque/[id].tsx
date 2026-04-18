import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "overview" | "times" | "events" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "times", label: "Times" },
  { key: "events", label: "Events" },
  { key: "reviews", label: "Reviews" },
];

const FACILITY_META: Record<string, { label: string; icon: IconName }> = {
  wudu: { label: "Wudu", icon: "wifi" },
  women: { label: "Women", icon: "users" },
  parking: { label: "Parking", icon: "parking" },
  ac: { label: "AC", icon: "ac" },
  book: { label: "Madrasa", icon: "book" },
  elevator: { label: "Elevator", icon: "arrow" },
};

export default function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<TabKey>("overview");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mosques", "byId", id],
    queryFn: () => api.mosques.byId({ id }),
    enabled: Boolean(id),
  });

  const mosque = data?.mosque;

  const handleDirections = () => {
    if (!mosque) return;
    const { lat, lng, name } = mosque;
    const label = encodeURIComponent(name);
    const url =
      Platform.OS === "ios"
        ? `comgooglemaps://?daddr=${lat},${lng}&q=${label}`
        : `google.navigation:q=${lat},${lng}`;
    const fallback =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    Linking.openURL(url).catch(() => Linking.openURL(fallback));
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-cream">
        <View className="flex-row items-center justify-between px-s-5 py-s-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-pill bg-white"
            hitSlop={8}
          >
            <Icon name="back" size={20} color="#1a2a22" />
          </Pressable>
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-pill bg-white"
            hitSlop={8}
          >
            <Icon name="heart" size={20} color="#1a2a22" />
          </Pressable>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2e5d45" />
        </View>
      ) : error || !mosque ? (
        <View className="flex-1 items-center justify-center gap-s-3 px-s-6">
          <Icon name="alert" size={32} color="#6b7a70" />
          <Text variant="body" tone="muted" className="text-center">
            Could not load this mosque.
          </Text>
          <Pressable onPress={() => refetch()}>
            <Text variant="label" tone="green">
              Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-s-6 pt-s-2">
              <Text variant="display-lg">{mosque.name}</Text>
              {mosque.subtitle ? (
                <Text variant="body" tone="muted" className="mt-s-1">
                  {mosque.subtitle}
                </Text>
              ) : null}

              <View className="mt-s-3 flex-row items-center gap-s-4">
                {typeof mosque.rating === "number" ? (
                  <View className="flex-row items-center gap-s-1">
                    <Icon name="star" size={14} color="#b68a3c" />
                    <Text variant="label">
                      {mosque.rating.toFixed(1)}
                      <Text variant="label" tone="muted">
                        {" "}
                        ({mosque.reviewsCount})
                      </Text>
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row items-center gap-s-1">
                  <Icon
                    name="clock"
                    size={14}
                    color={mosque.open ? "#2e5d45" : "#6b7a70"}
                  />
                  <Text variant="label" tone={mosque.open ? "green" : "muted"}>
                    {mosque.open ? "Open" : "Closed"}
                  </Text>
                </View>
                {mosque.area ? (
                  <View className="flex-row items-center gap-s-1">
                    <Icon name="pin" size={14} color="#6b7a70" />
                    <Text variant="label" tone="muted">
                      {mosque.area}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View className="mt-s-5 border-line border-b px-s-6">
              <View className="flex-row gap-s-5">
                {TABS.map((t) => {
                  const active = t.key === tab;
                  return (
                    <Pressable
                      key={t.key}
                      onPress={() => setTab(t.key)}
                      className="py-s-3"
                    >
                      <Text
                        variant="label"
                        tone={active ? "ink" : "muted"}
                        className={active ? "font-sans-semibold" : ""}
                      >
                        {t.label}
                      </Text>
                      {active ? (
                        <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-green" />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="px-s-6 pt-s-5">
              {tab === "overview" ? (
                <OverviewTab mosque={mosque} imam={data?.imam ?? null} />
              ) : tab === "times" ? (
                <TimesTab />
              ) : tab === "events" ? (
                <EventsTab events={data?.events ?? []} />
              ) : (
                <ReviewsTab reviews={data?.reviews ?? []} />
              )}
            </View>
          </ScrollView>

          <SafeAreaView
            edges={["bottom"]}
            className="absolute bottom-0 left-0 right-0 bg-cream"
          >
            <View className="border-line border-t px-s-6 py-s-3">
              <Button
                label="Directions"
                leading={<Icon name="navigation" size={18} color="#ffffff" />}
                onPress={handleDirections}
                size="lg"
              />
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

function OverviewTab({
  mosque,
  imam,
}: {
  mosque: NonNullable<Awaited<ReturnType<typeof api.mosques.byId>>>["mosque"];
  imam: Awaited<ReturnType<typeof api.mosques.byId>>["imam"];
}) {
  const facilities = useMemo(
    () =>
      mosque.facilities
        .map((key) => ({ key, meta: FACILITY_META[key] }))
        .filter(
          (f): f is { key: string; meta: (typeof FACILITY_META)[string] } =>
            Boolean(f.meta),
        ),
    [mosque.facilities],
  );

  return (
    <View className="gap-s-5">
      {mosque.about ? (
        <View>
          <Text variant="eyebrow" tone="muted">
            About
          </Text>
          <Text variant="body" className="mt-s-2">
            {mosque.about}
          </Text>
        </View>
      ) : null}

      {mosque.address ? (
        <View className="flex-row items-start gap-s-3 rounded-md bg-white p-s-4">
          <Icon name="pin" size={18} color="#2e5d45" />
          <View className="flex-1">
            <Text variant="label">{mosque.address}</Text>
            {mosque.street ? (
              <Text variant="caption" tone="muted" className="mt-s-1">
                {mosque.street}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {imam ? (
        <View>
          <Text variant="eyebrow" tone="muted">
            Imam
          </Text>
          <View className="mt-s-2 flex-row items-center gap-s-3 rounded-md bg-white p-s-4">
            <View className="h-11 w-11 items-center justify-center rounded-pill bg-green-tint">
              <Icon name="user" size={20} color="#2e5d45" />
            </View>
            <View className="flex-1">
              <Text variant="label">{imam.name}</Text>
              <Text variant="caption" tone="muted" className="mt-s-1">
                {imam.role}
                {imam.since ? ` · since ${imam.since}` : ""}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {facilities.length ? (
        <View>
          <Text variant="eyebrow" tone="muted">
            Facilities
          </Text>
          <View className="mt-s-2 flex-row flex-wrap gap-s-2">
            {facilities.map((f) => (
              <View
                key={f.key}
                className="flex-row items-center gap-s-2 rounded-pill bg-white px-s-4 py-s-2"
              >
                <Icon name={f.meta.icon} size={14} color="#2e5d45" />
                <Text variant="caption">{f.meta.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function TimesTab() {
  return (
    <View className="items-center gap-s-3 rounded-md bg-white px-s-5 py-s-8">
      <Icon name="clock" size={28} color="#6b7a70" />
      <Text variant="label" tone="muted">
        Prayer times coming soon
      </Text>
      <Text variant="caption" tone="muted" className="text-center">
        We&apos;ll pull today&apos;s times from AlAdhan and cache by area.
      </Text>
    </View>
  );
}

function EventsTab({
  events,
}: {
  events: Awaited<ReturnType<typeof api.mosques.byId>>["events"];
}) {
  if (!events.length) {
    return (
      <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
        <Text variant="label" tone="muted">
          No upcoming events
        </Text>
      </View>
    );
  }
  return (
    <View className="gap-s-3">
      {events.map((e) => (
        <View
          key={e.id}
          className="flex-row items-start gap-s-3 rounded-md bg-white p-s-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
            <Icon name="clock" size={16} color="#2e5d45" />
          </View>
          <View className="flex-1">
            <Text variant="label">{e.title}</Text>
            <Text variant="caption" tone="muted" className="mt-s-1">
              {e.when}
              {e.by ? ` · ${e.by}` : ""}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ReviewsTab({
  reviews,
}: {
  reviews: Awaited<ReturnType<typeof api.mosques.byId>>["reviews"];
}) {
  if (!reviews.length) {
    return (
      <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
        <Text variant="label" tone="muted">
          No reviews yet
        </Text>
      </View>
    );
  }
  return (
    <View className="gap-s-3">
      {reviews.map((r) => (
        <View key={r.id} className="rounded-md bg-white p-s-4">
          <View className="flex-row items-center justify-between">
            <Text variant="label">{r.userName}</Text>
            <View className="flex-row items-center gap-s-1">
              <Icon name="star" size={12} color="#b68a3c" />
              <Text variant="caption">{r.rating}</Text>
            </View>
          </View>
          {r.body ? (
            <Text variant="body-sm" tone="muted" className="mt-s-2">
              {r.body}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
