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
import Link from "next/link";

type InteriorProject = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  badge?: string;
  headline?: string;
  tagline?: string;
  longDescription?: string[];
  photos?: string[];
  beforeAfter?: string[];
};

export default function AdminInteriorPage() {
  const [projects, setProjects] = useState<InteriorProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<InteriorProject>({
    id: "",
    title: "",
    imageUrl: "",
    description: "",
    badge: "",
    headline: "",
    tagline: "",
    longDescription: [],
    photos: [],
    beforeAfter: [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [longDescParagraphs, setLongDescParagraphs] = useState("");
  const router = useRouter();

  const formFields: {
    key: keyof InteriorProject;
    label: string;
    placeholder?: string;
    help?: string;
  }[] = [
    {
      key: "id",
      label: "ID (unique, slug)",
      placeholder: "e.g., coastal-calm",
      help: "Use lowercase letters, numbers, and hyphens only; must be unique.",
    },
    {
      key: "title",
      label: "Title",
      placeholder: "e.g., Coastal Calm",
      help: "Short, descriptive name for the project.",
    },
    {
      key: "imageUrl",
      label: "Main Image URL (optional if uploading)",
      placeholder: "e.g., /uploads/photo.jpg or https://...",
      help: "If you upload a file below, the uploaded image will be used instead.",
    },
    {
      key: "description",
      label: "Card Description",
      placeholder: "Short description for the card...",
      help: "Shows on the card on the interior page (optional).",
    },
    {
      key: "badge",
      label: "Badge (detail page)",
      placeholder: "e.g., JUMEIRAH PARKS",
      help: "Small badge shown at the top of the detail page.",
    },
    {
      key: "headline",
      label: "Headline (detail page)",
      placeholder: "e.g., THE SOFT EDIT",
      help: "Large title on the detail page.",
    },
    {
      key: "tagline",
      label: "Tagline (detail page)",
      placeholder: "e.g., Neutral, airy, and organic design",
      help: "Subtitle below the headline.",
    },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/interior");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;

    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id))
        errs.id =
          "Use only lowercase letters, numbers, and hyphens (e.g., coastal-calm).";
      else if (projects.some((p) => p.id === form.id))
        errs.id = "This ID already exists. Choose a different one.";
    }

    if (!must(form.title)) errs.title = "Title is required.";

    // Require either an uploaded main image or an image URL
    if (!form.imageUrl && !file) {
      errs.imageUrl = "Provide an Image URL or upload a file below.";
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
      const fd = new FormData();
      fd.append("file", beforeFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Before image upload failed");
      const { url } = await res.json();
      urls.push(url as string);
    }
    if (afterFile) {
      const fd = new FormData();
      fd.append("file", afterFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("After image upload failed");
      const { url } = await res.json();
      urls.push(url as string);
    }
    return urls.length === 2 ? urls : form.beforeAfter ?? [];
  }

  async function createProject() {
    try {
      const v = validateForm(false);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();
      const finalPhotos = await uploadPhotosIfNeeded();
      const finalBeforeAfter = await uploadBeforeAfterIfNeeded();
      const longDesc = longDescParagraphs
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);
      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        photos: finalPhotos,
        beforeAfter: finalBeforeAfter,
        longDescription: longDesc,
      };
      const res = await fetch("/api/interior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({
          id: "",
          title: "",
          imageUrl: "",
          description: "",
          badge: "",
          headline: "",
          tagline: "",
          longDescription: [],
          photos: [],
          beforeAfter: [],
        });
        setFile(null);
        setPhotoFiles([]);
        setBeforeFile(null);
        setAfterFile(null);
        setLongDescParagraphs("");
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

  function beginEdit(p: InteriorProject) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
      description: p.description ?? "",
      badge: p.badge ?? "",
      headline: p.headline ?? "",
      tagline: p.tagline ?? "",
      longDescription: p.longDescription ?? [],
      photos: p.photos ?? [],
      beforeAfter: p.beforeAfter ?? [],
    });
    setFile(null);
    setPhotoFiles([]);
    setBeforeFile(null);
    setAfterFile(null);
    setLongDescParagraphs((p.longDescription ?? []).join("\n\n"));
  }

  async function updateProject() {
    if (!editingId) return;
    try {
      const v = validateForm(true);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();
      const finalPhotos = photoFiles.length
        ? await uploadPhotosIfNeeded()
        : form.photos ?? [];
      const finalBeforeAfter =
        beforeFile || afterFile
          ? await uploadBeforeAfterIfNeeded()
          : form.beforeAfter ?? [];
      const longDesc = longDescParagraphs
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);
      // Do not allow changing the id during update
      const { id: _omit, ...rest } = form as any;
      const payload = {
        ...rest,
        imageUrl: finalImageUrl,
        photos: finalPhotos,
        beforeAfter: finalBeforeAfter,
        longDescription: longDesc,
      };
      const res = await fetch(`/api/interior/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({
          id: "",
          title: "",
          imageUrl: "",
          description: "",
          badge: "",
          headline: "",
          tagline: "",
          longDescription: [],
          photos: [],
          beforeAfter: [],
        });
        setFile(null);
        setPhotoFiles([]);
        setBeforeFile(null);
        setAfterFile(null);
        setLongDescParagraphs("");
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
    setForm({
      id: "",
      title: "",
      imageUrl: "",
      description: "",
      badge: "",
      headline: "",
      tagline: "",
      longDescription: [],
      photos: [],
      beforeAfter: [],
    });
    setFile(null);
    setPhotoFiles([]);
    setBeforeFile(null);
    setAfterFile(null);
    setLongDescParagraphs("");
    setErrors({});
  }

  async function removeProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/interior/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <HeaderContent
            align="left"
            showCta={false}
            title="Manage Interior Projects"
          />
          <div className="flex gap-2">
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/interior-testimonials">Manage Testimonials</Link>
            </Button>
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/stays">Manage Stays</Link>
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
                  {formFields.map(({ key, label, placeholder, help }) => {
                    const id = `field-${String(key)}`;
                    const hasError = Boolean(errors[key as string]);
                    return (
                      <div key={id} className="space-y-1">
                        <Label htmlFor={id} className="text-neutral-700">
                          {label}
                        </Label>
                        <Input
                          id={id}
                          placeholder={placeholder}
                          value={(form as any)[key] ?? ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                          disabled={editingId !== null && key === "id"}
                          className={
                            hasError
                              ? "border-destructive focus-visible:ring-destructive"
                              : undefined
                          }
                        />
                        {hasError ? (
                          <div className="text-xs text-red-600">
                            {errors[key as string]}
                          </div>
                        ) : help ? (
                          <div className="text-xs text-neutral-500">{help}</div>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="space-y-1">
                    <Label className="text-neutral-700">
                      Upload Main Image (optional)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-neutral-500">
                      PNG/JPG recommended. If provided, this will override the
                      Image URL above.
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">
                      Long Description (detail page, multiple paragraphs)
                    </Label>
                    <Textarea
                      rows={6}
                      value={longDescParagraphs}
                      onChange={(e) => setLongDescParagraphs(e.target.value)}
                      placeholder="Write multiple paragraphs separated by blank lines..."
                    />
                    <div className="text-xs text-neutral-500">
                      Separate paragraphs with a blank line (press Enter twice).
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">
                      Upload Gallery Photos (optional, multiple)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setPhotoFiles(Array.from(e.target.files ?? []))
                      }
                    />
                    <div className="text-xs text-neutral-500">
                      These images appear in the &quot;All Photos&quot; section on the detail page.
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">
                      Before Image (optional)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-neutral-500">
                      Upload a &quot;before&quot; image for the Before & After section.
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">
                      After Image (optional)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-neutral-500">
                      Upload an &quot;after&quot; image for the Before & After section.
                    </div>
                  </div>

                  {editingId ? (
                    <div className="flex gap-3">
                      <Button
                        variant="black"
                        onClick={updateProject}
                        disabled={submitting}
                      >
                        Update project
                      </Button>
                      <Button
                        variant="outlineBlack"
                        type="button"
                        onClick={cancelEdit}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="black"
                        onClick={createProject}
                        disabled={submitting}
                      >
                        Add project
                      </Button>
                      <Button
                        variant="outlineBlack"
                        type="button"
                        onClick={() => {
                          setForm({
                            id: "",
                            title: "",
                            imageUrl: "",
                            description: "",
                            badge: "",
                            headline: "",
                            tagline: "",
                            longDescription: [],
                            photos: [],
                            beforeAfter: [],
                          });
                          setFile(null);
                          setPhotoFiles([]);
                          setBeforeFile(null);
                          setAfterFile(null);
                          setLongDescParagraphs("");
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                <div>Loading…</div>
              ) : (
                projects.map((p) => (
                  <Card
                    key={p.id}
                    className="rounded-[14px] overflow-hidden border border-neutral-200"
                  >
                    <div className="relative w-full pt-[140%] bg-neutral-200">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        data-bg={`url(${p.imageUrl})`}
                      />
                    </div>
                    <div className="border-t border-neutral-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-playfair text-lg leading-tight">
                            {p.title}
                          </div>
                          {p.description ? (
                            <p className="mt-1 text-sm text-neutral-700 line-clamp-2">
                              {p.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button variant="outline" onClick={() => beginEdit(p)}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => removeProject(p.id)}
                          >
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
