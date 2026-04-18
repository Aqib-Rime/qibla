import { useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { View } from "react-native"
import { useMosque } from "../hooks/use-mosques"
import { usePushRecentMosque } from "../hooks/use-recent-mosques"
import { MosqueDetailContent } from "./mosque-detail-content"
import { MosqueDetailError } from "./mosque-detail-error"
import { MosqueDetailHeader } from "./mosque-detail-header"
import { MosqueDetailSkeleton } from "./mosque-detail-skeleton"
import { MosqueDirectionsFooter } from "./mosque-directions-footer"

export function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useMosque(id)
  const pushRecent = usePushRecentMosque()

  useEffect(() => {
    if (data?.mosque.id) pushRecent.mutate(data.mosque.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.mosque.id])

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MosqueDetailHeader mosqueId={data?.mosque.id} isSaved={data?.isSaved} />

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
    </View>
  )
}
