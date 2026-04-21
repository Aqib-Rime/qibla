import {
  ALLOWED_PHOTO_CONTENT_TYPES,
  presignMosquePhotoUpload,
} from "@qibla/api/lib/r2-presign";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware } from "@/middleware/auth-middleware";

export const getMosquePhotoUploadUrlFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(
    z.object({
      contentType: z.enum(ALLOWED_PHOTO_CONTENT_TYPES),
    }),
  )
  .handler(async ({ data }) => {
    return presignMosquePhotoUpload({ contentType: data.contentType });
  });
