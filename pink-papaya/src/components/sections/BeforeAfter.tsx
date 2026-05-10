"use client";

import * as React from "react";
import Image from "next/image";
import clsx from "clsx";
import styles from "./BeforeAfter.module.css";

type BeforeAfterProps = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BeforeAfter({ beforeSrc, afterSrc, alt, className }: BeforeAfterProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState(50);

  React.useEffect(() => {
    rootRef.current?.style.setProperty("--pos", `${pos}%`);
  }, [pos]);

  function setFromClientX(clientX: number) {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(clamp(pct, 0, 100));
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => clamp(p - 5, 0, 100));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => clamp(p + 5, 0, 100));
    }
  }

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, "relative aspect-video overflow-hidden rounded-image border border-line", className)}
    >
      <Image src={beforeSrc} alt={alt} fill className="object-cover" />
      <div className={clsx(styles.afterLayer, "absolute inset-0")} aria-hidden="true">
        <Image src={afterSrc} alt="" fill className="object-cover" />
      </div>

      <div className={clsx(styles.handle, "absolute inset-y-0 w-px bg-cream/80")} aria-hidden="true" />

      <button
        type="button"
        aria-label="Before and After handle"
        className={clsx(
          styles.handle,
          "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
          "h-10 w-10 rounded-full border border-cream bg-ink/40",
          "cursor-ew-resize",
          "focus-ring"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
