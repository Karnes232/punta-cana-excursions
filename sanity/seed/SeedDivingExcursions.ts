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
// Scuba diving excursion seed data
// =============================================================================

interface DivingExcursionSeed {
  slug: string;
  title: { en: string; es: string };
  shortSummary: { en: string; es: string };
  externalBookingUrl: string;
  experienceLevel: "all-levels" | "beginner" | "intermediate" | "advanced";
  certificationRequired: boolean;
  certificationDetails?: { en: string; es: string };
  maxDepth?: { en: string; es: string };
  numberOfDives?: number;
  marineLife: { en: string[]; es: string[] };
  equipmentProvided: { en: string[]; es: string[] };
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

const divingExcursions: DivingExcursionSeed[] = [
  // ─── 1. Discover Scuba Diving ──────────────────────────────────────────────
  {
    slug: "discover-scuba-diving",
    title: {
      en: "Discover Scuba Diving",
      es: "Descubre el Buceo",
    },
    shortSummary: {
      en: "No certification needed — take your first breath underwater with a PADI-certified instructor guiding you every fin kick of the way.",
      es: "Sin certificación necesaria — respira bajo el agua por primera vez con un instructor certificado PADI guiándote en cada palada.",
    },
    externalBookingUrl: "https://www.puntacana-excursions.com/scuba-diving/discover-scuba-diving",
    experienceLevel: "beginner",
    certificationRequired: false,
    maxDepth: { en: "12 meters (40 ft)", es: "12 metros (40 pies)" },
    numberOfDives: 1,
    marineLife: {
      en: [
        "Tropical reef fish",
        "Nurse sharks (resting on the sandy bottom)",
        "Sea turtles",
        "Moray eels",
        "Colorful coral formations",
      ],
      es: [
        "Peces tropicales de arrecife",
        "Tiburones nodriza (descansando en el fondo arenoso)",
        "Tortugas marinas",
        "Morenas",
        "Coloridas formaciones de coral",
      ],
    },
    equipmentProvided: {
      en: [
        "BCD (buoyancy control device)",
        "Regulator",
        "Wetsuit",
        "Mask & fins",
        "Weight belt",
        "Dive tank",
      ],
      es: [
        "BCD (dispositivo de control de flotabilidad)",
        "Regulador",
        "Traje de neopreno",
        "Máscara y aletas",
        "Cinturón de lastre",
        "Tanque de buceo",
      ],
    },
    price: 89,
    depositAmount: 25,
    priceNote: { en: "per person — all equipment included", es: "por persona — todo el equipo incluido" },
    duration: { en: "3 hours", es: "3 horas" },
    pickupTime: {
      en: "8:00 AM – 9:00 AM depending on hotel location",
      es: "8:00 AM – 9:00 AM según la ubicación del hotel",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "2–8 people (1 instructor per 2 divers)", es: "2–8 personas (1 instructor por 2 buceadores)" },
    highlights: {
      en: [
        "No certification required — just show up and dive",
        "1-on-1 ratio: one PADI instructor per 2 guests maximum",
        "Pool session briefing before entering the ocean",
        "Dive to 12 meters alongside nurse sharks and sea turtles",
        "All professional dive equipment provided",
        "Underwater photos included",
      ],
      es: [
        "Sin certificación requerida — solo llega y bucea",
        "Ratio 1 a 1: un instructor PADI por cada 2 huéspedes máximo",
        "Sesión de preparación en piscina antes de entrar al océano",
        "Bucea a 12 metros junto a tiburones nodriza y tortugas marinas",
        "Todo el equipo de buceo profesional incluido",
        "Fotos subacuáticas incluidas",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Pool briefing session",
        "Full dive equipment",
        "PADI-certified instructor (max 2 guests per instructor)",
        "Boat ride to dive site",
        "Underwater photos (digital)",
        "Bottled water",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Sesión de preparación en piscina",
        "Equipo de buceo completo",
        "Instructor certificado PADI (máx. 2 huéspedes por instructor)",
        "Paseo en bote al sitio de buceo",
        "Fotos subacuáticas (digitales)",
        "Agua embotellada",
      ],
    },
    whatToBring: {
      en: [
        "Swimsuit",
        "Towel",
        "Comfortable clothes over your swimsuit",
        "Cash for tips",
      ],
      es: [
        "Traje de baño",
        "Toalla",
        "Ropa cómoda sobre el traje de baño",
        "Efectivo para propinas",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 10 years",
        "Must be in good general health",
        "Not suitable for people with serious heart, lung, or ear conditions",
        "Not recommended for pregnant women",
        "Not suitable for non-swimmers",
        "You will be asked to complete a brief medical questionnaire",
      ],
      es: [
        "Edad mínima: 10 años",
        "Debe gozar de buena salud general",
        "No apto para personas con condiciones graves del corazón, pulmones u oídos",
        "No recomendado para mujeres embarazadas",
        "No apto para personas que no saben nadar",
        "Se le pedirá completar un breve cuestionario médico",
      ],
    },
    faq: [
      {
        question: {
          en: "Is it safe if I've never dived before?",
          es: "¿Es seguro si nunca he buceado?",
        },
        answer: {
          en: "Absolutely. You'll start with a full briefing and pool session before entering the ocean. Our PADI instructors are with you at all times underwater — you will never dive alone.",
          es: "Absolutamente. Comenzarás con una explicación completa y sesión en piscina antes de entrar al océano. Nuestros instructores PADI estarán contigo en todo momento bajo el agua — nunca bucearás solo.",
        },
      },
      {
        question: {
          en: "Will I actually see sharks?",
          es: "¿Realmente veré tiburones?",
        },
        answer: {
          en: "Nurse sharks are common at our dive sites — they rest on the sandy bottom and are completely harmless. Sightings are frequent but not guaranteed. Many guests say it's the highlight of their trip!",
          es: "Los tiburones nodriza son comunes en nuestros sitios de buceo — descansan en el fondo arenoso y son completamente inofensivos. Los avistamientos son frecuentes pero no garantizados. ¡Muchos huéspedes dicen que es lo mejor de su viaje!",
        },
      },
      {
        question: {
          en: "Can I get my PADI certification after this?",
          es: "¿Puedo obtener mi certificación PADI después de esto?",
        },
        answer: {
          en: "Yes! The Discover Scuba experience counts toward a full PADI Open Water certification. Ask your instructor about upgrading to the full course during your trip.",
          es: "¡Sí! La experiencia Discover Scuba cuenta para una certificación PADI Open Water completa. Pregúntale a tu instructor sobre cómo upgradear al curso completo durante tu estadía.",
        },
      },
    ],
    isFeatured: true,
    badge: { en: "Best for Beginners", es: "Ideal para Principiantes" },
    sortOrder: 20,
  },

  // ─── 2. Two-Tank Certified Reef Dive ──────────────────────────────────────
  {
    slug: "two-tank-reef-dive",
    title: {
      en: "Two-Tank Certified Reef Dive",
      es: "Buceo Certificado de Dos Tanques",
    },
    shortSummary: {
      en: "Two dives at Punta Cana's top reef sites — barracuda, manta rays, moray eels, and pristine coral at depths up to 18 meters. Certification required.",
      es: "Dos inmersiones en los mejores arrecifes de Punta Cana — barracudas, mantas rayas, morenas y coral prístino a profundidades de hasta 18 metros. Certificación requerida.",
    },
    externalBookingUrl: "https://www.puntacana-excursions.com/scuba-diving/two-tank-reef-dive",
    experienceLevel: "advanced",
    certificationRequired: true,
    certificationDetails: {
      en: "PADI Open Water or equivalent certification required",
      es: "Se requiere certificación PADI Open Water o equivalente",
    },
    maxDepth: { en: "18 meters (60 ft)", es: "18 metros (60 pies)" },
    numberOfDives: 2,
    marineLife: {
      en: [
        "Barracuda schools",
        "Manta rays",
        "Moray eels",
        "Grouper and snapper",
        "Lobster and crabs",
        "Pristine coral formations",
      ],
      es: [
        "Cardúmenes de barracudas",
        "Mantas rayas",
        "Morenas",
        "Mero y pargo",
        "Langostas y cangrejos",
        "Prístinas formaciones de coral",
      ],
    },
    equipmentProvided: {
      en: [
        "BCD (buoyancy control device)",
        "Regulator",
        "Wetsuit",
        "Mask & fins",
        "Weight belt",
        "Dive computer",
        "2 dive tanks",
      ],
      es: [
        "BCD (dispositivo de control de flotabilidad)",
        "Regulador",
        "Traje de neopreno",
        "Máscara y aletas",
        "Cinturón de lastre",
        "Computadora de buceo",
        "2 tanques de buceo",
      ],
    },
    price: 120,
    depositAmount: 30,
    priceNote: { en: "per person — all equipment included", es: "por persona — todo el equipo incluido" },
    duration: { en: "4–5 hours", es: "4–5 horas" },
    pickupTime: {
      en: "7:30 AM – 8:30 AM depending on hotel location",
      es: "7:30 AM – 8:30 AM según la ubicación del hotel",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "2–10 certified divers", es: "2–10 buceadores certificados" },
    highlights: {
      en: [
        "Two dives at two different reef sites",
        "Depths up to 18 meters (60 ft)",
        "Spot barracuda schools, manta rays, and moray eels",
        "Dive computer included for every diver",
        "Small group — maximum 5 divers per guide",
        "Surface interval with snacks between dives",
      ],
      es: [
        "Dos inmersiones en dos sitios de arrecife diferentes",
        "Profundidades de hasta 18 metros (60 pies)",
        "Avista cardúmenes de barracudas, mantas rayas y morenas",
        "Computadora de buceo incluida para cada buceador",
        "Grupo pequeño — máximo 5 buceadores por guía",
        "Intervalo de superficie con snacks entre inmersiones",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Full dive equipment (2 tanks, BCD, regulator, wetsuit, computer)",
        "Divemaster guide",
        "Boat ride to both dive sites",
        "Snacks and water during surface interval",
        "Dive log stamp",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Equipo de buceo completo (2 tanques, BCD, regulador, traje, computadora)",
        "Guía divemaster",
        "Paseo en bote a ambos sitios de buceo",
        "Snacks y agua durante el intervalo de superficie",
        "Sello de bitácora de buceo",
      ],
    },
    whatToBring: {
      en: [
        "Valid dive certification card (C-card)",
        "Dive logbook (optional but recommended)",
        "Swimsuit",
        "Towel",
        "Cash for tips",
      ],
      es: [
        "Tarjeta de certificación de buceo vigente (C-card)",
        "Bitácora de buceo (opcional pero recomendado)",
        "Traje de baño",
        "Toalla",
        "Efectivo para propinas",
      ],
    },
    restrictions: {
      en: [
        "Valid PADI Open Water certification or equivalent required — bring your C-card",
        "Minimum age: 15 years",
        "Must have dived within the last 12 months (or complete a refresher dive)",
        "Not suitable for people with heart or lung conditions",
        "Not recommended for pregnant women",
        "Maximum depth: 18 meters per dive",
      ],
      es: [
        "Se requiere certificación PADI Open Water vigente o equivalente — traiga su C-card",
        "Edad mínima: 15 años",
        "Debe haber buceado en los últimos 12 meses (o completar una inmersión de actualización)",
        "No apto para personas con condiciones cardíacas o pulmonares",
        "No recomendado para mujeres embarazadas",
        "Profundidad máxima: 18 metros por inmersión",
      ],
    },
    faq: [
      {
        question: {
          en: "What certification level do I need?",
          es: "¿Qué nivel de certificación necesito?",
        },
        answer: {
          en: "PADI Open Water (or equivalent such as SSI, NAUI, CMAS) is the minimum required. Please bring your C-card — we cannot accept screenshots or photos as substitutes.",
          es: "Se requiere PADI Open Water (o equivalente como SSI, NAUI, CMAS) como mínimo. Por favor traiga su C-card — no aceptamos capturas de pantalla o fotos como sustitutos.",
        },
      },
      {
        question: {
          en: "I haven't dived in a while — is that okay?",
          es: "Hace tiempo que no buceo — ¿está bien?",
        },
        answer: {
          en: "If it's been more than 12 months since your last dive, we recommend adding a short refresher session (Scuba Review) before the two-tank dive. Ask us when you book and we can arrange it.",
          es: "Si han pasado más de 12 meses desde tu última inmersión, recomendamos agregar una sesión de actualización corta (Scuba Review) antes del buceo de dos tanques. Pregúntanos al reservar y lo organizamos.",
        },
      },
      {
        question: {
          en: "Can I use my own dive equipment?",
          es: "¿Puedo usar mi propio equipo de buceo?",
        },
        answer: {
          en: "Yes! If you're traveling with your own equipment, let us know in advance. We'll provide tanks and weights — you'll just need your BCD, regulator, wetsuit, and computer.",
          es: "¡Sí! Si viajas con tu propio equipo, avísanos con anticipación. Nosotros proporcionamos tanques y pesas — solo necesitarás tu BCD, regulador, traje y computadora.",
        },
      },
    ],
    isFeatured: false,
    badge: null,
    sortOrder: 30,
  },
];

// =============================================================================
// Seed runner
// =============================================================================

async function seedDivingExcursions() {
  console.log("🤿  Seeding scuba diving excursions...\n");

  for (const exc of divingExcursions) {
    const doc = {
      _type: "divingExcursion" as const,
      _id: `diving-excursion-${exc.slug}`,
      title: exc.title,
      slug: { _type: "slug", current: exc.slug },
      shortSummary: exc.shortSummary,
      externalBookingUrl: exc.externalBookingUrl,
      experienceLevel: exc.experienceLevel,
      certificationRequired: exc.certificationRequired,
      ...(exc.certificationDetails && { certificationDetails: exc.certificationDetails }),
      ...(exc.maxDepth && { maxDepth: exc.maxDepth }),
      ...(exc.numberOfDives !== undefined && { numberOfDives: exc.numberOfDives }),
      marineLife: exc.marineLife,
      equipmentProvided: exc.equipmentProvided,
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
      // fullDescription left empty — write rich text via Studio
      // seo left empty — fill in via Studio
    };

    await client.createOrReplace(doc);
    console.log(`  ✅ ${exc.title.en} — $${exc.price}`);
  }

  // ── Wire up related excursions ──────────────────────────────────────────
  console.log("\n🔗 Wiring related excursions...\n");

  const relatedMap: Record<string, string[]> = {
    "diving-excursion-discover-scuba-diving": [
      "diving-excursion-two-tank-reef-dive",
    ],
    "diving-excursion-two-tank-reef-dive": [
      "diving-excursion-discover-scuba-diving",
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

  console.log("\n🎉 Scuba diving excursion seeding complete!");
}

seedDivingExcursions().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
