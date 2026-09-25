"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginUser(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/contests",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Fel e-postadress eller lösenord." };
    }
    throw error;
  }

  return {};
}
