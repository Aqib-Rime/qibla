import { ArtMap } from "@/components/onboard/art-map"
import { OnboardLayout } from "@/components/onboard/onboard-layout"

export default function OnboardOne() {
  return (
    <OnboardLayout
      step={1}
      title="Every mosque in Dhaka on one map"
      body="1,240 verified mosques with live status, photos, and community reviews."
      art={<ArtMap />}
    />
  )
}
