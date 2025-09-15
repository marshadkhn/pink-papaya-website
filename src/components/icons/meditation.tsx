import * as React from "react";

export default function MeditationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c2-2 4.5-3 8-3s6 1 8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14l4 2l4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
