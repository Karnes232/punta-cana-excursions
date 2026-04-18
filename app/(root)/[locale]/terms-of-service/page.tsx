import { LegalPage } from "@/components/LegalPage/LegalPage";
import { getTermsOfService } from "@/sanity/queries/LegalPages/LegalDocument";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { PortableTextBlock } from "@portabletext/types";

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page] = await Promise.all([params, getTermsOfService()]);

  const lk = locale as keyof LocalizedField;

  const lastUpdatedLabels: Record<string, string> = {
    en: "Last updated",
    es: "Última actualización",
  };

  return (
    <LegalPage
      title={page?.title?.[lk] ?? "Terms of Service"}
      lastUpdated={page?.lastUpdated ?? null}
      body={(page?.body?.[lk] ?? []) as PortableTextBlock[]}
      lastUpdatedLabel={lastUpdatedLabels[lk] ?? "Last updated"}
    />
  );
}
