import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Namnet måste vara minst 2 tecken").max(100),
  email: z.string().trim().toLowerCase().email("Ogiltig e-postadress"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken").max(200),
});

export const contestSchema = z.object({
  title: z.string().trim().min(2, "Titeln måste vara minst 2 tecken").max(150),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const photoUploadSchema = z.object({
  title: z.string().trim().min(2, "Titeln måste vara minst 2 tecken").max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
