"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Dynamic detail routes whose [slug] value differs per locale. */
export type DetailPathname =
  | "/excursions/[slug]"
  | "/scuba-diving/[slug]"
  | "/blog/[slug]";

export interface AlternateSlugInfo {
  /** The typed detail route this page renders. */
  pathname: DetailPathname;
  /** The slug to use for each locale (a locale may be missing if no translation). */
  slugByLocale: Partial<Record<"en" | "es", string>>;
}

const AlternateSlugContext = createContext<AlternateSlugInfo | null>(null);

/**
 * Detail pages wrap their content in this so the global LanguageSwitcher can
 * resolve the correct per-locale slug when toggling languages (otherwise it
 * would carry the current locale's slug into the other locale's URL and 404).
 */
export function AlternateSlugProvider({
  value,
  children,
}: {
  value: AlternateSlugInfo;
  children: ReactNode;
}) {
  return (
    <AlternateSlugContext.Provider value={value}>
      {children}
    </AlternateSlugContext.Provider>
  );
}

export function useAlternateSlug(): AlternateSlugInfo | null {
  return useContext(AlternateSlugContext);
}
