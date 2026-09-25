import type { ContestStatus } from "@/generated/prisma/enums";

export const CONTEST_STATUS_LABEL: Record<ContestStatus, string> = {
  DRAFT: "Utkast",
  SUBMISSION: "Öppen för bidrag",
  VOTING: "Röstning pågår",
  CLOSED: "Avslutad",
};

export const CONTEST_STATUS_BADGE: Record<ContestStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMISSION: "bg-blue-100 text-blue-700",
  VOTING: "bg-amber-100 text-amber-700",
  CLOSED: "bg-emerald-100 text-emerald-700",
};
