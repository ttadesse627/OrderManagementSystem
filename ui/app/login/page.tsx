"use client";

import { useState } from "react";
import Link from "next/link";

type AuthResponse = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};

type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
  requestId?: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5077";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAuth(null);
    setLoading(true);

    try {
      const body: LoginRequest = { email, password };

      const res = await fetch(`${API_BASE}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let detail = `Login failed (${res.status})`;

        try {
          const problem = (await res.json()) as ProblemDetails;

          if (problem?.errors) {
            const messages = Object.values(problem.errors)
              .flat()
              .join(", ");
            detail = messages || problem.title || detail;
          } else if (problem?.title) {
            detail = problem.title;
          }
        } catch {}

        throw new Error(detail);
      }

      const data = (await res.json()) as AuthResponse;
      setAuth(data);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // GOOGLE LOGIN HANDLER
  // ---------------------------------------------------------
  async function handleGoogleLogin() {
    try {
      const res = await fetch(`${API_BASE}/api/Auth/google-login-url`);
      const { url } = await res.json(); // backend returns Google authorization URL
      window.location.href = url;       // redirect user to Google
    } catch (err) {
      setError("Failed to start Google login.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Sign In</h1>
          <Link
            href="/"
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Home
          </Link>
        </div>

        {/* ------------------------------ */}
        {/* Sign-In Form */}
        {/* ------------------------------ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* ------------------------------ */}
        {/* GOOGLE LOGIN BUTTON */}
        {/* ------------------------------ */}
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="h-5 w-5"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>

        {/* ------------------------------ */}
        {/* Error */}
        {/* ------------------------------ */}
        {error && (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950">
            {error}
          </div>
        )}

        {/* ------------------------------ */}
        {/* Auth Response */}
        {/* ------------------------------ */}
        {auth && (
          <div className="mt-6 space-y-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950">
            <div>
              Welcome, {auth.firstName} {auth.lastName}
            </div>
            <div className="text-xs text-green-700/80">
              Token saved. You can now access protected routes.
            </div>
            <div className="pt-2">
              <Link
                href="/items"
                className="inline-flex items-center rounded-md border border-green-300 px-3 py-1.5 text-xs hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900"
              >
                Go to Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
