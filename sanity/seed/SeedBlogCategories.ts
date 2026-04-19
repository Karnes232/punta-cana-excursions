import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const categories = [
  {
    _id: "blog-category-travel-tips",
    _type: "blogCategory",
    title: { en: "Travel Tips", es: "Consejos de Viaje" },
    slug: { _type: "slug", current: "travel-tips" },
    sortOrder: 10,
  },
  {
    _id: "blog-category-marine-life",
    _type: "blogCategory",
    title: { en: "Marine Life", es: "Vida Marina" },
    slug: { _type: "slug", current: "marine-life" },
    sortOrder: 20,
  },
  {
    _id: "blog-category-local-culture",
    _type: "blogCategory",
    title: { en: "Local Culture", es: "Cultura Local" },
    slug: { _type: "slug", current: "local-culture" },
    sortOrder: 30,
  },
  {
    _id: "blog-category-adventure",
    _type: "blogCategory",
    title: { en: "Adventure", es: "Aventura" },
    slug: { _type: "slug", current: "adventure" },
    sortOrder: 40,
  },
  {
    _id: "blog-category-family",
    _type: "blogCategory",
    title: { en: "Family", es: "Familia" },
    slug: { _type: "slug", current: "family" },
    sortOrder: 50,
  },
];

async function seed() {
  for (const cat of categories) {
    await client.createOrReplace(cat);
    console.log(`✅ ${cat._id}`);
  }
  console.log("\nAll blog categories seeded.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
