import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { useMosque } from "../hooks/use-mosques";
import { usePushRecentMosque } from "../hooks/use-recent-mosques";
import { MosqueDetailContent } from "./mosque-detail-content";
import { MosqueDetailError } from "./mosque-detail-error";
import { MosqueDetailOverlay } from "./mosque-detail-overlay";
import { MosqueDetailSkeleton } from "./mosque-detail-skeleton";
import { MosqueDirectionsFooter } from "./mosque-directions-footer";

export function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useMosque(id);
  const pushRecent = usePushRecentMosque();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pushRecent is a stable mutation; we only want to fire when the id changes
  useEffect(() => {
    if (data?.mosque.id) pushRecent.mutate(data.mosque.id);
  }, [data?.mosque.id]);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="light" />

      {isLoading ? (
        <MosqueDetailSkeleton />
      ) : error || !data ? (
        <MosqueDetailError onRetry={() => refetch()} />
      ) : (
        <>
          <MosqueDetailContent data={data} />
          <MosqueDirectionsFooter mosque={data.mosque} />
        </>
      )}

      <MosqueDetailOverlay mosqueId={data?.mosque.id} isSaved={data?.isSaved} />
    </View>
  );
}
