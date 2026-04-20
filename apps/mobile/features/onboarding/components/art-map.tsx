import { View } from "react-native";
import { MosqueMark } from "@/components/ui/mosque-mark";

export function ArtMap() {
  const pins = [
    { x: 0.24, y: 0.32 },
    { x: 0.68, y: 0.22 },
    { x: 0.44, y: 0.44 },
    { x: 0.3, y: 0.72 },
    { x: 0.78, y: 0.66 },
  ];
  return (
    <View className="flex-1 bg-[#ede5c8]">
      {/* soft block grid */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 4 }).map((__, col) => (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: static 5x4 grid, indices are the stable identity
            key={`${row}-${col}`}
            className="absolute bg-[#d9cfae]"
            style={{
              left: `${col * 25 + 3}%`,
              top: `${row * 20 + 5}%`,
              width: "18%",
              height: "12%",
              borderRadius: 2,
            }}
          />
        )),
      )}
      {pins.map((p) => (
        <View
          key={`${p.x}-${p.y}`}
          className="absolute"
          style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
        >
          <MosqueMark size="sm" />
        </View>
      ))}
      {/* highlighted centered pin */}
      <View
        className="absolute"
        style={{ left: "50%", top: "50%", marginLeft: -28, marginTop: -28 }}
      >
        <MosqueMark size="md" />
      </View>
    </View>
  );
}
