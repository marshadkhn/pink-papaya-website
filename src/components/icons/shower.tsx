import * as React from "react";

export default function ShowerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 4h10a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 13v2M12 13v2M16 13v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
