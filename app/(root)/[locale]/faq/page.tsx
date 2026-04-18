import { FaqHero } from "@/components/FaqPage/FaqHero/FaqHero";
import { FaqCategories } from "@/components/FaqPage/FaqCategories/FaqCategories";
import type { FaqCategoryData } from "@/components/FaqPage/FaqCategories/FaqCategories";
import { getFaqPage } from "@/sanity/queries/FaqPage/FaqPage";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page] = await Promise.all([params, getFaqPage()]);

  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const categories: FaqCategoryData[] =
    page?.categories?.map((cat) => ({
      _key: cat._key,
      categoryName: cat.categoryName?.[lk] ?? "",
      icon: cat.icon ?? null,
      items: (cat.items ?? []).map((item) => ({
        _key: item._key,
        question: item.question?.[lk] ?? "",
        answer: item.answer?.[lk] ?? "",
      })),
    })) ?? [];

  return (
    <main className="min-h-screen bg-white">
      <FaqHero
        headline={page?.heroHeadline?.[lk] ?? (isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions")}
        subheadline={page?.heroSubheadline?.[lk] ?? ""}
      />

      <FaqCategories
        categories={categories}
        allLabel={isEs ? "Todas" : "All"}
      />
    </main>
  );
}
