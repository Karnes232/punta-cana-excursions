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

async function seed() {
  await client.createOrReplace({
    _id: "blogPage",
    _type: "blogPage",
    heroHeadline: {
      en: "Travel Tips & Stories",
      es: "Consejos de Viaje e Historias",
    },
    heroSubheadline: {
      en: "Expert advice, local insights, and inspiration for your next Punta Cana adventure — available in multiple languages.",
      es: "Consejos de expertos, perspectivas locales e inspiración para tu próxima aventura en Punta Cana — disponible en varios idiomas.",
    },
  });
  console.log("✅ blogPage seeded");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
