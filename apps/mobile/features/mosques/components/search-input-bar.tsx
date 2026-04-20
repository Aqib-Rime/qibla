import { router } from "expo-router";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const FIELD_SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export function SearchInputBar({ value, onChange }: Props) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center gap-s-3 px-s-5 py-s-3">
        <IconButton
          icon="back"
          size="sm"
          variant="ghost"
          onPress={() => router.back()}
          accessibilityLabel="Close search"
        />
        <View
          className="h-14 flex-1 flex-row items-center gap-s-3 rounded-lg border border-line/80 bg-white px-s-4"
          style={FIELD_SHADOW}
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
  );
}
