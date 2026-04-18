import { router } from "expo-router"
import { View } from "react-native"
import { MapFloatingAction } from "./map-floating-action"

type Props = {
  onRecenter: () => void
  canRecenter: boolean
  activeFilters: number
}

export function MapFloatingControls({
  onRecenter,
  canRecenter,
  activeFilters,
}: Props) {
  return (
    <View className="items-end gap-s-3">
      <MapFloatingAction
        icon="filter"
        onPress={() => router.push("/filter")}
        accessibilityLabel="Filter mosques"
        badgeCount={activeFilters}
      />
      <MapFloatingAction
        icon="recenter"
        onPress={onRecenter}
        disabled={!canRecenter}
        accessibilityLabel="Recenter on my location"
      />
    </View>
  )
}
