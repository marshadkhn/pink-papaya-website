"use client";

import { useCallback, useRef, useState } from "react";

export type CmsToastState = { type: "success" | "error"; message: string } | null;

export function useCmsToast() {
  const [toast, setToast] = useState<CmsToastState>(null);
  const timer = useRef<number | null>(null);

  const show = useCallback((t: Exclude<CmsToastState, null>) => {
    setToast(t);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, show };
}

export function CmsToast({ toast }: { toast: CmsToastState }) {
  if (!toast) return null;
  const cls =
    toast.type === "success"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : "bg-red-50 border-red-100 text-red-600";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`rounded-xl border px-4 py-3 shadow-sm text-sm font-bricolage ${cls}`}>
        {toast.message}
      </div>
    </div>
  );
}
