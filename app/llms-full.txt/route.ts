import {
  getGeneralLayout,
  getLocalized,
  getLocalizedPortableText,
  getLocalizedStringArray,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { getExcursionsForLlms } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDivingForLlms } from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
import { getBlogArticlesForLlms } from "@/sanity/queries/Blog/Blog";
import { getLocalizedUrl } from "@/i18n/hreflang";
import { portableTextToPlain } from "@/lib/seo/portableTextToPlain";

export const revalidate = 3600;

const EN = "en";

function bulletList(label: string, items: string[]): string[] {
  if (!items.length) return [];
  return ["", `${label}:`, ...items.map((i) => `- ${i}`)];
}

export async function GET() {
  const [layout, defaultSeo, excursions, diving, blog] = await Promise.all([
    getGeneralLayout(),
    getDefaultSeo(),
    getExcursionsForLlms(),
    getDivingForLlms(),
    getBlogArticlesForLlms(),
  ]);

  const name = getLocalized(layout?.companyName, EN) || "Punta Cana Excursions";
  const tagline =
    getLocalized(layout?.tagline, EN) ||
    getLocalized(defaultSeo?.defaultSeo?.metaDescription, EN);
  const description = getLocalized(layout?.footerDescription, EN);

  const lines: string[] = [`# ${name}`];
  if (tagline) lines.push("", `> ${tagline}`);
  if (description) lines.push("", description);

  if (excursions.length) {
    lines.push("", "# Excursions");
    for (const e of excursions.filter((x) => !x.noIndex)) {
      const url = getLocalizedUrl(EN, {
        pathname: "/excursions/[slug]",
        params: { slug: e.slug.current },
      });
      lines.push("", `## ${getLocalized(e.title, EN)}`, url);
      const summary = getLocalized(e.shortSummary, EN);
      if (summary) lines.push("", summary);
      lines.push(
        "",
        `Price: from $${e.price} · Duration: ${getLocalized(e.duration, EN)}`,
      );
      lines.push(...bulletList("Highlights", getLocalizedStringArray(e.highlights, EN)));
      lines.push(...bulletList("What's included", getLocalizedStringArray(e.whatsIncluded, EN)));
      const body = portableTextToPlain(getLocalizedPortableText(e.fullDescription, EN));
      if (body) lines.push("", body);
    }
  }

  if (diving.length) {
    lines.push("", "# Diving & Snorkeling");
    for (const d of diving.filter((x) => !x.noIndex)) {
      const url = getLocalizedUrl(EN, {
        pathname: "/scuba-diving/[slug]",
        params: { slug: d.slug.current },
      });
      lines.push("", `## ${getLocalized(d.title, EN)}`, url);
      const summary = getLocalized(d.shortSummary, EN);
      if (summary) lines.push("", summary);
      lines.push(
        "",
        `Price: from $${d.price} · Duration: ${getLocalized(d.duration, EN)}`,
      );
      lines.push(...bulletList("Highlights", getLocalizedStringArray(d.highlights, EN)));
      const body = portableTextToPlain(getLocalizedPortableText(d.fullDescription, EN));
      if (body) lines.push("", body);
    }
  }

  if (blog.length) {
    lines.push("", "# Blog");
    for (const b of blog) {
      const locale = b.language === "es" ? "es" : "en";
      const url = getLocalizedUrl(locale, {
        pathname: "/blog/[slug]",
        params: { slug: b.slug },
      });
      lines.push("", `## ${b.title}`, url, `Language: ${b.language}`);
      if (b.excerpt) lines.push("", b.excerpt);
      const body = portableTextToPlain(b.body);
      if (body) lines.push("", body);
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
