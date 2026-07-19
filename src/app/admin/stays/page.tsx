"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { formatPriceString } from "@/utils/formatCurrency";
import { Stay } from "@/app/admin/stays/types";

export default function AdminStaysPage() {
  const router = useRouter();
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const staysRes = await fetch("/api/stays");
      if (staysRes.ok) setStays(await staysRes.json());
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function removeStay(id: string) {
    if (!confirm("Delete this stay?")) return;
    const res = await fetch(`/api/stays/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <>
      <AdminPageHeader
        title="Stays"
        description="Add, edit, or remove stay listings."
        actions={
          <Button onClick={() => router.push("/admin/stays/new")}>+ New Stay</Button>
        }
      />

      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 font-bricolage text-sm">Loading…</div>
        ) : stays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-neutral-400 font-bricolage text-sm">No stays yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stays.map((s, i) => (
              <div key={s.id ? `${s.id}-${i}` : i} className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col">
                <div className="relative w-full pt-[62%] bg-neutral-100">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.imageUrl})` }} />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap pr-3">
                    {s.featuredOnHome && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold bg-[#16323C] text-white px-2 py-0.5 rounded-full font-bricolage shadow-sm">
                        Featured
                      </span>
                    )}
                    {s.category && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold bg-white/90 text-neutral-700 px-2 py-0.5 rounded-full font-bricolage shadow-sm">
                        {s.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="font-semibold text-neutral-900 font-bricolage leading-tight text-lg">{s.title}</div>
                  <div className="mt-1 text-xs text-[#C07A5A] font-bricolage font-medium tracking-wide uppercase">{s.location || "Goa"}</div>
                  <div className="mt-2 text-sm text-neutral-500 font-bricolage">{s.area} · {s.bed} · {s.guests}</div>
                  {s.pricePerNight && (
                    <div className="mt-2 text-sm font-semibold text-neutral-800 font-bricolage">
                      From {formatPriceString(s.pricePerNight)}/night
                    </div>
                  )}
                  <div className="flex gap-3 mt-auto pt-5">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/stays/${s.id}`)} className="flex-1">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => removeStay(s.id)} className="flex-1">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
