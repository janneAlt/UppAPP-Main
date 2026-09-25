"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/app/register/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Namn
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
      </div>

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
        {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
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
          minLength={8}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password[0]}</p>}
      </div>

      {errors.form && (
        <p className="text-sm text-red-600" aria-live="polite">
          {errors.form[0]}
        </p>
      )}

      <SubmitButton pendingText="Skapar konto...">Skapa konto</SubmitButton>

      <p className="text-sm text-slate-500">
        Har du redan ett konto?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          Logga in
        </Link>
      </p>
    </form>
  );
}
