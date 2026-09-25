"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contestSchema } from "@/lib/validations";
import type { ContestStatus } from "@/generated/prisma/enums";

export type CreateContestState = {
  errors?: Partial<Record<"title" | "description" | "form", string[]>>;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Endast administratörer har åtkomst.");
  }
  return session;
}

export async function createContest(_prevState: CreateContestState, formData: FormData): Promise<CreateContestState> {
  await requireAdmin();

  const parsed = contestSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.contest.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/contests");
  revalidatePath("/contests");
  return {};
}

const NEXT_STATUS: Record<ContestStatus, ContestStatus | null> = {
  DRAFT: "SUBMISSION",
  SUBMISSION: "VOTING",
  VOTING: "CLOSED",
  CLOSED: null,
};

export async function advanceContestStatus(contestId: string) {
  await requireAdmin();

  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest) return;

  const next = NEXT_STATUS[contest.status];
  if (!next) return;

  await prisma.contest.update({ where: { id: contestId }, data: { status: next } });
  revalidatePath("/admin/contests");
  revalidatePath("/contests");
  revalidatePath(`/contests/${contestId}`);
}

export async function deleteContest(contestId: string) {
  await requireAdmin();

  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest || contest.status !== "DRAFT") return;

  await prisma.contest.delete({ where: { id: contestId } });
  revalidatePath("/admin/contests");
  revalidatePath("/contests");
}
