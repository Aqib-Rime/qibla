import { useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import { useMosque } from "../hooks/use-mosques"
import { MosqueDetailContent } from "./mosque-detail-content"
import { MosqueDetailError } from "./mosque-detail-error"
import { MosqueDetailHeader } from "./mosque-detail-header"
import { MosqueDetailSkeleton } from "./mosque-detail-skeleton"
import { MosqueDirectionsFooter } from "./mosque-directions-footer"

export function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useMosque(id)

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MosqueDetailHeader />

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
