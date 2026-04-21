import { ORPCError } from "@orpc/server";
import { z } from "zod";
import {
  ALLOWED_PHOTO_CONTENT_TYPES,
  presignMosquePhotoUpload,
} from "../lib/r2-presign.ts";
import { authedProcedure } from "../router-base.ts";

// Client uploads directly to R2 via presigned URL — keeps image bytes out of
// the Worker so we don't pay bandwidth or trip CPU / body-size limits.
export const uploadsRouter = {
  getMosquePhotoUrl: authedProcedure
    .input(z.object({ contentType: z.enum(ALLOWED_PHOTO_CONTENT_TYPES) }))
    .handler(async ({ input }) => {
      try {
        return await presignMosquePhotoUpload({
          contentType: input.contentType,
        });
      } catch (err) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: err instanceof Error ? err.message : "Upload setup failed",
        });
      }
    }),
};
