import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useAppDialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { usePickAndUploadPhotos } from "@/features/uploads";
import { PhotoPreviewModal } from "./photo-preview-modal";

const HORIZONTAL_PAD = 24;
const GRID_GAP = 12;

type Props = {
  visible: boolean;
  onClose: () => void;
  photos: string[];
  onChange: (next: string[]) => void;
  maxPhotos?: number;
};

const DEFAULT_MAX = 12;

export function PhotoManagerModal({
  visible,
  onClose,
  photos,
  onChange,
  maxPhotos = DEFAULT_MAX,
}: Props) {
  const upload = usePickAndUploadPhotos();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dialog = useAppDialog();
  const remaining = maxPhotos - photos.length;
  const addDisabled = remaining <= 0 || upload.isPending;

  // 2-column grid sized off the screen width so tiles scale nicely on tablets.
  const tileSize =
    (Dimensions.get("window").width - HORIZONTAL_PAD * 2 - GRID_GAP) / 2;

  const handleAdd = async (source: "camera" | "library") => {
    try {
      const urls = await upload.mutateAsync(source);
      if (urls.length === 0) return;
      const next = [...photos, ...urls].slice(0, maxPhotos);
      onChange(next);
    } catch (err) {
      dialog.show({
        title: "Upload failed",
        body: err instanceof Error ? err.message : "Try again.",
        actions: [{ label: "OK" }],
      });
    }
  };

  const handleRemove = (url: string) => {
    onChange(photos.filter((p) => p !== url));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-cream">
        <SafeAreaView edges={["top"]} className="bg-cream">
          <View className="flex-row items-center justify-between px-s-5 py-s-3">
            <IconButton
              icon="x"
              size="sm"
              variant="ghost"
              onPress={onClose}
              accessibilityLabel="Close"
            />
            <Text variant="display-sm">
              Photos · {photos.length}/{maxPhotos}
            </Text>
            <View className="h-10 w-10" />
          </View>
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PAD,
            paddingTop: 4,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-s-3">
            <Button
              label={upload.isPending ? "Uploading…" : "Add from library"}
              onPress={() => handleAdd("library")}
              disabled={addDisabled}
              leading={<Icon name="pin" size={16} color="#ffffff" />}
            />
            <Button
              label="Take a photo"
              variant="outline"
              onPress={() => handleAdd("camera")}
              disabled={addDisabled}
              leading={<Icon name="pencil" size={16} color="#2e5d45" />}
            />
          </View>

          {upload.isPending ? (
            <View className="mt-s-4 flex-row items-center justify-center gap-s-2">
              <ActivityIndicator color="#2e5d45" />
              <Text variant="caption" tone="muted">
                Uploading photos…
              </Text>
            </View>
          ) : null}

          <View className="mt-s-6">
            {photos.length === 0 ? (
              <View className="items-center gap-s-2 rounded-md border border-dashed border-line bg-white px-s-5 py-s-8">
                <Icon name="pin" size={28} color="#6b7a70" />
                <Text variant="label" tone="muted">
                  No photos yet
                </Text>
                <Text variant="caption" tone="muted" className="text-center">
                  Optional — you can submit without photos and add them later.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
                {photos.map((url) => (
                  <PhotoTile
                    key={url}
                    url={url}
                    size={tileSize}
                    onPreview={() => setPreviewUrl(url)}
                    onRemove={() => handleRemove(url)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <SafeAreaView
          edges={["bottom"]}
          className="border-line border-t bg-cream"
        >
          <View className="px-s-5 py-s-3">
            <Button label="Done" onPress={onClose} />
          </View>
        </SafeAreaView>

        <PhotoPreviewModal
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />

        {dialog.element}
      </View>
    </Modal>
  );
}

function PhotoTile({
  url,
  size,
  onPreview,
  onRemove,
}: {
  url: string;
  size: number;
  onPreview: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onPreview}
      style={{ width: size, height: size }}
      className="overflow-hidden rounded-md bg-white"
    >
      <Image
        source={{ uri: url }}
        contentFit="cover"
        style={{ width: size, height: size }}
      />
      <Pressable
        onPress={onRemove}
        hitSlop={12}
        className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-pill bg-black/60"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityLabel="Remove photo"
      >
        <Icon name="x" size={14} color="#ffffff" />
      </Pressable>
    </Pressable>
  );
}
