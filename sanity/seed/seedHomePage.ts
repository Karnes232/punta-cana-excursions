/**
 * Seed script for HomePage content.
 *
 * Run with:  npx tsx src/sanity/seed/seedHomePage.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env
 *   - SANITY_API_WRITE_TOKEN in .env (create at sanity.io/manage → API → Tokens)
 *   - The homePage schema must be deployed to your Studio first
 *
 * This script uses createOrReplace so it's safe to re-run — it will
 * overwrite the existing homePage document each time.
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function seed() {
  console.log("🌴 Seeding HomePage content...\n");

  const doc = {
    _id: "homePage",
    _type: "homePage",

    // =========================================================================
    // HERO
    // =========================================================================

    // Note: heroImage requires an uploaded asset. You'll need to upload an image
    // via the Studio or via the client.assets.upload() API and reference it here.
    // For now we leave it as a placeholder — fill it in the Studio.

    heroImageAlt: {
      en: "Aerial view of a catamaran sailing through turquoise Caribbean waters near Punta Cana",
      es: "Vista aérea de un catamarán navegando por las aguas turquesas del Caribe cerca de Punta Cana",
    },

    heroHeadline: {
      en: "Discover the Best Excursions in Punta Cana",
      es: "Descubre las Mejores Excursiones en Punta Cana",
    },

    heroSubheadline: {
      en: "Island tours, catamarans, snorkeling, and adventure — all backed by real local expertise. Easy booking with local support.",
      es: "Tours a islas, catamaranes, snorkel y aventura — todo respaldado por experiencia local real. Reservas fáciles con soporte local.",
    },

    heroPrimaryCta: {
      text: {
        en: "Explore Excursions",
        es: "Explorar Excursiones",
      },
      href: "/excursions",
    },

    heroSecondaryCta: {
      text: {
        en: "How It Works",
        es: "Cómo Funciona",
      },
      href: "/how-it-works",
    },

    // =========================================================================
    // BRAND INTRO
    // =========================================================================

    brandIntroTagline: {
      en: "Local experts since day one",
      es: "Expertos locales desde el primer día",
    },

    brandIntroHeading: {
      en: "Curated Excursions Backed by Real Local Experience",
      es: "Excursiones Seleccionadas con Experiencia Local Real",
    },

    brandIntroBody: {
      en: "Punta Cana Excursions by Grand Bay brings together the best tours, island trips, and ocean adventures in one place. With years of tourism experience in the Dominican Republic, we handpick every excursion so you can explore with confidence and book with ease. From the moment you reach out to the moment you get back to your hotel, our team is here to help.",
      es: "Punta Cana Excursions by Grand Bay reúne los mejores tours, viajes a islas y aventuras oceánicas en un solo lugar. Con años de experiencia turística en República Dominicana, seleccionamos cada excursión para que explores con confianza y reserves con facilidad. Desde el momento en que nos contactas hasta que regresas a tu hotel, nuestro equipo está aquí para ayudarte.",
    },

    brandIntroImageAlt: {
      en: "The Grand Bay team preparing boats at the Punta Cana marina",
      es: "El equipo de Grand Bay preparando botes en la marina de Punta Cana",
    },

    // =========================================================================
    // FEATURED EXCURSIONS
    // =========================================================================

    featuredHeading: {
      en: "Top Excursions in Punta Cana",
      es: "Mejores Excursiones en Punta Cana",
    },

    featuredSubheading: {
      en: "Handpicked adventures loved by travelers. Island hopping, ocean fun, and unforgettable memories.",
      es: "Aventuras seleccionadas y preferidas por viajeros. Islas, diversión oceánica y recuerdos inolvidables.",
    },

    // Note: featuredExcursions is an array of references to excursion documents.
    // These will be populated once you create the Excursion schema and add excursions.
    // For now, leave empty — the component handles empty states gracefully.
    // featuredExcursions: [],

    featuredViewAllText: {
      en: "Explore All Excursions",
      es: "Explorar Todas las Excursiones",
    },

    // =========================================================================
    // EXCURSION CATEGORIES
    // =========================================================================

    categoriesHeading: {
      en: "Browse by Category",
      es: "Explora por Categoría",
    },

    categoriesSubheading: {
      en: "Find the perfect experience for your Punta Cana trip",
      es: "Encuentra la experiencia perfecta para tu viaje a Punta Cana",
    },

    // Note: displayedCategories is an array of references to excursionCategory documents.
    // Populate once those schemas exist.
    // displayedCategories: [],

    // =========================================================================
    // WHY CHOOSE US
    // =========================================================================

    whyChooseUsHeading: {
      en: "Why Book With Us",
      es: "Por Qué Reservar Con Nosotros",
    },

    whyChooseUsSubheading: {
      en: "Real local expertise, trusted by thousands of travelers in Punta Cana",
      es: "Experiencia local real, con la confianza de miles de viajeros en Punta Cana",
    },

    trustPillars: [
      {
        _key: "pillar-local",
        icon: "local",
        title: {
          en: "Local Expertise",
          es: "Experiencia Local",
        },
        description: {
          en: "Born and raised in Punta Cana. We know the best spots, the best guides, and the best times to go.",
          es: "Nacidos y criados en Punta Cana. Conocemos los mejores lugares, los mejores guías y los mejores horarios.",
        },
      },
      {
        _key: "pillar-trust",
        icon: "trust",
        title: {
          en: "Trusted & Verified",
          es: "Confiable y Verificado",
        },
        description: {
          en: "Every excursion is handpicked and verified. Real reviews from real travelers who booked with us.",
          es: "Cada excursión es seleccionada y verificada. Reseñas reales de viajeros reales que reservaron con nosotros.",
        },
      },
      {
        _key: "pillar-booking",
        icon: "booking",
        title: {
          en: "Easy Booking",
          es: "Reserva Fácil",
        },
        description: {
          en: "Simple deposit to reserve. Pay the balance on tour day. No complicated forms or hidden fees.",
          es: "Depósito simple para reservar. Paga el resto el día del tour. Sin formularios complicados ni cargos ocultos.",
        },
      },
      {
        _key: "pillar-support",
        icon: "support",
        title: {
          en: "Bilingual Support",
          es: "Soporte Bilingüe",
        },
        description: {
          en: "English and Spanish support before, during, and after your excursion. We're always reachable.",
          es: "Soporte en inglés y español antes, durante y después de tu excursión. Siempre estamos disponibles.",
        },
      },
    ],

    // =========================================================================
    // HOW BOOKING WORKS
    // =========================================================================

    howBookingWorksHeading: {
      en: "How Booking Works",
      es: "Cómo Funciona la Reserva",
    },

    howBookingWorksSubheading: {
      en: "Three simple steps to your next adventure",
      es: "Tres pasos simples para tu próxima aventura",
    },

    bookingSteps: [
      {
        _key: "step-browse",
        stepNumber: 1,
        icon: "browse",
        title: {
          en: "Browse Excursions",
          es: "Explora Excursiones",
        },
        description: {
          en: "Explore our curated selection of island tours, catamarans, adventures, and more. Filter by category, duration, or price.",
          es: "Explora nuestra selección de tours a islas, catamaranes, aventuras y más. Filtra por categoría, duración o precio.",
        },
      },
      {
        _key: "step-deposit",
        stepNumber: 2,
        icon: "deposit",
        title: {
          en: "Secure With a Deposit",
          es: "Reserva Con un Depósito",
        },
        description: {
          en: "Reserve your spot with a small deposit. Pay the balance on the day of your excursion, either in cash or card.",
          es: "Reserva tu lugar con un pequeño depósito. Paga el resto el día de tu excursión, en efectivo o con tarjeta.",
        },
      },
      {
        _key: "step-enjoy",
        stepNumber: 3,
        icon: "enjoy",
        title: {
          en: "Enjoy Your Excursion",
          es: "Disfruta Tu Excursión",
        },
        description: {
          en: "We handle pickup, guides, and everything else. Just show up and have an amazing time in Punta Cana.",
          es: "Nosotros nos encargamos del transporte, guías y todo lo demás. Solo preséntate y pasa un tiempo increíble en Punta Cana.",
        },
      },
    ],

    // =========================================================================
    // REVIEWS / TESTIMONIALS
    // =========================================================================

    reviewsHeading: {
      en: "What Travelers Are Saying",
      es: "Lo Que Dicen los Viajeros",
    },

    reviewsSubheading: {
      en: "Real reviews from real travelers who booked with us",
      es: "Reseñas reales de viajeros reales que reservaron con nosotros",
    },

    reviews: [
      {
        _key: "review-1",
        name: "Sarah M.",
        country: "United States",
        text: {
          en: "The Saona Island trip was absolutely incredible. The crew was friendly, the natural pool was amazing, and everything was perfectly organized. We felt safe the entire time. Highly recommend booking through Grand Bay!",
          es: "El viaje a Isla Saona fue absolutamente increíble. La tripulación fue amable, la piscina natural fue asombrosa y todo estuvo perfectamente organizado. Nos sentimos seguros todo el tiempo. ¡Recomiendo mucho reservar con Grand Bay!",
        },
        rating: 5,
        excursionTitle: "Saona Island",
      },
      {
        _key: "review-2",
        name: "James R.",
        country: "Canada",
        text: {
          en: "We did the catamaran cruise for our anniversary and it was perfect. Great music, unlimited drinks, and the snorkeling stop was beautiful. The team even helped us take photos. Will definitely book again on our next trip!",
          es: "Hicimos el crucero en catamarán por nuestro aniversario y fue perfecto. Buena música, bebidas ilimitadas y la parada de snorkel fue hermosa. El equipo incluso nos ayudó a tomar fotos. ¡Definitivamente reservaremos de nuevo en nuestro próximo viaje!",
        },
        rating: 5,
        excursionTitle: "Catamaran Cruise",
      },
      {
        _key: "review-3",
        name: "María L.",
        country: "Colombia",
        text: {
          en: "We loved the snorkeling excursion. The guides spoke both Spanish and English, which was great for our group. The reef was impressive and the kids enjoyed it so much. Very well organized from start to finish.",
          es: "Nos encantó la excursión de snorkel. Los guías hablaban español e inglés, lo cual fue genial para nuestro grupo. El arrecife era impresionante y los niños lo disfrutaron mucho. Muy bien organizado de principio a fin.",
        },
        rating: 5,
        excursionTitle: "Reef Snorkeling",
      },
      {
        _key: "review-4",
        name: "David & Emma T.",
        country: "United Kingdom",
        text: {
          en: "We booked three excursions through Grand Bay during our holiday — Saona Island, the buggy adventure, and a sunset catamaran. All three were fantastic. Pickup was always on time, guides were knowledgeable, and the prices were very fair. This is the best way to experience Punta Cana.",
          es: "Reservamos tres excursiones con Grand Bay durante nuestras vacaciones — Isla Saona, la aventura en buggy y un catamarán al atardecer. Las tres fueron fantásticas. El transporte siempre fue puntual, los guías eran conocedores y los precios muy justos. Esta es la mejor manera de conocer Punta Cana.",
        },
        rating: 5,
        excursionTitle: "Multiple Tours",
      },
      {
        _key: "review-5",
        name: "Roberto S.",
        country: "Argentina",
        text: {
          en: "Excellent service from beginning to end. The booking was easy, they confirmed everything by email, and the pickup from our hotel was right on time. The Catalina Island tour was the highlight of our vacation. Thank you!",
          es: "Excelente servicio de principio a fin. La reserva fue fácil, confirmaron todo por correo electrónico y la recogida en nuestro hotel fue puntual. El tour a Isla Catalina fue lo mejor de nuestras vacaciones. ¡Gracias!",
        },
        rating: 5,
        excursionTitle: "Catalina Island",
      },
      {
        _key: "review-6",
        name: "Jennifer K.",
        country: "United States",
        text: {
          en: "I was nervous about booking excursions online, but Grand Bay made it so easy. They answered all my WhatsApp messages quickly and gave honest recommendations. The zip line adventure was thrilling and the guides made sure everyone was comfortable. Great experience!",
          es: "Estaba nerviosa por reservar excursiones en línea, pero Grand Bay lo hizo muy fácil. Respondieron todos mis mensajes de WhatsApp rápidamente y dieron recomendaciones honestas. La aventura en tirolesa fue emocionante y los guías se aseguraron de que todos estuvieran cómodos. ¡Gran experiencia!",
        },
        rating: 5,
        excursionTitle: "Zip Line Adventure",
      },
    ],

    // =========================================================================
    // FAQ PREVIEW
    // =========================================================================

    faqPreviewHeading: {
      en: "Common Questions",
      es: "Preguntas Frecuentes",
    },

    faqPreviewSubheading: {
      en: "Quick answers to help you book with confidence",
      es: "Respuestas rápidas para que reserves con confianza",
    },

    faqPreviewItems: [
      {
        _key: "faq-1",
        question: {
          en: "Is transportation included in the excursions?",
          es: "¿El transporte está incluido en las excursiones?",
        },
        answer: {
          en: "Yes! Most excursions include round-trip transportation from your hotel in Punta Cana, Bávaro, or Cap Cana. Pickup details and times are confirmed after booking. If your hotel is outside our main service area, we'll work with you to arrange the best option.",
          es: "¡Sí! La mayoría de las excursiones incluyen transporte de ida y vuelta desde tu hotel en Punta Cana, Bávaro o Cap Cana. Los detalles y horarios de recogida se confirman después de la reserva. Si tu hotel está fuera de nuestra área principal de servicio, trabajaremos contigo para encontrar la mejor opción.",
        },
      },
      {
        _key: "faq-2",
        question: {
          en: "How does the deposit work?",
          es: "¿Cómo funciona el depósito?",
        },
        answer: {
          en: "You pay a small deposit online to reserve your spot — usually between $15 and $30 depending on the excursion. The remaining balance is paid on the day of your tour, either in cash (USD or pesos) or by card depending on the excursion operator. Your deposit is fully refundable if you cancel at least 48 hours in advance.",
          es: "Pagas un pequeño depósito en línea para reservar tu lugar — generalmente entre $15 y $30 dependiendo de la excursión. El saldo restante se paga el día de tu tour, en efectivo (USD o pesos) o con tarjeta según el operador. Tu depósito es totalmente reembolsable si cancelas con al menos 48 horas de anticipación.",
        },
      },
      {
        _key: "faq-3",
        question: {
          en: "What if the weather is bad on my excursion day?",
          es: "¿Qué pasa si el clima es malo el día de mi excursión?",
        },
        answer: {
          en: "If weather conditions make an excursion unsafe, we'll reschedule for another day during your stay at no extra cost. If rescheduling isn't possible, you'll receive a full refund of your deposit. Safety always comes first — we monitor conditions closely and will contact you in advance if any changes are needed.",
          es: "Si las condiciones climáticas hacen que una excursión no sea segura, reprogramaremos para otro día durante tu estadía sin costo adicional. Si no es posible reprogramar, recibirás un reembolso completo de tu depósito. La seguridad siempre es primero — monitoreamos las condiciones de cerca y te contactaremos con anticipación si se necesita algún cambio.",
        },
      },
      {
        _key: "faq-4",
        question: {
          en: "Are excursions family-friendly?",
          es: "¿Las excursiones son aptas para familias?",
        },
        answer: {
          en: "Many of our excursions are great for families with children. Each listing shows age restrictions and recommendations so you can choose the right experience. Island tours, snorkeling trips, and catamaran cruises are especially popular with families. For younger children, we recommend the Saona Island tour — it's a full day of fun with calm, shallow waters perfect for kids.",
          es: "Muchas de nuestras excursiones son excelentes para familias con niños. Cada listado muestra restricciones de edad y recomendaciones para que elijas la experiencia correcta. Los tours a islas, excursiones de snorkel y cruceros en catamarán son especialmente populares con familias. Para niños más pequeños, recomendamos el tour a Isla Saona — es un día completo de diversión con aguas tranquilas y poco profundas, perfectas para los niños.",
        },
      },
      {
        _key: "faq-5",
        question: {
          en: "Can I contact you on WhatsApp?",
          es: "¿Puedo contactarlos por WhatsApp?",
        },
        answer: {
          en: "Absolutely! You can message us anytime on WhatsApp for quick questions, booking help, or support during your trip. We respond in both English and Spanish, usually within a few hours. It's the fastest way to get in touch with our team, and many of our guests prefer it for real-time updates on excursion day.",
          es: "¡Por supuesto! Puedes enviarnos un mensaje en cualquier momento por WhatsApp para preguntas rápidas, ayuda con reservas o soporte durante tu viaje. Respondemos en inglés y español, generalmente en pocas horas. Es la forma más rápida de contactar a nuestro equipo, y muchos de nuestros huéspedes lo prefieren para actualizaciones en tiempo real el día de la excursión.",
        },
      },
    ],

    faqPreviewCtaText: {
      en: "View All FAQs",
      es: "Ver Todas las Preguntas",
    },

    // =========================================================================
    // CTA BANNER
    // =========================================================================

    ctaBannerHeadline: {
      en: "Ready to Explore Punta Cana?",
      es: "¿Listo Para Explorar Punta Cana?",
    },

    ctaBannerSubheadline: {
      en: "Browse our excursions, pick your adventure, and reserve your spot with a simple deposit. We handle the rest.",
      es: "Explora nuestras excursiones, elige tu aventura y reserva tu lugar con un simple depósito. Nosotros nos encargamos del resto.",
    },

    ctaBannerButtonText: {
      en: "Book Now",
      es: "Reservar Ahora",
    },

    ctaBannerButtonHref: "/contact",

    ctaBannerWhatsappLabel: {
      en: "Chat on WhatsApp",
      es: "Chatear por WhatsApp",
    },
  };

  try {
    await client.createOrReplace(doc);
    console.log("✅ HomePage seeded successfully!\n");
    console.log("📝 Next steps:");
    console.log("   1. Open your Studio at /studio");
    console.log("   2. Go to Home Page → Hero tab");
    console.log(
      "   3. Upload a hero image (the only field that needs manual upload)",
    );
    console.log("   4. Upload a brand intro image in the Brand Intro tab");
    console.log(
      "   5. Once Excursion + Category schemas exist, add references\n",
    );
  } catch (error) {
    console.error("❌ Failed to seed HomePage:", error);
    process.exit(1);
  }
}

seed();
