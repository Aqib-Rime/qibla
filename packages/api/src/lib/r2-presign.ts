import { AwsClient } from "aws4fetch";

const PRESIGN_EXPIRY_SECONDS = 600;

export const ALLOWED_PHOTO_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export type AllowedPhotoContentType =
  (typeof ALLOWED_PHOTO_CONTENT_TYPES)[number];

function extFromContentType(ct: AllowedPhotoContentType): string {
  switch (ct) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
  }
}

function readR2Env() {
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
    throw new Error(
      `R2 upload not configured. Missing env: ${missing.join(", ")}`,
    );
  }

  return {
    accountId: accountId as string,
    bucket: bucket as string,
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
    publicUrl: (publicUrl as string).replace(/\/$/, ""),
  };
}

export async function presignMosquePhotoUpload({
  contentType,
}: {
  contentType: AllowedPhotoContentType;
}) {
  const env = readR2Env();
  const key = `mosque-photos/${crypto.randomUUID()}${extFromContentType(contentType)}`;

  const aws = new AwsClient({
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const target = new URL(
    `https://${env.accountId}.r2.cloudflarestorage.com/${env.bucket}/${key}`,
  );
  target.searchParams.set("X-Amz-Expires", String(PRESIGN_EXPIRY_SECONDS));

  const signed = await aws.sign(
    new Request(target.toString(), {
      method: "PUT",
      headers: { "Content-Type": contentType },
    }),
    { aws: { signQuery: true } },
  );

  return {
    uploadUrl: signed.url,
    publicUrl: `${env.publicUrl}/${key}`,
    key,
    expiresIn: PRESIGN_EXPIRY_SECONDS,
  };
}
