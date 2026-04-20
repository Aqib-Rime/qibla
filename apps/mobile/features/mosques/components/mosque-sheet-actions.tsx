import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { openDirections } from "../lib/directions";
import type { MosqueListItem } from "../lib/types";

export function MosqueSheetActions({ mosque }: { mosque: MosqueListItem }) {
  return (
    <View className="flex-row gap-s-3">
      <View className="flex-1">
        <Button
          label="Directions"
          leading={<Icon name="directions" size={16} color="#ffffff" />}
          onPress={() =>
            openDirections({
              lat: mosque.lat,
              lng: mosque.lng,
              name: mosque.name,
            })
          }
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
  );
}
