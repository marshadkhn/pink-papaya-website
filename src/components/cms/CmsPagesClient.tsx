"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

type PageRow = {
  slug: string;
  label: string;
  publicPath: string;
  updatedAt: string;
};

export default function CmsPagesClient() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/pages");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load pages");
      setPages((data.pages ?? []).map((p: any) => ({
        slug: p.slug,
        label: p.label,
        publicPath: p.publicPath,
        updatedAt: p.updatedAt,
      })));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pages;
    return pages.filter((p) => p.slug.toLowerCase().includes(s) || p.label.toLowerCase().includes(s));
  }, [q, pages]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-full max-w-sm">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages…" />
        </div>
        <button
          onClick={load}
          className="text-sm font-bricolage text-neutral-500 hover:text-neutral-800 transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-400 font-bricolage py-6">Loading…</p>
      ) : error ? (
        <p className="text-red-500 font-bricolage py-6">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-400 font-bricolage py-6">No pages found.</p>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-white">
          <table className="w-full text-sm font-bricolage">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Page</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Public</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.slug} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-4 text-neutral-800 font-medium">{p.label}</td>
                  <td className="px-5 py-4 text-neutral-500">{p.slug}</td>
                  <td className="px-5 py-4">
                    <a
                      href={p.publicPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9A6648] hover:underline"
                    >
                      {p.publicPath}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-neutral-400">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/cms/pages/${p.slug}`}
                      className="text-xs font-semibold uppercase tracking-widest text-[#9A6648] hover:text-[#82553C]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
