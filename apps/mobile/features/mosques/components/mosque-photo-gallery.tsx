import { Image } from "expo-image";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import { MosqueMark } from "@/components/ui/mosque-mark";
import { useThemeColors } from "@/lib/theme";

type Props = {
  photos: string[];
};

export function MosquePhotoHero({ photos }: Props) {
  const width = Dimensions.get("window").width;
  const [index, setIndex] = useState(0);
  const colors = useThemeColors();

  if (photos.length === 0) {
    return (
      <View className="aspect-[4/3] items-center justify-center bg-green-tint">
        <MosqueMark size="xl" />
      </View>
    );
  }

  if (photos.length === 1) {
    return (
      <View className="aspect-[4/3] bg-line">
        <Image
          source={{ uri: photos[0] }}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
          transition={200}
        />
      </View>
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View className="aspect-[4/3] bg-line">
      <FlatList
        data={photos}
        keyExtractor={(uri) => uri}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width, aspectRatio: 4 / 3 }}>
            <Image
              source={{ uri: item }}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
              transition={200}
            />
          </View>
        )}
      />

      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-s-3 flex-row justify-center gap-s-1"
      >
        {photos.map((uri, i) => {
          const active = i === index;
          return (
            <View
              key={uri}
              style={{
                width: active ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: active ? colors.white : `${colors.white}80`,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
