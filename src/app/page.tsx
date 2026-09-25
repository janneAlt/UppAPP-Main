import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Fototävlingen</h1>
      <p className="max-w-xl text-slate-600">
        Skapa ett konto, ladda upp dina bästa foton och rösta fram vinnaren tillsammans med övriga
        medlemmar.
      </p>
      <div className="flex gap-3">
        <Link
          href="/contests"
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Se tävlingar
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
        >
          Skapa konto
        </Link>
      </div>
    </div>
  );
}
