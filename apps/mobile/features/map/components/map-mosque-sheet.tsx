import { MosqueSheetContent, type MosqueListItem } from "@/features/mosques"
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { forwardRef, useCallback, useMemo } from "react"

type Props = {
  mosque: MosqueListItem | null
  onClose: () => void
}

export const MapMosqueSheet = forwardRef<BottomSheet, Props>(
  function MapMosqueSheet({ mosque, onClose }, ref) {
    const snapPoints = useMemo(() => ["32%", "85%"], [])

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={1}
          disappearsOnIndex={0}
          opacity={0.3}
          pressBehavior="collapse"
        />
      ),
      []
    )

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#fffbf1" }}
        handleIndicatorStyle={{ backgroundColor: "#c5c0ad" }}
        onClose={onClose}
      >
        {mosque ? <MosqueSheetContent mosque={mosque} /> : null}
      </BottomSheet>
    )
  }
)
