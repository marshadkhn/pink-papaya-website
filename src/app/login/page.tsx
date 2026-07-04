"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit() {
    const email = (emailRef.current?.value ?? "").trim();
    const password = passwordRef.current?.value ?? "";

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: { ok?: boolean; error?: string } | null = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        setError(data?.error ?? "Invalid credentials");
        return;
      }

      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl font-semibold text-neutral-900">
            Pink Papaya
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-bricolage">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 font-bricolage">Sign In</h2>
            <p className="text-sm text-neutral-400 mt-0.5 font-bricolage">
              Enter your admin credentials to continue
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-bricolage"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 font-bricolage"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                ref={emailRef}
                type="email"
                className="w-full rounded-xl border border-neutral-200 bg-[#F9F7F4] px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#9A6648]/30 focus:border-[#9A6648] transition font-bricolage"
                placeholder=""
                autoComplete="email"
                autoFocus
                onKeyDown={handleKeyDown}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 font-bricolage"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                ref={passwordRef}
                type="password"
                className="w-full rounded-xl border border-neutral-200 bg-[#F9F7F4] px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#9A6648]/30 focus:border-[#9A6648] transition font-bricolage"
                placeholder=""
                autoComplete="current-password"
                onKeyDown={handleKeyDown}
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-[#9A6648] text-white py-3 text-sm font-bold uppercase tracking-widest font-bricolage hover:bg-[#82553C] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
