import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-zinc-900 text-white">
      <div className="text-lg font-bold" id="logo">
        <Link href="/">Order Management UI</Link>
      </div>
      
        <div className="flex items-center gap-2" id="">
          <Link
            href="/items"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
          >
            Items
          </Link>
        </div>
    <div className="flex items-center gap-3">
        {/* Auth section: visible to guests */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
