import { Button } from "@/components/ui/button"
import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { api } from "@/lib/api"
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  View,
} from "react-native"
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps"
import { SafeAreaView } from "react-native-safe-area-context"

const MARKER_COLOR = "#2e5d45"

const DHAKA_REGION: Region = {
  latitude: 23.7806,
  longitude: 90.4078,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
}

const FACILITY_META: Record<string, { label: string; icon: IconName }> = {
  wudu: { label: "Wudu", icon: "wifi" },
  women: { label: "Women", icon: "users" },
  parking: { label: "Parking", icon: "parking" },
  ac: { label: "AC", icon: "ac" },
  book: { label: "Madrasa", icon: "book" },
  elevator: { label: "Elevator", icon: "arrow" },
}

type Mosque = NonNullable<
  Awaited<ReturnType<typeof api.mosques.list>>["data"]
>[number]

export default function MapScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mosques", "list"],
    queryFn: () => api.mosques.list({ pageSize: 50 }),
  })

  const mosques = useMemo(() => data?.data ?? [], [data])
  const [selected, setSelected] = useState<Mosque | null>(null)
  const sheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["32%", "85%"], [])

  const handleMarkerPress = useCallback((m: Mosque) => {
    setSelected(m)
    sheetRef.current?.snapToIndex(0)
  }, [])

  const handleSheetClose = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        opacity={0.3}
        pressBehavior="collapse"
      />
    ),
    []
  )

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DHAKA_REGION}
        showsUserLocation
        showsCompass={false}
        onPress={handleSheetClose}
      >
        {mosques.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            pinColor={MARKER_COLOR}
            onPress={(e) => {
              e.stopPropagation()
              handleMarkerPress(m)
            }}
          />
        ))}
      </MapView>

      <SafeAreaView
        edges={["top", "left", "right"]}
        pointerEvents="box-none"
        className="absolute left-0 right-0 top-0"
      >
        <View
          className="mx-s-5 mt-s-3 flex-row items-center gap-s-3 rounded-md bg-white px-s-4 py-s-3"
          style={{
            shadowColor: "#1a2a22",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
            <Icon name="pin" size={16} color="#2e5d45" />
          </View>
          <View className="flex-1">
            <Text variant="label" tone="ink">
              {isLoading
                ? "Loading mosques…"
                : error
                  ? "Could not load mosques"
                  : `${mosques.length} mosques in Dhaka`}
            </Text>
            <Text variant="caption" tone="muted">
              Tap a pin for details
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#2e5d45" />
          ) : error ? (
            <Pressable onPress={() => refetch()}>
              <Text variant="label" tone="green">
                Retry
              </Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#fffbf1" }}
        handleIndicatorStyle={{ backgroundColor: "#c5c0ad" }}
        onClose={() => setSelected(null)}
      >
        {selected ? <MosqueSheet mosque={selected} /> : null}
      </BottomSheet>
    </View>
  )
}

function MosqueSheet({ mosque }: { mosque: Mosque }) {
  const facilities = useMemo(
    () =>
      mosque.facilities
        .map((key) => ({ key, meta: FACILITY_META[key] }))
        .filter(
          (f): f is { key: string; meta: (typeof FACILITY_META)[string] } =>
            Boolean(f.meta)
        ),
    [mosque.facilities]
  )

  const openDirections = () => {
    const { lat, lng, name } = mosque
    const label = encodeURIComponent(name)
    const url =
      Platform.OS === "ios"
        ? `comgooglemaps://?daddr=${lat},${lng}&q=${label}`
        : `google.navigation:q=${lat},${lng}`
    const fallback =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    Linking.openURL(url).catch(() => Linking.openURL(fallback))
  }

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-s-6 pt-s-2">
        <Text variant="display-md">{mosque.name}</Text>
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

        <View className="mt-s-5 flex-row gap-s-3">
          <View className="flex-1">
            <Button
              label="Directions"
              leading={<Icon name="navigation" size={16} color="#ffffff" />}
              onPress={openDirections}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Details"
              variant="outline"
              trailing={<Icon name="chevron" size={16} color="#1a2a22" />}
              onPress={() => router.push(`/mosque/${mosque.id}`)}
            />
          </View>
        </View>

        {mosque.address ? (
          <View className="mt-s-5 flex-row items-start gap-s-3 rounded-md bg-white p-s-4">
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

        {mosque.about ? (
          <View className="mt-s-5">
            <Text variant="eyebrow" tone="muted">
              About
            </Text>
            <Text variant="body" className="mt-s-2">
              {mosque.about}
            </Text>
          </View>
        ) : null}

        {facilities.length ? (
          <View className="mt-s-5">
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
    </BottomSheetScrollView>
  )
}
