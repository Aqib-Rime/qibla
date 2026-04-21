import { cva, type VariantProps } from "class-variance-authority";
import { Text as RNText, type TextProps } from "react-native";

export const textVariants = cva("text-ink", {
  variants: {
    variant: {
      "display-xl": "text-display-xl font-sans-semibold",
      "display-lg": "text-display-lg font-sans-semibold",
      "display-md": "text-display-md font-sans-semibold",
      "display-sm": "text-display-sm font-sans-semibold",
      title: "text-title font-sans-semibold",
      body: "text-body font-sans",
      "body-sm": "text-body-sm font-sans",
      label: "text-label font-sans-medium",
      caption: "text-caption font-sans-medium",
      eyebrow: "text-eyebrow font-sans-semibold uppercase",
    },
    tone: {
      ink: "text-ink",
      muted: "text-muted",
      green: "text-green",
      gold: "text-gold",
      white: "text-white",
      "white-muted": "text-white/60",
      danger: "text-danger",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "ink",
  },
});

export type TextVariantProps = VariantProps<typeof textVariants>;

export function Text({
  variant,
  tone,
  className,
  ...props
}: TextProps & TextVariantProps & { className?: string }) {
  return (
    <RNText className={textVariants({ variant, tone, className })} {...props} />
  );
}
