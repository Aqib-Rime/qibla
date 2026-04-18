import type { Timings } from "@/features/prayer-times"
import { router } from "expo-router"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapFloatingControls } from "./map-floating-controls"
import { MapTopMenu } from "./map-top-menu"
import { MapTopPill } from "./map-top-pill"

type Props = {
  mosqueCount: number
  mosquesLoading: boolean
  mosquesError: boolean
  timings: Timings | null
  onRetry: () => void
  onRecenter: () => void
  canRecenter: boolean
  activeFilters: number
  menuOpen: boolean
  onOpenMenu: () => void
  onCloseMenu: () => void
}

export function MapTopOverlay(props: Props) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      pointerEvents="box-none"
      className="absolute left-0 right-0 top-0"
    >
      <View className="gap-s-4 px-s-5 pt-s-4" pointerEvents="box-none">
        <View
          pointerEvents="box-none"
          style={{ zIndex: 20, elevation: 20 }}
        >
          <MapTopPill
            mosqueCount={props.mosqueCount}
            mosquesLoading={props.mosquesLoading}
            mosquesError={props.mosquesError}
            timings={props.timings}
            onRetry={props.onRetry}
            onSearch={() => {
              props.onCloseMenu()
              router.push("/search")
            }}
            onOpenMenu={props.onOpenMenu}
          />
          {props.menuOpen ? <MapTopMenu onClose={props.onCloseMenu} /> : null}
        </View>
        <MapFloatingControls
          onRecenter={props.onRecenter}
          canRecenter={props.canRecenter}
          activeFilters={props.activeFilters}
        />
      </View>
    </SafeAreaView>
  )
}
