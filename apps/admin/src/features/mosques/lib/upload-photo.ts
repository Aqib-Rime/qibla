import { getMosquePhotoUploadUrlFn } from "@/features/mosques/server/uploads";

export const ALLOWED_PHOTO_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export type AllowedPhotoMime = (typeof ALLOWED_PHOTO_MIME)[number];

export function isAllowedPhotoMime(t: string): t is AllowedPhotoMime {
  return (ALLOWED_PHOTO_MIME as readonly string[]).includes(t);
}

export async function uploadMosquePhoto(file: File): Promise<string> {
  if (!isAllowedPhotoMime(file.type)) {
    throw new Error("Only JPG, PNG, or WebP images");
  }
  const { uploadUrl, publicUrl } = await getMosquePhotoUploadUrlFn({
    data: { contentType: file.type },
  });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }

  return publicUrl;
}
