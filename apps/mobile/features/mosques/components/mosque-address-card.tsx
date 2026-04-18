import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

type Props = {
  address: string | null
  street: string | null
}

export function MosqueAddressCard({ address, street }: Props) {
  if (!address) return null
  return (
    <View className="flex-row items-start gap-s-3 rounded-md bg-white p-s-4">
      <Icon name="pin" size={18} color="#2e5d45" />
      <View className="flex-1">
        <Text variant="label">{address}</Text>
        {street ? (
          <Text variant="caption" tone="muted" className="mt-s-1">
            {street}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
