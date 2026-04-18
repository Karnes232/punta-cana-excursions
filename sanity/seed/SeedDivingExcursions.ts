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
// Diving excursion seed data
// =============================================================================

interface DivingExcursionSeed {
  slug: string;
  title: { en: string; es: string };
  shortSummary: { en: string; es: string };
  activityType: "scuba-diving" | "snorkeling" | "freediving" | "snuba" | "scuba-snorkeling";
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
  // ─── 1. Caribbean Reef Snorkeling ─────────────────────────────────────────
  {
    slug: "caribbean-reef-snorkeling",
    title: {
      en: "Caribbean Reef Snorkeling",
      es: "Snorkel en el Arrecife Caribeño",
    },
    shortSummary: {
      en: "Glide over vibrant coral gardens and swim alongside tropical fish, sea turtles, and spotted eagle rays on this guided snorkeling adventure.",
      es: "Deslízate sobre vibrantes jardines de coral y nada junto a peces tropicales, tortugas marinas y rayas águila en esta aventura de snorkel guiada.",
    },
    activityType: "snorkeling",
    experienceLevel: "all-levels",
    certificationRequired: false,
    marineLife: {
      en: [
        "Tropical reef fish (parrotfish, angelfish, wrasse)",
        "Sea turtles",
        "Spotted eagle rays",
        "Coral gardens and brain coral formations",
        "Parrotfish",
        "Sergeant major fish",
      ],
      es: [
        "Peces tropicales de arrecife (loro, ángel, doncella)",
        "Tortugas marinas",
        "Rayas águila manchadas",
        "Jardines de coral y formaciones de coral cerebro",
        "Peces loro",
        "Peces sargento",
      ],
    },
    equipmentProvided: {
      en: ["Mask & snorkel", "Fins", "Life vest", "Flotation noodle", "Underwater camera (on request)"],
      es: ["Máscara y snorkel", "Aletas", "Chaleco salvavidas", "Flotador", "Cámara submarina (bajo solicitud)"],
    },
    price: 55,
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
        "Visit 2 thriving coral reef sites",
        "Guided by certified Grand Bay dive instructors",
        "Spot sea turtles and spotted eagle rays",
        "All equipment included — no experience needed",
        "Small group for a personalized experience",
        "Refreshments included on board",
      ],
      es: [
        "Visita 2 prósperos sitios de arrecife de coral",
        "Guiado por instructores certificados de Grand Bay",
        "Avista tortugas marinas y rayas águila manchadas",
        "Todo el equipo incluido — sin experiencia necesaria",
        "Grupo pequeño para una experiencia personalizada",
        "Refrescos incluidos a bordo",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Boat ride to reef sites",
        "Professional snorkeling equipment",
        "Certified instructor guide",
        "Life vests and safety gear",
        "Bottled water and light snacks",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Paseo en bote a los arrecifes",
        "Equipo de snorkel profesional",
        "Guía instructor certificado",
        "Chalecos salvavidas y equipo de seguridad",
        "Agua embotellada y snacks ligeros",
      ],
    },
    whatToBring: {
      en: [
        "Swimsuit (wear it under your clothes)",
        "Towel",
        "Reef-safe sunscreen",
        "Cash for tips",
        "Waterproof phone case",
      ],
      es: [
        "Traje de baño (ponlo debajo de la ropa)",
        "Toalla",
        "Protector solar biodegradable",
        "Efectivo para propinas",
        "Funda impermeable para el teléfono",
      ],
    },
    restrictions: {
      en: [
        "Must be comfortable in open water",
        "Minimum age: 6 years",
        "Not recommended for people with severe asthma or breathing conditions",
        "Not recommended for pregnant women",
      ],
      es: [
        "Debe sentirse cómodo en aguas abiertas",
        "Edad mínima: 6 años",
        "No recomendado para personas con asma severa o condiciones respiratorias",
        "No recomendado para mujeres embarazadas",
      ],
    },
    faq: [
      {
        question: {
          en: "Do I need swimming experience?",
          es: "¿Necesito experiencia nadando?",
        },
        answer: {
          en: "You don't need to be a strong swimmer — life vests and flotation noodles are provided, and our instructors will guide you the entire time. Basic comfort in water is enough.",
          es: "No necesitas ser un gran nadador — se proporcionan chalecos salvavidas y flotadores, y nuestros instructores te guiarán todo el tiempo. Estar cómodo en el agua es suficiente.",
        },
      },
      {
        question: {
          en: "Will I really see turtles and rays?",
          es: "¿Realmente veré tortugas y rayas?",
        },
        answer: {
          en: "Our reef sites are well-known for consistent sightings of sea turtles and eagle rays. While wildlife can never be 100% guaranteed, our guides know exactly where to look.",
          es: "Nuestros sitios de arrecife son conocidos por los avistamientos frecuentes de tortugas marinas y rayas águila. Si bien la vida silvestre no se puede garantizar al 100%, nuestros guías saben exactamente dónde buscar.",
        },
      },
      {
        question: {
          en: "What if I've never snorkeled before?",
          es: "¿Qué pasa si nunca he hecho snorkel?",
        },
        answer: {
          en: "No problem! Our instructors give a full briefing and in-water demonstration before we head to the reef. Most first-timers are comfortable within minutes.",
          es: "¡Sin problema! Nuestros instructores dan una explicación completa y demostración en el agua antes de ir al arrecife. La mayoría de los principiantes se sienten cómodos en minutos.",
        },
      },
    ],
    isFeatured: true,
    badge: { en: "Most Popular", es: "Más Popular" },
    sortOrder: 10,
  },

  // ─── 2. Discover Scuba Diving ──────────────────────────────────────────────
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
    activityType: "scuba-diving",
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

  // ─── 3. Two-Tank Certified Reef Dive ──────────────────────────────────────
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
    activityType: "scuba-diving",
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

  // ─── 4. Snuba Adventure ────────────────────────────────────────────────────
  {
    slug: "snuba-adventure",
    title: {
      en: "Snuba Adventure",
      es: "Aventura de Snuba",
    },
    shortSummary: {
      en: "The perfect middle ground between snorkeling and scuba — breathe underwater at 6 meters without a heavy tank or certification.",
      es: "El punto medio perfecto entre el snorkel y el buceo — respira bajo el agua a 6 metros sin tanque pesado ni certificación.",
    },
    activityType: "snuba",
    experienceLevel: "all-levels",
    certificationRequired: false,
    maxDepth: { en: "6 meters (20 ft)", es: "6 metros (20 pies)" },
    numberOfDives: 1,
    marineLife: {
      en: [
        "Tropical reef fish",
        "Coral formations",
        "Sea turtles",
        "Starfish",
        "Sea urchins",
      ],
      es: [
        "Peces tropicales de arrecife",
        "Formaciones de coral",
        "Tortugas marinas",
        "Estrellas de mar",
        "Erizos de mar",
      ],
    },
    equipmentProvided: {
      en: [
        "Snuba breathing apparatus (air hose connected to surface raft)",
        "Mask",
        "Fins",
        "Flotation harness",
        "Weight belt",
      ],
      es: [
        "Aparato de respiración snuba (manguera de aire conectada a balsa de superficie)",
        "Máscara",
        "Aletas",
        "Arnés de flotación",
        "Cinturón de lastre",
      ],
    },
    price: 75,
    depositAmount: 20,
    priceNote: { en: "per person — all equipment included", es: "por persona — todo el equipo incluido" },
    duration: { en: "2.5 hours", es: "2.5 horas" },
    pickupTime: {
      en: "9:00 AM or 2:00 PM",
      es: "9:00 AM o 2:00 PM",
    },
    pickupZones: ["Punta Cana", "Bávaro", "Cap Cana"],
    groupSize: { en: "2–12 people", es: "2–12 personas" },
    highlights: {
      en: [
        "Breathe underwater without a heavy tank on your back",
        "No certification or prior dive experience needed",
        "Explore the reef at 6 meters depth",
        "Perfect for families — kids from 8 years old can join",
        "10-minute easy briefing before you enter the water",
        "Guided by trained snuba instructors",
      ],
      es: [
        "Respira bajo el agua sin un pesado tanque en la espalda",
        "Sin certificación ni experiencia de buceo previa",
        "Explora el arrecife a 6 metros de profundidad",
        "Perfecto para familias — niños desde 8 años pueden participar",
        "Briefing fácil de 10 minutos antes de entrar al agua",
        "Guiado por instructores de snuba capacitados",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Full snuba equipment",
        "Trained snuba guide",
        "Boat ride to reef site",
        "Briefing and instruction",
        "Bottled water",
      ],
      es: [
        "Transporte ida y vuelta desde el hotel",
        "Equipo de snuba completo",
        "Guía de snuba capacitado",
        "Paseo en bote al sitio del arrecife",
        "Briefing e instrucción",
        "Agua embotellada",
      ],
    },
    whatToBring: {
      en: [
        "Swimsuit",
        "Towel",
        "Reef-safe sunscreen",
        "Cash for tips",
      ],
      es: [
        "Traje de baño",
        "Toalla",
        "Protector solar biodegradable",
        "Efectivo para propinas",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 8 years",
        "Must be comfortable in the water",
        "Not suitable for people with serious heart or ear conditions",
        "Not recommended for pregnant women",
        "Maximum depth: 6 meters",
      ],
      es: [
        "Edad mínima: 8 años",
        "Debe sentirse cómodo en el agua",
        "No apto para personas con condiciones cardíacas o de oído graves",
        "No recomendado para mujeres embarazadas",
        "Profundidad máxima: 6 metros",
      ],
    },
    faq: [
      {
        question: {
          en: "What exactly is Snuba?",
          es: "¿Qué es exactamente el Snuba?",
        },
        answer: {
          en: "Snuba is a hybrid between snorkeling and scuba diving. You breathe through a regulator connected by a long hose to an air tank floating on a raft at the surface — so you can go underwater without carrying a tank or needing a certification.",
          es: "El Snuba es un híbrido entre el snorkel y el buceo. Respiras a través de un regulador conectado por una manguera larga a un tanque de aire que flota en una balsa en la superficie, por lo que puedes ir bajo el agua sin cargar un tanque ni necesitar certificación.",
        },
      },
      {
        question: {
          en: "Is this good for kids?",
          es: "¿Es bueno para niños?",
        },
        answer: {
          en: "Snuba is one of our most family-friendly underwater experiences. Children from 8 years old can participate alongside adults. It's a fantastic introduction to the underwater world for young explorers.",
          es: "El Snuba es una de nuestras experiencias subacuáticas más familiares. Los niños desde 8 años pueden participar junto a los adultos. Es una introducción fantástica al mundo submarino para los jóvenes exploradores.",
        },
      },
      {
        question: {
          en: "How is Snuba different from Discover Scuba?",
          es: "¿En qué se diferencia el Snuba del Discover Scuba?",
        },
        answer: {
          en: "With Snuba, the air tank stays on the surface raft — you're tethered to it by a hose. With Discover Scuba, the tank is on your back and you go deeper (up to 12 meters). Snuba is a great first step if you're curious about breathing underwater but not ready for a full scuba setup.",
          es: "Con el Snuba, el tanque de aire permanece en la balsa de superficie y estás conectado a él por una manguera. Con Discover Scuba, el tanque va en tu espalda y puedes ir más profundo (hasta 12 metros). El Snuba es un excelente primer paso si tienes curiosidad por respirar bajo el agua pero no estás listo para una configuración de buceo completa.",
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

async function seedDivingExcursions() {
  console.log("🤿  Seeding diving & snorkeling excursions...\n");

  for (const exc of divingExcursions) {
    const doc = {
      _type: "divingExcursion" as const,
      _id: `diving-excursion-${exc.slug}`,
      title: exc.title,
      slug: { _type: "slug", current: exc.slug },
      shortSummary: exc.shortSummary,
      activityType: exc.activityType,
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
    console.log(`  ✅ ${exc.title.en} [${exc.activityType}] — $${exc.price}`);
  }

  // ── Wire up related excursions ──────────────────────────────────────────
  console.log("\n🔗 Wiring related excursions...\n");

  const relatedMap: Record<string, string[]> = {
    "diving-excursion-caribbean-reef-snorkeling": [
      "diving-excursion-discover-scuba-diving",
      "diving-excursion-snuba-adventure",
    ],
    "diving-excursion-discover-scuba-diving": [
      "diving-excursion-caribbean-reef-snorkeling",
      "diving-excursion-snuba-adventure",
    ],
    "diving-excursion-two-tank-reef-dive": [
      "diving-excursion-discover-scuba-diving",
      "diving-excursion-caribbean-reef-snorkeling",
    ],
    "diving-excursion-snuba-adventure": [
      "diving-excursion-caribbean-reef-snorkeling",
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

  console.log("\n🎉 Diving & snorkeling excursion seeding complete!");
}

seedDivingExcursions().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
