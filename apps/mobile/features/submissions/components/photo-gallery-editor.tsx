import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { usePickAndUploadPhotos } from "@/features/uploads";

type Props = {
  photos: string[];
  onChange: (next: string[]) => void;
  maxPhotos?: number;
};

const DEFAULT_MAX = 12;

export function PhotoGalleryEditor({
  photos,
  onChange,
  maxPhotos = DEFAULT_MAX,
}: Props) {
  const upload = usePickAndUploadPhotos();
  const remaining = maxPhotos - photos.length;

  const handleAdd = async (source: "camera" | "library") => {
    try {
      const urls = await upload.mutateAsync(source);
      if (urls.length === 0) return;
      const next = [...photos, ...urls].slice(0, maxPhotos);
      onChange(next);
    } catch (err) {
      Alert.alert(
        "Upload failed",
        err instanceof Error ? err.message : "Try again.",
      );
    }
  };

  const handleRemove = (url: string) => {
    onChange(photos.filter((p) => p !== url));
  };

  const addDisabled = remaining <= 0 || upload.isPending;

  return (
    <View className="gap-s-3">
      <View className="flex-row items-center justify-between">
        <Text variant="label">Photos</Text>
        <Text variant="caption" tone="muted">
          {photos.length}/{maxPhotos}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {photos.map((url) => (
          <View key={url} className="h-24 w-24">
            <Image
              source={{ uri: url }}
              contentFit="cover"
              style={{ width: 96, height: 96, borderRadius: 8 }}
            />
            <Pressable
              onPress={() => handleRemove(url)}
              className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-pill bg-[#b04a3a]"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Icon name="x" size={12} color="#ffffff" />
            </Pressable>
          </View>
        ))}

        {upload.isPending ? (
          <View className="h-24 w-24 items-center justify-center rounded-md border border-dashed border-line bg-white">
            <ActivityIndicator color="#2e5d45" />
          </View>
        ) : null}

        <Pressable
          onPress={() => handleAdd("library")}
          disabled={addDisabled}
          className="h-24 w-24 items-center justify-center rounded-md border border-dashed border-line bg-white"
          style={({ pressed }) => ({
            opacity: pressed || addDisabled ? 0.6 : 1,
          })}
        >
          <Icon name="pin" size={20} color="#2e5d45" />
          <Text variant="caption" tone="green" className="mt-s-1">
            Library
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleAdd("camera")}
          disabled={addDisabled}
          className="h-24 w-24 items-center justify-center rounded-md border border-dashed border-line bg-white"
          style={({ pressed }) => ({
            opacity: pressed || addDisabled ? 0.6 : 1,
          })}
        >
          <Icon name="pencil" size={20} color="#2e5d45" />
          <Text variant="caption" tone="green" className="mt-s-1">
            Camera
          </Text>
        </Pressable>
      </ScrollView>

      {photos.length === 0 ? (
        <Text variant="caption" tone="muted">
          Optional — you can submit without photos and add them later.
        </Text>
      ) : null}
    </View>
  );
}
