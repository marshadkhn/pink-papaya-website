"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import NextImage from "next/image";
import { Stay, Collection, PropertyType } from "@/app/admin/stays/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const EMPTY: Stay = {
  id: "", title: "", imageUrl: "", area: "", bed: "", guests: "", category: "", propertyType: "",
  description: "", pricePerNight: "", images: [], amenities: [], location: "",
  aboutContent: "", locationMapUrl: "", nearbyPlaces: [], faqs: [], featuredOnHome: false,
};

export default function StayForm({ initialData }: { initialData?: Stay }) {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Stay>(initialData ?? EMPTY);
  const [allImages, setAllImages] = useState<string[]>(() => {
    const arr = [];
    if (initialData?.imageUrl) arr.push(initialData.imageUrl);
    if (initialData?.images) arr.push(...initialData.images);
    return arr;
  });
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [amenityInput, setAmenityInput] = useState("");
  const [nearbyPlaceName, setNearbyPlaceName] = useState("");
  const [nearbyPlaceDistance, setNearbyPlaceDistance] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [allStays, setAllStays] = useState<Stay[]>([]);

  const isEdit = !!initialData;

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

  async function loadData() {
    try {
      const [colsRes, ptsRes, staysRes] = await Promise.all([
        fetch("/api/collections"),
        fetch("/api/property-types"),
        fetch("/api/stays")
      ]);
      if (colsRes.ok) setCollections(await colsRes.json());
      if (ptsRes.ok) setPropertyTypes(await ptsRes.json());
      if (staysRes.ok) setAllStays(await staysRes.json());
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  function normalizePrice(p?: string): string {
    const s = (p ?? "").trim();
    if (!s) return "";
    if (/night/i.test(s)) return s;
    return `${s}${s.endsWith("/") ? "" : "/"}night`;
  }

  function validateForm(): Record<string, string> {
    const errs: Record<string, string> = {};
    const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const must = (val?: string) => (val ?? "").trim().length > 0;
    if (!isEdit) {
      if (!must(form.id)) errs.id = "ID is required.";
      else if (!slugRe.test(form.id)) errs.id = "Use lowercase letters, numbers, and hyphens.";
      else if (allStays.some((s) => s.id === form.id)) errs.id = "This ID already exists.";
    }
    if (!must(form.title)) errs.title = "Title is required.";
    if (!must(form.area)) errs.area = "Area is required.";
    if (!must(form.bed)) errs.bed = "Bed info is required.";
    if (!must(form.guests)) errs.guests = "Guests info is required.";
    if (!must(form.category)) errs.category = "Category is required.";
    if (allImages.length === 0) errs.imageUrl = "Provide at least one image.";
    if (must(form.pricePerNight) && !/^\$?₹?\d/.test((form.pricePerNight ?? "").trim()))
      errs.pricePerNight = "Price should start with a number.";
    return errs;
  }

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, dropIdx: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    
    setAllImages(prev => {
      const newArr = [...prev];
      const [movedItem] = newArr.splice(draggedIdx, 1);
      newArr.splice(dropIdx, 0, movedItem);
      return newArr;
    });
    setDraggedIdx(null);
  }

  async function handleFileUpload(files: FileList | File[]) {
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const fd = new FormData(); fd.append("file", f);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        urls.push((await res.json()).url as string);
      }
      setAllImages(prev => [...prev, ...urls]);
      if (galleryFileRef.current) galleryFileRef.current.value = "";
    } catch (e: any) { alert(e?.message ?? "Upload failed"); }
    finally { setGalleryUploading(false); }
  }

  async function handleSubmit() {
    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const finalImageUrl = allImages[0] || "";
      const finalGallery = allImages.slice(1);
      const { id: _omit, ...rest } = form as any;
      const url = isEdit ? `/api/stays/${initialData.id}` : "/api/stays";
      const method = isEdit ? "PATCH" : "POST";
      const body = { 
        ...rest, 
        pricePerNight: normalizePrice(form.pricePerNight), 
        imageUrl: finalImageUrl, 
        images: finalGallery, 
        amenities: form.amenities ?? [] 
      };

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        router.push("/admin/stays");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err?.error || "Failed to save");
      }
    } catch (e: any) { alert(e?.message ?? "Failed"); }
    finally { setSubmitting(false); }
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

  if (loading) {
    return <div className="text-sm font-bricolage text-neutral-500 py-10">Loading configuration...</div>;
  }

  const candidateImages = [...allImages];
  
  const validImages = candidateImages.filter((s) => typeof s === "string" && s.trim() !== "");
  const showCarousel = validImages.length > 1;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start w-full">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 lg:p-10 w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-neutral-900 font-bricolage">
          {isEdit ? "Edit Stay" : "New Stay"}
        </h2>
      </div>

      <div className="space-y-8">
        {/* Basic fields */}
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {formFields.map(({ key, label, placeholder, help }) => (
            <div key={String(key)} className="space-y-1.5">
              <Label htmlFor={`sf-${String(key)}`} className="text-xs font-bold uppercase tracking-wide text-neutral-700">{label}</Label>
              <Input
                id={`sf-${String(key)}`}
                placeholder={placeholder}
                value={(form as any)[key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                disabled={isEdit && key === "id"}
                className={errors[key as string] ? "border-red-300" : ""}
              />
              {errors[key as string] ? <p className="text-xs text-red-600">{errors[key as string]}</p> : help ? <p className="text-xs text-neutral-400">{help}</p> : null}
            </div>
          ))}

          {/* Collection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Collection</Label>
            <Select value={form.category ?? ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              <option value="">Choose a collection</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Property Type</Label>
            <Select value={form.propertyType ?? ""} onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}>
              <option value="">Choose a property type</option>
              {propertyTypes.filter((p) => p.id !== "all-homes").map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>
        </div>

        {/* Featured on Home toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={!!form.featuredOnHome}
            onClick={() => setForm((f) => ({ ...f, featuredOnHome: !f.featuredOnHome }))}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.featuredOnHome ? "bg-[#16323C]" : "bg-neutral-200"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.featuredOnHome ? "translate-x-5" : "translate-x-0"}`} />
          </button>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-neutral-700 font-bricolage">Featured on Home</p>
            <p className="text-sm text-neutral-400 font-bricolage">Show in the 6×2 grid on the homepage</p>
          </div>
        </div>

        {/* Description */}
        <div className="pt-6 border-t border-neutral-100 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Short Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="1–2 sentences for the card…" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">About Content</Label>
            <Textarea rows={6} value={form.aboutContent} onChange={(e) => setForm((f) => ({ ...f, aboutContent: e.target.value }))} placeholder="Detailed description for the About section…" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Google Maps Embed URL</Label>
            <Input placeholder="https://www.google.com/maps/embed?…" value={form.locationMapUrl} onChange={(e) => setForm((f) => ({ ...f, locationMapUrl: e.target.value }))} />
          </div>
        </div>

        {/* Unified Media Manager & 5 Hero Images Control */}
        <div className="pt-6 border-t border-neutral-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">
                Property Media & Hero Grid Manager
              </Label>
              <p className="text-xs text-neutral-500 font-bricolage mt-0.5">
                The <span className="font-semibold text-[#C07A5A]">first 5 images</span> will be used as the 5-photo Hero Grid on the stay detail page (Tisya/Airbnb Style). Drag or click position buttons to arrange.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <input
                ref={galleryFileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files ? Array.from(e.target.files) : [])}
              />
              <Button type="button" variant="outlineBlack" onClick={() => galleryFileRef.current?.click()} disabled={galleryUploading}>
                {galleryUploading ? "Uploading..." : "Upload Images"}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL…"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = imageUrlInput.trim();
                  if (v) { setAllImages(prev => [...prev, v]); setImageUrlInput(""); }
                }
              }}
            />
            <Button type="button" variant="outlineBlack" onClick={() => {
              const v = imageUrlInput.trim();
              if (v) { setAllImages(prev => [...prev, v]); setImageUrlInput(""); }
            }}>Add URL</Button>
          </div>

          {/* 5-Image Hero Grid Live Preview in Admin Form */}
          {allImages.length > 0 && (
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-bricolage">
                  Hero 5-Photo Grid Preview (Live Layout)
                </span>
                <span className="text-[11px] text-neutral-400 font-bricolage">
                  {Math.min(allImages.length, 5)} of 5 Hero Slots Filled
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 h-44 w-full rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300/60 p-1">
                {/* Hero #1 (Left Feature) */}
                <div className="col-span-2 relative h-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                  {allImages[0] ? (
                    <>
                      <NextImage src={allImages[0]} alt="" fill className="object-cover" unoptimized />
                      <div className="absolute top-1.5 left-1.5 bg-[#C07A5A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        #1 Main Left
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-neutral-400">#1 Empty</div>
                  )}
                </div>

                {/* Hero #2, #3, #4, #5 Grid */}
                <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-1.5 h-full">
                  {[1, 2, 3, 4].map((slotIdx) => {
                    const url = allImages[slotIdx];
                    const labels = ["#2 Top Left", "#3 Top Right", "#4 Bottom Left", "#5 Bottom Right"];
                    return (
                      <div key={slotIdx} className="relative h-full w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                        {url ? (
                          <>
                            <NextImage src={url} alt="" fill className="object-cover" unoptimized />
                            <div className="absolute top-1 left-1 bg-[#16323C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-90">
                              {labels[slotIdx - 1]}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-neutral-400">
                            #{slotIdx + 1} Empty
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All Uploaded Images with Clear Hero Badges & Quick Move Buttons */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allImages.map((url, idx) => {
                const isHero1 = idx === 0;
                const isHero = idx < 5;
                const heroLabels = [
                  "Hero #1 (Main Feature)",
                  "Hero #2 (Top Left)",
                  "Hero #3 (Top Right)",
                  "Hero #4 (Bottom Left)",
                  "Hero #5 (Bottom Right)",
                ];

                return (
                  <div 
                    key={url + idx} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`relative group rounded-xl overflow-hidden aspect-square bg-neutral-100 border-2 cursor-grab active:cursor-grabbing transition-all ${
                      isHero1
                        ? "border-[#C07A5A] ring-2 ring-[#C07A5A]/30 shadow-md"
                        : isHero
                        ? "border-[#16323C] ring-1 ring-[#16323C]/20"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                  >
                    <NextImage src={url} alt="" fill className="object-cover" unoptimized />
                    
                    {/* Badge */}
                    <div className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm text-white ${
                      isHero1 ? "bg-[#C07A5A]" : isHero ? "bg-[#16323C]" : "bg-black/60 backdrop-blur-sm"
                    }`}>
                      {isHero ? heroLabels[idx] : `Photo #${idx + 1}`}
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setAllImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10"
                    >×</button>
                    
                    {/* Position Control Buttons on Hover */}
                    <div className="absolute inset-x-2 top-9 bottom-10 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs p-1.5 rounded-lg z-10">
                      <span className="text-[9px] font-bold text-center text-white uppercase tracking-wider">Set Position</span>
                      <div className="grid grid-cols-5 gap-1">
                        {[1, 2, 3, 4, 5].map((posNum) => (
                          <button
                            key={posNum}
                            type="button"
                            onClick={() => {
                              setAllImages((prev) => {
                                const arr = [...prev];
                                const [item] = arr.splice(idx, 1);
                                arr.splice(posNum - 1, 0, item);
                                return arr;
                              });
                            }}
                            className={`py-1 text-[10px] font-bold rounded transition-colors ${
                              idx === posNum - 1
                                ? "bg-[#C07A5A] text-white"
                                : "bg-white/90 hover:bg-white text-neutral-800"
                            }`}
                          >
                            #{posNum}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Reorder Arrows */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity gap-1 z-10">
                      <button 
                        type="button"
                        disabled={idx === 0}
                        onClick={() => setAllImages(prev => {
                          const arr = [...prev];
                          [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
                          return arr;
                        })}
                        className="bg-white/90 text-neutral-800 p-1 rounded hover:bg-white disabled:opacity-30 flex-1 flex justify-center items-center shadow-sm text-xs font-bold"
                      >
                        ←
                      </button>
                      <button 
                        type="button"
                        disabled={idx === allImages.length - 1}
                        onClick={() => setAllImages(prev => {
                          const arr = [...prev];
                          [arr[idx+1], arr[idx]] = [arr[idx], arr[idx+1]];
                          return arr;
                        })}
                        className="bg-white/90 text-neutral-800 p-1 rounded hover:bg-white disabled:opacity-30 flex-1 flex justify-center items-center shadow-sm text-xs font-bold"
                      >
                        →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="pt-6 border-t border-neutral-100 space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Amenities</Label>
          <div className="flex gap-2 max-w-sm">
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
              <span key={a} className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-700 text-sm px-3 py-1.5 rounded-full font-bricolage">
                {a}
                <button onClick={() => setForm((f) => ({ ...f, amenities: (f.amenities ?? []).filter((x) => x !== a) }))} className="text-neutral-400 hover:text-red-500 leading-none">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div className="pt-6 border-t border-neutral-100 space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">Nearby Places</Label>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <Input placeholder="Place name" value={nearbyPlaceName} onChange={(e) => setNearbyPlaceName(e.target.value)} />
            <Input placeholder="Distance" value={nearbyPlaceDistance} onChange={(e) => setNearbyPlaceDistance(e.target.value)} />
            <Button type="button" variant="outlineBlack" onClick={addNearbyPlace}>Add</Button>
          </div>
          <div className="space-y-2">
            {(form.nearbyPlaces ?? []).map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-neutral-50 px-4 py-3 rounded-lg text-sm font-bricolage">
                <span className="font-medium text-neutral-800">{p.name} <span className="text-neutral-400 font-normal ml-2">{p.distance}</span></span>
                <button className="text-red-400 hover:text-red-600 text-sm font-medium" onClick={() => setForm((f) => ({ ...f, nearbyPlaces: (f.nearbyPlaces ?? []).filter((_, i) => i !== idx) }))}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-6 border-t border-neutral-100 space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wide text-neutral-700">FAQs</Label>
          <div className="space-y-2">
            <Input placeholder="Question" value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} />
            <Textarea placeholder="Answer" value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} rows={3} />
            <Button type="button" variant="outlineBlack" onClick={addFaq}>Add FAQ</Button>
          </div>
          <div className="space-y-3">
            {(form.faqs ?? []).map((faq, idx) => (
              <div key={idx} className="bg-neutral-50 px-4 py-3 rounded-lg text-sm font-bricolage">
                <div className="font-semibold text-neutral-800 text-base mb-1">{faq.question}</div>
                <div className="text-neutral-600">{faq.answer}</div>
                <button className="text-red-400 hover:text-red-600 text-sm font-medium mt-3 inline-block" onClick={() => setForm((f) => ({ ...f, faqs: (f.faqs ?? []).filter((_, i) => i !== idx) }))}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-6 border-t border-neutral-100">
          <Button variant="black" onClick={handleSubmit} disabled={submitting} className="min-w-40 h-12 text-base">
            {submitting ? "Saving…" : isEdit ? "Update Stay" : "Add Stay"}
          </Button>
          <Button variant="outlineBlack" onClick={() => router.push("/admin/stays")} disabled={submitting} className="h-12 text-base">
            Cancel
          </Button>
        </div>
      </div>
      </div>

      {/* Live Preview */}
      <div className="sticky top-8 flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500 font-bricolage px-1">Live Preview</h3>
        <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col shadow-sm group">
          <div className="relative w-full pt-[62%] bg-neutral-100">
            {showCarousel ? (
              <Carousel className="absolute inset-0 w-full h-full" opts={{ loop: true }}>
                <CarouselContent className="h-full !ml-0">
                  {validImages.slice(0, 5).map((src, idx) => (
                    <CarouselItem key={idx} className="!pl-0 relative w-full h-full overflow-hidden">
                      <NextImage src={src} alt="" fill unoptimized className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-[1.04]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
                <CarouselNext className="right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
              </Carousel>
            ) : validImages.length > 0 ? (
              <NextImage src={validImages[0]} alt="" fill unoptimized className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-[1.04]" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm font-bricolage">No Main Image</div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap pr-3">
              {form.featuredOnHome && (
                <span className="text-[10px] uppercase tracking-wide font-semibold bg-[#16323C] text-white px-2 py-0.5 rounded-full font-bricolage shadow-sm">
                  Featured
                </span>
              )}
              {form.category && (
                <span className="text-[10px] uppercase tracking-wide font-semibold bg-white/90 text-neutral-700 px-2 py-0.5 rounded-full font-bricolage shadow-sm">
                  {collections.find((c) => c.id === form.category)?.name || form.category}
                </span>
              )}
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="font-semibold text-neutral-900 font-bricolage leading-tight text-lg">{form.title || "Property Title"}</div>
            <div className="mt-1 text-xs text-[#C07A5A] font-bricolage font-medium tracking-wide uppercase">{form.location || "Location"}</div>
            <div className="mt-2 text-sm text-neutral-500 font-bricolage">
              {form.area || "Area"} · {form.bed || "Bed"} · {form.guests || "Guests"}
            </div>
            {form.pricePerNight && (
              <div className="mt-2 text-sm font-semibold text-neutral-800 font-bricolage">
                From {normalizePrice(form.pricePerNight)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
