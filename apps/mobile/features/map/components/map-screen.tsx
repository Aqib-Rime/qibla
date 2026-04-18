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
import { MapFloatingControls } from "./map-floating-controls"
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
  const mapRef = useRef<MapView>(null)

  const userPos = useUserLocation()
  const coords = userPos ?? {
    lat: DHAKA_REGION.latitude,
    lng: DHAKA_REGION.longitude,
  }
  const { data: prayer } = usePrayerTimes(coords)

  const handleMarkerPress = useCallback((m: MosqueListItem) => {
    setSelected(m)
    sheetRef.current?.snapToIndex(0)
    mapRef.current?.animateToRegion(
      {
        latitude: m.lat,
        longitude: m.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400
    )
  }, [])

  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  const handleRecenter = useCallback(() => {
    const target = userPos ?? {
      lat: DHAKA_REGION.latitude,
      lng: DHAKA_REGION.longitude,
    }
    mapRef.current?.animateToRegion(
      {
        latitude: target.lat,
        longitude: target.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      500
    )
  }, [userPos])

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DHAKA_REGION}
        showsUserLocation
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={handleCloseSheet}
        onPoiClick={handleCloseSheet}
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

      <MapFloatingControls
        onRecenter={handleRecenter}
        canRecenter={Boolean(userPos)}
      />

      <MapMosqueSheet
        ref={sheetRef}
        mosque={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  )
}
