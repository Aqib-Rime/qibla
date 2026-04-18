import { ArtRoute } from "./art-route"
import { OnboardLayout } from "./onboard-layout"

export function OnboardSlideThree() {
  return (
    <OnboardLayout
      step={3}
      title="Walk, ride, or drive — in seconds"
      body="Turn-by-turn directions to the nearest Jummah, wudu facility, or women-friendly space."
      art={<ArtRoute />}
    />
  )
}
