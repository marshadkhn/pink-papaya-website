// Lightweight cn utility similar to shadcn/ui helper
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
