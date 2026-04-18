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
      en: "Grand Bay was founded in 2015 by a group of Punta Cana locals who believed that travelers deserved more than cookie-cutter tourist packages. We grew up on these beaches, dove in these reefs, and fell in love with every corner of the Dominican Republic's east coast.\n\nWhat started as a small boat and a big dream has grown into Punta Cana's most trusted excursion company — but we've never lost that personal touch. Every trip we offer is one we'd take our own families on. Every guide on our team is someone we trust with yours.\n\nWe keep groups small, experiences genuine, and prices fair. That's the Grand Bay promise.",
      es: "Grand Bay fue fundado en 2015 por un grupo de locales de Punta Cana que creían que los viajeros merecían algo más que paquetes turísticos genéricos. Crecimos en estas playas, buceamos en estos arrecifes y nos enamoramos de cada rincón de la costa este de la República Dominicana.\n\nLo que comenzó como un pequeño bote y un gran sueño se ha convertido en la empresa de excursiones más confiable de Punta Cana, sin perder nunca ese toque personal. Cada viaje que ofrecemos es uno en el que llevaríamos a nuestras propias familias.\n\nMantenemos los grupos pequeños, las experiencias genuinas y los precios justos. Esa es la promesa de Grand Bay.",
    },
    foundedYear: 2015,

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

    valuesHeadline: {
      en: "Why Guests Choose Grand Bay",
      es: "Por Qué los Huéspedes Eligen Grand Bay",
    },
    valuesSubheading: {
      en: "Every decision we make comes back to one thing: your experience.",
      es: "Cada decisión que tomamos tiene un propósito: tu experiencia.",
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

    ctaHeadline: {
      en: "Ready to Experience Punta Cana with Grand Bay?",
      es: "¿Listo para Vivir Punta Cana con Grand Bay?",
    },
    ctaSubheadline: {
      en: "Message us on WhatsApp for instant answers, or browse our full excursion lineup and book your adventure today.",
      es: "Escríbenos por WhatsApp para respuestas inmediatas, o explora nuestro catálogo completo de excursiones y reserva tu aventura hoy.",
    },
    ctaButtonText: {
      en: "Chat on WhatsApp",
      es: "Chatear en WhatsApp",
    },
    ctaWhatsappNumber: "18091234567",
    ctaContactText: {
      en: "Browse Excursions",
      es: "Ver Excursiones",
    },
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
