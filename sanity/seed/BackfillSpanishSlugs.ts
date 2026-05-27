import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * One-off backfill: populate `slugEs` on existing excursion / divingExcursion
 * documents that don't have one yet. Derives the Spanish slug from `title.es`,
 * falling back to the existing English slug when no Spanish title exists.
 *
 * Run with:  npx tsx sanity/seed/BackfillSpanishSlugs.ts
 */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// Matches the slugify in the excursion / divingExcursion schemas.
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .slice(0, 96);
}

interface DocToBackfill {
  _id: string;
  titleEs?: string;
  slugCurrent?: string;
}

async function backfillType(type: "excursion" | "divingExcursion") {
  const docs = await client.fetch<DocToBackfill[]>(
    `*[_type == $type && !defined(slugEs.current) && defined(slug.current)]{
      _id,
      "titleEs": title.es,
      "slugCurrent": slug.current
    }`,
    { type },
  );

  if (docs.length === 0) {
    console.log(`  ✅ ${type}: nothing to backfill`);
    return;
  }

  for (const doc of docs) {
    const current =
      doc.titleEs && doc.titleEs.trim() !== ""
        ? slugify(doc.titleEs)
        : (doc.slugCurrent ?? "");
    if (!current) {
      console.warn(`  ⚠️  ${type} ${doc._id}: no source for slugEs — skipped`);
      continue;
    }
    await client
      .patch(doc._id)
      .set({ slugEs: { _type: "slug", current } })
      .commit();
    console.log(`  ✅ ${type} ${doc._id} → slugEs "${current}"`);
  }
}

async function run() {
  console.log("🔤  Backfilling Spanish slugs...\n");
  await backfillType("excursion");
  await backfillType("divingExcursion");
  console.log("\n✨  Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
