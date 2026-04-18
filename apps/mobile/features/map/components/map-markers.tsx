import type { MosqueListItem } from "@/features/mosques"
import { Marker } from "react-native-maps"
import { MARKER_COLOR } from "../lib/region"

type Props = {
  mosques: readonly MosqueListItem[]
  onSelect: (mosque: MosqueListItem) => void
}

export function MapMarkers({ mosques, onSelect }: Props) {
  return (
    <>
      {mosques.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.lat, longitude: m.lng }}
          pinColor={MARKER_COLOR}
          onPress={(e) => {
            e.stopPropagation()
            onSelect(m)
          }}
        />
      ))}
    </>
  )
}
