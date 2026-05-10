"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type BlogPost = {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
};

const EMPTY: BlogPost = { id: "", title: "", imageUrl: "", author: "", date: "", excerpt: "", content: "" };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BlogPost>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const formFields: { key: keyof BlogPost; label: string; placeholder?: string; help?: string; type?: string }[] = [
    { key: "id", label: "ID (slug)", placeholder: "e.g., my-first-post", help: "Lowercase letters, numbers, hyphens only." },
    { key: "title", label: "Title", placeholder: "e.g., My First Blog Post" },
    { key: "imageUrl", label: "Image URL", placeholder: "e.g., /uploads/blog-image.jpg", help: "Optional if uploading below." },
    { key: "author", label: "Author", placeholder: "e.g., Jane Doe" },
    { key: "date", label: "Date", placeholder: "e.g., September 26, 2025" },
    { key: "excerpt", label: "Excerpt", placeholder: "A short summary.", type: "textarea" },
    { key: "content", label: "Full Content", placeholder: "Write the full blog post here. Use ## for headings, > for quotes.", type: "textarea", help: "Use ## for headings, > for blockquotes, ![caption|url] for images." },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use only lowercase letters, numbers, and hyphens.";
      else if (posts.some((p) => p.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.title)) errs.title = "Title is required.";
    if (!must(form.author)) errs.author = "Author is required.";
    if (!must(form.date)) errs.date = "Date is required.";
    if (!must(form.excerpt)) errs.excerpt = "Excerpt is required.";
    if (!must(form.content)) errs.content = "Content is required.";
    if (!form.imageUrl && !file) errs.imageUrl = "Provide an Image URL or upload a file.";
    return errs;
  }

  async function uploadIfNeeded(): Promise<string> {
    if (!file) return form.imageUrl;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url as string;
  }

  async function handleSubmit(isEdit: boolean) {
    try {
      const v = validateForm(isEdit);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();
      const payload = { ...form, imageUrl: finalImageUrl };
      const url = isEdit ? `/api/blog/${editingId}` : "/api/blog";
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed"); }
    } catch (e: any) {
      alert(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  function beginEdit(p: BlogPost) {
    setEditingId(p.id);
    setForm(p);
    setFile(null);
    setShowForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setFile(null);
    setErrors({});
    setShowForm(false);
  }

  async function removePost(id: string) {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Create, update, or remove blog posts."
        actions={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>
              + New Post
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form panel */}
        {showForm && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Post" : "New Post"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                {formFields.map(({ key, label, placeholder, help, type }) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-neutral-700 text-xs font-bold uppercase tracking-wide">
                      {label}
                    </Label>
                    {type === "textarea" ? (
                      <Textarea
                        id={key}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        rows={key === "content" ? 10 : 3}
                        className={errors[key] ? "border-red-300" : ""}
                      />
                    ) : (
                      <Input
                        id={key}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        disabled={editingId !== null && key === "id"}
                        className={errors[key] ? "border-red-300" : ""}
                      />
                    )}
                    {errors[key] ? (
                      <p className="text-xs text-red-600">{errors[key]}</p>
                    ) : help ? (
                      <p className="text-xs text-neutral-400">{help}</p>
                    ) : null}
                  </div>
                ))}

                <div className="space-y-1">
                  <Label className="text-neutral-700 text-xs font-bold uppercase tracking-wide">Featured Image Upload</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={() => handleSubmit(!!editingId)} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update Post" : "Add Post"}
                  </Button>
                  <Button variant="outlineBlack" onClick={cancelEdit} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post list */}
        <div className={showForm ? "lg:col-span-7" : "lg:col-span-12"}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-neutral-300 mb-3">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-neutral-400 font-bricolage text-sm">No posts yet.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${showForm ? "sm:grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"} gap-4`}>
              {posts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden group">
                  <div className="relative w-full pt-[52%] bg-neutral-100">
                    <div className="absolute inset-0 bg-cover bg-center" data-bg={`url(${p.imageUrl})`} />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-neutral-900 font-bricolage leading-tight">{p.title}</div>
                    <div className="mt-1 text-xs text-neutral-400 font-bricolage">{p.author} · {p.date}</div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(p)} className="flex-1">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removePost(p.id)} className="flex-1">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
