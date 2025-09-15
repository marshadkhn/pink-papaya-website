import * as React from "react";

export default function YogaMatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 16l10-10a3 3 0 1 1 4 4L8 20H4v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 6a2 2 0 1 1 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
