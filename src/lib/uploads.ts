import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function savePhotoFile(contestId: string, file: File): Promise<string> {
  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) {
    throw new Error("Filtypen stöds inte");
  }

  const contestDir = path.join(UPLOAD_ROOT, contestId);
  await mkdir(contestDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(contestDir, filename), bytes);

  return `/uploads/${contestId}/${filename}`;
}

export async function deletePhotoFile(filePath: string): Promise<void> {
  const resolved = path.join(process.cwd(), "public", filePath);
  await unlink(resolved).catch(() => undefined);
}
