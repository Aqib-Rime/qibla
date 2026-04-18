import { ArtRoute } from "@/components/onboard/art-route"
import { OnboardLayout } from "@/components/onboard/onboard-layout"

export default function OnboardThree() {
  return (
    <OnboardLayout
      step={3}
      title="Walk, ride, or drive — in seconds"
      body="Turn-by-turn directions to the nearest Jummah, wudu facility, or women-friendly space."
      art={<ArtRoute />}
    />
  )
}
