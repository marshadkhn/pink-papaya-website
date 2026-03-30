"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Location = {
  id: string;
  name: string;
  stayIds: string[];
};

type Stay = {
  id: string;
  title: string;
};

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Location>({
    id: "",
    name: "",
    stayIds: [],
  });
  const router = useRouter();

  async function loadLocations() {
    setLoading(true);
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("Failed to load locations:", res.status, text);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading locations:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadStays() {
    try {
      const res = await fetch("/api/stays");
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("Failed to load stays:", res.status, text);
        setStays([]);
        return;
      }
      const data = await res.json();
      setStays(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading stays:", e);
      setStays([]);
    }
  }

  useEffect(() => {
    loadLocations();
    loadStays();
  }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;

    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id))
        errs.id = "Use only lowercase letters, numbers, and hyphens (e.g., anjuna-goa).";
      else if (locations.some((l) => l.id === form.id))
        errs.id = "This ID already exists. Choose a different one.";
    }

    if (!must(form.name)) errs.name = "Name is required.";

    return errs;
  }

  async function createLocation() {
    try {
      const v = validateForm(false);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ id: "", name: "", stayIds: [] });
        setErrors({});
        await loadLocations();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create");
      }
    } catch (e: any) {
      alert(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  function beginEdit(l: Location) {
    setEditingId(l.id);
    setForm({ ...l });
  }

  async function updateLocation() {
    if (!editingId) return;
    try {
      const v = validateForm(true);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/locations/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ id: "", name: "", stayIds: [] });
        setErrors({});
        await loadLocations();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update");
      }
    } catch (e: any) {
      alert(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ id: "", name: "", stayIds: [] });
    setErrors({});
  }

  async function removeLocation(id: string) {
    if (!confirm("Delete this location?")) return;
    const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
    if (res.ok) await loadLocations();
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  function toggleStay(stayId: string) {
    setForm((f) => {
      const current = f.stayIds || [];
      if (current.includes(stayId)) {
        return { ...f, stayIds: current.filter((id) => id !== stayId) };
      } else {
        return { ...f, stayIds: [...current, stayId] };
      }
    });
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <HeaderContent
            align="left"
            showCta={false}
            title="Manage Locations"
          />
          <div className="flex gap-2">
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/stays">Manage Stays</Link>
            </Button>
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/blog">Manage Blog</Link>
            </Button>
            <Button variant="outlineBlack" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-5">
            <Card className="rounded-10">
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="field-id" className="text-neutral-700">
                      ID (unique, slug)
                    </Label>
                    <Input
                      id="field-id"
                      placeholder="e.g., anjuna-goa"
                      value={form.id}
                      onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                      disabled={editingId !== null}
                      className={errors.id ? "border-destructive focus-visible:ring-destructive" : undefined}
                    />
                    {errors.id ? (
                      <div className="text-xs text-red-600">{errors.id}</div>
                    ) : (
                      <div className="text-xs text-neutral-500">
                        Use lowercase letters, numbers, and hyphens only; must be unique.
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="field-name" className="text-neutral-700">
                      Name
                    </Label>
                    <Input
                      id="field-name"
                      placeholder="e.g., Anjuna, Goa"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={errors.name ? "border-destructive focus-visible:ring-destructive" : undefined}
                    />
                    {errors.name ? (
                      <div className="text-xs text-red-600">{errors.name}</div>
                    ) : (
                      <div className="text-xs text-neutral-500">Display name shown to users.</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">Assign Stays to this Location</Label>
                    <div className="border border-neutral-200 rounded-[10px] p-4 max-h-64 overflow-y-auto space-y-2">
                      {stays.length === 0 ? (
                        <div className="text-sm text-neutral-500">No stays available</div>
                      ) : (
                        stays.map((stay) => (
                          <label
                            key={stay.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={form.stayIds.includes(stay.id)}
                              onChange={() => toggleStay(stay.id)}
                              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-neutral-900">{stay.title}</span>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Select which stays belong to this location.
                    </div>
                  </div>

                  {editingId ? (
                    <div className="flex gap-3">
                      <Button variant="black" onClick={updateLocation} disabled={submitting}>
                        Update Location
                      </Button>
                      <Button variant="outlineBlack" type="button" onClick={cancelEdit} disabled={submitting}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="black" onClick={createLocation} disabled={submitting}>
                        Add Location
                      </Button>
                      <Button
                        variant="outlineBlack"
                        type="button"
                        onClick={() => {
                          setForm({ id: "", name: "", stayIds: [] });
                          setErrors({});
                        }}
                        disabled={submitting}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div>Loading…</div>
              ) : locations.length === 0 ? (
                <div className="text-center py-12 text-neutral-600">
                  No locations yet. Create your first location to organize stays.
                </div>
              ) : (
                locations.map((l) => (
                  <Card key={l.id} className="rounded-[14px] border border-neutral-200">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-playfair text-xl leading-tight text-neutral-900">{l.name}</div>
                          <div className="mt-1 text-xs text-neutral-500">ID: {l.id}</div>
                          <div className="mt-3">
                            <div className="text-sm font-semibold text-neutral-700 mb-2">
                              Assigned Stays ({l.stayIds.length}):
                            </div>
                            {l.stayIds.length === 0 ? (
                              <div className="text-sm text-neutral-500">No stays assigned yet</div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {l.stayIds.map((stayId) => {
                                  const stay = stays.find((s) => s.id === stayId);
                                  return (
                                    <span
                                      key={stayId}
                                      className="px-3 py-1 bg-neutral-100 text-neutral-900 text-xs rounded-full"
                                    >
                                      {stay?.title || stayId}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button variant="outline" onClick={() => beginEdit(l)}>
                            Edit
                          </Button>
                          <Button variant="destructive" onClick={() => removeLocation(l.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
