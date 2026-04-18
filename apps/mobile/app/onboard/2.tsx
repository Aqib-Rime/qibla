import { ArtTimes } from "@/components/onboard/art-times"
import { OnboardLayout } from "@/components/onboard/onboard-layout"

export default function OnboardTwo() {
  return (
    <OnboardLayout
      step={2}
      title="Never miss a prayer"
      body="Tuned prayer times from your current location. Gentle reminders, silent by default."
      art={<ArtTimes />}
    />
  )
}
