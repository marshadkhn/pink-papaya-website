import * as React from "react";

export default function TeaSetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 14a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1H4v-1Z" stroke="currentColor" strokeWidth="2" />
      <path d="M17 11h3v2a2 2 0 0 1-2 2h-1" stroke="currentColor" strokeWidth="2" />
      <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
