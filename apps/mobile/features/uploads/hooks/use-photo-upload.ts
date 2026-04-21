import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api";

export type PickSource = "camera" | "library";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

function isAllowedType(s: string | undefined): s is AllowedType {
  return (ALLOWED_TYPES as readonly string[]).includes(s ?? "");
}

async function requestPermission(source: PickSource): Promise<boolean> {
  if (source === "camera") {
    const res = await ImagePicker.requestCameraPermissionsAsync();
    return res.status === "granted";
  }
  const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return res.status === "granted";
}

async function launchPicker(
  source: PickSource,
): Promise<ImagePicker.ImagePickerAsset[]> {
  const opts: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: false,
    allowsMultipleSelection: source === "library",
    quality: 0.7,
    exif: false,
  };
  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
  if (result.canceled) return [];
  return result.assets ?? [];
}

async function uploadAsset(
  asset: ImagePicker.ImagePickerAsset,
): Promise<string> {
  const contentType = asset.mimeType ?? "image/jpeg";
  if (!isAllowedType(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }

  const { uploadUrl, publicUrl } = await api.uploads.getMosquePhotoUrl({
    contentType,
  });

  // Read the picked file's raw bytes. Using arrayBuffer() instead of blob()
  // avoids a React Native quirk where blob() can come back with size 0 on
  // Android, which makes the PUT succeed but store an empty object.
  const fileResponse = await fetch(asset.uri);
  const arrayBuffer = await fileResponse.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  console.log(
    "[upload] asset.uri=",
    asset.uri,
    "size=",
    bytes.byteLength,
    "type=",
    contentType,
  );

  if (bytes.byteLength === 0) {
    throw new Error("Picked image came back empty; pick it again.");
  }

  const putResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: bytes,
  });

  console.log("[upload] PUT status=", putResponse.status, "public=", publicUrl);

  if (!putResponse.ok) {
    throw new Error(
      `Upload failed (${putResponse.status}): ${await putResponse.text()}`,
    );
  }

  return publicUrl;
}

/**
 * Pick one or more photos (library) or capture a single photo (camera),
 * upload each to R2 via presigned URL, and return the resulting public URLs.
 * Returns an empty array if the user cancels.
 */
export function usePickAndUploadPhotos() {
  return useMutation({
    mutationFn: async (source: PickSource): Promise<string[]> => {
      const granted = await requestPermission(source);
      if (!granted) {
        throw new Error(
          source === "camera"
            ? "Camera permission denied"
            : "Photos permission denied",
        );
      }
      const assets = await launchPicker(source);
      if (assets.length === 0) return [];
      // Parallel uploads — R2 handles concurrent PUTs fine and this matters
      // when the user picks 5+ photos from their library.
      return await Promise.all(assets.map(uploadAsset));
    },
  });
}
