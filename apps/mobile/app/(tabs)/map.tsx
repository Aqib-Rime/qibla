import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { StatusBar } from "expo-status-bar"
import { useMemo } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"
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

export default function MapScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mosques", "list"],
    queryFn: () => api.mosques.list({ pageSize: 50 }),
  })

  const mosques = useMemo(() => data?.data ?? [], [data])

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DHAKA_REGION}
        showsUserLocation
        showsCompass={false}
      >
        {mosques.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            title={m.name}
            description={m.area ?? undefined}
            pinColor={MARKER_COLOR}
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
              Tap a pin for prayer times
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
    </View>
  )
}
