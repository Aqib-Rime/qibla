import { cva, type VariantProps } from "class-variance-authority";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenVariants = cva("flex-1", {
  variants: {
    bg: {
      cream: "bg-cream",
      surface: "bg-surface",
      dark: "bg-dark",
      white: "bg-white",
    },
  },
  defaultVariants: {
    bg: "cream",
  },
});

type Props = VariantProps<typeof screenVariants> & {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
};

export function Screen({ children, bg, padded = true, className }: Props) {
  return (
    <>
      <StatusBar style={bg === "dark" ? "light" : "dark"} />
      <SafeAreaView className={screenVariants({ bg, className })}>
        <View className={padded ? "flex-1 px-s-6" : "flex-1"}>{children}</View>
      </SafeAreaView>
    </>
  );
}
