import { SITE_URL } from "@/lib/seo/constants";

/**
 * Utility function to generate hreflang URLs for a given path
 * Ensures reciprocal hreflang tags (both en and es versions)
 */
export function generateHreflangUrls(
  path: string,
  baseUrl: string = SITE_URL,
): { en: string; es: string } {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // For English, path without locale prefix
  const enPath = cleanPath;
  // For Spanish, add /es prefix (avoid trailing slash when path is empty)
  const esPath = cleanPath ? `es/${cleanPath}` : "es";

  return {
    en: enPath ? `${baseUrl}/${enPath}` : baseUrl,
    es: `${baseUrl}/${esPath}`,
  };
}

/**
 * Generate alternates object with hreflang tags for Next.js metadata
 */
export function generateHreflangAlternates(
  currentLocale: "en" | "es",
  path: string,
  baseUrl: string = SITE_URL,
) {
  const urls = generateHreflangUrls(path, baseUrl);

  return {
    languages: {
      en: urls.en,
      es: urls.es,
      "x-default": urls.en, // Default to English
    },
  };
}
