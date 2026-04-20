import { Text } from "@/components/ui/text";

export function SignInLegalFooter() {
  return (
    <Text variant="body-sm" tone="muted" className="pb-s-6 pt-s-6 text-center">
      By continuing you agree to our{" "}
      <Text variant="body-sm" tone="ink" className="underline">
        Terms
      </Text>{" "}
      and{" "}
      <Text variant="body-sm" tone="ink" className="underline">
        Privacy
      </Text>
    </Text>
  );
}
