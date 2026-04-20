import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useUserLocation } from "@/lib/use-user-location";
import { useDeviceHeading } from "../hooks/use-device-heading";
import {
  bearingDelta,
  bearingToMecca,
  distanceToMeccaKm,
} from "../lib/bearing";
import { QiblaCalibrationOverlay } from "./qibla-calibration-overlay";
import { QiblaDial } from "./qibla-dial";
import { QiblaHeader } from "./qibla-header";
import { QiblaInfoGrid } from "./qibla-info-grid";
import { QiblaLocationGate } from "./qibla-location-gate";
import { QiblaSensorError } from "./qibla-sensor-error";

const ALIGNMENT_THRESHOLD = 5;

export function QiblaScreen() {
  const [permissionKey, setPermissionKey] = useState(0);
  const userPos = useUserLocation();
  const heading = useDeviceHeading();

  const qiblaBearing = useMemo(
    () => (userPos ? bearingToMecca(userPos) : null),
    [userPos],
  );
  const distanceKm = useMemo(
    () => (userPos ? distanceToMeccaKm(userPos) : null),
    [userPos],
  );

  const aligned =
    heading && qiblaBearing != null
      ? Math.abs(bearingDelta(qiblaBearing, heading.heading)) <=
        ALIGNMENT_THRESHOLD
      : false;

  const prevAlignedRef = useRef(false);
  useEffect(() => {
    if (aligned && !prevAlignedRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
    prevAlignedRef.current = aligned;
  }, [aligned]);

  // Location permission may have been denied during onboarding.
  // If after a short wait we still have no userPos, show the gate.
  const [showGate, setShowGate] = useState(false);
  useEffect(() => {
    if (userPos) {
      setShowGate(false);
      return;
    }
    const t = setTimeout(() => setShowGate(true), 1200);
    return () => clearTimeout(t);
  }, [userPos, permissionKey]);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <QiblaHeader />

      {showGate && !userPos ? (
        <QiblaLocationGate onGranted={() => setPermissionKey((k) => k + 1)} />
      ) : !userPos ? (
        <View className="flex-1 items-center justify-center gap-s-4">
          <Skeleton className="h-[280px] w-[280px] rounded-pill" />
          <Skeleton className="h-4 w-40 rounded-sm" />
        </View>
      ) : heading == null && showGate === false ? (
        <View className="flex-1 items-center justify-center gap-s-4">
          <Skeleton className="h-[280px] w-[280px] rounded-pill" />
          <Text variant="caption" tone="muted">
            Waiting for compass sensor…
          </Text>
        </View>
      ) : heading == null ? (
        <QiblaSensorError />
      ) : (
        <View className="flex-1 px-s-6">
          <View className="flex-1 items-center justify-center">
            <QiblaDial
              heading={heading.heading}
              qiblaBearing={qiblaBearing ?? 0}
              aligned={aligned}
            />
            <Text
              variant="label"
              tone={aligned ? "green" : "muted"}
              className="mt-s-5"
            >
              {aligned
                ? "You are facing Qibla"
                : "Rotate until the marker meets the pointer"}
            </Text>
          </View>

          <View className="pb-s-6">
            <QiblaInfoGrid
              bearing={qiblaBearing ?? 0}
              distanceKm={distanceKm ?? 0}
              accuracy={heading.accuracy}
            />
          </View>

          {heading.accuracy === "low" ? <QiblaCalibrationOverlay /> : null}
        </View>
      )}
    </View>
  );
}
