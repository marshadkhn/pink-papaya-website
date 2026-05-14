"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PropertyType = { id: string; name: string };

const EMPTY: PropertyType = { id: "", name: "" };

export default function AdminPropertyTypesPage() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<PropertyType>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/property-types");
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setPropertyTypes(Array.isArray(data) ? data : []);
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
      else if (propertyTypes.some((p) => p.id === form.id)) errs.id = "ID already exists.";
    }
    if (!must(form.name)) errs.name = "Name is required.";
    return errs;
  }

  async function create() {
    const v = validate(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/property-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to create"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(p: PropertyType) {
    setEditingId(p.id);
    setForm({ ...p });
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
      const res = await fetch(`/api/property-types/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rest) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err.error || "Failed to update"); }
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
    if (!confirm("Delete this property type?")) return;
    const res = await fetch(`/api/property-types/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Property Types"
        description="Manage property types shown as filter options on the stays page."
        actions={!showForm && <Button onClick={() => setShowForm(true)}>+ New Type</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {showForm && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Property Type" : "New Property Type"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">Cancel</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="pt-id" className="text-xs font-bold uppercase tracking-wide text-neutral-700">ID (slug)</Label>
                  <Input
                    id="pt-id"
                    placeholder="e.g., villas"
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    disabled={editingId !== null}
                    className={errors.id ? "border-red-300" : ""}
                  />
                  {errors.id ? <p className="text-xs text-red-600">{errors.id}</p> : <p className="text-xs text-neutral-400">Lowercase, numbers, hyphens only.</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pt-name" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Name</Label>
                  <Input
                    id="pt-name"
                    placeholder="e.g., Villas"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={errors.name ? "border-red-300" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? update : create} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update" : "Add Type"}
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
          ) : propertyTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No property types yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {propertyTypes.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900 font-bricolage">{p.name}</span>
                      <span className="text-[11px] text-neutral-400 font-bricolage bg-neutral-100 px-2 py-0.5 rounded-full">{p.id}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(p)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>Delete</Button>
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
