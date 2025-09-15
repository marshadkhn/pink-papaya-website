import * as React from "react";

export default function BedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 7h12a6 6 0 0 1 6 6v4H3V7Z" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7v10M21 13H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
