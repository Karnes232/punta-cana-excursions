import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchAboutWhereWeOperate — additive patch for the live aboutPage doc.

   Sets the new "Where We Operate" fields + the CTA eyebrow. Uses .set() only,
   so it touches nothing else (images, story/values/beliefs content untouched).

   Run: npx tsx sanity/seed/PatchAboutWhereWeOperate.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// Block-content helper (each block + span needs a _key)
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
  console.log("🩹 Patching About Page — Where We Operate + CTA eyebrow...\n");

  await client
    .patch("aboutPage")
    .set({
      operateEyebrow: { en: "Where We Operate", es: "Dónde Operamos" },
      operateHeadline: {
        en: "Serving All of Punta Cana & the East Coast",
        es: "Servimos Todo Punta Cana y la Costa Este",
      },
      operateBody: {
        en: blocks([
          "We pick up guests from hotels and resorts across the Punta Cana region — including Bávaro, Cap Cana, Uvero Alto, and Macao. Wherever you're staying along the coast, we'll get you to the adventure and back, hassle-free.",
        ]),
        es: blocks([
          "Recogemos a nuestros huéspedes en hoteles y resorts de toda la región de Punta Cana, incluyendo Bávaro, Cap Cana, Uvero Alto y Macao. Dondequiera que te alojes en la costa, te llevamos a la aventura y de regreso, sin complicaciones.",
        ]),
      },
      ctaEyebrow: { en: "Your Adventure Awaits", es: "Tu Aventura Te Espera" },
    })
    .commit();

  console.log("✅ About Page patched (Where We Operate + CTA eyebrow).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
