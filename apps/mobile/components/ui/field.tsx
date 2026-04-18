import { Icon, type IconName } from "@/components/ui/icon"
import { forwardRef } from "react"
import {
  TextInput,
  type TextInputProps,
  View,
} from "react-native"

type Props = TextInputProps & {
  icon?: IconName
  trailing?: React.ReactNode
}

export const Field = forwardRef<TextInput, Props>(function Field(
  { icon, trailing, ...props },
  ref
) {
  return (
    <View className="flex-row items-center gap-s-3 rounded-md border border-line bg-white px-s-4 py-s-3">
      {icon && <Icon name={icon} size={18} color="#6b7a70" />}
      <TextInput
        ref={ref}
        placeholderTextColor="#6b7a70"
        className="flex-1 text-body font-sans text-ink"
        {...props}
      />
      {trailing}
    </View>
  )
})
