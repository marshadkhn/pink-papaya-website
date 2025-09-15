import * as React from "react";

export default function TvIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 18l-2 3M16 18l2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
