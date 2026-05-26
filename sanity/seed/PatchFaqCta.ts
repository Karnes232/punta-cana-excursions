import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchFaqCta — additive patch for the live faqPage doc.

   Sets the bottom CTA banner fields. Uses .set() only — non-destructive, leaves
   the hero image, hero eyebrow, and categories untouched.

   Run: npx tsx sanity/seed/PatchFaqCta.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  console.log("🩹 Patching FAQ Page — CTA banner...\n");

  await client
    .patch("faqPage")
    .set({
      ctaEyebrow: { en: "Still Have Questions?", es: "¿Aún Tienes Preguntas?" },
      ctaHeadline: { en: "We're Here to Help", es: "Estamos Aquí para Ayudarte" },
      ctaSubheadline: {
        en: "Can't find what you're looking for? Reach out and we'll get back to you fast.",
        es: "¿No encuentras lo que buscas? Escríbenos y te responderemos rápido.",
      },
      ctaPrimaryButtonText: { en: "Contact Us", es: "Contáctanos" },
      ctaPrimaryButtonHref: "/contact",
      ctaSecondaryButtonText: { en: "Browse Excursions", es: "Ver Excursiones" },
      ctaSecondaryButtonHref: "/excursions",
    })
    .commit();

  console.log("✅ FAQ Page patched (CTA banner).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
