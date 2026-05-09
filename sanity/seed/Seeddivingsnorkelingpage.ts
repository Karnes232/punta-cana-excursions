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

/* ---------------------------------------------------------------------------
   Seed: Diving & Snorkeling Page (singleton)
   
   Run with: npx tsx src/sanity/seed/seedDivingSnorkelingPage.ts
   --------------------------------------------------------------------------- */

const DOCUMENT_ID = "divingSnorkelingPage";

const divingSnorkelingPageData = {
  _id: DOCUMENT_ID,
  _type: "divingSnorkelingPage",

  // ─── Hero ──────────────────────────────────────────────────────────────────

  heroBadge: {
    en: "Grand Bay Diving Expertise",
    es: "Experiencia de Buceo Grand Bay",
  },

  heroHeadline: {
    en: "Dive Into the Caribbean's Best Underwater Experiences",
    es: "Sumérgete en las Mejores Experiencias Submarinas del Caribe",
  },

  heroSubheadline: {
    en: "From vibrant coral reefs to crystal-clear snorkeling spots, explore Punta Cana's underwater world with a team that's been diving these waters for years.",
    es: "Desde vibrantes arrecifes de coral hasta lugares cristalinos para snorkel, explora el mundo submarino de Punta Cana con un equipo que lleva años buceando estas aguas.",
  },

  heroPrimaryCTA: {
    text: {
      en: "Explore Diving Trips",
      es: "Explorar Buceo",
    },
    href: "/scuba-diving",
  },

  heroSecondaryCTA: {
    text: {
      en: "Snorkeling Adventures",
      es: "Aventuras de Snorkel",
    },
    href: "/scuba-diving",
  },

  // ─── Intro ──────────────────────────────────────────────────────────────────

  introTagline: {
    en: "Our Diving Heritage",
    es: "Nuestra Herencia de Buceo",
  },

  introHeadline: {
    en: "Punta Cana's Trusted Dive Team",
    es: "El Equipo de Buceo de Confianza en Punta Cana",
  },

  // Note: introBody would be Portable Text in production — seed as simple text
  // for the schema to accept, or create manually in Studio
  introBody: {
    en: [
      {
        _type: "block",
        _key: "intro-en-1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "intro-en-1-span",
            text: "Grand Bay's connection to the water goes back to our roots. Before launching Punta Cana Excursions, our team built years of experience in diving and snorkeling operations across the Dominican Republic's most stunning coastal areas.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "intro-en-2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "intro-en-2-span",
            text: "That hands-on experience means we know every reef, every current, and every hidden spot worth visiting. Whether you're a certified diver looking for your next adventure or a first-time snorkeler wanting a safe, guided experience — we've got you covered.",
            marks: [],
          },
        ],
      },
    ],
    es: [
      {
        _type: "block",
        _key: "intro-es-1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "intro-es-1-span",
            text: "La conexión de Grand Bay con el agua viene desde nuestros orígenes. Antes de lanzar Punta Cana Excursions, nuestro equipo acumuló años de experiencia en operaciones de buceo y snorkel en las zonas costeras más impresionantes de República Dominicana.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "intro-es-2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "intro-es-2-span",
            text: "Esa experiencia práctica significa que conocemos cada arrecife, cada corriente y cada rincón escondido que vale la pena visitar. Ya seas un buceador certificado buscando tu próxima aventura o un principiante que quiere una experiencia segura y guiada — te tenemos cubierto.",
            marks: [],
          },
        ],
      },
    ],
  },

  introStats: [
    {
      _key: "stat-1",
      value: { en: "10+", es: "10+" },
      label: { en: "Years Experience", es: "Años de Experiencia" },
    },
    {
      _key: "stat-2",
      value: { en: "5,000+", es: "5,000+" },
      label: { en: "Dives Completed", es: "Inmersiones Realizadas" },
    },
    {
      _key: "stat-3",
      value: { en: "PADI", es: "PADI" },
      label: { en: "Certified Instructors", es: "Instructores Certificados" },
    },
  ],

  // ─── Trust Pillars ─────────────────────────────────────────────────────────

  trustHeadline: {
    en: "Why Book Your Water Adventures With Grand Bay",
    es: "Por Qué Reservar Tus Aventuras Acuáticas Con Grand Bay",
  },

  trustPillars: [
    {
      _key: "trust-1",
      icon: "certified",
      title: {
        en: "Certified & Experienced Guides",
        es: "Guías Certificados y Experimentados",
      },
      description: {
        en: "All our dive instructors hold PADI certifications and have years of experience in Punta Cana's waters.",
        es: "Todos nuestros instructores de buceo tienen certificaciones PADI y años de experiencia en las aguas de Punta Cana.",
      },
    },
    {
      _key: "trust-2",
      icon: "safety",
      title: {
        en: "Safety-First Approach",
        es: "La Seguridad es Primero",
      },
      description: {
        en: "Professional-grade equipment, thorough safety briefings, and small group sizes ensure your comfort and safety.",
        es: "Equipo de grado profesional, briefings de seguridad completos y grupos pequeños garantizan tu comodidad y seguridad.",
      },
    },
    {
      _key: "trust-3",
      icon: "local",
      title: {
        en: "Local Knowledge, Hidden Spots",
        es: "Conocimiento Local, Lugares Escondidos",
      },
      description: {
        en: "We take you to the best reefs and snorkeling spots that only locals know — not just the overcrowded tourist stops.",
        es: "Te llevamos a los mejores arrecifes y spots de snorkel que solo los locales conocen — no solo las paradas turísticas saturadas.",
      },
    },
    {
      _key: "trust-4",
      icon: "experience",
      title: {
        en: "All Levels Welcome",
        es: "Todos los Niveles Son Bienvenidos",
      },
      description: {
        en: "From complete beginners to experienced divers, we match the right trip to your skill level and comfort.",
        es: "Desde principiantes completos hasta buzos experimentados, combinamos el viaje correcto con tu nivel y comodidad.",
      },
    },
  ],

  // ─── CTA ───────────────────────────────────────────────────────────────────

  ctaHeadline: {
    en: "Ready to Explore Underwater Punta Cana?",
    es: "¿Listo para Explorar el Punta Cana Submarino?",
  },

  ctaButtonText: {
    en: "Chat With Us on WhatsApp",
    es: "Chatea Con Nosotros por WhatsApp",
  },

  ctaWhatsappNumber: "18095551234",

  // ─── SEO ───────────────────────────────────────────────────────────────────

  seo: {
    metaTitle: {
      en: "Scuba Diving in Punta Cana | Grand Bay Excursions",
      es: "Buceo en Punta Cana | Excursiones Grand Bay",
    },
    metaDescription: {
      en: "Explore Punta Cana's best scuba diving experiences with certified local guides. PADI-certified instructors, top equipment, and hidden reef spots. Book with Grand Bay.",
      es: "Explora las mejores experiencias de buceo en Punta Cana con guías locales certificados. Instructores PADI, equipo de primera y arrecifes escondidos. Reserva con Grand Bay.",
    },
  },
};

async function seed() {
  console.log("🤿 Seeding Diving & Snorkeling page...\n");

  try {
    const result = await client.createOrReplace(divingSnorkelingPageData);
    console.log(`✅ Created/replaced: ${result._id}`);
  } catch (error) {
    console.error("❌ Error seeding Diving & Snorkeling page:", error);
    process.exit(1);
  }

  console.log("\n🎉 Diving & Snorkeling page seeded successfully!");
  console.log("   Run: npx tsx src/sanity/seed/seedDivingSnorkelingPage.ts");
}

seed();
