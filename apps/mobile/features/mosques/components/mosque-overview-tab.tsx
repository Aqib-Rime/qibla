import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { Imam, Mosque } from "../lib/types"
import { MosqueAddressCard } from "./mosque-address-card"
import { MosqueFacilities } from "./mosque-facilities"
import { MosqueImamCard } from "./mosque-imam-card"

type Props = {
  mosque: Mosque
  imam: Imam
}

export function MosqueOverviewTab({ mosque, imam }: Props) {
  return (
    <View className="gap-s-5">
      {mosque.about ? (
        <View>
          <Text variant="eyebrow" tone="muted">
            About
          </Text>
          <Text variant="body" className="mt-s-2">
            {mosque.about}
          </Text>
        </View>
      ) : null}

      <MosqueAddressCard address={mosque.address} street={mosque.street} />
      <MosqueImamCard imam={imam} />
      <MosqueFacilities facilities={mosque.facilities} />
    </View>
  )
}
