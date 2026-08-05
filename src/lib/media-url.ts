/**
 * CMS-uploaded media is pre-optimized to WebP at upload time (see src/lib/media-storage.ts),
 * so re-running it through next/image's runtime optimizer just burns CPU for no quality gain.
 * Unsplash placeholders are likewise served already-optimized by Unsplash's own CDN.
 */
export function isPreOptimizedMedia(src: string): boolean {
  if (!src) return false;
  return (
    src.includes("muscache.com") ||
    src.startsWith("https://images.unsplash.com/") ||
    src.startsWith("/media/") ||
    src.startsWith("/api/media/")
  );
}
