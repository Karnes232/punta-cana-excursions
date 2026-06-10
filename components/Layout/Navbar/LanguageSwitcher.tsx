"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { useAlternateSlug } from "@/components/ui/AlternateSlugProvider";

export default function LanguageSwitcher() {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const alternate = useAlternateSlug();

  // The extra blog locales (fr/de/pt/it) only ever serve individual blog
  // articles, whose in-body translations widget handles language switching.
  // The en/es chrome toggle would have nowhere valid to go, so hide it.
  if (locale !== "en" && locale !== "es") return null;

  function onClick(next: "en" | "es") {
    if (next === locale) return;
    startTransition(() => {
      // Detail pages with per-locale slugs (excursions/diving/blog): swap to the
      // target locale's slug. If that locale has no version (e.g. a blog article
      // without that translation), do nothing rather than navigate to a 404.
      if (alternate) {
        const altSlug = alternate.slugByLocale[next];
        if (!altSlug) return;
        router.replace(
          { pathname: alternate.pathname, params: { slug: altSlug } },
          { locale: next },
        );
        return;
      }
      // All other routes: keep the current pathname (next-intl re-localizes the
      // segment). params fills any dynamic segment shared across locales.
      router.replace(
        // @ts-expect-error -- pathname & params always match the current route
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <button
      onClick={() => onClick(locale === "en" ? "es" : "en")}
      className="text-[12px] font-semibold text-[#005F86] border-[1.5px] border-[#005F86] rounded-full px-3 py-1.5 hover:bg-[#E8F4F9] transition-colors duration-150 whitespace-nowrap"
    >
      EN / ES
    </button>
  );
}
