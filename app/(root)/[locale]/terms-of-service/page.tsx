import { LegalPage } from "@/components/LegalPage/LegalPage";
import {
  getTermsOfService,
  getLegalDocumentSeo,
} from "@/sanity/queries/LegalPages/LegalDocument";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { assertSiteLocale } from "@/i18n/siteLocale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getLegalDocumentSeo("terms-of-service"),
    getDefaultSeo(),
    getTermsOfService(),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/terms-of-service",
    fallbackTitle: page?.title?.[lk],
  });
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page, pageSeo] = await Promise.all([
    params,
    getTermsOfService(),
    getLegalDocumentSeo("terms-of-service"),
  ]);

  assertSiteLocale(locale);

  const lk = locale as keyof LocalizedField;
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const lastUpdatedLabels: Record<string, string> = {
    en: "Last updated",
    es: "Última actualización",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <LegalPage
        title={page?.title?.[lk] ?? "Terms of Service"}
        lastUpdated={page?.lastUpdated ?? null}
        body={(page?.body?.[lk] ?? []) as PortableTextBlock[]}
        lastUpdatedLabel={lastUpdatedLabels[lk] ?? "Last updated"}
      />
    </>
  );
}
