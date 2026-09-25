import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, contestCount, photoCount, voteCount] = await Promise.all([
    prisma.user.count(),
    prisma.contest.count(),
    prisma.photo.count(),
    prisma.vote.count(),
  ]);

  const stats = [
    { label: "Medlemmar", value: userCount, href: "/admin/users" },
    { label: "Tävlingar", value: contestCount, href: "/admin/contests" },
    { label: "Bidrag", value: photoCount, href: "/admin/contests" },
    { label: "Röster", value: voteCount, href: "/admin/reports" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Översikt</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-400"
          >
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
