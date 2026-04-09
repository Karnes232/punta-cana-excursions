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
// We need ExcursionCategory references — fetch existing ones by slug
// =============================================================================

async function getCategoryId(slug: string): Promise<string | null> {
  const result = await client.fetch<{ _id: string } | null>(
    `*[_type == "excursionCategory" && slug.current == $slug][0]{ _id }`,
    { slug },
  );
  return result?._id ?? null;
}

// =============================================================================
// Excursion seed data
// =============================================================================

interface ExcursionSeed {
  title: { en: string; es: string };
  slug: string;
  shortSummary: { en: string; es: string };
  categorySlug: string;
  price: number;
  depositAmount: number;
  priceNote: { en: string; es: string };
  duration: { en: string; es: string };
  pickupTime: { en: string; es: string };
  pickupZones: string[];
  groupSize: { en: string; es: string };
  highlights: { en: string[]; es: string[] };
  whatsIncluded: { en: string[]; es: string[] };
  whatToBring: { en: string[]; es: string[] };
  restrictions: { en: string[]; es: string[] };
  faq: Array<{
    question: { en: string; es: string };
    answer: { en: string; es: string };
  }>;
  isFeatured: boolean;
  badge: { en: string; es: string } | null;
  sortOrder: number;
}

const excursions: ExcursionSeed[] = [
  // ─── 1. Saona Island Full Day ─────────────────────────────────────────────
  {
    title: {
      en: "Saona Island Full Day",
      es: "Isla Saona Día Completo",
    },
    slug: "saona-island-full-day",
    shortSummary: {
      en: "Sail to the stunning Saona Island with a catamaran ride, natural pool stop, open bar, and beach buffet lunch.",
      es: "Navega hasta la impresionante Isla Saona en catamarán con parada en piscina natural, barra libre y almuerzo buffet en la playa.",
    },
    categorySlug: "island-tours",
    price: 89,
    depositAmount: 25,
    priceNote: { en: "per person", es: "por persona" },
    duration: { en: "Full day (8–9 hours)", es: "Día completo (8–9 horas)" },
    pickupTime: {
      en: "6:00 AM – 7:30 AM depending on hotel location",
      es: "6:00 AM – 7:30 AM según la ubicación del hotel",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana", "Uvero Alto"],
    groupSize: { en: "2–50 people", es: "2–50 personas" },
    highlights: {
      en: [
        "Catamaran ride through turquoise waters",
        "Stop at the famous natural pool with starfish",
        "Open bar with rum, beer, sodas, and water",
        "Beach buffet lunch with Dominican flavors",
        "Free time to swim, snorkel, and relax on white sand",
        "Professional photographer on board",
      ],
      es: [
        "Paseo en catamarán por aguas turquesas",
        "Parada en la famosa piscina natural con estrellas de mar",
        "Barra libre con ron, cerveza, refrescos y agua",
        "Almuerzo buffet en la playa con sabores dominicanos",
        "Tiempo libre para nadar, snorkelear y relajarte en arena blanca",
        "Fotógrafo profesional a bordo",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Catamaran boat ride",
        "Natural pool stop",
        "Open bar (rum, beer, soft drinks, water)",
        "Beach buffet lunch",
        "Bilingual guide",
        "Lounge chairs and beach area",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Paseo en catamarán",
        "Parada en piscina natural",
        "Barra libre (ron, cerveza, refrescos, agua)",
        "Almuerzo buffet en la playa",
        "Guía bilingüe",
        "Sillas de playa y área de descanso",
      ],
    },
    whatToBring: {
      en: [
        "Sunscreen (reef-safe preferred)",
        "Towel",
        "Swimsuit (wear it under your clothes)",
        "Cash for tips and souvenirs",
        "Waterproof phone case",
        "Sunglasses",
      ],
      es: [
        "Protector solar (preferiblemente biodegradable)",
        "Toalla",
        "Traje de baño (ponlo debajo de la ropa)",
        "Efectivo para propinas y recuerdos",
        "Funda impermeable para el teléfono",
        "Gafas de sol",
      ],
    },
    restrictions: {
      en: [
        "Not recommended for pregnant women",
        "Children under 2 travel free (must be accompanied by an adult)",
        "Wheelchair access not available on the boat",
        "Subject to weather conditions — we will notify you in advance if cancelled",
      ],
      es: [
        "No recomendado para mujeres embarazadas",
        "Niños menores de 2 años viajan gratis (deben ir acompañados de un adulto)",
        "El barco no tiene acceso para sillas de ruedas",
        "Sujeto a condiciones climáticas — te notificaremos con anticipación si se cancela",
      ],
    },
    faq: [
      {
        question: {
          en: "Is transportation included from my hotel?",
          es: "¿Está incluido el transporte desde mi hotel?",
        },
        answer: {
          en: "Yes! We pick you up and drop you off directly at your hotel. Pickup times vary depending on your hotel location in the Punta Cana area.",
          es: "¡Sí! Te recogemos y te dejamos directamente en tu hotel. Los horarios de recogida varían según la ubicación de tu hotel en la zona de Punta Cana.",
        },
      },
      {
        question: {
          en: "Can I bring my own food or drinks?",
          es: "¿Puedo llevar mi propia comida o bebidas?",
        },
        answer: {
          en: "You're welcome to bring snacks, but we provide a full open bar and beach buffet lunch so you won't need much!",
          es: "Puedes traer snacks, pero ofrecemos barra libre y almuerzo buffet en la playa, ¡así que no necesitarás mucho!",
        },
      },
      {
        question: {
          en: "What happens if the weather is bad?",
          es: "¿Qué pasa si el clima está malo?",
        },
        answer: {
          en: "If the trip is cancelled due to weather, we'll offer you an alternative date or a full refund of your deposit. We'll notify you the evening before.",
          es: "Si el viaje se cancela por el clima, te ofreceremos una fecha alternativa o reembolso completo del depósito. Te avisaremos la noche anterior.",
        },
      },
    ],
    isFeatured: true,
    badge: { en: "Most Popular", es: "Más Popular" },
    sortOrder: 10,
  },

  // ─── 2. Catamaran Party Cruise ────────────────────────────────────────────
  {
    title: {
      en: "Catamaran Party Cruise",
      es: "Crucero Fiesta en Catamarán",
    },
    slug: "catamaran-party-cruise",
    shortSummary: {
      en: "A vibrant half-day catamaran cruise with music, dancing, open bar, snorkeling, and a stop at a stunning natural pool.",
      es: "Un vibrante crucero de medio día en catamarán con música, baile, barra libre, snorkel y parada en una piscina natural impresionante.",
    },
    categorySlug: "catamaran",
    price: 69,
    depositAmount: 20,
    priceNote: { en: "per person", es: "por persona" },
    duration: { en: "4 hours", es: "4 horas" },
    pickupTime: {
      en: "8:30 AM or 1:00 PM (morning or afternoon departure)",
      es: "8:30 AM o 1:00 PM (salida por la mañana o por la tarde)",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "10–40 people", es: "10–40 personas" },
    highlights: {
      en: [
        "Open bar with rum cocktails, beer, and soft drinks",
        "Live DJ and dancing on deck",
        "Snorkeling stop at a coral reef",
        "Natural pool swim stop",
        "Stunning views of the Punta Cana coastline",
      ],
      es: [
        "Barra libre con cócteles de ron, cerveza y refrescos",
        "DJ en vivo y baile en cubierta",
        "Parada de snorkel en un arrecife de coral",
        "Parada de natación en piscina natural",
        "Vistas impresionantes de la costa de Punta Cana",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Catamaran cruise",
        "Open bar",
        "Snorkeling equipment",
        "DJ and music entertainment",
        "Bilingual crew",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Crucero en catamarán",
        "Barra libre",
        "Equipo de snorkel",
        "DJ y entretenimiento musical",
        "Tripulación bilingüe",
      ],
    },
    whatToBring: {
      en: ["Sunscreen", "Towel", "Swimsuit", "Good vibes and dancing shoes"],
      es: [
        "Protector solar",
        "Toalla",
        "Traje de baño",
        "Buena vibra y ganas de bailar",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 18 years (alcoholic beverages served)",
        "Not recommended for people with severe motion sickness",
      ],
      es: [
        "Edad mínima: 18 años (se sirven bebidas alcohólicas)",
        "No recomendado para personas con mareo severo",
      ],
    },
    faq: [
      {
        question: {
          en: "Is this excursion family-friendly?",
          es: "¿Esta excursión es apta para familias?",
        },
        answer: {
          en: "This is a party cruise aimed at adults. For families, we recommend the Saona Island or Catamaran Snorkel excursion instead.",
          es: "Este es un crucero fiesta para adultos. Para familias, recomendamos la excursión a Isla Saona o el Catamarán Snorkel.",
        },
      },
    ],
    isFeatured: false,
    badge: null,
    sortOrder: 20,
  },

  // ─── 3. Zip Line & Eco Adventure Park ────────────────────────────────────
  {
    title: {
      en: "Zip Line & Eco Adventure Park",
      es: "Tirolesa y Parque de Eco Aventura",
    },
    slug: "zip-line-eco-adventure-park",
    shortSummary: {
      en: "Soar through the Dominican treetops on thrilling zip lines, splash in natural river pools, and ride horses through the jungle.",
      es: "Vuela por las copas de los árboles dominicanos en emocionantes tirolesas, chapotea en piscinas naturales de río y monta a caballo por la selva.",
    },
    categorySlug: "adventure",
    price: 85,
    depositAmount: 25,
    priceNote: { en: "per person", es: "por persona" },
    duration: { en: "5 hours", es: "5 horas" },
    pickupTime: {
      en: "7:30 AM – 9:00 AM depending on hotel location",
      es: "7:30 AM – 9:00 AM según la ubicación del hotel",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "2–25 people", es: "2–25 personas" },
    highlights: {
      en: [
        "12 zip lines through lush tropical canopy",
        "Natural river pool swimming",
        "Horseback riding through the countryside",
        "Dominican coffee and chocolate tasting",
        "Authentic Dominican lunch",
        "Stunning mountain and jungle views",
      ],
      es: [
        "12 tirolesas a través del frondoso dosel tropical",
        "Natación en piscina natural de río",
        "Cabalgata por el campo dominicano",
        "Degustación de café y chocolate dominicano",
        "Almuerzo dominicano auténtico",
        "Vistas impresionantes de montaña y selva",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Professional zip line guides and safety equipment",
        "Horseback riding",
        "Natural pool access",
        "Dominican lunch",
        "Coffee and chocolate tasting",
        "Bilingual guide",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Guías profesionales de tirolesa y equipo de seguridad",
        "Cabalgata",
        "Acceso a piscina natural",
        "Almuerzo dominicano",
        "Degustación de café y chocolate",
        "Guía bilingüe",
      ],
    },
    whatToBring: {
      en: [
        "Closed-toe shoes (required for zip lines)",
        "Comfortable clothes you don't mind getting wet",
        "Sunscreen and bug spray",
        "Cash for tips",
        "Towel",
      ],
      es: [
        "Zapatos cerrados (requeridos para las tirolesas)",
        "Ropa cómoda que pueda mojarse",
        "Protector solar y repelente de insectos",
        "Efectivo para propinas",
        "Toalla",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 6 years",
        "Maximum weight for zip line: 250 lbs (113 kg)",
        "Not recommended for people with severe back or heart conditions",
        "Closed-toe shoes required — no sandals or flip-flops",
      ],
      es: [
        "Edad mínima: 6 años",
        "Peso máximo para tirolesa: 113 kg (250 lbs)",
        "No recomendado para personas con problemas severos de espalda o corazón",
        "Se requieren zapatos cerrados — no sandalias ni chancletas",
      ],
    },
    faq: [
      {
        question: {
          en: "Do I need experience for the zip lines?",
          es: "¿Necesito experiencia para las tirolesas?",
        },
        answer: {
          en: "No experience needed! Our professional guides will give you full instructions and help you every step of the way.",
          es: "¡No necesitas experiencia! Nuestros guías profesionales te darán instrucciones completas y te ayudarán en cada paso.",
        },
      },
      {
        question: {
          en: "Is this safe for kids?",
          es: "¿Es seguro para niños?",
        },
        answer: {
          en: "Yes, children 6 and older can participate in all activities. Younger kids can enjoy the river pool and horseback riding while parents do the zip lines.",
          es: "Sí, niños de 6 años en adelante pueden participar en todas las actividades. Los más pequeños pueden disfrutar la piscina del río y la cabalgata mientras los padres hacen las tirolesas.",
        },
      },
    ],
    isFeatured: true,
    badge: { en: "Best Seller", es: "Más Vendido" },
    sortOrder: 30,
  },

  // ─── 4. Snorkeling & Reef Explorer ────────────────────────────────────────
  {
    title: {
      en: "Snorkeling & Reef Explorer",
      es: "Snorkel y Exploración de Arrecifes",
    },
    slug: "snorkeling-reef-explorer",
    shortSummary: {
      en: "Discover the vibrant coral reefs of Punta Cana on a guided snorkeling adventure with expert dive instructors from Grand Bay.",
      es: "Descubre los vibrantes arrecifes de coral de Punta Cana en una aventura de snorkel guiada con instructores expertos de Grand Bay.",
    },
    categorySlug: "snorkeling",
    price: 59,
    depositAmount: 15,
    priceNote: { en: "per person", es: "por persona" },
    duration: { en: "3 hours", es: "3 horas" },
    pickupTime: {
      en: "8:00 AM or 1:30 PM",
      es: "8:00 AM o 1:30 PM",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "2–15 people", es: "2–15 personas" },
    highlights: {
      en: [
        "Visit 2–3 different reef sites",
        "Guided by certified Grand Bay dive instructors",
        "See tropical fish, sea turtles, and rays",
        "High-quality snorkeling equipment provided",
        "Small group for a personal experience",
      ],
      es: [
        "Visita 2–3 sitios de arrecifes diferentes",
        "Guiado por instructores de buceo certificados de Grand Bay",
        "Observa peces tropicales, tortugas marinas y rayas",
        "Equipo de snorkel de alta calidad incluido",
        "Grupo pequeño para una experiencia personalizada",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Boat ride to reef sites",
        "Professional-grade snorkeling equipment",
        "Certified dive instructor guide",
        "Bottled water and light snacks",
        "Underwater photos (digital)",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Paseo en bote a los arrecifes",
        "Equipo de snorkel de grado profesional",
        "Guía instructor de buceo certificado",
        "Agua embotellada y snacks ligeros",
        "Fotos subacuáticas (digitales)",
      ],
    },
    whatToBring: {
      en: [
        "Swimsuit",
        "Towel",
        "Reef-safe sunscreen",
        "Waterproof phone case for photos",
      ],
      es: [
        "Traje de baño",
        "Toalla",
        "Protector solar biodegradable",
        "Funda impermeable para fotos",
      ],
    },
    restrictions: {
      en: [
        "Must know how to swim",
        "Minimum age: 6 years",
        "Not recommended for people with severe asthma or breathing conditions",
      ],
      es: [
        "Debe saber nadar",
        "Edad mínima: 6 años",
        "No recomendado para personas con asma severa o condiciones respiratorias",
      ],
    },
    faq: [
      {
        question: {
          en: "Do I need to know how to dive?",
          es: "¿Necesito saber bucear?",
        },
        answer: {
          en: "No diving experience needed — this is snorkeling, so you stay at the surface. Our instructors will help beginners feel comfortable in the water.",
          es: "No necesitas experiencia en buceo — esto es snorkel, así que te quedas en la superficie. Nuestros instructores ayudarán a los principiantes a sentirse cómodos en el agua.",
        },
      },
    ],
    isFeatured: false,
    badge: null,
    sortOrder: 40,
  },
];

// =============================================================================
// Seed runner
// =============================================================================

async function seedExcursions() {
  console.log("🏝️  Seeding excursions...\n");

  for (const exc of excursions) {
    // Look up category reference
    const categoryId = await getCategoryId(exc.categorySlug);
    if (!categoryId) {
      console.warn(
        `⚠️  Category "${exc.categorySlug}" not found — skipping ${exc.title.en}`,
      );
      console.warn(`   Make sure to run seedExcursionCategories first.\n`);
      continue;
    }

    const doc = {
      _type: "excursion" as const,
      _id: `excursion-${exc.slug}`,
      title: exc.title,
      slug: { _type: "slug", current: exc.slug },
      shortSummary: exc.shortSummary,
      category: { _type: "reference", _ref: categoryId },
      price: exc.price,
      depositAmount: exc.depositAmount,
      priceNote: exc.priceNote,
      duration: exc.duration,
      pickupTime: exc.pickupTime,
      pickupZones: exc.pickupZones,
      groupSize: exc.groupSize,
      highlights: exc.highlights,
      whatsIncluded: exc.whatsIncluded,
      whatToBring: exc.whatToBring,
      restrictions: exc.restrictions,
      faq: exc.faq.map((item, i) => ({
        _key: `faq-${i}`,
        _type: "faqItem",
        question: item.question,
        answer: item.answer,
      })),
      isFeatured: exc.isFeatured,
      badge: exc.badge,
      sortOrder: exc.sortOrder,
      // heroImage and gallery left empty — upload images via Studio
      // relatedExcursions left empty — wire up after all excursions exist
      // seo left empty — fill in via Studio
    };

    await client.createOrReplace(doc);
    console.log(`  ✅ ${exc.title.en} (${exc.slug})`);
  }

  // ── Wire up related excursions ──────────────────────────────────────────
  console.log("\n🔗 Wiring related excursions...\n");

  const relatedMap: Record<string, string[]> = {
    "excursion-saona-island-full-day": [
      "excursion-catamaran-party-cruise",
      "excursion-snorkeling-reef-explorer",
      "excursion-zip-line-eco-adventure-park",
    ],
    "excursion-catamaran-party-cruise": [
      "excursion-saona-island-full-day",
      "excursion-snorkeling-reef-explorer",
    ],
    "excursion-zip-line-eco-adventure-park": [
      "excursion-saona-island-full-day",
      "excursion-catamaran-party-cruise",
    ],
    "excursion-snorkeling-reef-explorer": [
      "excursion-saona-island-full-day",
      "excursion-catamaran-party-cruise",
      "excursion-zip-line-eco-adventure-park",
    ],
  };

  for (const [excId, relatedIds] of Object.entries(relatedMap)) {
    await client
      .patch(excId)
      .set({
        relatedExcursions: relatedIds.map((refId) => ({
          _type: "reference",
          _ref: refId,
          _key: refId,
        })),
      })
      .commit();
    console.log(`  🔗 ${excId} → ${relatedIds.length} related`);
  }

  console.log("\n🎉 Excursion seeding complete!");
}

seedExcursions().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
