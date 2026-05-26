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

// Block-content helpers (each block + span needs a _key)
let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36)}`;
const blocks = (paras: string[]) =>
  paras.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

async function main() {
  console.log("🌱 Seeding About Page...\n");

  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",

    heroBadge: { en: "About Grand Bay", es: "Sobre Grand Bay" },
    heroHeadline: {
      en: "Your Trusted Guide to Punta Cana's Best Experiences",
      es: "Tu Guía de Confianza para las Mejores Experiencias en Punta Cana",
    },
    heroSubheadline: {
      en: "Born in Punta Cana, built on passion. For over a decade we've been connecting travelers with authentic Caribbean adventures — from coral reef snorkeling to island catamaran cruises.",
      es: "Nacidos en Punta Cana, impulsados por la pasión. Durante más de una década hemos conectado viajeros con auténticas aventuras caribeñas, desde snorkel en arrecifes de coral hasta cruceros en catamarán.",
    },

    storyTagline: { en: "Our Story", es: "Nuestra Historia" },
    storyHeadline: {
      en: "From Local Roots to Unforgettable Adventures",
      es: "De Raíces Locales a Aventuras Inolvidables",
    },
    storyBody: {
      en: blocks([
        "Grand Bay was founded in 2015 by a group of Punta Cana locals who believed that travelers deserved more than cookie-cutter tourist packages. We grew up on these beaches, dove in these reefs, and fell in love with every corner of the Dominican Republic's east coast.",
        "What started as a small boat and a big dream has grown into Punta Cana's most trusted excursion company — but we've never lost that personal touch. Every trip we offer is one we'd take our own families on. Every guide on our team is someone we trust with yours.",
        "We keep groups small, experiences genuine, and prices fair. That's the Grand Bay promise.",
      ]),
      es: blocks([
        "Grand Bay fue fundado en 2015 por un grupo de locales de Punta Cana que creían que los viajeros merecían algo más que paquetes turísticos genéricos. Crecimos en estas playas, buceamos en estos arrecifes y nos enamoramos de cada rincón de la costa este de la República Dominicana.",
        "Lo que comenzó como un pequeño bote y un gran sueño se ha convertido en la empresa de excursiones más confiable de Punta Cana, sin perder nunca ese toque personal. Cada viaje que ofrecemos es uno en el que llevaríamos a nuestras propias familias.",
        "Mantenemos los grupos pequeños, las experiencias genuinas y los precios justos. Esa es la promesa de Grand Bay.",
      ]),
    },
    foundedYear: 2015,

    beliefsEyebrow: { en: "What We Believe", es: "Lo Que Creemos" },
    beliefsHeadline: {
      en: "The Principles Behind Every Trip",
      es: "Los Principios Detrás de Cada Viaje",
    },
    beliefsBody: {
      en: blocks([
        "Grand Bay isn't just about getting you out on the water — it's about how we do it. These are the beliefs that shape every excursion we run.",
      ]),
      es: blocks([
        "Grand Bay no se trata solo de llevarte al agua, sino de cómo lo hacemos. Estas son las creencias que dan forma a cada excursión que realizamos.",
      ]),
    },
    beliefs: [
      {
        _key: key(),
        headline: {
          en: "Local Knowledge, Shared Generously",
          es: "Conocimiento Local, Compartido con Generosidad",
        },
        body: {
          en: blocks([
            "We grew up on these shores. Every reef, current, and hidden cove we show you comes from a lifetime spent exploring this coast.",
          ]),
          es: blocks([
            "Crecimos en estas costas. Cada arrecife, corriente y cala escondida que te mostramos proviene de toda una vida explorando este litoral.",
          ]),
        },
      },
      {
        _key: key(),
        headline: {
          en: "Small Groups, Real Connections",
          es: "Grupos Pequeños, Conexiones Reales",
        },
        body: {
          en: blocks([
            "We cap our group sizes on purpose. Fewer people means more attention, better photos, and a trip that feels personal rather than processed.",
          ]),
          es: blocks([
            "Limitamos el tamaño de nuestros grupos a propósito. Menos personas significa más atención, mejores fotos y un viaje que se siente personal, no industrializado.",
          ]),
        },
      },
      {
        _key: key(),
        headline: {
          en: "Safety Without Compromise",
          es: "Seguridad Sin Concesiones",
        },
        body: {
          en: blocks([
            "Certified guides, inspected equipment, and a spotless record. Your adventure should be thrilling for the right reasons.",
          ]),
          es: blocks([
            "Guías certificados, equipo inspeccionado y un historial impecable. Tu aventura debe ser emocionante por las razones correctas.",
          ]),
        },
      },
    ],

    statsHeadline: {
      en: "Grand Bay by the Numbers",
      es: "Grand Bay en Números",
    },
    stats: [
      {
        value: { en: "10+", es: "10+" },
        label: { en: "Years of Experience", es: "Años de Experiencia" },
      },
      {
        value: { en: "50,000+", es: "50,000+" },
        label: { en: "Happy Guests", es: "Huéspedes Felices" },
      },
      {
        value: { en: "20+", es: "20+" },
        label: { en: "Excursions Available", es: "Excursiones Disponibles" },
      },
      {
        value: { en: "4.9★", es: "4.9★" },
        label: { en: "Average Rating", es: "Calificación Promedio" },
      },
    ],

    valuesEyebrow: { en: "Our Values", es: "Nuestros Valores" },
    valuesHeadline: {
      en: "Why Guests Choose Grand Bay",
      es: "Por Qué los Huéspedes Eligen Grand Bay",
    },
    valuesSubheading: {
      en: blocks([
        "Every decision we make comes back to one thing: your experience.",
      ]),
      es: blocks([
        "Cada decisión que tomamos tiene un propósito: tu experiencia.",
      ]),
    },
    values: [
      {
        icon: "safety",
        title: { en: "Safety First, Always", es: "Seguridad ante Todo" },
        description: {
          en: "Every excursion is led by certified, experienced guides. Our equipment is inspected before every trip and our safety record is spotless.",
          es: "Cada excursión es dirigida por guías certificados y experimentados. Nuestro equipo es inspeccionado antes de cada viaje y nuestro historial de seguridad es impecable.",
        },
      },
      {
        icon: "local",
        title: { en: "True Local Expertise", es: "Verdadero Conocimiento Local" },
        description: {
          en: "We're from here. We know every reef, beach, and hidden gem in Punta Cana — and we love sharing them with you.",
          es: "Somos de aquí. Conocemos cada arrecife, playa y rincón escondido en Punta Cana, y nos encanta compartirlos contigo.",
        },
      },
      {
        icon: "trust",
        title: { en: "Authentic Experiences", es: "Experiencias Auténticas" },
        description: {
          en: "No tourist traps. No overcrowded boats. Just genuine Caribbean adventures with real cultural depth and personal attention.",
          es: "Sin trampas turísticas. Sin botes abarrotados. Solo aventuras caribeñas genuinas con profundidad cultural y atención personalizada.",
        },
      },
      {
        icon: "bilingual",
        title: { en: "Bilingual Team", es: "Equipo Bilingüe" },
        description: {
          en: "Our guides and staff are fluent in English and Spanish so you'll always feel comfortable and fully informed throughout your experience.",
          es: "Nuestros guías y personal dominan el inglés y el español para que siempre te sientas cómodo/a e informado/a durante tu experiencia.",
        },
      },
      {
        icon: "support",
        title: { en: "Personal Attention", es: "Atención Personal" },
        description: {
          en: "We keep our groups small on purpose. You're not a ticket number — you're a guest, and we treat you like one from the first message to the last goodbye.",
          es: "Mantenemos nuestros grupos pequeños a propósito. No eres un número de ticket, eres un huésped, y te tratamos como tal desde el primer mensaje hasta el último adiós.",
        },
      },
      {
        icon: "reviews",
        title: { en: "5-Star Track Record", es: "Historial de 5 Estrellas" },
        description: {
          en: "With thousands of 5-star reviews across platforms, our reputation speaks for itself. We're proud to be Punta Cana's highest-rated excursion company.",
          es: "Con miles de reseñas de 5 estrellas en todas las plataformas, nuestra reputación habla por sí sola. Nos enorgullece ser la empresa de excursiones mejor calificada de Punta Cana.",
        },
      },
    ],

    operateEyebrow: { en: "Where We Operate", es: "Dónde Operamos" },
    operateHeadline: {
      en: "Serving All of Punta Cana & the East Coast",
      es: "Servimos Todo Punta Cana y la Costa Este",
    },
    operateBody: {
      en: blocks([
        "We pick up guests from hotels and resorts across the Punta Cana region — including Bávaro, Cap Cana, Uvero Alto, and Macao. Wherever you're staying along the coast, we'll get you to the adventure and back, hassle-free.",
      ]),
      es: blocks([
        "Recogemos a nuestros huéspedes en hoteles y resorts de toda la región de Punta Cana, incluyendo Bávaro, Cap Cana, Uvero Alto y Macao. Dondequiera que te alojes en la costa, te llevamos a la aventura y de regreso, sin complicaciones.",
      ]),
    },

    teamHeadline: {
      en: "Meet the Grand Bay Team",
      es: "Conoce al Equipo de Grand Bay",
    },
    teamSubheading: {
      en: "The passionate people who make every excursion unforgettable.",
      es: "Las personas apasionadas que hacen que cada excursión sea inolvidable.",
    },
    teamMembers: [
      {
        name: "Marco Silva",
        role: { en: "Head Guide & Co-Founder", es: "Guía Principal y Co-Fundador" },
        bio: {
          en: "Born and raised in Punta Cana, Marco has been exploring these waters for over 20 years. His infectious enthusiasm and encyclopedic knowledge of local marine life make every trip an education.",
          es: "Nacido y criado en Punta Cana, Marco lleva más de 20 años explorando estas aguas. Su entusiasmo contagioso y su conocimiento enciclopédico de la fauna marina local hacen de cada viaje una experiencia única.",
        },
      },
      {
        name: "Sofia Reyes",
        role: { en: "Guest Experience Manager", es: "Gerente de Experiencia al Huésped" },
        bio: {
          en: "Sofia is the warm voice behind every booking and the first person you'll meet on arrival. She ensures every detail of your experience is perfect, from pickup to drop-off.",
          es: "Sofia es la cálida voz detrás de cada reserva y la primera persona que conocerás a tu llegada. Se asegura de que cada detalle de tu experiencia sea perfecto, desde la recogida hasta el regreso.",
        },
      },
      {
        name: "Diego Vargas",
        role: { en: "Certified Dive Instructor", es: "Instructor de Buceo Certificado" },
        bio: {
          en: "PADI Master Instructor with 15 years of experience, Diego has introduced thousands of first-timers to the underwater world. His patience and clear instruction make even beginners feel at home.",
          es: "Instructor Master PADI con 15 años de experiencia, Diego ha introducido a miles de principiantes al mundo submarino. Su paciencia y clara instrucción hacen que incluso los principiantes se sientan como en casa.",
        },
      },
    ],

    ctaEyebrow: { en: "Your Adventure Awaits", es: "Tu Aventura Te Espera" },
    ctaHeadline: {
      en: "Ready to Experience Punta Cana with Grand Bay?",
      es: "¿Listo para Vivir Punta Cana con Grand Bay?",
    },
    ctaSubheadline: {
      en: "Message us on WhatsApp for instant answers, or browse our full excursion lineup and book your adventure today.",
      es: "Escríbenos por WhatsApp para respuestas inmediatas, o explora nuestro catálogo completo de excursiones y reserva tu aventura hoy.",
    },
    ctaPrimaryButtonText: {
      en: "Contact Us",
      es: "Contáctanos",
    },
    ctaPrimaryButtonHref: "/contact",
    ctaSecondaryButtonText: {
      en: "Browse Excursions",
      es: "Ver Excursiones",
    },
    ctaSecondaryButtonHref: "/excursions",
  });

  console.log("✅ About Page seeded successfully.");
  console.log("\n📸 Remember to upload images via Sanity Studio:");
  console.log("   • Hero background image");
  console.log("   • Our Story image");
  console.log("   • Team member photos");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
