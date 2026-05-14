"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HostTestimonial = { id: string; name: string; role: string; quote: string };

const EMPTY: HostTestimonial = { id: "", name: "", role: "", quote: "" };

export default function AdminHostTestimonialsPage() {
  const [items, setItems] = useState<HostTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<HostTestimonial>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/host-testimonials");
      if (!res.ok) { setLoading(false); return; }
      setItems(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function validate(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (v?: string) => (v ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Lowercase, numbers, hyphens only.";
      else if (items.some((i) => i.id === form.id)) errs.id = "ID already exists.";
    }
    if (!must(form.name)) errs.name = "Name is required.";
    if (!must(form.quote)) errs.quote = "Quote is required.";
    return errs;
  }

  async function create() {
    const v = validate(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/host-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(t: HostTestimonial) {
    setEditingId(t.id);
    setForm({ ...t });
    setShowForm(true);
  }

  async function update() {
    if (!editingId) return;
    const v = validate(true);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/host-testimonials/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
    setShowForm(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/host-testimonials/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Host Testimonials"
        description="Manage testimonials shown on the Partner With Us page."
        actions={!showForm && <Button onClick={() => setShowForm(true)}>+ New Testimonial</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showForm && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Testimonial" : "New Testimonial"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">Cancel</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="ht-id" className="text-xs font-bold uppercase tracking-wide text-neutral-700">ID (slug)</Label>
                  <Input
                    id="ht-id"
                    placeholder="e.g., julianne-thorne"
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    disabled={editingId !== null}
                    className={errors.id ? "border-red-300" : ""}
                  />
                  {errors.id ? <p className="text-xs text-red-600">{errors.id}</p> : <p className="text-xs text-neutral-400">Lowercase, numbers, hyphens only.</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ht-name" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Name</Label>
                  <Input
                    id="ht-name"
                    placeholder="e.g., Julianne Thorne"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={errors.name ? "border-red-300" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ht-role" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Role / Property</Label>
                  <Input
                    id="ht-role"
                    placeholder="e.g., Owner, Casa Della Luce — Tuscany"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ht-quote" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Quote</Label>
                  <Textarea
                    id="ht-quote"
                    placeholder="Their testimonial…"
                    rows={5}
                    value={form.quote}
                    onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                    className={errors.quote ? "border-red-300" : ""}
                  />
                  {errors.quote && <p className="text-xs text-red-600">{errors.quote}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? update : create} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update" : "Add Testimonial"}
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
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No testimonials yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-neutral-900 font-bricolage">{t.name}</span>
                        {t.role && <span className="text-xs text-neutral-400 font-bricolage">{t.role}</span>}
                        <span className="text-[11px] text-neutral-300 font-bricolage bg-neutral-100 px-2 py-0.5 rounded-full">{t.id}</span>
                      </div>
                      <p className="text-sm text-neutral-500 font-bricolage italic leading-relaxed line-clamp-2">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(t)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => remove(t.id)}>Delete</Button>
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
