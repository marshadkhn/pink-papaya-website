"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type InteriorProject = {
  id: string; title: string; imageUrl: string; description?: string;
  badge?: string; headline?: string; tagline?: string;
  longDescription?: string[]; photos?: string[]; beforeAfter?: string[];
};

const EMPTY: InteriorProject = {
  id: "", title: "", imageUrl: "", description: "",
  badge: "", headline: "", tagline: "",
  longDescription: [], photos: [], beforeAfter: [],
};

export default function AdminInteriorPage() {
  const [projects, setProjects] = useState<InteriorProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<InteriorProject>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [longDescParagraphs, setLongDescParagraphs] = useState("");
  const [showForm, setShowForm] = useState(false);

  const formFields: { key: keyof InteriorProject; label: string; placeholder?: string; help?: string }[] = [
    { key: "id", label: "ID (slug)", placeholder: "e.g., coastal-calm", help: "Lowercase, numbers, hyphens only." },
    { key: "title", label: "Title", placeholder: "e.g., Coastal Calm" },
    { key: "imageUrl", label: "Main Image URL", placeholder: "e.g., /uploads/photo.jpg", help: "Optional if uploading below." },
    { key: "description", label: "Card Description", placeholder: "Short description for the card…", help: "Shows on the card (optional)." },
    { key: "badge", label: "Badge", placeholder: "e.g., JUMEIRAH PARKS", help: "Small badge on detail page." },
    { key: "headline", label: "Headline", placeholder: "e.g., THE SOFT EDIT", help: "Large title on detail page." },
    { key: "tagline", label: "Tagline", placeholder: "e.g., Neutral, airy design", help: "Subtitle below headline." },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/interior");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use lowercase letters, numbers, and hyphens.";
      else if (projects.some((p) => p.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.title)) errs.title = "Title is required.";
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

  async function uploadPhotosIfNeeded(): Promise<string[]> {
    if (!photoFiles.length) return form.photos ?? [];
    const urls: string[] = [];
    for (const gf of photoFiles) {
      const fd = new FormData();
      fd.append("file", gf);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Photo upload failed");
      const { url } = await res.json();
      urls.push(url as string);
    }
    return urls;
  }

  async function uploadBeforeAfterIfNeeded(): Promise<string[]> {
    if (!beforeFile && !afterFile) return form.beforeAfter ?? [];
    const urls: string[] = [];
    if (beforeFile) {
      const fd = new FormData(); fd.append("file", beforeFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Before image upload failed");
      urls.push((await res.json()).url as string);
    }
    if (afterFile) {
      const fd = new FormData(); fd.append("file", afterFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("After image upload failed");
      urls.push((await res.json()).url as string);
    }
    return urls.length === 2 ? urls : form.beforeAfter ?? [];
  }

  async function createProject() {
    const v = validateForm(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalImageUrl = await uploadIfNeeded();
      const finalPhotos = await uploadPhotosIfNeeded();
      const finalBeforeAfter = await uploadBeforeAfterIfNeeded();
      const longDesc = longDescParagraphs.split("\n\n").map((p) => p.trim()).filter(Boolean);
      const res = await fetch("/api/interior", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, imageUrl: finalImageUrl, photos: finalPhotos, beforeAfter: finalBeforeAfter, longDescription: longDesc }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to create"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(p: InteriorProject) {
    setEditingId(p.id);
    setForm({ ...p, description: p.description ?? "", badge: p.badge ?? "", headline: p.headline ?? "", tagline: p.tagline ?? "", longDescription: p.longDescription ?? [], photos: p.photos ?? [], beforeAfter: p.beforeAfter ?? [] });
    setFile(null); setPhotoFiles([]); setBeforeFile(null); setAfterFile(null);
    setLongDescParagraphs((p.longDescription ?? []).join("\n\n"));
    setShowForm(true);
  }

  async function updateProject() {
    if (!editingId) return;
    const v = validateForm(true);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalImageUrl = await uploadIfNeeded();
      const finalPhotos = photoFiles.length ? await uploadPhotosIfNeeded() : form.photos ?? [];
      const finalBeforeAfter = (beforeFile || afterFile) ? await uploadBeforeAfterIfNeeded() : form.beforeAfter ?? [];
      const longDesc = longDescParagraphs.split("\n\n").map((p) => p.trim()).filter(Boolean);
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/interior/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rest, imageUrl: finalImageUrl, photos: finalPhotos, beforeAfter: finalBeforeAfter, longDescription: longDesc }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to update"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setFile(null); setPhotoFiles([]); setBeforeFile(null); setAfterFile(null);
    setLongDescParagraphs("");
    setErrors({});
    setShowForm(false);
  }

  async function removeProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/interior/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Interior Projects"
        description="Add, edit, or remove interior design projects."
        actions={!showForm && <Button onClick={() => setShowForm(true)}>+ New Project</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showForm && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">Cancel</button>
              </div>

              <div className="space-y-4">
                {formFields.map(({ key, label, placeholder, help }) => (
                  <div key={String(key)} className="space-y-1">
                    <Label htmlFor={`f-${String(key)}`} className="text-xs font-bold uppercase tracking-wide text-neutral-700">{label}</Label>
                    <Input
                      id={`f-${String(key)}`}
                      placeholder={placeholder}
                      value={(form as any)[key] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      disabled={editingId !== null && key === "id"}
                      className={errors[key as string] ? "border-red-300" : ""}
                    />
                    {errors[key as string] ? <p className="text-xs text-red-600">{errors[key as string]}</p> : help ? <p className="text-xs text-neutral-400">{help}</p> : null}
                  </div>
                ))}

                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Upload Main Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Long Description (detail page)</Label>
                  <Textarea rows={6} value={longDescParagraphs} onChange={(e) => setLongDescParagraphs(e.target.value)} placeholder="Separate paragraphs with a blank line…" />
                  <p className="text-xs text-neutral-400">Press Enter twice between paragraphs.</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Gallery Photos (multiple)</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Before Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">After Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? updateProject : createProject} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update Project" : "Add Project"}
                  </Button>
                  <Button variant="outlineBlack" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={showForm ? "lg:col-span-7" : "lg:col-span-12"}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No projects yet.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${showForm ? "sm:grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"} gap-4`}>
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden">
                  <div className="relative w-full pt-[120%] bg-neutral-100">
                    <div className="absolute inset-0 bg-cover bg-center" data-bg={`url(${p.imageUrl})`} />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-neutral-900 font-bricolage">{p.title}</div>
                    {p.description && <p className="mt-1 text-sm text-neutral-500 font-bricolage line-clamp-2">{p.description}</p>}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(p)} className="flex-1">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeProject(p.id)} className="flex-1">Delete</Button>
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
