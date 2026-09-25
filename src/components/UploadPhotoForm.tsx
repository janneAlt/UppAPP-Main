"use client";

import { useActionState } from "react";
import { upload } from "@vercel/blob/client";
import { uploadPhoto, type UploadPhotoState } from "@/app/contests/[id]/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, photoUploadSchema } from "@/lib/validations";

const initialState: UploadPhotoState = {};

export function UploadPhotoForm({ contestId }: { contestId: string }) {
  // Uploads the file straight from the browser to Vercel Blob, then sends only
  // its URL to the server action (Vercel functions reject bodies over 4.5 MB).
  async function action(prevState: UploadPhotoState, formData: FormData): Promise<UploadPhotoState> {
    const parsed = photoUploadSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
    });
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) {
      return { errors: { file: ["Välj en bildfil."] } };
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return { errors: { file: ["Endast JPEG, PNG eller WEBP stöds."] } };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { errors: { file: ["Filen är för stor (max 10 MB)."] } };
    }

    let url: string;
    try {
      const blob = await upload(`contests/${contestId}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/photos/upload",
        clientPayload: JSON.stringify({ contestId }),
        contentType: file.type,
      });
      url = blob.url;
    } catch (error) {
      return { errors: { form: [(error as Error).message || "Uppladdningen misslyckades."] } };
    }

    formData.delete("photo");
    formData.set("photoUrl", url);
    return uploadPhoto(contestId, prevState, formData);
  }

  const [state, formAction] = useActionState(action, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-medium text-slate-900">Ladda upp ett bidrag</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Titel
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Beskrivning (valfritt)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="photo" className="text-sm font-medium text-slate-700">
          Bild (JPEG, PNG eller WEBP, max 10 MB)
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-sm"
        />
        {errors.file && <p className="text-sm text-red-600">{errors.file[0]}</p>}
      </div>

      {errors.form && (
        <p className="text-sm text-red-600" aria-live="polite">
          {errors.form[0]}
        </p>
      )}

      <SubmitButton pendingText="Laddar upp...">Ladda upp</SubmitButton>
    </form>
  );
}
