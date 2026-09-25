"use client";

import { useActionState } from "react";
import { castVote, type VoteState } from "@/app/contests/[id]/actions";

const initialState: VoteState = {};

export function VoteButton({
  contestId,
  photoId,
  isSelected,
}: {
  contestId: string;
  photoId: string;
  isSelected: boolean;
}) {
  const action = castVote.bind(null, contestId, photoId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${
          isSelected
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-slate-900 text-white hover:bg-slate-700"
        }`}
      >
        {isSelected ? "Din röst ✓" : "Rösta"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
