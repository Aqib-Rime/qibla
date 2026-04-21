import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { type MosqueListItem, MosqueSheetContent } from "@/features/mosques";
import { useThemeColors } from "@/lib/theme";

type Props = {
  mosque: MosqueListItem | null;
  onClose: () => void;
};

export const MapMosqueSheet = forwardRef<BottomSheet, Props>(
  function MapMosqueSheet({ mosque, onClose }, ref) {
    const colors = useThemeColors();
    const snapPoints = useMemo(() => ["32%", "85%"], []);

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
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.line }}
        onClose={onClose}
      >
        {mosque ? <MosqueSheetContent mosque={mosque} /> : null}
      </BottomSheet>
    );
  },
);
