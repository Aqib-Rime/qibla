import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useThemeScheme } from "@/features/theme/hooks/use-theme-scheme";
import { SettingsHeader } from "./settings-header";

type Faq = {
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    question: "How are prayer times calculated?",
    answer:
      "Times come from the AlAdhan API using the Karachi calculation method with the Hanafi Asr school. Your location is used once per day to fetch the day's times, which are cached locally.",
  },
  {
    question: "Why is the Qibla compass drifting?",
    answer:
      "The magnetometer picks up interference from metal, speakers, and other magnets nearby. Open the compass screen and follow the figure-8 calibration overlay that appears when accuracy drops.",
  },
  {
    question: "Can I use Qibla without sharing my location?",
    answer:
      "Most features work without location, but you won't see nearby mosques on the map, accurate prayer times, or the Qibla direction. You can grant location only when needed.",
  },
  {
    question: "My reviews are not showing — why?",
    answer:
      "New reviews start as 'pending' until a moderator approves them. You'll always see your own pending review on the mosque detail page; other users see it once approved.",
  },
  {
    question: "How do I stop getting prayer notifications?",
    answer:
      "Open Settings → Prayer reminders and toggle it off. You can also manage notifications at the OS level from the Settings row.",
  },
];

export function HelpScreen() {
  const scheme = useThemeScheme();
  return (
    <View className="flex-1 bg-cream">
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <SettingsHeader title="Help & guides" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-s-6">
          {FAQS.map((faq) => (
            <View key={faq.question} className="gap-s-2">
              <Text variant="label">{faq.question}</Text>
              <Text variant="body-sm" tone="muted">
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-s-8">
          <Text variant="caption" tone="muted" className="text-center">
            Still stuck? Reach out via the repo on GitHub.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
