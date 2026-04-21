import { forwardRef } from "react";
import { TextInput, type TextInputProps, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { colors } from "@/lib/theme";

type Props = TextInputProps & {
  icon?: IconName;
  trailing?: React.ReactNode;
};

export const Field = forwardRef<TextInput, Props>(function Field(
  { icon, trailing, multiline, style, ...props },
  ref,
) {
  return (
    <View className="flex-row items-center gap-s-3 rounded-md border border-line bg-white px-s-4 py-s-1">
      {icon && <Icon name={icon} size={18} color={colors.muted} />}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        className="flex-1 font-sans text-body text-ink"
        style={[{ padding: 0, margin: 0, includeFontPadding: false }, style]}
        {...props}
      />
      {trailing}
    </View>
  );
});
