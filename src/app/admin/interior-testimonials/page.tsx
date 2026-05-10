"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type InteriorFeedbackItem = { id: string; name: string; avatar: string; text: string; role?: string };

const EMPTY: InteriorFeedbackItem = { id: "", name: "", avatar: "", text: "", role: "" };

export default function AdminInteriorTestimonialsPage() {
  const [feedbacks, setFeedbacks] = useState<InteriorFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<InteriorFeedbackItem>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const formFields: { key: keyof InteriorFeedbackItem; label: string; placeholder?: string; help?: string }[] = [
    { key: "id", label: "ID", placeholder: "e.g., if1", help: "Lowercase letters and numbers; must be unique." },
    { key: "name", label: "Client Name", placeholder: "e.g., Elena Park" },
    { key: "role", label: "Role (optional)", placeholder: "e.g., Residential Client" },
    { key: "avatar", label: "Avatar URL", placeholder: "e.g., /uploads/photo.jpg", help: "Optional if uploading below." },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/interior-feedback");
    const data = await res.json();
    setFeedbacks(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (feedbacks.some((f) => f.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.name)) errs.name = "Name is required.";
    if (!must(form.text)) errs.text = "Testimonial text is required.";
    if (!form.avatar && !file) errs.avatar = "Provide an Avatar URL or upload a file.";
    return errs;
  }

  async function uploadIfNeeded(): Promise<string> {
    if (!file) return form.avatar;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url as string;
  }

  async function createFeedback() {
    const v = validateForm(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalAvatarUrl = await uploadIfNeeded();
      const res = await fetch("/api/interior-feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, avatar: finalAvatarUrl }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to create"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(f: InteriorFeedbackItem) {
    setEditingId(f.id);
    setForm({ ...f, role: f.role ?? "" });
    setFile(null);
    setShowForm(true);
  }

  async function updateFeedback() {
    if (!editingId) return;
    const v = validateForm(true);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalAvatarUrl = await uploadIfNeeded();
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/interior-feedback/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rest, avatar: finalAvatarUrl }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to update"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setFile(null);
    setErrors({});
    setShowForm(false);
  }

  async function removeFeedback(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/interior-feedback/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Manage client testimonials for interior projects."
        actions={!showForm && <Button onClick={() => setShowForm(true)}>+ New Testimonial</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showForm && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Testimonial" : "New Testimonial"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">Cancel</button>
              </div>

              <div className="space-y-4">
                {formFields.map(({ key, label, placeholder, help }) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs font-bold uppercase tracking-wide text-neutral-700">{label}</Label>
                    <Input
                      id={key}
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
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Upload Avatar</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="text" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Testimonial Text</Label>
                  <Textarea
                    id="text"
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                    placeholder="Write the testimonial text…"
                    className={errors.text ? "border-red-300" : ""}
                  />
                  {errors.text && <p className="text-xs text-red-600">{errors.text}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? updateFeedback : createFeedback} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update" : "Add Testimonial"}
                  </Button>
                  <Button variant="outlineBlack" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
          ) : feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No testimonials yet.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${showForm ? "" : "sm:grid-cols-2 xl:grid-cols-3"} gap-4`}>
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" data-bg={`url(${f.avatar})`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-900 font-bricolage text-sm">{f.name}</div>
                    {f.role && <div className="text-[11px] text-neutral-400 font-bricolage">{f.role}</div>}
                    <p className="mt-1.5 text-sm text-neutral-600 font-bricolage leading-relaxed line-clamp-3">{f.text}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(f)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeFeedback(f.id)}>Delete</Button>
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
