import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Fototävlingen
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/contests" className="text-slate-600 hover:text-slate-900">
            Tävlingar
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              Admin
            </Link>
          )}

          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-500">{session.user.name}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="text-slate-600 underline hover:text-slate-900">
                  Logga ut
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Logga in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
              >
                Skapa konto
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
