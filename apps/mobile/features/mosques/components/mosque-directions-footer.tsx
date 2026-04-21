import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useThemeColors } from "@/lib/theme";
import { openDirections } from "../lib/directions";
import type { Mosque } from "../lib/types";

export function MosqueDirectionsFooter({ mosque }: { mosque: Mosque }) {
  const colors = useThemeColors();
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="absolute bottom-0 left-0 right-0 bg-cream"
    >
      <View className="border-line border-t px-s-6 py-s-3">
        <Button
          label="Directions"
          leading={<Icon name="directions" size={18} color={colors.white} />}
          onPress={() =>
            openDirections({
              lat: mosque.lat,
              lng: mosque.lng,
              name: mosque.name,
            })
          }
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
