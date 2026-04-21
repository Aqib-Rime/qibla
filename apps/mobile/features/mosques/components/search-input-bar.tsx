import { router } from "expo-router";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { useThemeColors } from "@/lib/theme";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchInputBar({ value, onChange }: Props) {
  const colors = useThemeColors();
  const fieldShadow = {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  };
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
          className="h-14 flex-1 flex-row items-center gap-s-3 rounded-lg border border-line/80 bg-surface px-s-4"
          style={fieldShadow}
        >
          <Icon name="search" size={20} color={colors.muted} />
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Search mosques, areas…"
            placeholderTextColor={colors.muted}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            style={{
              flex: 1,
              fontFamily: "Geist_400Regular",
              fontSize: 16,
              color: colors.ink,
            }}
          />
          {value ? (
            <Pressable onPress={() => onChange("")} hitSlop={10}>
              <Icon name="x" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
