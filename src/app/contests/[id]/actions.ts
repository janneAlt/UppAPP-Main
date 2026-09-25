"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { savePhotoFile } from "@/lib/uploads";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, photoUploadSchema } from "@/lib/validations";

export type UploadPhotoState = {
  errors?: Partial<Record<"title" | "description" | "file" | "form", string[]>>;
};

export async function uploadPhoto(
  contestId: string,
  _prevState: UploadPhotoState,
  formData: FormData,
): Promise<UploadPhotoState> {
  const session = await auth();
  if (!session?.user) {
    return { errors: { form: ["Du måste vara inloggad för att ladda upp foton."] } };
  }

  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest || contest.status !== "SUBMISSION") {
    return { errors: { form: ["Tävlingen tar inte emot bidrag just nu."] } };
  }

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

  const filePath = await savePhotoFile(contestId, file);

  await prisma.photo.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      filePath,
      contestId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/contests/${contestId}`);
  return {};
}

export type VoteState = {
  error?: string;
};

export async function castVote(
  contestId: string,
  photoId: string,
  _prevState: VoteState,
  _formData: FormData,
): Promise<VoteState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Du måste vara inloggad för att rösta." };
  }

  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest || contest.status !== "VOTING") {
    return { error: "Röstningen är inte öppen just nu." };
  }

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo || photo.contestId !== contestId) {
    return { error: "Bidraget hittades inte." };
  }
  if (photo.userId === session.user.id) {
    return { error: "Du kan inte rösta på ditt eget bidrag." };
  }

  await prisma.vote.upsert({
    where: { userId_contestId: { userId: session.user.id, contestId } },
    update: { photoId },
    create: { userId: session.user.id, contestId, photoId },
  });

  revalidatePath(`/contests/${contestId}`);
  return {};
}
