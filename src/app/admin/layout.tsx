import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <nav className="mb-8 flex gap-5 border-b border-slate-200 pb-4 text-sm">
        <Link href="/admin" className="font-medium text-slate-900">
          Översikt
        </Link>
        <Link href="/admin/contests" className="text-slate-600 hover:text-slate-900">
          Tävlingar
        </Link>
        <Link href="/admin/users" className="text-slate-600 hover:text-slate-900">
          Medlemmar
        </Link>
        <Link href="/admin/reports" className="text-slate-600 hover:text-slate-900">
          Rapporter
        </Link>
      </nav>
      {children}
    </div>
  );
}
