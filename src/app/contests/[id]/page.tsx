import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONTEST_STATUS_BADGE, CONTEST_STATUS_LABEL } from "@/lib/contest-status";
import { UploadPhotoForm } from "@/components/UploadPhotoForm";
import { VoteButton } from "@/components/VoteButton";

export default async function ContestPage({ params }: PageProps<"/contests/[id]">) {
  const { id } = await params;
  const session = await auth();

  const contest = await prisma.contest.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true } },
          _count: { select: { votes: true } },
        },
      },
    },
  });

  if (!contest || contest.status === "DRAFT") {
    notFound();
  }

  let myVotePhotoId: string | null = null;
  if (session?.user) {
    const myVote = await prisma.vote.findUnique({
      where: { userId_contestId: { userId: session.user.id, contestId: contest.id } },
    });
    myVotePhotoId = myVote?.photoId ?? null;
  }

  const winner =
    contest.status === "CLOSED" && contest.photos.length > 0
      ? [...contest.photos].sort((a, b) => b._count.votes - a._count.votes)[0]
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{contest.title}</h1>
          {contest.description && <p className="mt-2 max-w-2xl text-slate-600">{contest.description}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${CONTEST_STATUS_BADGE[contest.status]}`}
        >
          {CONTEST_STATUS_LABEL[contest.status]}
        </span>
      </div>

      {winner && (
        <div className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">
            Vinnare: {winner.title} av {winner.user.name} ({winner._count.votes} röster)
          </p>
        </div>
      )}

      {contest.status === "SUBMISSION" &&
        (session?.user ? (
          <div className="mb-10">
            <UploadPhotoForm contestId={contest.id} />
          </div>
        ) : (
          <p className="mb-10 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Logga in eller skapa ett konto för att lämna in ett bidrag.
          </p>
        ))}

      {contest.photos.length === 0 ? (
        <p className="text-slate-500">Inga bidrag har laddats upp ännu.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contest.photos.map((photo) => (
            <div
              key={photo.id}
              className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                <Image src={photo.filePath} alt={photo.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-medium text-slate-900">{photo.title}</p>
                <p className="text-sm text-slate-500">av {photo.user.name}</p>
                {photo.description && <p className="text-sm text-slate-600">{photo.description}</p>}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-sm text-slate-500">{photo._count.votes} röster</span>
                  {contest.status === "VOTING" && session?.user && session.user.id !== photo.userId && (
                    <VoteButton contestId={contest.id} photoId={photo.id} isSelected={myVotePhotoId === photo.id} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
