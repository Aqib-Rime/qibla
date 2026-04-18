import { Icon } from "@/components/ui/icon"
import { router } from "expo-router"
import { Pressable, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  value: string
  onChange: (v: string) => void
}

const PILL_SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
}

export function SearchInputBar({ value, onChange }: Props) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center gap-s-3 px-s-5 py-s-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="p-s-2"
          accessibilityLabel="Close search"
        >
          <Icon name="back" size={24} color="#1a2a22" />
        </Pressable>
        <View
          className="h-14 flex-1 flex-row items-center gap-s-3 rounded-pill bg-white px-s-5"
          style={PILL_SHADOW}
        >
          <Icon name="search" size={20} color="#6b7a70" />
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Search mosques, areas…"
            placeholderTextColor="#6b7a70"
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            style={{
              flex: 1,
              fontFamily: "Geist_400Regular",
              fontSize: 16,
              color: "#1a2a22",
            }}
          />
          {value ? (
            <Pressable onPress={() => onChange("")} hitSlop={10}>
              <Icon name="x" size={18} color="#6b7a70" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}
