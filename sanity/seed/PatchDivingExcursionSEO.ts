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

// =============================================================================
// SEO data per diving excursion document
// =============================================================================

const seoPatches: Array<{
  id: string;
  label: string;
  seo: {
    metaTitle: { en: string; es: string };
    metaDescription: { en: string; es: string };
  };
}> = [
  {
    id: "diving-excursion-caribbean-reef-snorkeling",
    label: "Caribbean Reef Snorkeling",
    seo: {
      metaTitle: {
        en: "Caribbean Reef Snorkeling in Punta Cana | Grand Bay",
        es: "Snorkel en el Arrecife Caribeño en Punta Cana | Grand Bay",
      },
      metaDescription: {
        en: "Snorkel with sea turtles, eagle rays & tropical fish on Punta Cana's vibrant coral reefs. 3-hour guided tour from $55. All equipment included. Book now!",
        es: "Nada junto a tortugas, rayas águila y peces tropicales en los arrecifes de Punta Cana. Tour guiado de 3 horas desde $55. Todo el equipo incluido. ¡Reserva ya!",
      },
    },
  },
  {
    id: "diving-excursion-discover-scuba-diving",
    label: "Discover Scuba Diving",
    seo: {
      metaTitle: {
        en: "Discover Scuba Diving in Punta Cana | No Cert Required",
        es: "Bautismo de Buceo en Punta Cana | Sin Certificación Necesaria",
      },
      metaDescription: {
        en: "Try scuba diving for the first time in Punta Cana! No certification needed. 1-tank guided dive to 40 ft with sea turtles & tropical reef fish. From $89.",
        es: "¡Prueba el buceo por primera vez en Punta Cana! Sin certificación necesaria. Inmersión guiada a 12 m con tortugas marinas y peces de arrecife. Desde $89.",
      },
    },
  },
  {
    id: "diving-excursion-two-tank-reef-dive",
    label: "Two-Tank Certified Reef Dive",
    seo: {
      metaTitle: {
        en: "Two-Tank Reef Dive in Punta Cana | Certified Divers",
        es: "Buceo de Dos Tanques en Punta Cana | Buceadores Certificados",
      },
      metaDescription: {
        en: "Explore Punta Cana's best reef walls on a 2-tank certified dive. Dive to 60 ft with barracuda, grouper & manta rays. PADI Open Water required. From $120.",
        es: "Explora los mejores arrecifes de Punta Cana en dos inmersiones certificadas. Bucea hasta 18 m con barracudas, meros y rayas manta. PADI requerido. Desde $120.",
      },
    },
  },
  {
    id: "diving-excursion-snuba-adventure",
    label: "Snuba Adventure",
    seo: {
      metaTitle: {
        en: "Snuba Adventure in Punta Cana | No Scuba Cert Needed",
        es: "Aventura Snuba en Punta Cana | Sin Certificación de Buceo",
      },
      metaDescription: {
        en: "Experience the best of snorkeling and scuba with Snuba in Punta Cana. Breathe underwater without a certification. 2.5-hour tour, up to 20 ft deep. From $75.",
        es: "Vive lo mejor del snorkel y el buceo con Snuba en Punta Cana. Respira bajo el agua sin certificación. Tour de 2.5 horas, hasta 6 metros de profundidad. Desde $75.",
      },
    },
  },
];

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log("🔍 Patching SEO fields on diving excursion documents...\n");

  for (const { id, label, seo } of seoPatches) {
    try {
      await client.patch(id).set({ seo }).commit();
      console.log(`✅ ${label} (${id})`);
    } catch (err) {
      console.error(`❌ Failed to patch ${id}:`, err);
    }
  }

  console.log("\n🎉 All diving excursion SEO fields patched.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
