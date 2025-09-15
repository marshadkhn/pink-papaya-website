import * as React from "react";

export default function BreakfastIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M13 8h6v4a4 4 0 0 1-4 4h-2V8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M3 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
