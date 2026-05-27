import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/**
 * The href type accepted by the locale-aware navigation APIs. With `pathnames`
 * configured in routing.ts this is strictly typed to the known route keys plus
 * the object form (`{ pathname, params?, query? }`).
 */
export type AppHref = Parameters<typeof getPathname>[0]["href"];

/** True for hrefs that should render a plain <a> rather than a locale-aware Link. */
export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|\/\/|#)/i.test(href);
}

/**
 * Pick the slug to use for the active locale. Spanish uses `slugEs` when present,
 * otherwise falls back to the English slug. Keeps per-locale dynamic URLs working
 * even before every document has a Spanish slug.
 */
export function localizedSlug(
  locale: string,
  slug: string,
  slugEs?: string | null,
): string {
  return locale === "es" ? slugEs || slug : slug;
}

/**
 * Convert a plain href string (e.g. stored in Sanity) into the typed href that
 * the locale-aware <Link> expects. Any `?query` is split off into a query object.
 * Internal CMS hrefs are known canonical English pathnames, so the cast is safe;
 * an unknown path still navigates, just without segment localization.
 */
export function parseInternalHref(href: string): AppHref {
  const [pathname, queryString] = href.split("?");
  if (!queryString) return pathname as AppHref;
  const query = Object.fromEntries(new URLSearchParams(queryString));
  return { pathname, query } as AppHref;
}
