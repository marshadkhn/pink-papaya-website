"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Stay = {
  id: string;
  title: string;
  imageUrl: string;
  area: string;
  bed: string;
  guests: string;
  description?: string;
  pricePerNight?: string;
  images?: string[];
  amenities?: string[];
};

export default function AdminStaysPage() {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Stay>({
    id: "",
    title: "",
    imageUrl: "",
    area: "",
    bed: "",
    guests: "",
    description: "",
    pricePerNight: "",
    images: [],
    amenities: [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const router = useRouter();

  const formFields: { key: keyof Stay; label: string; placeholder?: string; help?: string }[] = [
    {
      key: "id",
      label: "ID (unique, slug)",
      placeholder: "e.g., garden-suite",
      help: "Use lowercase letters, numbers, and hyphens only; must be unique.",
    },
    {
      key: "title",
      label: "Title",
      placeholder: "e.g., Garden Suite",
      help: "Short, descriptive name for the stay.",
    },
    {
      key: "imageUrl",
      label: "Image URL (optional if uploading)",
      placeholder: "e.g., /uploads/photo.jpg or https://...",
      help: "If you upload a file below, the uploaded image will be used instead.",
    },
    {
      key: "area",
      label: "Area (e.g., 550 sq. ft.)",
      placeholder: "e.g., 550 sq. ft.",
      help: "Include unit, e.g., ‘sq. ft.’",
    },
    {
      key: "bed",
      label: "Bed (e.g., 1 King Bed)",
      placeholder: "e.g., 1 King Bed",
      help: "Mention bed type and count.",
    },
    {
      key: "guests",
      label: "Guests (e.g., 2 Guests)",
      placeholder: "e.g., 2 Guests",
      help: "Max occupancy shown on cards.",
    },
    {
      key: "pricePerNight",
      label: "Price (e.g., $180/night)",
      placeholder: "e.g., $180",
      help: "‘/night’ will be added automatically if missing.",
    },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/stays");
    const data = await res.json();
    setStays(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function normalizePrice(p?: string): string {
    const s = (p ?? "").trim();
    if (!s) return "";
    if (/night/i.test(s)) return s;
    return `${s}${s.endsWith('/') ? '' : '/'}night`;
  }

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;

    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use only lowercase letters, numbers, and hyphens (e.g., garden-suite).";
      else if (stays.some((s) => s.id === form.id)) errs.id = "This ID already exists. Choose a different one.";
    }

    if (!must(form.title)) errs.title = "Title is required.";
    if (!must(form.area)) errs.area = "Area is required.";
    if (!must(form.bed)) errs.bed = "Bed info is required.";
    if (!must(form.guests)) errs.guests = "Guests info is required.";

    // Require either an uploaded main image or an image URL
    if (!form.imageUrl && !file) {
      errs.imageUrl = "Provide an Image URL or upload a file below.";
    }

    // Price is optional; if provided, it should start with a number or $
    if (must(form.pricePerNight)) {
      const p = (form.pricePerNight ?? "").trim();
      if (!/^\$?\d/.test(p)) errs.pricePerNight = "Price should start with a number (optionally with $).";
    }

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

  async function uploadGalleryIfNeeded(): Promise<string[]> {
    if (!galleryFiles.length) return form.images ?? [];
    const urls: string[] = [];
    for (const gf of galleryFiles) {
      const fd = new FormData();
      fd.append("file", gf);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gallery upload failed");
      const { url } = await res.json();
      urls.push(url as string);
    }
    return urls;
  }

  async function createStay() {
    try {
      const v = validateForm(false);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();
      const finalImages = await uploadGalleryIfNeeded();
      const payload = { ...form, pricePerNight: normalizePrice(form.pricePerNight), imageUrl: finalImageUrl, images: finalImages, amenities: form.amenities ?? [] };
      const res = await fetch("/api/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", description: "", pricePerNight: "", images: [], amenities: [] });
        setFile(null);
        setGalleryFiles([]);
        setErrors({});
        await load();
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

  function beginEdit(s: Stay) {
    setEditingId(s.id);
    setForm({
      id: s.id,
      title: s.title,
      imageUrl: s.imageUrl,
      area: s.area,
      bed: s.bed,
      guests: s.guests,
      description: s.description ?? "",
      pricePerNight: s.pricePerNight ?? "",
      images: s.images ?? [],
      amenities: s.amenities ?? [],
    });
    setFile(null);
    setGalleryFiles([]);
  }

  async function updateStay() {
    if (!editingId) return;
    try {
      const v = validateForm(true);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();
      const finalImages = galleryFiles.length ? await uploadGalleryIfNeeded() : (form.images ?? []);
      // Do not allow changing the id during update
      const { id: _omit, ...rest } = form as any;
      const payload = { ...rest, pricePerNight: normalizePrice(form.pricePerNight), imageUrl: finalImageUrl, images: finalImages, amenities: form.amenities ?? [] };
      const res = await fetch(`/api/stays/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", description: "", pricePerNight: "", images: [], amenities: [] });
        setFile(null);
        setGalleryFiles([]);
        setErrors({});
        await load();
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
    setForm({ id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", description: "", pricePerNight: "", images: [], amenities: [] });
    setFile(null);
    setGalleryFiles([]);
    setErrors({});
  }

  async function removeStay(id: string) {
    if (!confirm("Delete this stay?")) return;
    const res = await fetch(`/api/stays/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function logout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <HeaderContent align="left" showCta={false} badgeText="Admin" title="Manage Stays" />
          <Button variant="outlineBlack" onClick={logout}>Logout</Button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-5">
            <Card className="!rounded-none">
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {formFields.map(({ key, label, placeholder, help }) => {
                    const id = `field-${String(key)}`;
                    const hasError = Boolean(errors[key as string]);
                    return (
                      <div key={id} className="space-y-1">
                        <Label htmlFor={id} className="text-neutral-700">{label}</Label>
                        <Input
                          id={id}
                          placeholder={placeholder}
                          value={(form as any)[key] ?? ""}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          disabled={editingId !== null && key === "id"}
                          className={hasError ? "border-destructive focus-visible:ring-destructive" : undefined}
                        />
                        {hasError ? (
                          <div className="text-xs text-red-600">{errors[key as string]}</div>
                        ) : help ? (
                          <div className="text-xs text-neutral-500">{help}</div>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="space-y-1">
                    <Label className="text-neutral-700">Upload Image (optional)</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    <div className="text-xs text-neutral-500">PNG/JPG recommended. If provided, this will override the Image URL above.</div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">Upload Gallery Images (optional, multiple)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
                    />
                    <div className="text-xs text-neutral-500">These images appear in the carousel on the stay page.</div>
                  </div>

                  {/* Amenities multi-select */}
                  <div className="space-y-1">
                    <Label className="text-neutral-700">Amenities (select multiple)</Label>
                    <Select
                      multiple
                      className="min-h-28"
                      value={form.amenities ?? []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                        setForm((f) => ({ ...f, amenities: selected }));
                      }}
                    >
                      {["Garden Patio","Queen Bed","Rain Shower","Breakfast","Meditation Area","Smart TV","Yoga Mat","Tea Set"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Select>
                    <div className="text-xs text-neutral-500">Hold Ctrl/Cmd to select multiple.</div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">Description</Label>
                    <Textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Write 1–2 sentences about the stay..."
                    />
                    <div className="text-xs text-neutral-500">Keep it concise and helpful—this shows near the top of the detail page.</div>
                  </div>

                  {editingId ? (
                    <div className="flex gap-3">
                      <Button variant="black" onClick={updateStay} disabled={submitting}>Update stay</Button>
                      <Button variant="outlineBlack" type="button" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="black" onClick={createStay} disabled={submitting}>Add stay</Button>
                      <Button variant="outlineBlack" type="button" onClick={() => { setForm({ id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", description: "", pricePerNight: "", images: [], amenities: [] }); setFile(null); setGalleryFiles([]); setErrors({}); }} disabled={submitting}>Clear</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                <div>Loading…</div>
              ) : (
                stays.map((s) => (
                  <Card key={s.id} className="!rounded-none overflow-hidden">
                    <div className="relative w-full pt-[60%] bg-neutral-200">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.imageUrl})` }} />
                    </div>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-neutral-600">{s.area} • {s.bed} • {s.guests}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => beginEdit(s)}>Edit</Button>
                          <Button variant="destructive" onClick={() => removeStay(s.id)}>Delete</Button>
                        </div>
                      </div>
                    </CardContent>
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
