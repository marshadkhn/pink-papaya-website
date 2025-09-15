import * as React from "react";

export default function PatioIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 14h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14v4M18 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 10h16l-2-4H6l-2 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
