import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchAboutRichText — migrate the live aboutPage doc to rich text.

   storyBody + valuesSubheading were plain localizedText; they're now
   localizedBlockContent. This patch (.set only) converts them and seeds the
   new "What We Believe" section + the values eyebrow — WITHOUT touching the
   document's uploaded images (unlike the createOrReplace seed).

   Run: npx tsx sanity/seed/PatchAboutRichText.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// =============================================================================
// Block-content helpers (each block + span needs a _key)
// =============================================================================

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

// =============================================================================
// Content
// =============================================================================

const storyBody = {
  en: blocks([
    "Grand Bay was founded in 2015 by a group of Punta Cana locals who believed that travelers deserved more than cookie-cutter tourist packages. We grew up on these beaches, dove in these reefs, and fell in love with every corner of the Dominican Republic's east coast.",
    "What started as a small boat and a big dream has grown into Punta Cana's most trusted excursion company — but we've never lost that personal touch. Every trip we offer is one we'd take our own families on. Every guide on our team is someone we trust with yours.",
    "We keep groups small, experiences genuine, and prices fair. That's the Grand Bay promise.",
  ]),
  es: blocks([
    "Grand Bay fue fundado en 2015 por un grupo de locales de Punta Cana que creían que los viajeros merecían algo más que paquetes turísticos genéricos. Crecimos en estas playas, buceamos en estos arrecifes y nos enamoramos de cada rincón de la costa este de la República Dominicana.",
    "Lo que comenzó como un pequeño bote y un gran sueño se ha convertido en la empresa de excursiones más confiable de Punta Cana, sin perder nunca ese toque personal. Cada viaje que ofrecemos es uno en el que llevaríamos a nuestras propias familias.",
    "Mantenemos los grupos pequeños, las experiencias genuinas y los precios justos. Esa es la promesa de Grand Bay.",
  ]),
};

const valuesSubheading = {
  en: blocks([
    "Every decision we make comes back to one thing: your experience.",
  ]),
  es: blocks([
    "Cada decisión que tomamos tiene un propósito: tu experiencia.",
  ]),
};

const beliefs = [
  {
    _key: key(),
    headline: {
      en: "Local Knowledge, Shared Generously",
      es: "Conocimiento Local, Compartido con Generosidad",
    },
    body: {
      en: blocks([
        "We grew up on these shores. Every reef, current, and hidden cove we show you comes from a lifetime spent exploring this coast.",
      ]),
      es: blocks([
        "Crecimos en estas costas. Cada arrecife, corriente y cala escondida que te mostramos proviene de toda una vida explorando este litoral.",
      ]),
    },
  },
  {
    _key: key(),
    headline: {
      en: "Small Groups, Real Connections",
      es: "Grupos Pequeños, Conexiones Reales",
    },
    body: {
      en: blocks([
        "We cap our group sizes on purpose. Fewer people means more attention, better photos, and a trip that feels personal rather than processed.",
      ]),
      es: blocks([
        "Limitamos el tamaño de nuestros grupos a propósito. Menos personas significa más atención, mejores fotos y un viaje que se siente personal, no industrializado.",
      ]),
    },
  },
  {
    _key: key(),
    headline: {
      en: "Safety Without Compromise",
      es: "Seguridad Sin Concesiones",
    },
    body: {
      en: blocks([
        "Certified guides, inspected equipment, and a spotless record. Your adventure should be thrilling for the right reasons.",
      ]),
      es: blocks([
        "Guías certificados, equipo inspeccionado y un historial impecable. Tu aventura debe ser emocionante por las razones correctas.",
      ]),
    },
  },
];

// =============================================================================
// Patch
// =============================================================================

async function main() {
  console.log("🩹 Patching About Page rich text...\n");

  await client
    .patch("aboutPage")
    .set({
      storyBody,
      valuesEyebrow: { en: "Our Values", es: "Nuestros Valores" },
      valuesSubheading,
      beliefsEyebrow: { en: "What We Believe", es: "Lo Que Creemos" },
      beliefsHeadline: {
        en: "The Principles Behind Every Trip",
        es: "Los Principios Detrás de Cada Viaje",
      },
      beliefsBody: {
        en: blocks([
          "Grand Bay isn't just about getting you out on the water — it's about how we do it. These are the beliefs that shape every excursion we run.",
        ]),
        es: blocks([
          "Grand Bay no se trata solo de llevarte al agua, sino de cómo lo hacemos. Estas son las creencias que dan forma a cada excursión que realizamos.",
        ]),
      },
      beliefs,
    })
    .commit();

  console.log("✅ About Page rich text patched (images preserved).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
