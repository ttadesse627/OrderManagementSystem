import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Order Management UI</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Welcome. You can browse products without signing in.
          </p>
          <Link
            href="/items"
            className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse Items
          </Link>
        </div>
      </main>
    </div>
  );
}
