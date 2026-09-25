"use client";

import { useActionState } from "react";
import { createContest, type CreateContestState } from "@/app/admin/contests/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: CreateContestState = {};

export function CreateContestForm() {
  const [state, formAction] = useActionState(createContest, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-medium text-slate-900">Skapa ny tävling</h2>

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

      <SubmitButton pendingText="Skapar...">Skapa tävling</SubmitButton>
    </form>
  );
}
