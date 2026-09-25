"use client";

import { useActionState } from "react";
import { uploadPhoto, type UploadPhotoState } from "@/app/contests/[id]/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: UploadPhotoState = {};

export function UploadPhotoForm({ contestId }: { contestId: string }) {
  const action = uploadPhoto.bind(null, contestId);
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
