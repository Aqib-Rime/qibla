import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { PrayerTimesTab } from "@/features/prayer-times";
import { useThemeColors } from "@/lib/theme";
import { usePullToRefresh } from "@/lib/use-pull-to-refresh";
import type { MosqueDetail } from "../lib/types";
import { MosqueDetailTabs, type MosqueTab } from "./mosque-detail-tabs";
import { MosqueEventsTab } from "./mosque-events-tab";
import { MosqueMetaRow } from "./mosque-meta-row";
import { MosqueOverviewTab } from "./mosque-overview-tab";
import { MosquePhotoHero, MosquePhotoStrip } from "./mosque-photo-gallery";
import { MosqueReviewsTab } from "./mosque-reviews-tab";

export function MosqueDetailContent({ data }: { data: MosqueDetail }) {
  const [tab, setTab] = useState<MosqueTab>("overview");
  const { mosque, imam, events, reviews } = data;
  const { refreshing, onRefresh } = usePullToRefresh();
  const colors = useThemeColors();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.green}
          colors={[colors.green]}
        />
      }
    >
      <MosquePhotoHero photos={mosque.photos} />

      <View className="px-s-6 pt-s-5">
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

      {mosque.photos.length > 1 ? (
        <View className="mt-s-5">
          <MosquePhotoStrip photos={mosque.photos} />
        </View>
      ) : null}

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
