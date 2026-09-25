"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export type RegisterState = {
  errors?: Partial<Record<"name" | "email" | "password" | "form", string[]>>;
};

const initialErrors: RegisterState = {};

export async function registerUser(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["Det finns redan ett konto med denna e-postadress."] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/contests" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { errors: { form: ["Kontot skapades men inloggningen misslyckades. Försök logga in manuellt."] } };
    }
    throw error;
  }

  return initialErrors;
}
