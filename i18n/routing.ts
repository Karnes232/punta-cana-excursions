import { defineRouting } from "next-intl/routing";
import { ALL_LOCALES } from "./blogLocales";

// All routing locales must appear in every object-form pathname below. The 4
// non-site locales (fr/de/pt/it) only ever serve individual blog articles, so
// for site routes they simply mirror the English segment (those URLs 404 via
// assertSiteLocale anyway). Blog routes are shared strings — valid everywhere.
const sitePath = (en: string, es: string) => ({
  en,
  es,
  fr: en,
  de: en,
  pt: en,
  it: en,
});

export const routing = defineRouting({
  locales: ALL_LOCALES,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  // We emit correct hreflang in each page's <head> via generateMetadata. The
  // automatic alternate `Link` header would otherwise advertise every routing
  // locale using the SAME slug — wrong for our en/es-only site pages and our
  // per-document blog slugs (it generated ~330 internal 404s for Ahrefs).
  alternateLinks: false,
  // Localized URL segments. Keys are the canonical (English) pathnames that
  // match the file-system routes under app/(root)/[locale]/. The es value is the
  // public Spanish URL segment — next-intl rewrites it back to the canonical
  // route internally, so no folders need to move. Dynamic [slug] values are
  // substituted verbatim (per-locale slugs are handled at the data layer).
  pathnames: {
    "/": "/",
    "/excursions": sitePath("/excursions", "/excursiones"),
    "/excursions/[slug]": sitePath("/excursions/[slug]", "/excursiones/[slug]"),
    "/scuba-diving": sitePath("/scuba-diving", "/buceo"),
    "/scuba-diving/[slug]": sitePath("/scuba-diving/[slug]", "/buceo/[slug]"),
    "/about": sitePath("/about", "/sobre-nosotros"),
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": sitePath("/contact", "/contacto"),
    "/faq": sitePath("/faq", "/preguntas-frecuentes"),
    "/how-it-works": sitePath("/how-it-works", "/como-funciona"),
    "/privacy-policy": sitePath("/privacy-policy", "/politica-de-privacidad"),
    "/terms-of-service": sitePath("/terms-of-service", "/terminos-de-servicio"),
    "/cancellation-policy": sitePath(
      "/cancellation-policy",
      "/politica-de-cancelacion",
    ),
  },
});
