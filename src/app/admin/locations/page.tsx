"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Location = { id: string; name: string; stayIds: string[] };
type Stay = { id: string; title: string };

const EMPTY: Location = { id: "", name: "", stayIds: [] };

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Location>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  async function loadLocations() {
    setLoading(true);
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  }

  async function loadStays() {
    try {
      const res = await fetch("/api/stays");
      if (!res.ok) { setStays([]); return; }
      const data = await res.json();
      setStays(Array.isArray(data) ? data : []);
    } catch { setStays([]); }
  }

  useEffect(() => { loadLocations(); loadStays(); }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use lowercase letters, numbers, and hyphens.";
      else if (locations.some((l) => l.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.name)) errs.name = "Name is required.";
    return errs;
  }

  async function createLocation() {
    const v = validateForm(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/locations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { cancelEdit(); await loadLocations(); }
      else { const err = await res.json(); alert(err.error || "Failed to create"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(l: Location) {
    setEditingId(l.id);
    setForm({ ...l });
    setShowForm(true);
  }

  async function updateLocation() {
    if (!editingId) return;
    const v = validateForm(true);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/locations/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rest) });
      if (res.ok) { cancelEdit(); await loadLocations(); }
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

  async function removeLocation(id: string) {
    if (!confirm("Delete this location?")) return;
    const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
    if (res.ok) await loadLocations();
  }

  function toggleStay(stayId: string) {
    setForm((f) => {
      const current = f.stayIds || [];
      return current.includes(stayId)
        ? { ...f, stayIds: current.filter((id) => id !== stayId) }
        : { ...f, stayIds: [...current, stayId] };
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Locations"
        description="Organise stays by location for filtering."
        actions={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>+ New Location</Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        {showForm && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Location" : "New Location"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="field-id" className="text-xs font-bold uppercase tracking-wide text-neutral-700">ID (slug)</Label>
                  <Input
                    id="field-id"
                    placeholder="e.g., anjuna-goa"
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    disabled={editingId !== null}
                    className={errors.id ? "border-red-300" : ""}
                  />
                  {errors.id ? <p className="text-xs text-red-600">{errors.id}</p> : <p className="text-xs text-neutral-400">Lowercase, numbers, hyphens only.</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="field-name" className="text-xs font-bold uppercase tracking-wide text-neutral-700">Name</Label>
                  <Input
                    id="field-name"
                    placeholder="e.g., Anjuna, Goa"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={errors.name ? "border-red-300" : ""}
                  />
                  {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : <p className="text-xs text-neutral-400">Display name shown to users.</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Assign Stays</Label>
                  <div className="border border-neutral-200 rounded-xl p-3 max-h-56 overflow-y-auto space-y-1">
                    {stays.length === 0 ? (
                      <p className="text-sm text-neutral-400">No stays available</p>
                    ) : (
                      stays.map((stay) => (
                        <label key={stay.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-neutral-50 px-2 py-1.5 rounded-lg">
                          <input
                            type="checkbox"
                            checked={form.stayIds.includes(stay.id)}
                            onChange={() => toggleStay(stay.id)}
                            className="w-4 h-4 rounded border-neutral-300 text-[#C07A5A] focus:ring-[#C07A5A]"
                          />
                          <span className="text-sm text-neutral-900 font-bricolage">{stay.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? updateLocation : createLocation} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update" : "Add Location"}
                  </Button>
                  <Button variant="outlineBlack" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No locations yet. Create your first to organise stays.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-neutral-900 font-bricolage">{l.name}</span>
                        <span className="text-[11px] text-neutral-400 font-bricolage bg-neutral-100 px-2 py-0.5 rounded-full">{l.id}</span>
                      </div>
                      <div className="mt-3">
                        <div className="text-[11px] uppercase tracking-wide text-neutral-400 font-bricolage font-semibold mb-2">
                          Stays ({l.stayIds.length})
                        </div>
                        {l.stayIds.length === 0 ? (
                          <span className="text-sm text-neutral-400 font-bricolage">None assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {l.stayIds.map((stayId) => {
                              const stay = stays.find((s) => s.id === stayId);
                              return (
                                <span key={stayId} className="text-xs bg-[#16323C]/8 text-[#16323C] px-2.5 py-1 rounded-full font-bricolage">
                                  {stay?.title || stayId}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(l)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeLocation(l.id)}>Delete</Button>
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
