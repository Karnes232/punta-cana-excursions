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

let k = 0;
const key = () => `hiw-key-${++k}`;

async function main() {
  console.log("🌱 Seeding How It Works Page...\n");

  await client.createOrReplace({
    _id: "howItWorksPage",
    _type: "howItWorksPage",

    // ── HERO ──────────────────────────────────────────────────────────────
    heroHeadline: {
      en: "How Booking Works",
      es: "Cómo Funciona la Reserva",
    },
    heroSubheadline: {
      en: "From browsing excursions to enjoying your day in Punta Cana — here's how easy we make it.",
      es: "Desde explorar excursiones hasta disfrutar tu día en Punta Cana — así de fácil lo hacemos.",
    },

    // ── STEPS ─────────────────────────────────────────────────────────────
    stepsHeading: {
      en: "Five Simple Steps",
      es: "Cinco Pasos Sencillos",
    },
    stepsSubheading: {
      en: "Booking with Grand Bay is straightforward, secure, and stress-free. Here's exactly what to expect from the moment you find an excursion you love to the day you step off the boat.",
      es: "Reservar con Grand Bay es sencillo, seguro y sin estrés. Esto es exactamente lo que puedes esperar desde el momento en que encuentras una excursión que te encanta hasta el día en que bajas del barco.",
    },
    steps: [
      {
        _key: key(),
        _type: "step",
        stepNumber: 1,
        icon: "browse",
        title: { en: "Browse Excursions", es: "Explora las Excursiones" },
        description: {
          en: "Start by exploring our full catalog of group and public excursions. Filter by category — diving, snorkeling, catamaran, island hops, cultural tours — and review pricing, inclusions, and group sizes. Every excursion page has photos, detailed descriptions, and honest information so you can choose with confidence.",
          es: "Comienza explorando nuestro catálogo completo de excursiones grupales y públicas. Filtra por categoría — buceo, snorkel, catamarán, tours por islas, recorridos culturales — y revisa precios, inclusiones y tamaños de grupo. Cada página de excursión tiene fotos, descripciones detalladas e información honesta para que puedas elegir con confianza.",
        },
      },
      {
        _key: key(),
        _type: "step",
        stepNumber: 2,
        icon: "reserve",
        title: { en: "Reserve Your Spot", es: "Reserva tu Lugar" },
        description: {
          en: "Click the Book Now button on the excursion of your choice and fill out a short reservation form with your preferred date, number of guests, and hotel pickup location. You can also message us on WhatsApp if you'd prefer to chat with a real person and get personalized recommendations.",
          es: "Haz clic en el botón Reservar Ahora en la excursión que elijas y completa un breve formulario con la fecha que prefieras, el número de huéspedes y la ubicación de tu hotel para el recogido. También puedes escribirnos por WhatsApp si prefieres hablar con una persona real y recibir recomendaciones personalizadas.",
        },
      },
      {
        _key: key(),
        _type: "step",
        stepNumber: 3,
        icon: "deposit",
        title: { en: "Pay the Deposit", es: "Paga el Depósito" },
        description: {
          en: "Secure your reservation with a small deposit via secure card payment, PayPal, or bank transfer. The deposit amount is shown clearly on every excursion page — no hidden fees, no surprises. The remaining balance is paid in cash on the day of the excursion before departure.",
          es: "Asegura tu reserva con un pequeño depósito mediante pago seguro con tarjeta, PayPal o transferencia bancaria. El monto del depósito se muestra claramente en cada página de excursión — sin tarifas ocultas, sin sorpresas. El saldo restante se paga en efectivo el día de la excursión antes de la salida.",
        },
      },
      {
        _key: key(),
        _type: "step",
        stepNumber: 4,
        icon: "confirm",
        title: { en: "Get Your Confirmation", es: "Recibe tu Confirmación" },
        description: {
          en: "Within minutes you'll receive a confirmation email and WhatsApp message with your booking details, exact pickup time for your hotel, what to bring, and your guide's contact info. We'll check in the day before to confirm everything and answer any last-minute questions.",
          es: "En cuestión de minutos recibirás un correo de confirmación y un mensaje por WhatsApp con los detalles de tu reserva, la hora exacta de recogida en tu hotel, qué llevar y la información de contacto de tu guía. Te contactaremos el día anterior para confirmar todo y responder cualquier pregunta de último momento.",
        },
      },
      {
        _key: key(),
        _type: "step",
        stepNumber: 5,
        icon: "enjoy",
        title: { en: "Enjoy Your Adventure", es: "Disfruta tu Aventura" },
        description: {
          en: "Your bilingual guide will pick you up right at your hotel and take care of everything from there. Just bring your sense of adventure — we'll handle the equipment, transportation, safety, and unforgettable memories. Don't forget your camera!",
          es: "Tu guía bilingüe te recogerá directamente en tu hotel y se encargará de todo desde ese momento. Solo trae tu espíritu aventurero — nosotros nos encargamos del equipo, el transporte, la seguridad y los recuerdos inolvidables. ¡No olvides tu cámara!",
        },
      },
    ],

    // ── FAQ ───────────────────────────────────────────────────────────────
    faqHeading: {
      en: "Booking Questions",
      es: "Preguntas sobre Reservas",
    },
    faqSubheading: {
      en: "Quick answers to the questions we hear most often about the booking process. Still curious? Reach out on WhatsApp anytime.",
      es: "Respuestas rápidas a las preguntas que escuchamos con más frecuencia sobre el proceso de reserva. ¿Aún tienes dudas? Escríbenos por WhatsApp en cualquier momento.",
    },
    faqItems: [
      {
        _key: key(),
        _type: "faqItem",
        question: {
          en: "How much is the deposit and is it refundable?",
          es: "¿Cuánto es el depósito y es reembolsable?",
        },
        answer: {
          en: "The deposit is typically 20–30% of the total excursion price and is shown on every excursion page. Deposits are fully refundable up to 72 hours before your excursion, 50% refundable between 48 and 72 hours, and non-refundable within 48 hours of departure.",
          es: "El depósito normalmente es del 20–30% del precio total de la excursión y se muestra en cada página. Los depósitos son totalmente reembolsables hasta 72 horas antes de tu excursión, reembolsables al 50% entre 48 y 72 horas, y no reembolsables dentro de las 48 horas previas a la salida.",
        },
      },
      {
        _key: key(),
        _type: "faqItem",
        question: {
          en: "When do I pay the remaining balance?",
          es: "¿Cuándo pago el saldo restante?",
        },
        answer: {
          en: "The remaining balance is collected in cash (USD or DOP) on the day of the excursion, just before departure. Your guide will provide a printed receipt. This keeps things simple and avoids extra processing fees on your end.",
          es: "El saldo restante se cobra en efectivo (USD o DOP) el día de la excursión, justo antes de la salida. Tu guía te entregará un recibo impreso. Esto simplifica las cosas y evita tarifas adicionales de procesamiento de tu lado.",
        },
      },
      {
        _key: key(),
        _type: "faqItem",
        question: {
          en: "What happens if it rains or the weather turns bad?",
          es: "¿Qué pasa si llueve o el clima empeora?",
        },
        answer: {
          en: "If we cancel your excursion due to weather or unsafe conditions, you'll receive a full refund of every dollar paid — including the deposit — or you can reschedule for free on a date that works for you. Your safety always comes first.",
          es: "Si cancelamos tu excursión por mal tiempo o condiciones inseguras, recibirás un reembolso completo de cada dólar pagado — incluyendo el depósito — o puedes reprogramar gratis en una fecha que te convenga. Tu seguridad siempre es lo primero.",
        },
      },
      {
        _key: key(),
        _type: "faqItem",
        question: {
          en: "Can I change my booking date after I've paid the deposit?",
          es: "¿Puedo cambiar la fecha de mi reserva después de pagar el depósito?",
        },
        answer: {
          en: "Yes — date changes are free as long as you give us at least 48 hours of notice and the new date has availability. Just message us on WhatsApp or email and we'll take care of moving everything for you.",
          es: "Sí — los cambios de fecha son gratuitos siempre y cuando nos avises con al menos 48 horas de anticipación y la nueva fecha tenga disponibilidad. Solo escríbenos por WhatsApp o correo y nos encargamos de mover todo por ti.",
        },
      },
    ],

    // ── CTA ───────────────────────────────────────────────────────────────
    ctaHeadline: {
      en: "Ready to Book Your Adventure?",
      es: "¿Listo para Reservar tu Aventura?",
    },
    ctaSubheadline: {
      en: "Browse our full lineup of group excursions and reserve your spot in just a few clicks. Or chat with us on WhatsApp for personalized recommendations.",
      es: "Explora nuestra selección completa de excursiones grupales y reserva tu lugar en solo unos clics. O conversa con nosotros por WhatsApp para recibir recomendaciones personalizadas.",
    },
    ctaButtonText: {
      en: "Browse Excursions",
      es: "Ver Excursiones",
    },
    ctaButtonHref: "/excursions",
    ctaWhatsappLabel: {
      en: "Chat on WhatsApp",
      es: "Chatea por WhatsApp",
    },

    // ── SEO ───────────────────────────────────────────────────────────────
    seo: {
      metaTitle: {
        en: "How Booking Works | Punta Cana Excursions",
        es: "Cómo Funciona la Reserva | Excursiones en Punta Cana",
      },
      metaDescription: {
        en: "See how easy it is to book your Punta Cana excursion. Browse, reserve with a small deposit, get instant confirmation, and pay the rest on the day. Free cancellation up to 24 hours before.",
        es: "Descubre lo fácil que es reservar tu excursión en Punta Cana. Explora, reserva con un pequeño depósito, recibe confirmación instantánea y paga el resto el día de la actividad. Cancelación gratuita hasta 24 horas antes.",
      },
      keywords: {
        en: [
          "how to book Punta Cana excursions",
          "Punta Cana tour booking",
          "excursion deposit",
          "instant booking confirmation",
          "free cancellation",
          "pay on arrival Punta Cana",
        ],
        es: [
          "cómo reservar excursiones en Punta Cana",
          "reserva de tours Punta Cana",
          "depósito para excursiones",
          "confirmación instantánea",
          "cancelación gratuita",
          "pago el día de la excursión",
        ],
      },
      ogTitle: {
        en: "How Booking Works — Simple, Secure, Stress-Free",
        es: "Cómo Funciona la Reserva — Simple, Seguro y Sin Estrés",
      },
      ogDescription: {
        en: "From browsing excursions to enjoying your day in Punta Cana — five clear steps with transparent pricing and free cancellation.",
        es: "Desde explorar excursiones hasta disfrutar tu día en Punta Cana — cinco pasos claros con precios transparentes y cancelación gratuita.",
      },
      twitterCard: "summary_large_image",
      noIndex: false,
      noFollow: false,
      structuredDataEn: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Book a Punta Cana Excursion",
          description:
            "Five simple steps to book your Punta Cana excursion: browse, reserve, pay a small deposit, get instant confirmation, and enjoy your day.",
          inLanguage: "en",
          step: [
            { "@type": "HowToStep", position: 1, name: "Browse excursions" },
            { "@type": "HowToStep", position: 2, name: "Reserve your spot" },
            { "@type": "HowToStep", position: 3, name: "Pay a small deposit" },
            { "@type": "HowToStep", position: 4, name: "Get instant confirmation" },
            { "@type": "HowToStep", position: 5, name: "Enjoy your excursion" },
          ],
        },
        null,
        2,
      ),
      structuredDataEs: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cómo Reservar una Excursión en Punta Cana",
          description:
            "Cinco pasos simples para reservar tu excursión en Punta Cana: explora, reserva, paga un pequeño depósito, recibe confirmación instantánea y disfruta tu día.",
          inLanguage: "es",
          step: [
            { "@type": "HowToStep", position: 1, name: "Explora las excursiones" },
            { "@type": "HowToStep", position: 2, name: "Reserva tu lugar" },
            { "@type": "HowToStep", position: 3, name: "Paga un pequeño depósito" },
            { "@type": "HowToStep", position: 4, name: "Recibe confirmación instantánea" },
            { "@type": "HowToStep", position: 5, name: "Disfruta tu excursión" },
          ],
        },
        null,
        2,
      ),
    },
  });

  console.log("✅ How It Works Page seeded successfully.");
  console.log("\n📸 Remember to upload images via Sanity Studio:");
  console.log("   • Hero background image");
  console.log("   • SEO Open Graph image (required to pass publish validation)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
