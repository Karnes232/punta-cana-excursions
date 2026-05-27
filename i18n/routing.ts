import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  // Localized URL segments. Keys are the canonical (English) pathnames that
  // match the file-system routes under app/(root)/[locale]/. The es value is the
  // public Spanish URL segment — next-intl rewrites it back to the canonical
  // route internally, so no folders need to move. Dynamic [slug] values are
  // substituted verbatim (per-locale slugs are handled at the data layer).
  pathnames: {
    "/": "/",
    "/excursions": { en: "/excursions", es: "/excursiones" },
    "/excursions/[slug]": { en: "/excursions/[slug]", es: "/excursiones/[slug]" },
    "/scuba-diving": { en: "/scuba-diving", es: "/buceo" },
    "/scuba-diving/[slug]": { en: "/scuba-diving/[slug]", es: "/buceo/[slug]" },
    "/about": { en: "/about", es: "/sobre-nosotros" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": { en: "/contact", es: "/contacto" },
    "/faq": { en: "/faq", es: "/preguntas-frecuentes" },
    "/how-it-works": { en: "/how-it-works", es: "/como-funciona" },
    "/privacy-policy": { en: "/privacy-policy", es: "/politica-de-privacidad" },
    "/terms-of-service": { en: "/terms-of-service", es: "/terminos-de-servicio" },
    "/cancellation-policy": {
      en: "/cancellation-policy",
      es: "/politica-de-cancelacion",
    },
  },
});
