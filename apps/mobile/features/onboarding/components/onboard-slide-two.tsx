import { ArtTimes } from "./art-times";
import { OnboardLayout } from "./onboard-layout";

export function OnboardSlideTwo() {
  return (
    <OnboardLayout
      step={2}
      title="Never miss a prayer"
      body="Tuned prayer times from your current location. Gentle reminders, silent by default."
      art={<ArtTimes />}
    />
  );
}
