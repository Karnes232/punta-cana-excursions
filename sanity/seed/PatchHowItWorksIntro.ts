import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchHowItWorksIntro — additive patch for the live howItWorksPage doc.

   Sets the hero eyebrow, the new "Intro" section, the steps / FAQ / CTA
   eyebrows, and the CTA secondary button (replacing the old WhatsApp label).
   Uses .set()/.unset() only — non-destructive, leaves the hero image and
   steps/FAQ/CTA copy untouched.

   Run: npx tsx sanity/seed/PatchHowItWorksIntro.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36)}`;
const blocks = (paras: string[]) =>
  paras.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

async function main() {
  console.log("🩹 Patching How It Works Page — eyebrows + intro...\n");

  await client
    .patch("howItWorksPage")
    .set({
      heroEyebrow: { en: "Booking Made Simple", es: "Reservar es Sencillo" },
      introEyebrow: { en: "Before You Book", es: "Antes de Reservar" },
      introHeadline: {
        en: "Booking With Grand Bay Is Refreshingly Simple",
        es: "Reservar con Grand Bay es Refrescantemente Sencillo",
      },
      introBody: {
        en: blocks([
          "Booking with Grand Bay is straightforward, secure, and stress-free — no call centers, no pushy upsells, no hidden fees. Here's exactly what to expect, from the moment you find an excursion you love to the day you step off the boat.",
        ]),
        es: blocks([
          "Reservar con Grand Bay es sencillo, seguro y sin estrés — sin call centers, sin ventas insistentes, sin tarifas ocultas. Esto es exactamente lo que puedes esperar, desde el momento en que encuentras una excursión que te encanta hasta el día en que bajas del barco.",
        ]),
      },
      stepsEyebrow: { en: "The Process", es: "El Proceso" },
      faqEyebrow: { en: "Frequently Asked", es: "Preguntas Frecuentes" },
      ctaEyebrow: { en: "Let's Get Started", es: "Comencemos" },
      ctaSecondaryButtonText: { en: "Contact Us", es: "Contáctanos" },
      ctaSecondaryButtonHref: "/contact",
    })
    .unset(["ctaWhatsappLabel"])
    .commit();

  console.log("✅ How It Works Page patched (eyebrows + intro).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
