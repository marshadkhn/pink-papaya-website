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

type InteriorFeedbackItem = {
  id: string;
  name: string;
  avatar: string;
  text: string;
  role?: string;
};

export default function AdminInteriorTestimonialsPage() {
  const [feedbacks, setFeedbacks] = useState<InteriorFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<InteriorFeedbackItem>({
    id: "",
    name: "",
    avatar: "",
    text: "",
    role: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const formFields: {
    key: keyof InteriorFeedbackItem;
    label: string;
    placeholder?: string;
    help?: string;
  }[] = [
    {
      key: "id",
      label: "ID (unique)",
      placeholder: "e.g., if1",
      help: "Use lowercase letters and numbers; must be unique.",
    },
    {
      key: "name",
      label: "Name",
      placeholder: "e.g., Elena Park",
      help: "Client name.",
    },
    {
      key: "role",
      label: "Role (optional)",
      placeholder: "e.g., Residential Client",
      help: "Role or category of the client.",
    },
    {
      key: "avatar",
      label: "Avatar URL (optional if uploading)",
      placeholder: "e.g., /uploads/photo.jpg",
      help: "If you upload a file below, the uploaded image will be used instead.",
    },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/interior-feedback");
    const data = await res.json();
    setFeedbacks(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function validateForm(isEdit: boolean): Record<string, string> {
    const errs: Record<string, string> = {};
    const must = (val?: string) => (val ?? "").trim().length > 0;

    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (feedbacks.some((f) => f.id === form.id))
        errs.id = "This ID already exists. Choose a different one.";
    }

    if (!must(form.name)) errs.name = "Name is required.";
    if (!must(form.text)) errs.text = "Testimonial text is required.";

    // Require either an uploaded avatar or an avatar URL
    if (!form.avatar && !file) {
      errs.avatar = "Provide an Avatar URL or upload a file below.";
    }

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
    try {
      const v = validateForm(false);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalAvatarUrl = await uploadIfNeeded();
      const payload = {
        ...form,
        avatar: finalAvatarUrl,
      };
      const res = await fetch("/api/interior-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({
          id: "",
          name: "",
          avatar: "",
          text: "",
          role: "",
        });
        setFile(null);
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

  function beginEdit(f: InteriorFeedbackItem) {
    setEditingId(f.id);
    setForm({
      id: f.id,
      name: f.name,
      avatar: f.avatar,
      text: f.text,
      role: f.role ?? "",
    });
    setFile(null);
  }

  async function updateFeedback() {
    if (!editingId) return;
    try {
      const v = validateForm(true);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalAvatarUrl = await uploadIfNeeded();
      // Do not allow changing the id during update
      const { id: _omit, ...rest } = form as any;
      const payload = {
        ...rest,
        avatar: finalAvatarUrl,
      };
      const res = await fetch(`/api/interior-feedback/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({
          id: "",
          name: "",
          avatar: "",
          text: "",
          role: "",
        });
        setFile(null);
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
      name: "",
      avatar: "",
      text: "",
      role: "",
    });
    setFile(null);
    setErrors({});
  }

  async function removeFeedback(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/interior-feedback/${id}`, {
      method: "DELETE",
    });
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
            title="Manage Interior Testimonials"
          />
          <div className="flex gap-2">
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/interior">Manage Projects</Link>
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
                      Upload Avatar (optional)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-neutral-500">
                      PNG/JPG recommended. If provided, this will override the
                      Avatar URL above.
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-neutral-700">Testimonial Text</Label>
                    <Textarea
                      rows={4}
                      value={form.text}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, text: e.target.value }))
                      }
                      placeholder="Write the testimonial text..."
                    />
                    {errors.text ? (
                      <div className="text-xs text-red-600">{errors.text}</div>
                    ) : (
                      <div className="text-xs text-neutral-500">
                        Keep it concise—this shows on the card.
                      </div>
                    )}
                  </div>

                  {editingId ? (
                    <div className="flex gap-3">
                      <Button
                        variant="black"
                        onClick={updateFeedback}
                        disabled={submitting}
                      >
                        Update testimonial
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
                        onClick={createFeedback}
                        disabled={submitting}
                      >
                        Add testimonial
                      </Button>
                      <Button
                        variant="outlineBlack"
                        type="button"
                        onClick={() => {
                          setForm({
                            id: "",
                            name: "",
                            avatar: "",
                            text: "",
                            role: "",
                          });
                          setFile(null);
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
                feedbacks.map((f) => (
                  <Card
                    key={f.id}
                    className="rounded-[14px] overflow-hidden border border-neutral-200"
                  >
                    <div className="relative w-full pt-[100%] bg-neutral-200">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        data-bg={`url(${f.avatar})`}
                      />
                    </div>
                    <div className="border-t border-neutral-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-neutral-900">
                            {f.name}
                          </div>
                          {f.role ? (
                            <div className="text-xs text-neutral-500">
                              {f.role}
                            </div>
                          ) : null}
                          <p className="mt-1 text-sm text-neutral-700">
                            {f.text}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button variant="outline" onClick={() => beginEdit(f)}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => removeFeedback(f.id)}
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
