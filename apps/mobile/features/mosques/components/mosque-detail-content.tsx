import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { PrayerTimesTab } from "@/features/prayer-times";
import type { MosqueDetail } from "../lib/types";
import { MosqueDetailTabs, type MosqueTab } from "./mosque-detail-tabs";
import { MosqueEventsTab } from "./mosque-events-tab";
import { MosqueMetaRow } from "./mosque-meta-row";
import { MosqueOverviewTab } from "./mosque-overview-tab";
import { MosqueReviewsTab } from "./mosque-reviews-tab";

export function MosqueDetailContent({ data }: { data: MosqueDetail }) {
  const [tab, setTab] = useState<MosqueTab>("overview");
  const { mosque, imam, events, reviews } = data;

  return (
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
        <View className="mt-s-3">
          <MosqueMetaRow
            rating={mosque.rating}
            reviewsCount={mosque.reviewsCount}
            open={mosque.open}
            area={mosque.area}
          />
        </View>
      </View>

      <View className="mt-s-5">
        <MosqueDetailTabs active={tab} onChange={setTab} />
      </View>

      <View className="px-s-6 pt-s-5">
        {tab === "overview" ? (
          <MosqueOverviewTab mosque={mosque} imam={imam} />
        ) : tab === "times" ? (
          <PrayerTimesTab lat={mosque.lat} lng={mosque.lng} />
        ) : tab === "events" ? (
          <MosqueEventsTab events={events} />
        ) : (
          <MosqueReviewsTab mosqueId={mosque.id} reviews={reviews} />
        )}
      </View>
    </ScrollView>
  );
}
