import * as React from "react";

export default function AreaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
