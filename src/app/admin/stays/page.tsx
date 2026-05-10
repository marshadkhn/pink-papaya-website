"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { stayCategories } from "@/data/stays";
import { formatPriceString } from "@/utils/formatCurrency";

type Stay = {
  id: string; title: string; imageUrl: string; area: string; bed: string;
  guests: string; category?: string; description?: string; pricePerNight?: string;
  images?: string[]; amenities?: string[]; location?: string; aboutContent?: string;
  locationMapUrl?: string; nearbyPlaces?: { name: string; distance: string }[];
  faqs?: { question: string; answer: string }[];
};

const EMPTY: Stay = {
  id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", category: "",
  description: "", pricePerNight: "", images: [], amenities: [], location: "",
  aboutContent: "", locationMapUrl: "", nearbyPlaces: [], faqs: [],
};

export default function AdminStaysPage() {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Stay>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [nearbyPlaceName, setNearbyPlaceName] = useState("");
  const [nearbyPlaceDistance, setNearbyPlaceDistance] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);

  const formFields: { key: keyof Stay; label: string; placeholder?: string; help?: string }[] = [
    { key: "id", label: "ID (slug)", placeholder: "e.g., garden-suite", help: "Lowercase, numbers, hyphens only." },
    { key: "title", label: "Title", placeholder: "e.g., Garden Suite" },
    { key: "imageUrl", label: "Main Image URL", placeholder: "https://… or /uploads/…", help: "Optional if uploading below." },
    { key: "area", label: "Area", placeholder: "e.g., 550 sq. ft." },
    { key: "bed", label: "Bed", placeholder: "e.g., 1 King Bed" },
    { key: "guests", label: "Guests", placeholder: "e.g., 2 Guests" },
    { key: "location", label: "Location", placeholder: "e.g., Anjuna, Goa" },
    { key: "pricePerNight", label: "Price per Night", placeholder: "e.g., ₹18,000", help: "'/night' added automatically." },
  ];

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/stays");
      if (!res.ok) { setLoading(false); return; }
      setStays(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function normalizePrice(p?: string): string {
    const s = (p ?? "").trim();
    if (!s) return "";
    if (/night/i.test(s)) return s;
    return `${s}${s.endsWith("/") ? "" : "/"}night`;
  }

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use lowercase letters, numbers, and hyphens.";
      else if (stays.some((s) => s.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.title)) errs.title = "Title is required.";
    if (!must(form.area)) errs.area = "Area is required.";
    if (!must(form.bed)) errs.bed = "Bed info is required.";
    if (!must(form.guests)) errs.guests = "Guests info is required.";
    if (!must(form.category)) errs.category = "Category is required.";
    if (!form.imageUrl && !file) errs.imageUrl = "Provide an Image URL or upload a file.";
    if (must(form.pricePerNight) && !/^\$?₹?\d/.test((form.pricePerNight ?? "").trim()))
      errs.pricePerNight = "Price should start with a number.";
    return errs;
  }

  async function uploadIfNeeded(): Promise<string> {
    if (!file) return form.imageUrl;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).url as string;
  }

  async function uploadGalleryIfNeeded(): Promise<string[]> {
    if (!galleryFiles.length) return form.images ?? [];
    const urls: string[] = [];
    for (const gf of galleryFiles) {
      const fd = new FormData(); fd.append("file", gf);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gallery upload failed");
      urls.push((await res.json()).url as string);
    }
    return urls;
  }

  async function createStay() {
    const v = validateForm(false);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalImageUrl = await uploadIfNeeded();
      const finalImages = await uploadGalleryIfNeeded();
      const res = await fetch("/api/stays", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, pricePerNight: normalizePrice(form.pricePerNight), imageUrl: finalImageUrl, images: finalImages, amenities: form.amenities ?? [] }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err?.error || "Failed to create"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function beginEdit(s: Stay) {
    setEditingId(s.id);
    setForm({ ...s, category: s.category ?? "", description: s.description ?? "", pricePerNight: s.pricePerNight ?? "", images: s.images ?? [], amenities: s.amenities ?? [], location: s.location ?? "", aboutContent: s.aboutContent ?? "", locationMapUrl: s.locationMapUrl ?? "", nearbyPlaces: s.nearbyPlaces ?? [], faqs: s.faqs ?? [] });
    setFile(null); setGalleryFiles([]);
    setShowForm(true);
  }

  async function updateStay() {
    if (!editingId) return;
    const v = validateForm(true);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalImageUrl = await uploadIfNeeded();
      const finalImages = galleryFiles.length ? await uploadGalleryIfNeeded() : form.images ?? [];
      const { id: _omit, ...rest } = form as any;
      const res = await fetch(`/api/stays/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rest, pricePerNight: normalizePrice(form.pricePerNight), imageUrl: finalImageUrl, images: finalImages, amenities: form.amenities ?? [] }) });
      if (res.ok) { cancelEdit(); await load(); }
      else { const err = await res.json(); alert(err?.error || "Failed to update"); }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
  }

  function cancelEdit() {
    setEditingId(null); setForm(EMPTY);
    setFile(null); setGalleryFiles([]);
    setErrors({}); setShowForm(false);
  }

  async function removeStay(id: string) {
    if (!confirm("Delete this stay?")) return;
    const res = await fetch(`/api/stays/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  function addAmenity() {
    const v = amenityInput.trim();
    if (!v || (form.amenities ?? []).includes(v)) { setAmenityInput(""); return; }
    setForm((f) => ({ ...f, amenities: [...(f.amenities ?? []), v] }));
    setAmenityInput("");
  }

  function addNearbyPlace() {
    if (!nearbyPlaceName || !nearbyPlaceDistance) return;
    setForm((f) => ({ ...f, nearbyPlaces: [...(f.nearbyPlaces ?? []), { name: nearbyPlaceName, distance: nearbyPlaceDistance }] }));
    setNearbyPlaceName(""); setNearbyPlaceDistance("");
  }

  function addFaq() {
    if (!faqQuestion || !faqAnswer) return;
    setForm((f) => ({ ...f, faqs: [...(f.faqs ?? []), { question: faqQuestion, answer: faqAnswer }] }));
    setFaqQuestion(""); setFaqAnswer("");
  }

  return (
    <>
      <AdminPageHeader
        title="Stays"
        description="Add, edit, or remove stay listings."
        actions={!showForm && <Button onClick={() => setShowForm(true)}>+ New Stay</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        {showForm && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 font-bricolage">
                  {editingId ? "Edit Stay" : "New Stay"}
                </h2>
                <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 text-sm font-bricolage">Cancel</button>
              </div>

              <div className="space-y-5">
                {/* Basic fields */}
                <div className="space-y-4">
                  {formFields.map(({ key, label, placeholder, help }) => (
                    <div key={String(key)} className="space-y-1">
                      <Label htmlFor={`sf-${String(key)}`} className="text-xs font-bold uppercase tracking-wide text-neutral-700">{label}</Label>
                      <Input
                        id={`sf-${String(key)}`}
                        placeholder={placeholder}
                        value={(form as any)[key] ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        disabled={editingId !== null && key === "id"}
                        className={errors[key as string] ? "border-red-300" : ""}
                      />
                      {errors[key as string] ? <p className="text-xs text-red-600">{errors[key as string]}</p> : help ? <p className="text-xs text-neutral-400">{help}</p> : null}
                    </div>
                  ))}

                  {/* Category */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Category</Label>
                    <Select value={form.category ?? ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                      <option value="">Choose a category</option>
                      {stayCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
                  </div>

                  {/* Image upload */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Upload Main Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Upload Gallery Images</Label>
                    <Input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))} />
                    <p className="text-xs text-neutral-400">Appear in the carousel on the stay page.</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Amenities</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Pool, WiFi"
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                    />
                    <Button type="button" variant="outlineBlack" onClick={addAmenity}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.amenities ?? []).map((a) => (
                      <span key={a} className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-full font-bricolage">
                        {a}
                        <button onClick={() => setForm((f) => ({ ...f, amenities: (f.amenities ?? []).filter((x) => x !== a) }))} className="text-neutral-400 hover:text-red-500 leading-none">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Short Description</Label>
                    <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="1–2 sentences for the card…" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">About Content</Label>
                    <Textarea rows={5} value={form.aboutContent} onChange={(e) => setForm((f) => ({ ...f, aboutContent: e.target.value }))} placeholder="Detailed description for the About section…" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Google Maps Embed URL</Label>
                    <Input placeholder="https://www.google.com/maps/embed?…" value={form.locationMapUrl} onChange={(e) => setForm((f) => ({ ...f, locationMapUrl: e.target.value }))} />
                  </div>
                </div>

                {/* Nearby Places */}
                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Nearby Places</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Place name" value={nearbyPlaceName} onChange={(e) => setNearbyPlaceName(e.target.value)} />
                    <Input placeholder="Distance" value={nearbyPlaceDistance} onChange={(e) => setNearbyPlaceDistance(e.target.value)} />
                  </div>
                  <Button type="button" variant="outlineBlack" onClick={addNearbyPlace} className="w-full">Add Place</Button>
                  <div className="space-y-1.5">
                    {(form.nearbyPlaces ?? []).map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-neutral-50 px-3 py-2 rounded-lg text-sm font-bricolage">
                        <span>{p.name} — {p.distance}</span>
                        <button className="text-red-400 hover:text-red-600 text-xs" onClick={() => setForm((f) => ({ ...f, nearbyPlaces: (f.nearbyPlaces ?? []).filter((_, i) => i !== idx) }))}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">FAQs</Label>
                  <Input placeholder="Question" value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} />
                  <Textarea placeholder="Answer" value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} rows={2} />
                  <Button type="button" variant="outlineBlack" onClick={addFaq} className="w-full">Add FAQ</Button>
                  <div className="space-y-2">
                    {(form.faqs ?? []).map((faq, idx) => (
                      <div key={idx} className="bg-neutral-50 px-3 py-2.5 rounded-lg text-sm font-bricolage">
                        <div className="font-semibold text-neutral-800">{faq.question}</div>
                        <div className="text-neutral-500 mt-0.5">{faq.answer}</div>
                        <button className="text-red-400 hover:text-red-600 text-xs mt-1" onClick={() => setForm((f) => ({ ...f, faqs: (f.faqs ?? []).filter((_, i) => i !== idx) }))}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <Button variant="black" onClick={editingId ? updateStay : createStay} disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : editingId ? "Update Stay" : "Add Stay"}
                  </Button>
                  <Button variant="outlineBlack" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className={showForm ? "lg:col-span-7" : "lg:col-span-12"}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
          ) : stays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-400 font-bricolage text-sm">No stays yet. Add your first one.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${showForm ? "sm:grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"} gap-4`}>
              {stays.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden">
                  <div className="relative w-full pt-[62%] bg-neutral-100">
                    <div className="absolute inset-0 bg-cover bg-center" data-bg={`url(${s.imageUrl})`} />
                    {s.category && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] uppercase tracking-wide font-semibold bg-white/90 text-neutral-700 px-2 py-0.5 rounded-full font-bricolage">
                          {s.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-neutral-900 font-bricolage leading-tight">{s.title}</div>
                    <div className="mt-0.5 text-xs text-[#C07A5A] font-bricolage font-medium">{s.location || "Goa"}</div>
                    <div className="mt-1.5 text-xs text-neutral-400 font-bricolage">{s.area} · {s.bed} · {s.guests}</div>
                    {s.pricePerNight && (
                      <div className="mt-1 text-sm font-semibold text-neutral-800 font-bricolage">
                        From {formatPriceString(s.pricePerNight)}/night
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => beginEdit(s)} className="flex-1">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeStay(s.id)} className="flex-1">Delete</Button>
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
