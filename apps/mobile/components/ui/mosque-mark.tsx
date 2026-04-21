import { cva, type VariantProps } from "class-variance-authority";
import { MapPin } from "lucide-react-native";
import { View, type ViewProps } from "react-native";
import { useThemeColors } from "@/lib/theme";

const markVariants = cva(
  "items-center justify-center rounded-md bg-green shadow-lg",
  {
    variants: {
      size: {
        sm: "h-8 w-8 rounded-sm",
        md: "h-14 w-14 rounded-md",
        lg: "h-20 w-20 rounded-lg",
        xl: "h-24 w-24 rounded-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const iconSize: Record<
  NonNullable<VariantProps<typeof markVariants>["size"]>,
  number
> = {
  sm: 16,
  md: 26,
  lg: 36,
  xl: 42,
};

type Props = VariantProps<typeof markVariants> &
  Pick<ViewProps, "onLayout"> & {
    className?: string;
  };

export function MosqueMark({ size = "md", className, onLayout }: Props) {
  const colors = useThemeColors();
  return (
    <View
      onLayout={onLayout}
      className={markVariants({ size, className })}
      style={{
        shadowColor: colors.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      <MapPin size={iconSize[size ?? "md"]} color={colors.white} />
    </View>
  );
}
