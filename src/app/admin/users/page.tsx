import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setUserActive, setUserRole } from "./actions";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { photos: true, votes: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Medlemmar</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2">Namn</th>
              <th className="px-4 py-2">E-post</th>
              <th className="px-4 py-2">Roll</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Bidrag</th>
              <th className="px-4 py-2">Röster</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session?.user.id;
              return (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-2 text-slate-500">{user.email}</td>
                  <td className="px-4 py-2">{user.role === "ADMIN" ? "Admin" : "Medlem"}</td>
                  <td className="px-4 py-2">{user.isActive ? "Aktiv" : "Inaktiverad"}</td>
                  <td className="px-4 py-2">{user._count.photos}</td>
                  <td className="px-4 py-2">{user._count.votes}</td>
                  <td className="px-4 py-2 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-400">Ditt konto</span>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <form action={setUserRole.bind(null, user.id, user.role === "ADMIN" ? "MEMBER" : "ADMIN")}>
                          <button className="text-xs font-medium text-slate-600 underline hover:text-slate-900">
                            {user.role === "ADMIN" ? "Gör till medlem" : "Gör till admin"}
                          </button>
                        </form>
                        <form action={setUserActive.bind(null, user.id, !user.isActive)}>
                          <button className="text-xs font-medium text-slate-600 underline hover:text-slate-900">
                            {user.isActive ? "Inaktivera" : "Aktivera"}
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
