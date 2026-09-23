/**
 * Resolve a URL relative to a base URL, similar to how browsers resolve hrefs.
 * If the relative URL is already absolute, it is returned as-is.
 */
export function resolveUrl(relative: string, base: string): string {
  try {
    // If relative is empty, return base
    if (!relative) return base;
    // If relative is already absolute (contains :// or starts with //), return it
    if (/^[a-z][a-z0-9+.-]*:/.test(relative) || relative.startsWith('//')) {
      return relative;
    }
    // Use URL constructor to resolve
    return new URL(relative, base).href;
  } catch {
    // Fallback: return relative as-is if URL constructor fails
    return relative;
  }
}