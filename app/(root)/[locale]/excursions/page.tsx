import { ExcursionsBrowseSection } from "@/components/ExcursionsPage/ExcursionsBrowseSection/ExcursionsBrowseSection";
import { ExcursionsHero } from "@/components/ExcursionsPage/Hero/ExcursionsHero";
import { WhatsAppCTAStrip } from "@/components/ExcursionsPage/WhatsAppCTA/WhatsAppCTAStrip";
import { getExcursionCategoryPage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import { getExcursionsPage } from "@/sanity/queries/ExcursionsPage/ExcursionsPage";
import { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export default async function Excursions({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }, excursionCategories, excursionsPage] = await Promise.all([
    params,
    getExcursionCategoryPage(),
    getExcursionsPage(),
  ]);
  const localeKey = locale as keyof LocalizedField;
  return (
    <>
      <ExcursionsHero
        backgroundImage={{
          url: excursionsPage?.heroImage?.asset?.url ?? "",
          alt: excursionsPage?.heroHeadline?.[localeKey] ?? excursionsPage?.heroHeadline?.en ?? "",
          lqip: excursionsPage?.heroImage?.asset?.metadata?.lqip ?? "",
        }}
        headline={excursionsPage?.heroHeadline?.[localeKey] ?? excursionsPage?.heroHeadline?.en ?? ""}
        subheadline={excursionsPage?.heroSubheadline?.[localeKey] ?? excursionsPage?.heroSubheadline?.en ?? ""}
        totalExcursions={10}
      />
      <ExcursionsBrowseSection
        categories={excursionCategories.map((category) => ({
          slug: category.slug,
          title: category.title?.[localeKey] ?? "",
        }))}
        excursions={[
          {
            slug: "excursion-1",
            title: "Excursion 1",
            summary: "Excursion 1 summary",
            image: {
              url: "https://picsum.photos/1000/1000?random=1",
              alt: "Excursion 1",
              lqip: "https://picsum.photos/1000/1000?random=1",
            },
            price: 100,
            duration: "1 hour",
            category: "Adventure",
            badge: "Featured",
            isFeatured: true,
          },
          {
            slug: "excursion-2",
            title: "Excursion 2",
            summary: "Excursion 2 summary",
            image: {
              url: "https://picsum.photos/1000/1000?random=2",
              alt: "Excursion 2",
              lqip: "https://picsum.photos/1000/1000?random=2",
            },
            price: 200,
            duration: "2 hours",
            category: "Beach",
            badge: "Popular",
            isFeatured: false,
          },
          {
            slug: "excursion-3",
            title: "Excursion 3",
            summary: "Excursion 3 summary",
            image: {
              url: "https://picsum.photos/1000/1000?random=3",
              alt: "Excursion 3",
              lqip: "https://picsum.photos/1000/1000?random=3",
            },
            price: 300,
            duration: "3 hours",
            category: "Cultural",
            badge: "New",
            isFeatured: false,
          },
          {
            slug: "excursion-4",
            title: "Excursion 4",
            summary: "Excursion 4 summary",
            image: {
              url: "https://picsum.photos/1000/1000?random=4",
              alt: "Excursion 4",
              lqip: "https://picsum.photos/1000/1000?random=4",
            },
            price: 400,
            duration: "4 hours",
            category: "Nature",
            badge: "Best Seller",
            isFeatured: false,
          },
          {
            slug: "excursion-5",
            title: "Excursion 5",
            summary: "Excursion 5 summary",
            image: {
              url: "https://picsum.photos/1000/1000?random=5",
              alt: "Excursion 5",
              lqip: "https://picsum.photos/1000/1000?random=5",
            },
            price: 500,
            duration: "5 hours",
            category: "Water",
            badge: "Best Value",
            isFeatured: false,
          },
        ]}
        currencySymbol="$"
        labels={{
          filter: {
            all: "All",
            sortBy: "Sort by",
            sortFeatured: "Featured",
            sortPriceLow: "Price low",
            sortPriceHigh: "Price high",
            sortDuration: "Duration",
            showing: "Showing",
            excursion: "Excursion",
            excursions: "Excursions",
          },
          card: {
            from: "From",
            perPerson: "Per person",
            viewAndBook: "View and book",
          },
          empty: {
            title: "No excursions found",
            description: "No excursions found",
          },
        }}
      />
      <WhatsAppCTAStrip
        headline={excursionsPage?.ctaHeadline?.[localeKey] ?? excursionsPage?.ctaHeadline?.en ?? ""}
        description={excursionsPage?.ctaDescription?.[localeKey] ?? excursionsPage?.ctaDescription?.en ?? ""}
        whatsappNumber="1234567890"
        whatsappDefaultMessage="Hello, I have a question about the best way to get to Punta Cana."
        whatsappButtonText={excursionsPage?.ctaWhatsappButtonText?.[localeKey] ?? excursionsPage?.ctaWhatsappButtonText?.en ?? ""}
        contactHref="/contact"
        contactButtonText={excursionsPage?.ctaContactButtonText?.[localeKey] ?? excursionsPage?.ctaContactButtonText?.en ?? ""}
      />
    </>
  );
}
