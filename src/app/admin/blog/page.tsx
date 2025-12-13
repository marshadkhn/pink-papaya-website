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

type BlogPost = {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BlogPost>({
    id: "",
    title: "",
    imageUrl: "",
    author: "",
    date: "",
    excerpt: "",
    content: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const formFields: {
    key: keyof BlogPost;
    label: string;
    placeholder?: string;
    help?: string;
    type?: string;
  }[] = [
    {
      key: "id",
      label: "ID (unique, slug)",
      placeholder: "e.g., my-first-post",
      help: "Use lowercase letters, numbers, and hyphens only.",
    },
    { key: "title", label: "Title", placeholder: "e.g., My First Blog Post" },
    {
      key: "imageUrl",
      label: "Image URL (optional if uploading)",
      placeholder: "e.g., /uploads/blog-image.jpg",
    },
    { key: "author", label: "Author", placeholder: "e.g., Jane Doe" },
    { key: "date", label: "Date", placeholder: "e.g., September 26, 2025" },
    {
      key: "excerpt",
      label: "Excerpt",
      placeholder: "A short summary of the post.",
      type: "textarea",
    },
    {
      key: "content",
      label: "Full Content",
      placeholder:
        "Write the full blog post here. Use empty lines to separate paragraphs.",
      type: "textarea",
      help: "Use empty lines to create new paragraphs.",
    },
  ];

  async function load() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data);
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
        errs.id = "Use only lowercase letters, numbers, and hyphens.";
      else if (posts.some((p) => p.id === form.id))
        errs.id = "This ID already exists.";
    }

    if (!must(form.title)) errs.title = "Title is required.";
    if (!must(form.author)) errs.author = "Author is required.";
    if (!must(form.date)) errs.date = "Date is required.";
    if (!must(form.excerpt)) errs.excerpt = "Excerpt is required.";
    if (!must(form.content)) errs.content = "Content is required.";
    if (!form.imageUrl && !file)
      errs.imageUrl = "Provide an Image URL or upload a file.";

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

  async function handleSubmit(isEdit: boolean) {
    try {
      const v = validateForm(isEdit);
      setErrors(v);
      if (Object.keys(v).length) return;
      setSubmitting(true);
      const finalImageUrl = await uploadIfNeeded();

      const payload = { ...form, imageUrl: finalImageUrl };
      const url = isEdit ? `/api/blog/${editingId}` : "/api/blog";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cancelEdit(); // Resets form and state
        await load();
      } else {
        const err = await res.json();
        alert(err.error || `Failed to ${isEdit ? "update" : "create"}`);
      }
    } catch (e: any) {
      alert(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  function beginEdit(p: BlogPost) {
    setEditingId(p.id);
    setForm(p);
    setFile(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      id: "",
      title: "",
      imageUrl: "",
      author: "",
      date: "",
      excerpt: "",
      content: "",
    });
    setFile(null);
    setErrors({});
  }

  async function removePost(id: string) {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <HeaderContent
            align="left"
            showCta={false}
            title="Manage Blog"
          />
          <div className="flex gap-2">
            <Button variant="outlineBlack" asChild>
              <Link href="/admin/stays">Manage Stays</Link>
            </Button>
            <Button
              variant="outlineBlack"
              onClick={() => router.push("/login")}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-5">
            <Card className="rounded-10">
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {formFields.map(({ key, label, placeholder, help, type }) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-neutral-700">
                        {label}
                      </Label>
                      {type === "textarea" ? (
                        <Textarea
                          id={key}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                          rows={key === "content" ? 8 : 3}
                          className={
                            errors[key]
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                      ) : (
                        <Input
                          id={key}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [key]: e.target.value }))
                          }
                          disabled={editingId !== null && key === "id"}
                          className={
                            errors[key]
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                      )}
                      {errors[key] ? (
                        <div className="text-xs text-red-600">
                          {errors[key]}
                        </div>
                      ) : help ? (
                        <div className="text-xs text-neutral-500">{help}</div>
                      ) : null}
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-neutral-700">Featured Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  {editingId ? (
                    <div className="flex gap-3">
                      <Button
                        variant="black"
                        onClick={() => handleSubmit(true)}
                        disabled={submitting}
                      >
                        Update Post
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
                    <Button
                      variant="black"
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}
                    >
                      Add Post
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Post List */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                <div>Loading…</div>
              ) : (
                posts.map((p) => (
                  <Card key={p.id} className="rounded-10 overflow-hidden">
                    <div className="relative w-full pt-[60%] bg-neutral-200">
                      <div
                          className="absolute inset-0 bg-cover bg-center"
                          data-bg={`url(${p.imageUrl})`}
                        />
                    </div>
                    <CardContent>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-neutral-600">
                        {p.author} • {p.date}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => beginEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePost(p.id)}
                        >
                          Delete
                        </Button>
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
