import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";

// Load .env.local
try {
  const envFile = fs.readFileSync(".env.local", "utf8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env.local:", e.message);
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://cdn.shivranjanisolanki.com";

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error("Missing R2 environment variables in .env.local");
  process.exit(1);
}

export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp4": return "video/mp4";
    case ".webm": return "video/webm";
    case ".mov": return "video/quicktime";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    default: return "application/octet-stream";
  }
}

export async function uploadToR2(localPath, r2Key) {
  if (!fs.existsSync(localPath)) {
    throw new Error(`File not found: ${localPath}`);
  }
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = getMimeType(localPath);
  const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(2);

  console.log(`Uploading ${localPath} (${sizeMb} MB) to R2 as '${r2Key}' (${contentType})...`);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3.send(command);
  const cleanPublicUrl = publicUrl.replace(/\/+$/, "");
  const finalUrl = `${cleanPublicUrl}/${r2Key}`;
  console.log(`✔ Uploaded successfully: ${finalUrl}`);
  return finalUrl;
}

export async function listR2Objects(prefix = "") {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });
  const res = await s3.send(command);
  return res.Contents || [];
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const [localPath, r2Key] = args;
    await uploadToR2(localPath, r2Key);
  } else {
    console.log(`Connected to R2 bucket: ${bucketName}`);
    const objects = await listR2Objects();
    console.log(`\nFound ${objects.length} object(s):`);
    for (const obj of objects) {
      console.log(` - ${obj.Key} (${(obj.Size / (1024 * 1024)).toFixed(2)} MB)`);
    }
    console.log("\nUsage to upload: node scripts/upload-to-r2.mjs <localPath> <r2Key>");
  }
}

main().catch((err) => {
  console.error("R2 operation failed:", err.message);
  process.exit(1);
});
