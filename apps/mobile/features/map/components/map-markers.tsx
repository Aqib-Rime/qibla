import type { MosqueListItem } from "@/features/mosques"
import { Marker } from "react-native-maps"

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
          onPress={(e) => {
            e.stopPropagation()
            onSelect(m)
          }}
        />
      ))}
    </>
  )
}
