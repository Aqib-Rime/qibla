import {
  useMosquesList,
  type MosqueListItem,
} from "@/features/mosques"
import { usePrayerTimes } from "@/features/prayer-times"
import type BottomSheet from "@gorhom/bottom-sheet"
import { StatusBar } from "expo-status-bar"
import { useCallback, useMemo, useRef, useState } from "react"
import { View } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { useUserLocation } from "../hooks/use-user-location"
import { DHAKA_REGION } from "../lib/region"
import { MapMarkers } from "./map-markers"
import { MapMosqueSheet } from "./map-mosque-sheet"
import { MapTopPill } from "./map-top-pill"

export function MapScreen() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useMosquesList({ pageSize: 50 })
  const mosques = useMemo(() => data?.data ?? [], [data])

  const [selected, setSelected] = useState<MosqueListItem | null>(null)
  const sheetRef = useRef<BottomSheet>(null)

  const userPos = useUserLocation()
  const coords = userPos ?? {
    lat: DHAKA_REGION.latitude,
    lng: DHAKA_REGION.longitude,
  }
  const { data: prayer } = usePrayerTimes(coords)

  const handleMarkerPress = useCallback((m: MosqueListItem) => {
    setSelected(m)
    sheetRef.current?.snapToIndex(0)
  }, [])

  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DHAKA_REGION}
        showsUserLocation
        showsCompass={false}
        onPress={handleCloseSheet}
      >
        <MapMarkers mosques={mosques} onSelect={handleMarkerPress} />
      </MapView>

      <MapTopPill
        mosqueCount={mosques.length}
        mosquesLoading={isLoading}
        mosquesError={Boolean(error)}
        timings={prayer?.timings ?? null}
        onRetry={() => refetch()}
      />

      <MapMosqueSheet
        ref={sheetRef}
        mosque={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  )
}
