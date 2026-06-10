import { notFound } from "next/navigation";
import { isSiteLocale } from "./blogLocales";

/**
 * Guard for non-blog routes. The extra blog locales (fr/de/pt/it) are valid
 * routing locales so individual blog articles can render with the correct
 * `<html lang>` and hreflang, but the rest of the site only has en/es content.
 * Call this near the top of every non-blog page (and the blog index) so e.g.
 * `/fr/about` or `/fr/excursions` 404 instead of rendering English fallback
 * content under a foreign-language URL (which would be duplicate content).
 */
export function assertSiteLocale(locale: string): void {
  if (!isSiteLocale(locale)) notFound();
}
