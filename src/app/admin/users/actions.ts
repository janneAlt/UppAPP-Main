"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Endast administratörer har åtkomst.");
  }
  return session;
}

export async function setUserRole(userId: string, role: Role) {
  const session = await requireAdmin();
  if (userId === session.user.id) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function setUserActive(userId: string, isActive: boolean) {
  const session = await requireAdmin();
  if (userId === session.user.id) return;

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/users");
}
