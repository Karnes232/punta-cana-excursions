import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchFaqHeroEyebrow — additive patch for the live faqPage doc.

   Sets the new hero eyebrow. Uses .set() only — non-destructive, leaves the
   hero image, headline, categories, and SEO untouched.

   Run: npx tsx sanity/seed/PatchFaqHeroEyebrow.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  console.log("🩹 Patching FAQ Page — hero eyebrow...\n");

  await client
    .patch("faqPage")
    .set({
      heroEyebrow: { en: "Got Questions?", es: "¿Tienes Preguntas?" },
    })
    .commit();

  console.log("✅ FAQ Page patched (hero eyebrow).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
