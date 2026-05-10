"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";

const CATEGORIES = [
  "All",
  "Coastal Living",
  "Interior Design",
  "Travel Trends",
  "Host Stories",
  "Destinations",
];

export default function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "All";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") params.delete("category");
    else params.set("category", cat);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 font-bricolage text-[13px] font-medium text-neutral-800 bg-white border border-neutral-200 rounded-full px-5 py-2.5 hover:border-neutral-400 transition-colors"
        aria-expanded={open}
      >
        {current === "All" ? "All Collections" : current}
        <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-neutral-100 py-2 z-50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => select(cat)}
              className={cn(
                "w-full text-left px-5 py-2.5 text-[13px] font-bricolage transition-colors",
                (cat === "All" ? current === "All" : current === cat)
                  ? "text-[#16323C] font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {cat === "All" ? "All Collections" : cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
