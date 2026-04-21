import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PhotoManagerModal } from "./photo-manager-modal";

type Props = {
  photos: string[];
  onChange: (next: string[]) => void;
  maxPhotos?: number;
};

const PREVIEW_COUNT = 3;

export function PhotosField({ photos, onChange, maxPhotos = 12 }: Props) {
  const [open, setOpen] = useState(false);
  const preview = photos.slice(0, PREVIEW_COUNT);
  const extra = Math.max(0, photos.length - PREVIEW_COUNT);

  return (
    <>
      <View className="gap-s-2">
        <Text variant="label">Photos</Text>

        <Pressable
          onPress={() => setOpen(true)}
          className="flex-row items-center gap-s-3 rounded-md border border-line bg-white p-s-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          accessibilityRole="button"
          accessibilityLabel={
            photos.length === 0
              ? "Add photos"
              : `Manage ${photos.length} photo${photos.length === 1 ? "" : "s"}`
          }
        >
          {photos.length === 0 ? (
            <>
              <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
                <Icon name="pin" size={18} color="#2e5d45" />
              </View>
              <View className="flex-1">
                <Text variant="body">Add photos</Text>
                <Text variant="caption" tone="muted" className="mt-s-1">
                  Optional — library or camera, up to {maxPhotos}
                </Text>
              </View>
              <Icon name="chevron" size={14} color="#6b7a70" />
            </>
          ) : (
            <>
              <View className="flex-row">
                {preview.map((url, i) => (
                  <Image
                    key={url}
                    source={{ uri: url }}
                    contentFit="cover"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: "#ffffff",
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
                {extra > 0 ? (
                  <View
                    className="items-center justify-center rounded-sm border-2 border-white bg-green-tint"
                    style={{ width: 40, height: 40, marginLeft: -10 }}
                  >
                    <Text variant="caption" tone="green">
                      +{extra}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View className="flex-1">
                <Text variant="body">
                  {photos.length} photo{photos.length === 1 ? "" : "s"}
                </Text>
                <Text variant="caption" tone="muted" className="mt-s-1">
                  Tap to manage or add more
                </Text>
              </View>
              <Icon name="chevron" size={14} color="#6b7a70" />
            </>
          )}
        </Pressable>
      </View>

      <PhotoManagerModal
        visible={open}
        onClose={() => setOpen(false)}
        photos={photos}
        onChange={onChange}
        maxPhotos={maxPhotos}
      />
    </>
  );
}
