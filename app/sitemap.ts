import type { MetadataRoute } from "next";
import { getLocalizedUrl } from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";
import { localizedSlug } from "@/i18n/navigation";
import { getExcursionSlugs } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDivingExcursionSlugs } from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
import {
  getBlogSitemapEntries,
  type BlogSitemapEntry,
} from "@/sanity/queries/Blog/Blog";

export const revalidate = 3600;

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];
type Locale = "en" | "es";
const LOCALES: Locale[] = ["en", "es"];

// Static (non-dynamic) pages — keys match routing.pathnames.
const STATIC_PAGES: {
  href: AppHref;
  priority: number;
  changeFrequency: ChangeFreq;
}[] = [
  { href: "/", priority: 1.0, changeFrequency: "weekly" },
  { href: "/excursions", priority: 0.9, changeFrequency: "weekly" },
  { href: "/scuba-diving", priority: 0.9, changeFrequency: "weekly" },
  { href: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { href: "/about", priority: 0.6, changeFrequency: "monthly" },
  { href: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { href: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { href: "/how-it-works", priority: 0.5, changeFrequency: "monthly" },
  { href: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { href: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
  { href: "/cancellation-policy", priority: 0.3, changeFrequency: "yearly" },
];

/** Public URL for a blog article, keyed off the document's language (en/es prefix). */
function blogUrl(b: BlogSitemapEntry): string {
  const locale: Locale = b.language === "es" ? "es" : "en";
  return getLocalizedUrl(locale, {
    pathname: "/blog/[slug]",
    params: { slug: b.slug },
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [excursions, diving, blog] = await Promise.all([
    getExcursionSlugs(),
    getDivingExcursionSlugs(),
    getBlogSitemapEntries(),
  ]);

  const now = new Date();

  // One clean <url> per locale for every static page (en unprefixed, es localized).
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, p.href),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
  );

  const excursionEntries: MetadataRoute.Sitemap = excursions
    .filter((e) => !e.noIndex)
    .flatMap((e) =>
      LOCALES.map((locale) => ({
        url: getLocalizedUrl(locale, {
          pathname: "/excursions/[slug]",
          params: { slug: localizedSlug(locale, e.slug, e.slugEs) },
        }),
        lastModified: e._updatedAt ? new Date(e._updatedAt) : now,
        changeFrequency: "monthly" as ChangeFreq,
        priority: 0.7,
      })),
    );

  const divingEntries: MetadataRoute.Sitemap = diving
    .filter((d) => !d.noIndex)
    .flatMap((d) =>
      LOCALES.map((locale) => ({
        url: getLocalizedUrl(locale, {
          pathname: "/scuba-diving/[slug]",
          params: { slug: localizedSlug(locale, d.slug, d.slugEs) },
        }),
        lastModified: d._updatedAt ? new Date(d._updatedAt) : now,
        changeFrequency: "monthly" as ChangeFreq,
        priority: 0.7,
      })),
    );

  // Blog articles are per-language documents — one entry each at its own URL.
  const blogEntries: MetadataRoute.Sitemap = blog.map((b) => ({
    url: blogUrl(b),
    lastModified: b._updatedAt ? new Date(b._updatedAt) : now,
    changeFrequency: "monthly" as ChangeFreq,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...excursionEntries,
    ...divingEntries,
    ...blogEntries,
  ];
}
