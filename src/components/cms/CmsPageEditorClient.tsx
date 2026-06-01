"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CmsToast, useCmsToast } from "@/components/cms/CmsToast";

type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "url" | "label";
  help?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
};

type SectionConfig = {
  key: string;
  label: string;
  description?: string;
  fields: FieldConfig[];
};

type PageConfig = {
  slug: string;
  label: string;
  publicPath: string;
  sections: SectionConfig[];
  seo: { enabled: boolean };
};

type ApiResponse = {
  page: { slug: string; label: string; publicPath: string };
  config: PageConfig;
  content: { slug: string; sections: Record<string, Record<string, string>> };
  seo: { title: string; description: string; keywords: string[]; ogImageUrl: string };
};

export default function CmsPageEditorClient({ slug, permissions }: { slug: string; permissions: string[] }) {
  const { toast, show } = useCmsToast();
  const canWriteContent = permissions.includes("cms.pages.write_content");
  const canWriteSeo = permissions.includes("cms.pages.write_seo");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<"content" | "seo">("content");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);

  const [draftValues, setDraftValues] = useState<Record<string, Record<string, string>>>({});
  const [seoDraft, setSeoDraft] = useState({ title: "", description: "", keywords: "", ogImageUrl: "" });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cms/pages/${slug}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load page");

      const next = json as ApiResponse;
      setData(next);
      setDraftValues(next.content.sections ?? {});
      setSeoDraft({
        title: next.seo?.title ?? "",
        description: next.seo?.description ?? "",
        keywords: (next.seo?.keywords ?? []).join(", "),
        ogImageUrl: next.seo?.ogImageUrl ?? "",
      });

      const firstSection = next.config.sections?.[0]?.key ?? null;
      setActiveSectionKey((prev) => prev ?? firstSection);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const activeSection = useMemo(() => {
    if (!data || !activeSectionKey) return null;
    return data.config.sections.find((s) => s.key === activeSectionKey) ?? null;
  }, [data, activeSectionKey]);

  function setField(sectionKey: string, fieldKey: string, value: string) {
    setDraftValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] ?? {}),
        [fieldKey]: value,
      },
    }));
  }

  async function saveSection() {
    if (!data || !activeSection) return;
    if (!canWriteContent) {
      show({ type: "error", message: "You don’t have permission to edit content." });
      return;
    }

    setSaving(true);
    try {
      const values = draftValues[activeSection.key] ?? {};
      const res = await fetch(`/api/cms/pages/${slug}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: activeSection.key, values }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save");
      show({ type: "success", message: "Saved" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function saveSeo() {
    if (!data) return;
    if (!canWriteSeo) {
      show({ type: "error", message: "You don’t have permission to edit SEO." });
      return;
    }

    setSaving(true);
    try {
      const keywords = seoDraft.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const res = await fetch(`/api/cms/pages/${slug}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: seoDraft.title,
          description: seoDraft.description,
          keywords,
          ogImageUrl: seoDraft.ogImageUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save SEO");
      show({ type: "success", message: "SEO saved" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-neutral-400 font-bricolage py-6">Loading…</p>;
  if (error) return <p className="text-red-500 font-bricolage py-6">{error}</p>;
  if (!data) return <p className="text-neutral-400 font-bricolage py-6">No data.</p>;

  const publicPath = data.page.publicPath;

  return (
    <>
      <CmsToast toast={toast} />

      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("content")}
            className={`px-3 py-2 rounded-lg text-sm font-bricolage border transition ${
              tab === "content"
                ? "bg-white border-neutral-200 text-neutral-900"
                : "bg-transparent border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setTab("seo")}
            disabled={!data.config.seo.enabled}
            className={`px-3 py-2 rounded-lg text-sm font-bricolage border transition ${
              tab === "seo"
                ? "bg-white border-neutral-200 text-neutral-900"
                : "bg-transparent border-transparent text-neutral-500 hover:text-neutral-900"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            SEO
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bricolage text-[#9A6648] hover:underline"
          >
            Open public page
          </a>
          <Link
            href="/cms/pages"
            className="text-sm font-bricolage text-neutral-500 hover:text-neutral-900"
          >
            Back to pages
          </Link>
        </div>
      </div>

      {tab === "content" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 font-bricolage mb-3">
                Sections
              </div>

              {data.config.sections.length === 0 ? (
                <p className="text-sm text-neutral-400 font-bricolage">No sections configured yet.</p>
              ) : (
                <div className="space-y-1">
                  {data.config.sections.map((s) => {
                    const active = s.key === activeSectionKey;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveSectionKey(s.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bricolage transition ${
                          active
                            ? "bg-[#9A6648]/10 text-[#9A6648] font-semibold"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {s.label}
                        {s.description && (
                          <div className={`mt-0.5 text-xs ${active ? "text-[#9A6648]/80" : "text-neutral-400"}`}>
                            {s.description}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            {!activeSection ? (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
                <p className="text-neutral-400 font-bricolage">Select a section to edit.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-semibold text-neutral-900 font-bricolage">{activeSection.label}</h2>
                    {activeSection.description && (
                      <p className="mt-1 text-sm text-neutral-500 font-bricolage">{activeSection.description}</p>
                    )}
                  </div>
                  <Button onClick={saveSection} disabled={saving || !canWriteContent}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>

                <div className="space-y-4">
                  {activeSection.fields.map((f) => {
                    const value = (draftValues[activeSection.key] ?? {})[f.key] ?? "";

                    return (
                      <div key={f.key}>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                          {f.label}
                          {f.required ? <span className="text-red-400"> *</span> : null}
                        </label>

                        {f.type === "textarea" ? (
                          <Textarea
                            value={value}
                            onChange={(e) => setField(activeSection.key, f.key, e.target.value)}
                            placeholder={f.placeholder}
                            rows={4}
                          />
                        ) : f.type === "image" ? (
                          <div className="flex gap-2 items-center">
                            <Input
                              value={value}
                              onChange={(e) => setField(activeSection.key, f.key, e.target.value)}
                              placeholder={f.placeholder ?? "Paste URL or upload image"}
                              className="flex-1"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!canWriteContent}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    show({ type: "success", message: "Uploading..." });
                                    const form = new FormData();
                                    form.append("file", file);
                                    const res = await fetch("/api/cms/media/upload", { method: "POST", body: form });
                                    const json = await res.json();
                                    if (!res.ok) throw new Error(json?.error ?? "Upload failed");
                                    setField(activeSection.key, f.key, json.media.url);
                                    show({ type: "success", message: "Image uploaded" });
                                  } catch (err: any) {
                                    show({ type: "error", message: err.message });
                                  } finally {
                                    e.target.value = "";
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" disabled={!canWriteContent}>Upload</Button>
                            </div>
                          </div>
                        ) : (
                          <Input
                            value={value}
                            onChange={(e) => setField(activeSection.key, f.key, e.target.value)}
                            placeholder={f.placeholder}
                          />
                        )}

                        {(f.help || f.maxLength) && (
                          <div className="mt-1 text-xs text-neutral-400 font-bricolage flex items-center justify-between gap-3">
                            <span>{f.help ?? ""}</span>
                            {f.maxLength ? <span>{String(value).length}/{f.maxLength}</span> : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!canWriteContent && (
                  <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-500 font-bricolage">
                    Read-only: your role can’t edit content fields.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 max-w-2xl">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-semibold text-neutral-900 font-bricolage">SEO</h2>
              <p className="mt-1 text-sm text-neutral-500 font-bricolage">
                Control meta title/description, keywords, and OG image for this page.
              </p>
            </div>
            <Button onClick={saveSeo} disabled={saving || !canWriteSeo}>
              {saving ? "Saving…" : "Save SEO"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                Meta title
              </label>
              <Input value={seoDraft.title} onChange={(e) => setSeoDraft((p) => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                Meta description
              </label>
              <Textarea
                value={seoDraft.description}
                onChange={(e) => setSeoDraft((p) => ({ ...p, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                Keywords
              </label>
              <Input
                value={seoDraft.keywords}
                onChange={(e) => setSeoDraft((p) => ({ ...p, keywords: e.target.value }))}
                placeholder="comma, separated, keywords"
              />
              <div className="mt-1 text-xs text-neutral-400 font-bricolage">Stored as a list.</div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                OG image URL
              </label>
              <Input
                value={seoDraft.ogImageUrl}
                onChange={(e) => setSeoDraft((p) => ({ ...p, ogImageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {!canWriteSeo && (
            <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-500 font-bricolage">
              Read-only: your role can’t edit SEO fields.
            </div>
          )}
        </div>
      )}
    </>
  );
}
