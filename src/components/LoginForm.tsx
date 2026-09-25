"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "@/app/login/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          E-post
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Lösenord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Loggar in...">Logga in</SubmitButton>

      <p className="text-sm text-slate-500">
        Inget konto?{" "}
        <Link href="/register" className="font-medium text-slate-900 underline">
          Skapa ett konto
        </Link>
      </p>
    </form>
  );
}
