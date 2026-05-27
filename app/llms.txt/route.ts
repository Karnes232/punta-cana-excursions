import {
  getGeneralLayout,
  getLocalized,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { getExcursionList } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getScubaDivingExcursions } from "@/sanity/queries/DivingSnorkelingPage/DivingSnorkelingPage";
import { getBlogArticles } from "@/sanity/queries/Blog/Blog";
import { getLocalizedUrl } from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";

export const revalidate = 3600;

const EN = "en";

function listItem(title: string, url: string, summary?: string): string {
  const clean = summary?.replace(/\s+/g, " ").trim();
  return `- [${title}](${url})${clean ? `: ${clean}` : ""}`;
}

export async function GET() {
  const [layout, defaultSeo, excursions, diving, blog] = await Promise.all([
    getGeneralLayout(),
    getDefaultSeo(),
    getExcursionList(),
    getScubaDivingExcursions(),
    getBlogArticles(EN),
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
    lines.push("", "## Excursions");
    for (const e of excursions) {
      lines.push(
        listItem(
          getLocalized(e.title, EN),
          getLocalizedUrl(EN, {
            pathname: "/excursions/[slug]",
            params: { slug: e.slug.current },
          }),
          getLocalized(e.shortSummary, EN),
        ),
      );
    }
  }

  if (diving.length) {
    lines.push("", "## Diving & Snorkeling");
    for (const d of diving) {
      lines.push(
        listItem(
          getLocalized(d.title, EN),
          getLocalizedUrl(EN, {
            pathname: "/scuba-diving/[slug]",
            params: { slug: d.slug.current },
          }),
          getLocalized(d.shortSummary, EN),
        ),
      );
    }
  }

  if (blog.length) {
    lines.push("", "## Blog");
    for (const b of blog) {
      lines.push(
        listItem(
          b.title,
          getLocalizedUrl(EN, {
            pathname: "/blog/[slug]",
            params: { slug: b.slug },
          }),
          b.excerpt,
        ),
      );
    }
  }

  const pages: { label: string; href: AppHref }[] = [
    { label: "Excursions", href: "/excursions" },
    { label: "Diving & Snorkeling", href: "/scuba-diving" },
    { label: "About", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];
  lines.push("", "## Pages");
  for (const p of pages) {
    lines.push(`- [${p.label}](${getLocalizedUrl(EN, p.href)})`);
  }

  lines.push(
    "",
    "## Español",
    `- [Versión en español del sitio](${getLocalizedUrl("es", "/")})`,
  );

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
