import { put } from "@vercel/blob";
import fs from "node:fs";
import path from "node:path";

// Load .env.local if BLOB_READ_WRITE_TOKEN is not in process.env
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    for (const line of envFile.split("\n")) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch {}
}

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.error("\x1b[31m%s\x1b[0m", "Error: BLOB_READ_WRITE_TOKEN is not set.");
  console.log(`
To use this script:
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project -> click the 'Storage' tab -> click 'Create Database' -> select 'Blob'.
3. In the Blob store settings, copy the 'BLOB_READ_WRITE_TOKEN'.
4. Paste it into your .env.local file:
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
5. Re-run: node scripts/upload-to-blob.mjs
`);
  process.exit(1);
}

async function uploadFile(localPath, blobPath) {
  if (!fs.existsSync(localPath)) {
    console.warn(`File not found: ${localPath}, skipping.`);
    return null;
  }
  const fileBuffer = fs.readFileSync(localPath);
  const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`Uploading ${localPath} (${sizeMb} MB) -> ${blobPath}...`);

  const blob = await put(blobPath, fileBuffer, {
    access: "public",
    addRandomSuffix: false, // Clean, predictable URLs
  });

  console.log(`\x1b[32m✔ Uploaded:\x1b[0m ${blob.url}`);
  return blob.url;
}

async function main() {
  console.log("=== Vercel Blob Media Uploader ===\n");

  const results = {};

  // 1. Upload Hero Images
  if (fs.existsSync("public/Hero-Banner.PNG")) {
    results.heroBanner = await uploadFile(
      "public/Hero-Banner.PNG",
      "media/hero-banner.png",
    );
  }

  if (fs.existsSync("public/Moblie-banner.png")) {
    results.mobileBanner = await uploadFile(
      "public/Moblie-banner.png",
      "media/mobile-banner.png",
    );
  }

  // 2. Upload any local videos if present in public/videos or public/reels
  const videoDirs = ["public/videos", "public/reels"];
  for (const dir of videoDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (/\.(mp4|webm|mov|webp|jpg|png)$/i.test(file)) {
          const localPath = path.join(dir, file);
          const blobPath = `reels/${file}`;
          const url = await uploadFile(localPath, blobPath);
          results[file] = url;
        }
      }
    }
  }

  console.log("\n=== Upload Summary ===");
  console.log(JSON.stringify(results, null, 2));
  console.log(
    "\nYou can now copy these URLs into lib/editorial.ts or your environment variables!",
  );
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
