import { cva, type VariantProps } from "class-variance-authority";
import * as Haptics from "expo-haptics";
import type { LucideProps } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";
import { useThemeColors } from "@/lib/theme";
import { Icon, type IconName } from "./icon";

const iconButtonVariants = cva("items-center justify-center", {
  variants: {
    size: {
      sm: "h-10 w-10",
      md: "h-14 w-14",
      xl: "size-[60px]",
    },
    shape: {
      pill: "rounded-pill",
      square: "rounded-lg",
    },
    variant: {
      default: "border border-line/80 bg-surface",
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

const ICON_SIZE: Record<"sm" | "md" | "xl", number> = {
  sm: 18,
  md: 22,
  xl: 33,
};

type Tone = "ink" | "green" | "muted" | "danger" | "white";

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
  const colors = useThemeColors();
  const sizeKey = size ?? "md";
  const variantKey = variant ?? "default";
  const resolvedTone: Tone =
    tone ?? (variantKey === "filled" ? "white" : "ink");
  const toneColors: Record<Tone, string> = {
    ink: colors.ink,
    green: colors.green,
    muted: colors.muted,
    danger: colors.danger,
    white: colors.white,
  };
  const shadowBase =
    sizeKey === "sm"
      ? { height: 2, opacity: 0.08, radius: 6, elevation: 2 }
      : { height: 6, opacity: 0.14, radius: 16, elevation: 6 };
  const shadow =
    variantKey === "ghost"
      ? null
      : {
          shadowColor: colors.ink,
          shadowOffset: { width: 0, height: shadowBase.height },
          shadowOpacity: shadowBase.opacity,
          shadowRadius: shadowBase.radius,
          elevation: shadowBase.elevation,
        };

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
        color={toneColors[resolvedTone]}
        {...iconProps}
      />
    </Pressable>
  );
}
