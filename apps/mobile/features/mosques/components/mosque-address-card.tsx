import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

type Props = {
  address: string | null;
  street: string | null;
};

export function MosqueAddressCard({ address, street }: Props) {
  const colors = useThemeColors();
  if (!address) return null;
  return (
    <View className="flex-row items-start gap-s-3 rounded-md bg-surface p-s-4">
      <Icon name="pin" size={18} color={colors.green} />
      <View className="flex-1">
        <Text variant="label">{address}</Text>
        {street ? (
          <Text variant="caption" tone="muted" className="mt-s-1">
            {street}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
