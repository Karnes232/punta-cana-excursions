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

  function onClick(next: "en" | "es") {
    if (next === locale) return;
    startTransition(() => {
      // Detail pages with per-locale slugs: swap to the target locale's slug.
      const altSlug = alternate?.slugByLocale[next];
      if (alternate && altSlug) {
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
