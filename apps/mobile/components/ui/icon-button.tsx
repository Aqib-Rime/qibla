import { cva, type VariantProps } from "class-variance-authority";
import * as Haptics from "expo-haptics";
import type { LucideProps } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";
import { Icon, type IconName } from "./icon";

const iconButtonVariants = cva("items-center justify-center", {
  variants: {
    size: {
      sm: "h-10 w-10",
      md: "h-14 w-14",
    },
    shape: {
      pill: "rounded-pill",
      square: "rounded-lg",
    },
    variant: {
      default: "border border-line/80 bg-white",
      filled: "bg-green",
      ghost: "bg-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "square",
    variant: "default",
  },
});

const ICON_SIZE: Record<"sm" | "md", number> = {
  sm: 18,
  md: 22,
};

const SHADOW_SM = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.14,
  shadowRadius: 16,
  elevation: 6,
};

const TONE_COLORS = {
  ink: "#1a2a22",
  green: "#2e5d45",
  muted: "#6b7a70",
  danger: "#b42318",
  white: "#ffffff",
} as const;

type Tone = keyof typeof TONE_COLORS;

type Props = VariantProps<typeof iconButtonVariants> &
  Omit<PressableProps, "children"> & {
    icon: IconName;
    tone?: Tone;
    iconProps?: Omit<LucideProps, "size" | "color" | "name">;
    className?: string;
    accessibilityLabel: string;
  };

export function IconButton({
  icon,
  size,
  shape,
  variant,
  tone,
  iconProps,
  onPress,
  disabled,
  accessibilityLabel,
  className,
  hitSlop = 6,
  ...rest
}: Props) {
  const sizeKey = size ?? "md";
  const variantKey = variant ?? "default";
  const resolvedTone: Tone =
    tone ?? (variantKey === "filled" ? "white" : "ink");
  const shadow =
    variantKey === "ghost" ? null : sizeKey === "md" ? SHADOW_MD : SHADOW_SM;

  return (
    <Pressable
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      className={iconButtonVariants({ size, shape, variant, className })}
      style={({ pressed }) =>
        [
          shadow,
          {
            transform: [{ scale: pressed ? 0.94 : 1 }],
            opacity: disabled ? 0.5 : 1,
          },
        ].filter(Boolean) as never
      }
      hitSlop={hitSlop}
      {...rest}
    >
      <Icon
        name={icon}
        size={ICON_SIZE[sizeKey]}
        color={TONE_COLORS[resolvedTone]}
        {...iconProps}
      />
    </Pressable>
  );
}
