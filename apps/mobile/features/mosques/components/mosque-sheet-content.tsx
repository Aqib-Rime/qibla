import { Text } from "@/components/ui/text"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { View } from "react-native"
import type { MosqueListItem } from "../lib/types"
import { MosqueAddressCard } from "./mosque-address-card"
import { MosqueFacilities } from "./mosque-facilities"
import { MosqueMetaRow } from "./mosque-meta-row"
import { MosqueSheetActions } from "./mosque-sheet-actions"

export function MosqueSheetContent({ mosque }: { mosque: MosqueListItem }) {
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

        <View className="mt-s-3">
          <MosqueMetaRow
            rating={mosque.rating}
            reviewsCount={mosque.reviewsCount}
            open={mosque.open}
            area={mosque.area}
          />
        </View>

        <View className="mt-s-5">
          <MosqueSheetActions mosque={mosque} />
        </View>

        {mosque.address ? (
          <View className="mt-s-5">
            <MosqueAddressCard
              address={mosque.address}
              street={mosque.street}
            />
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

        <View className="mt-s-5">
          <MosqueFacilities facilities={mosque.facilities} />
        </View>
      </View>
    </BottomSheetScrollView>
  )
}
