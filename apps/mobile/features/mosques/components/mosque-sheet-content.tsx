import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useMemo } from "react";
import { View } from "react-native";
import { MosqueMark } from "@/components/ui/mosque-mark";
import { Text } from "@/components/ui/text";
import { useSavedMosques } from "../hooks/use-mosques";
import type { MosqueListItem } from "../lib/types";
import { MosqueAddressCard } from "./mosque-address-card";
import { MosqueFacilities } from "./mosque-facilities";
import { MosqueMetaRow } from "./mosque-meta-row";
import { MosqueSaveButton } from "./mosque-save-button";
import { MosqueSheetActions } from "./mosque-sheet-actions";

export function MosqueSheetContent({ mosque }: { mosque: MosqueListItem }) {
  const saved = useSavedMosques();
  const isSaved = useMemo(
    () => Boolean(saved.data?.data.some((m) => m.id === mosque.id)),
    [saved.data, mosque.id],
  );
  const thumb = mosque.photos?.[0];

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-s-6 pt-s-2">
        <View className="flex-row items-start gap-s-3">
          {thumb ? (
            <Image
              source={{ uri: thumb }}
              contentFit="cover"
              style={{ width: 56, height: 56, borderRadius: 8 }}
              transition={200}
            />
          ) : (
            <MosqueMark size="md" />
          )}
          <View className="flex-1">
            <Text variant="display-md">{mosque.name}</Text>
            {mosque.subtitle ? (
              <Text variant="body" tone="muted" className="mt-s-1">
                {mosque.subtitle}
              </Text>
            ) : null}
          </View>
          <MosqueSaveButton mosqueId={mosque.id} isSaved={isSaved} />
        </View>

        <View className="mt-s-3">
          <MosqueMetaRow
            rating={mosque.rating}
            reviewsCount={mosque.reviewsCount}
            open={mosque.open}
            area={mosque.area}
            distanceKm={mosque.distanceKm}
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
  );
}
