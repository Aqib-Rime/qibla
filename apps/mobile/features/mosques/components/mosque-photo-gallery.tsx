import { Image } from "expo-image";
import { FlatList, View } from "react-native";
import { MosqueMark } from "@/components/ui/mosque-mark";

type Props = {
  photos: string[];
};

export function MosquePhotoHero({ photos }: Props) {
  const uri = photos[0];

  if (!uri) {
    return (
      <View className="aspect-[4/3] items-center justify-center bg-green-tint">
        <MosqueMark size="xl" />
      </View>
    );
  }

  return (
    <View className="aspect-[4/3] bg-line">
      <Image
        source={{ uri }}
        contentFit="cover"
        style={{ width: "100%", height: "100%" }}
        transition={200}
      />
    </View>
  );
}

export function MosquePhotoStrip({ photos }: Props) {
  const rest = photos.slice(1);
  if (rest.length === 0) return null;

  return (
    <FlatList
      data={rest}
      keyExtractor={(uri) => uri}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          contentFit="cover"
          style={{ width: 120, height: 88, borderRadius: 8 }}
          transition={200}
        />
      )}
    />
  );
}
