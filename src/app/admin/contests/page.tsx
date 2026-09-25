import { prisma } from "@/lib/prisma";
import { CONTEST_STATUS_BADGE, CONTEST_STATUS_LABEL } from "@/lib/contest-status";
import { CreateContestForm } from "@/components/CreateContestForm";
import { advanceContestStatus, deleteContest } from "./actions";
import type { ContestStatus } from "@/generated/prisma/enums";

const NEXT_ACTION_LABEL: Record<ContestStatus, string | null> = {
  DRAFT: "Öppna för bidrag",
  SUBMISSION: "Starta röstning",
  VOTING: "Avsluta tävling",
  CLOSED: null,
};

export default async function AdminContestsPage() {
  const contests = await prisma.contest.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { photos: true, votes: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-slate-900">Tävlingar</h1>

      <CreateContestForm />

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2">Titel</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Bidrag</th>
              <th className="px-4 py-2">Röster</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-900">{contest.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${CONTEST_STATUS_BADGE[contest.status]}`}
                  >
                    {CONTEST_STATUS_LABEL[contest.status]}
                  </span>
                </td>
                <td className="px-4 py-2">{contest._count.photos}</td>
                <td className="px-4 py-2">{contest._count.votes}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    {NEXT_ACTION_LABEL[contest.status] && (
                      <form action={advanceContestStatus.bind(null, contest.id)}>
                        <button className="text-xs font-medium text-slate-600 underline hover:text-slate-900">
                          {NEXT_ACTION_LABEL[contest.status]}
                        </button>
                      </form>
                    )}
                    {contest.status === "DRAFT" && (
                      <form action={deleteContest.bind(null, contest.id)}>
                        <button className="text-xs font-medium text-red-600 underline hover:text-red-800">
                          Ta bort
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
