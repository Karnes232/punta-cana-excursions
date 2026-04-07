import { CategoriesSectionHeader } from "./CategoriesSectionHeader";
import { CategoryCard } from "./CategoryCard";

export interface ExcursionCategory {
  slug: string;
  title: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  excursionCount?: number;
}

interface ExcursionCategoriesProps {
  heading: string;
  subheading?: string;
  categories: ExcursionCategory[];
}

export function ExcursionCategories({
  heading,
  subheading,
  categories,
}: ExcursionCategoriesProps) {
  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <CategoriesSectionHeader heading={heading} subheading={subheading} />

        {/* Category grid — 2 cols mobile, 3 cols tablet, adaptive on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
