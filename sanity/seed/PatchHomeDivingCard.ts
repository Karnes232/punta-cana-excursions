import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchHomeDivingCard — additive patch for the live homePage doc.

   Sets the Scuba Diving card's title + description (the 6th card in the
   "Browse by Category" grid). Uses .set() only — non-destructive, leaves all
   other Home content and images untouched.

   NOTE: the card only appears once the "Diving Card Image" is uploaded in
   Studio (images can't be set from this text patch).

   Run: npx tsx sanity/seed/PatchHomeDivingCard.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  console.log("🩹 Patching Home Page — Scuba Diving card...\n");

  await client
    .patch("homePage")
    .set({
      divingCardTitle: { en: "Scuba Diving", es: "Buceo" },
      divingCardDescription: {
        en: "Explore reefs, wrecks, and the Caribbean's clear blue depths.",
        es: "Explora arrecifes, naufragios y las claras profundidades azules del Caribe.",
      },
    })
    .commit();

  console.log("✅ Home Page patched (Scuba Diving card text).");
  console.log("📸 Upload the Diving Card Image in Studio for the card to appear.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
