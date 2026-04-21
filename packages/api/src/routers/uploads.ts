import { ORPCError } from "@orpc/server";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import { authedProcedure } from "../router-base.ts";

// Client will upload directly to R2 using the presigned URL, bypassing the
// Worker so we don't pay bandwidth or hit CPU/body-size limits.
const PRESIGN_EXPIRY_SECONDS = 600; // 10 minutes

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

function extFromContentType(ct: AllowedContentType): string {
  switch (ct) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
  }
}

function requireR2Env() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.R2_PUBLIC_URL;

  const missing: string[] = [];
  if (!accountId) missing.push("CLOUDFLARE_ACCOUNT_ID");
  if (!bucket) missing.push("R2_BUCKET");
  if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
  if (!publicUrl) missing.push("R2_PUBLIC_URL");

  if (missing.length > 0) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: `R2 upload not configured. Missing env: ${missing.join(", ")}`,
    });
  }

  // Trim trailing slash on the public URL so we can safely concatenate the key.
  const normalizedPublicUrl = (publicUrl as string).replace(/\/$/, "");

  return {
    accountId: accountId as string,
    bucket: bucket as string,
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
    publicUrl: normalizedPublicUrl,
  };
}

async function presignR2Put({
  accountId,
  bucket,
  accessKeyId,
  secretAccessKey,
  key,
  contentType,
}: {
  accountId: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  key: string;
  contentType: string;
}): Promise<string> {
  const aws = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const target = new URL(
    `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`,
  );
  // aws4fetch signs whatever is already on the URL when signQuery is set; we
  // add X-Amz-Expires here so the presign is time-limited.
  target.searchParams.set("X-Amz-Expires", String(PRESIGN_EXPIRY_SECONDS));

  const signed = await aws.sign(
    new Request(target.toString(), {
      method: "PUT",
      headers: { "Content-Type": contentType },
    }),
    { aws: { signQuery: true } },
  );

  return signed.url;
}

export const uploadsRouter = {
  getMosquePhotoUrl: authedProcedure
    .input(
      z.object({
        contentType: z.enum(ALLOWED_CONTENT_TYPES),
      }),
    )
    .handler(async ({ input }) => {
      const env = requireR2Env();
      const key = `mosque-photos/${crypto.randomUUID()}${extFromContentType(input.contentType)}`;

      const uploadUrl = await presignR2Put({
        accountId: env.accountId,
        bucket: env.bucket,
        accessKeyId: env.accessKeyId,
        secretAccessKey: env.secretAccessKey,
        key,
        contentType: input.contentType,
      });

      return {
        uploadUrl,
        publicUrl: `${env.publicUrl}/${key}`,
        key,
        expiresIn: PRESIGN_EXPIRY_SECONDS,
      };
    }),
};
