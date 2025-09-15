import * as React from "react";

export default function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20a6 6 0 1 1 12 0" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M15 20a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
