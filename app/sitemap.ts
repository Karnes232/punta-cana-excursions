import type { MetadataRoute } from "next";
import { generateHreflangUrls, getLocalizedUrl } from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";
import { getExcursionSlugs } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDivingExcursionSlugs } from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
import {
  getBlogSitemapEntries,
  type BlogSitemapEntry,
} from "@/sanity/queries/Blog/Blog";

export const revalidate = 3600;

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

/** Build a bilingual sitemap entry from per-locale hrefs. */
function entry(
  hrefEn: AppHref,
  hrefEs: AppHref,
  opts: {
    priority: number;
    changeFrequency: ChangeFreq;
    lastModified?: string | Date;
  },
): MetadataRoute.Sitemap[number] {
  const urls = generateHreflangUrls({ en: hrefEn, es: hrefEs });
  return {
    url: urls.en,
    lastModified: opts.lastModified ? new Date(opts.lastModified) : new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: { en: urls.en, es: urls.es, "x-default": urls.en },
    },
  };
}

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

/** Public URL for a blog article, keyed off the document's language. */
function blogUrl(b: BlogSitemapEntry): string {
  const locale = b.language === "es" ? "es" : "en";
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

  const staticEntries = STATIC_PAGES.map((p) =>
    entry(p.href, p.href, {
      priority: p.priority,
      changeFrequency: p.changeFrequency,
    }),
  );

  const excursionEntries = excursions
    .filter((e) => !e.noIndex)
    .map((e) =>
      entry(
        { pathname: "/excursions/[slug]", params: { slug: e.slug } },
        { pathname: "/excursions/[slug]", params: { slug: e.slugEs || e.slug } },
        { priority: 0.7, changeFrequency: "monthly", lastModified: e._updatedAt },
      ),
    );

  const divingEntries = diving
    .filter((d) => !d.noIndex)
    .map((d) =>
      entry(
        { pathname: "/scuba-diving/[slug]", params: { slug: d.slug } },
        { pathname: "/scuba-diving/[slug]", params: { slug: d.slugEs || d.slug } },
        { priority: 0.7, changeFrequency: "monthly", lastModified: d._updatedAt },
      ),
    );

  // Group blog articles by translationGroup to wire en↔es reciprocal hreflang.
  const groups = new Map<string, { en?: BlogSitemapEntry; es?: BlogSitemapEntry }>();
  for (const b of blog) {
    const key = b.translationGroup || b.slug;
    const g = groups.get(key) ?? {};
    if (b.language === "en") g.en = b;
    else if (b.language === "es") g.es = b;
    groups.set(key, g);
  }

  const blogEntries = blog.map((b) => {
    const g = groups.get(b.translationGroup || b.slug) ?? {};
    const languages: Record<string, string> = {};
    if (g.en) languages.en = blogUrl(g.en);
    if (g.es) languages.es = blogUrl(g.es);
    if (g.en) languages["x-default"] = blogUrl(g.en);

    return {
      url: blogUrl(b),
      lastModified: b._updatedAt ? new Date(b._updatedAt) : new Date(),
      changeFrequency: "monthly" as ChangeFreq,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    };
  });

  return [
    ...staticEntries,
    ...excursionEntries,
    ...divingEntries,
    ...blogEntries,
  ];
}
