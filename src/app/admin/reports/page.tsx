import { prisma } from "@/lib/prisma";

export default async function AdminReportsPage() {
  const closedContests = await prisma.contest.findMany({
    where: { status: "CLOSED" },
    orderBy: { createdAt: "desc" },
    include: {
      photos: {
        include: {
          user: { select: { name: true } },
          _count: { select: { votes: true } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-slate-900">Rapporter över avslutade tävlingar</h1>

      {closedContests.length === 0 ? (
        <p className="text-slate-500">Inga avslutade tävlingar ännu.</p>
      ) : (
        closedContests.map((contest) => {
          const sorted = [...contest.photos].sort((a, b) => b._count.votes - a._count.votes);
          const winner = sorted[0];
          const totalVotes = sorted.reduce((sum, photo) => sum + photo._count.votes, 0);

          return (
            <div key={contest.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-900">{contest.title}</h2>
                <span className="text-sm text-slate-500">{totalVotes} röster totalt</span>
              </div>

              {winner ? (
                <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  Vinnare: {winner.title} av {winner.user.name} ({winner._count.votes} röster)
                </p>
              ) : (
                <p className="mb-4 text-sm text-slate-500">Inga bidrag laddades upp.</p>
              )}

              {sorted.length > 0 && (
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-1 pr-4">Bidrag</th>
                      <th className="py-1 pr-4">Fotograf</th>
                      <th className="py-1">Röster</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((photo) => (
                      <tr key={photo.id} className="border-t border-slate-100">
                        <td className="py-1 pr-4">{photo.title}</td>
                        <td className="py-1 pr-4 text-slate-500">{photo.user.name}</td>
                        <td className="py-1">{photo._count.votes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
