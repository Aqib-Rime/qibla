import { ArtMap } from "./art-map"
import { OnboardLayout } from "./onboard-layout"

export function OnboardSlideOne() {
  return (
    <OnboardLayout
      step={1}
      title="Every mosque in Dhaka on one map"
      body="1,240 verified mosques with live status, photos, and community reviews."
      art={<ArtMap />}
    />
  )
}
