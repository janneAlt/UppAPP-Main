import { del, head } from "@vercel/blob";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validations";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export function photoPathPrefix(contestId: string): string {
  return `contests/${contestId}/`;
}

/**
 * Verifies that a URL sent by the client points to an image that was uploaded
 * to our own Blob store for the given contest. Returns an error message, or
 * null if the blob is valid.
 */
export async function verifyPhotoBlob(contestId: string, url: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "Ogiltig bildadress.";
  }
  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(BLOB_HOST_SUFFIX)) {
    return "Ogiltig bildadress.";
  }

  const blob = await head(url).catch(() => null);
  if (!blob || !blob.pathname.startsWith(photoPathPrefix(contestId))) {
    return "Bilden kunde inte hittas. Försök ladda upp igen.";
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(blob.contentType) || blob.size > MAX_IMAGE_BYTES) {
    return "Endast JPEG, PNG eller WEBP upp till 10 MB stöds.";
  }
  return null;
}

export async function deletePhotoFile(url: string): Promise<void> {
  await del(url).catch(() => undefined);
}
