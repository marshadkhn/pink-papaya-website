"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CmsToast, useCmsToast } from "@/components/cms/CmsToast";

type MediaItem = {
  id: string;
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
  alt: string;
  createdBy: string | null;
  createdAt: string;
};

export default function CmsMediaClient({ permissions }: { permissions: string[] }) {
  const canWrite = permissions.includes("cms.media.write");
  const { toast, show } = useCmsToast();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(window.location.href);
      if (q.trim()) url.searchParams.set("q", q.trim());
      else url.searchParams.delete("q");

      const res = await fetch(`/api/cms/media${url.search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load media");
      setItems(json.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((m) =>
      m.fileName.toLowerCase().includes(s) || m.key.toLowerCase().includes(s) || m.url.toLowerCase().includes(s)
    );
  }, [q, items]);

  async function uploadSelected() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    if (!canWrite) {
      show({ type: "error", message: "You don’t have permission to upload media." });
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/cms/media/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");

      show({ type: "success", message: "Uploaded" });
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      show({ type: "success", message: "Copied URL" });
    } catch {
      show({ type: "error", message: "Copy failed" });
    }
  }

  async function remove(id: string) {
    if (!canWrite) {
      show({ type: "error", message: "You don’t have permission to delete media." });
      return;
    }
    if (!confirm("Delete this media asset?")) return;

    try {
      const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Delete failed");
      show({ type: "success", message: "Deleted" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Delete failed" });
    }
  }

  return (
    <>
      <CmsToast toast={toast} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="w-full sm:max-w-sm">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media…" />
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="text-sm font-bricolage"
            disabled={!canWrite || uploading}
          />
          <Button onClick={uploadSelected} disabled={!canWrite || uploading || !fileRef.current?.files?.length}>
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          <button onClick={load} className="text-sm font-bricolage text-neutral-500 hover:text-neutral-900 transition">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-400 font-bricolage py-6">Loading…</p>
      ) : error ? (
        <p className="text-red-500 font-bricolage py-6">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-400 font-bricolage py-6">No media found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden">
              <div className="relative aspect-[4/3] bg-neutral-100">
                <Image src={m.url} alt={m.alt || m.fileName} fill className="object-cover" sizes="400px" unoptimized />
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm font-semibold text-neutral-900 font-bricolage truncate" title={m.fileName}>
                  {m.fileName}
                </div>
                <div className="text-xs text-neutral-400 font-bricolage truncate" title={m.key}>
                  {m.key}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => copyUrl(m.url)}
                    className="text-xs font-semibold uppercase tracking-widest text-[#9A6648] hover:text-[#82553C]"
                  >
                    Copy URL
                  </button>
                  <span className="text-neutral-300">•</span>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                  >
                    Open
                  </a>
                  <span className="ml-auto" />
                  <button
                    onClick={() => remove(m.id)}
                    disabled={!canWrite}
                    className="text-xs font-semibold uppercase tracking-widest text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!canWrite && (
        <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-500 font-bricolage">
          Read-only: your role can’t upload/delete media.
        </div>
      )}
    </>
  );
}
