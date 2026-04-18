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
const key = () => `faq-key-${++k}`;

const faqPageData = {
  _id: "faqPage",
  _type: "faqPage",

  heroHeadline: {
    en: "Frequently Asked Questions",
    es: "Preguntas Frecuentes",
  },
  heroSubheadline: {
    en: "Everything you need to know before your excursion. Can't find your answer? Reach out via WhatsApp — we reply fast.",
    es: "Todo lo que necesita saber antes de su excursión. ¿No encuentra su respuesta? Escríbanos por WhatsApp — respondemos rápido.",
  },

  categories: [
    // ── Booking & Payments ─────────────────────────────────────────────────
    {
      _key: key(),
      _type: "faqCategory",
      categoryName: { en: "Booking & Payments", es: "Reservas y Pagos" },
      icon: "booking",
      items: [
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "How do I book an excursion?",
            es: "¿Cómo reservo una excursión?",
          },
          answer: {
            en: "You can book directly through our website by clicking the Book Now button on any excursion page, or by messaging us on WhatsApp. We'll confirm your reservation once the deposit is received.",
            es: "Puede reservar directamente en nuestro sitio web haciendo clic en el botón Reservar Ahora en cualquier página de excursión, o enviándonos un mensaje por WhatsApp. Confirmaremos su reserva una vez recibido el depósito.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What payment methods do you accept?",
            es: "¿Qué métodos de pago aceptan?",
          },
          answer: {
            en: "We accept credit and debit cards via our secure payment link, PayPal, and bank transfers. The remaining balance (after the deposit) is paid in cash on the day of the excursion.",
            es: "Aceptamos tarjetas de crédito y débito a través de nuestro enlace de pago seguro, PayPal y transferencias bancarias. El saldo restante (después del depósito) se paga en efectivo el día de la excursión.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Is a deposit required to confirm my booking?",
            es: "¿Se requiere un depósito para confirmar mi reserva?",
          },
          answer: {
            en: "Yes, a deposit is required to secure your spot. The deposit amount varies by excursion and is shown on each excursion page. The remaining balance is collected on the day of the excursion before departure.",
            es: "Sí, se requiere un depósito para asegurar su lugar. El monto del depósito varía según la excursión y se muestra en cada página de excursión. El saldo restante se cobra el día de la excursión antes de la salida.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Are prices per person or per group?",
            es: "¿Los precios son por persona o por grupo?",
          },
          answer: {
            en: "All prices listed on our website are per person unless otherwise noted. Private group rates may differ — contact us for a custom quote for groups of 8 or more.",
            es: "Todos los precios que aparecen en nuestro sitio web son por persona a menos que se indique lo contrario. Las tarifas para grupos privados pueden diferir — contáctenos para una cotización personalizada para grupos de 8 o más personas.",
          },
        },
      ],
    },

    // ── Excursions ──────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: "faqCategory",
      categoryName: { en: "Excursions", es: "Excursiones" },
      icon: "excursion",
      items: [
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What is typically included in an excursion?",
            es: "¿Qué incluye típicamente una excursión?",
          },
          answer: {
            en: "Most excursions include hotel pickup and drop-off, an English/Spanish bilingual guide, equipment specific to the activity, and safety briefing. Food and drinks are included on select full-day excursions. Check the 'What's Included' section on each excursion page for details.",
            es: "La mayoría de las excursiones incluyen traslado desde y hacia el hotel, un guía bilingüe en inglés y español, equipo específico para la actividad y orientación de seguridad. La comida y las bebidas están incluidas en algunas excursiones de día completo. Consulte la sección 'Qué Incluye' en cada página de excursión para más detalles.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What time does pickup happen?",
            es: "¿A qué hora es el recogido?",
          },
          answer: {
            en: "Pickup times vary by excursion and your hotel location. You'll receive the exact pickup time for your hotel in your booking confirmation. Most morning excursions depart between 7:00 AM and 9:00 AM.",
            es: "Los horarios de recogida varían según la excursión y la ubicación de su hotel. Recibirá el horario exacto de recogida para su hotel en la confirmación de su reserva. La mayoría de las excursiones matutinas salen entre las 7:00 AM y las 9:00 AM.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What should I bring on an excursion?",
            es: "¿Qué debo llevar en una excursión?",
          },
          answer: {
            en: "We recommend bringing sunscreen (reef-safe when possible), a towel, comfortable clothes, and a camera. Specific packing lists are included on each excursion page under 'What to Bring'. Water is provided on most tours.",
            es: "Recomendamos traer protector solar (respetuoso con los arrecifes si es posible), una toalla, ropa cómoda y una cámara. Listas de equipaje específicas se incluyen en cada página de excursión bajo 'Qué Traer'. Se proporciona agua en la mayoría de los tours.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Are excursions available in both English and Spanish?",
            es: "¿Las excursiones están disponibles en inglés y español?",
          },
          answer: {
            en: "Yes. All our guides are bilingual in English and Spanish, so you'll feel comfortable no matter which language you prefer.",
            es: "Sí. Todos nuestros guías son bilingües en inglés y español, para que se sienta cómodo sin importar qué idioma prefiera.",
          },
        },
      ],
    },

    // ── Cancellations ────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: "faqCategory",
      categoryName: { en: "Cancellations & Changes", es: "Cancelaciones y Cambios" },
      icon: "cancellation",
      items: [
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What is your cancellation policy?",
            es: "¿Cuál es su política de cancelación?",
          },
          answer: {
            en: "Cancellations made more than 72 hours before the excursion receive a full deposit refund. Cancellations between 48–72 hours receive a 50% refund. Cancellations within 48 hours are non-refundable. See our full Cancellation Policy page for details.",
            es: "Las cancelaciones realizadas con más de 72 horas de anticipación reciben un reembolso completo del depósito. Las cancelaciones entre 48 y 72 horas reciben un reembolso del 50%. Las cancelaciones dentro de las 48 horas no son reembolsables. Consulte nuestra página de Política de Cancelación para más detalles.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What happens if the weather is bad?",
            es: "¿Qué pasa si el clima es malo?",
          },
          answer: {
            en: "If Grand Bay cancels your excursion due to weather or unsafe conditions, you will receive a full refund of all amounts paid or a free reschedule — your choice. We monitor conditions closely and will notify you as early as possible.",
            es: "Si Grand Bay cancela su excursión por mal tiempo o condiciones inseguras, recibirá un reembolso completo de todos los montos pagados o una reprogramación gratuita — usted elige. Monitoreamos las condiciones de cerca y le notificaremos lo antes posible.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Can I change the date of my booking?",
            es: "¿Puedo cambiar la fecha de mi reserva?",
          },
          answer: {
            en: "Yes, date changes are possible subject to availability. Contact us at least 48 hours before your original excursion date and we'll do our best to accommodate you at no extra charge.",
            es: "Sí, los cambios de fecha son posibles sujetos a disponibilidad. Contáctenos al menos 48 horas antes de la fecha original de su excursión y haremos todo lo posible para atenderle sin costo adicional.",
          },
        },
      ],
    },

    // ── Safety ───────────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: "faqCategory",
      categoryName: { en: "Safety & Requirements", es: "Seguridad y Requisitos" },
      icon: "safety",
      items: [
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Are there age or health restrictions?",
            es: "¿Hay restricciones de edad o salud?",
          },
          answer: {
            en: "Age and health requirements vary by excursion and are listed on each excursion page. Some water activities have minimum age limits (typically 6+) and may not be suitable for guests with certain medical conditions. When in doubt, contact us before booking.",
            es: "Los requisitos de edad y salud varían según la excursión y se indican en cada página de excursión. Algunas actividades acuáticas tienen límites de edad mínima (normalmente 6+) y pueden no ser adecuadas para huéspedes con ciertas condiciones médicas. En caso de duda, contáctenos antes de reservar.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Do I need to know how to swim?",
            es: "¿Necesito saber nadar?",
          },
          answer: {
            en: "For most snorkeling excursions, basic swimming ability is helpful but not required — life vests and flotation aids are always provided. Scuba diving requires the ability to swim. Specific requirements are listed on each excursion page.",
            es: "Para la mayoría de las excursiones de snorkel, tener habilidades básicas de natación es útil pero no obligatorio — siempre se proporcionan chalecos salvavidas y flotadores. El buceo requiere poder nadar. Los requisitos específicos se indican en cada página de excursión.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "Is Grand Bay Excursions insured?",
            es: "¿Grand Bay Excursions está asegurado?",
          },
          answer: {
            en: "Yes. Grand Bay Excursions carries full liability insurance for all guided activities. Our guides are trained in first aid and water safety. Your wellbeing is always our top priority.",
            es: "Sí. Grand Bay Excursions cuenta con seguro de responsabilidad civil completo para todas las actividades guiadas. Nuestros guías están capacitados en primeros auxilios y seguridad acuática. Su bienestar siempre es nuestra máxima prioridad.",
          },
        },
        {
          _key: key(),
          _type: "faqItem",
          question: {
            en: "What should I do if I have a medical condition?",
            es: "¿Qué debo hacer si tengo una condición médica?",
          },
          answer: {
            en: "Please inform us of any medical conditions, disabilities, or physical limitations before booking. We'll advise you on which excursions are suitable and ensure our team is prepared to assist you appropriately.",
            es: "Por favor infórmenos de cualquier condición médica, discapacidad o limitación física antes de reservar. Le asesoraremos sobre qué excursiones son adecuadas y nos aseguraremos de que nuestro equipo esté preparado para asistirle adecuadamente.",
          },
        },
      ],
    },
  ],
};

async function seed() {
  await client.createOrReplace(faqPageData);
  console.log("✅ faqPage seeded");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
