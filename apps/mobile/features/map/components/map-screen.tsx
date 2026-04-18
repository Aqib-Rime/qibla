import {
  applyFilters,
  countActive,
  useMosqueFilters,
  useMosquesList,
  type MosqueListItem,
} from "@/features/mosques"
import { usePrayerTimes } from "@/features/prayer-times"
import type BottomSheet from "@gorhom/bottom-sheet"
import { StatusBar } from "expo-status-bar"
import { useCallback, useMemo, useRef, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { useUserLocation } from "@/lib/use-user-location"
import { DHAKA_REGION } from "../lib/region"
import { MapMarkers } from "./map-markers"
import { MapMosqueSheet } from "./map-mosque-sheet"
import { MapTopOverlay } from "./map-top-overlay"

export function MapScreen() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useMosquesList({ pageSize: 50 })
  const filters = useMosqueFilters()
  const activeFilters = countActive(filters)
  const mosques = useMemo(
    () => applyFilters(data?.data ?? [], filters),
    [data, filters]
  )

  const [selected, setSelected] = useState<MosqueListItem | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
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
    setMenuOpen(false)
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

      {menuOpen ? (
        <Pressable
          onPress={() => setMenuOpen(false)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <MapTopOverlay
        mosqueCount={mosques.length}
        mosquesLoading={isLoading}
        mosquesError={Boolean(error)}
        timings={prayer?.timings ?? null}
        onRetry={() => refetch()}
        onRecenter={handleRecenter}
        canRecenter={Boolean(userPos)}
        activeFilters={activeFilters}
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <MapMosqueSheet
        ref={sheetRef}
        mosque={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  )
}
