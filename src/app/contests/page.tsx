import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CONTEST_STATUS_BADGE, CONTEST_STATUS_LABEL } from "@/lib/contest-status";

export default async function ContestsPage() {
  const contests = await prisma.contest.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { photos: true, votes: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-slate-900">Tävlingar</h1>

      {contests.length === 0 ? (
        <p className="text-slate-500">Det finns inga tävlingar ännu.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {contests.map((contest) => (
            <li key={contest.id}>
              <Link
                href={`/contests/${contest.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4 hover:border-slate-400"
              >
                <div>
                  <p className="font-medium text-slate-900">{contest.title}</p>
                  <p className="text-sm text-slate-500">
                    {contest._count.photos} bidrag &middot; {contest._count.votes} röster
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${CONTEST_STATUS_BADGE[contest.status]}`}>
                  {CONTEST_STATUS_LABEL[contest.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
