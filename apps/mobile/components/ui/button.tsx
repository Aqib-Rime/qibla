import { cva, type VariantProps } from "class-variance-authority";
import * as Haptics from "expo-haptics";
import { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type View,
} from "react-native";
import { Text } from "./text";

const buttonVariants = cva(
  "flex-row items-center justify-center gap-s-2 rounded-md px-s-5",
  {
    variants: {
      variant: {
        primary: "bg-green",
        dark: "bg-ink",
        outline: "border border-line bg-white",
        ghost: "bg-white/10",
        subtle: "bg-green-tint",
        destructive: "bg-[#b04a3a]",
      },
      size: {
        md: "py-s-4",
        lg: "py-s-5",
      },
      disabled: {
        true: "opacity-50",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const labelVariants = cva("font-sans-semibold", {
  variants: {
    variant: {
      primary: "text-white",
      dark: "text-white",
      outline: "text-ink",
      ghost: "text-white",
      subtle: "text-green",
      destructive: "text-white",
    },
    size: {
      md: "text-body",
      lg: "text-body",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    label,
    leading,
    trailing,
    variant = "primary",
    size = "md",
    loading,
    disabled,
    className,
    onPress,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      className={buttonVariants({
        variant,
        size,
        disabled: isDisabled,
        className,
      })}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "subtle" ? "#2e5d45" : "#fff"
          }
        />
      ) : (
        <>
          {leading}
          <Text className={labelVariants({ variant, size })}>{label}</Text>
          {trailing}
        </>
      )}
    </Pressable>
  );
});
