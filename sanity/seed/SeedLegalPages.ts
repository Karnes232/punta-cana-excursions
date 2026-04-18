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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let keyCounter = 0;
function key() {
  return `k${++keyCounter}`;
}

function block(
  text: string,
  style: "normal" | "h2" | "h3" | "h4" | "blockquote" = "normal",
  marks: string[] = [],
) {
  return {
    _type: "block",
    _key: key(),
    style,
    children: [{ _type: "span", _key: key(), text, marks }],
    markDefs: [],
  };
}

function bullet(items: string[]) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: key(), text: items[0], marks: [] }],
    markDefs: [],
  };
}

function bullets(items: string[]) {
  return items.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  }));
}

// ---------------------------------------------------------------------------
// Privacy Policy
// ---------------------------------------------------------------------------

const privacyPolicyEn = [
  block("Privacy Policy", "h2"),
  block(
    `Grand Bay Excursions ("we," "us," or "our") operates puntacana-excursions.com. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or book an excursion with us.`,
  ),

  block("1. Information We Collect", "h3"),
  block(
    "We collect information you provide directly, such as your name, email address, phone number, and payment details when you make a booking or contact us.",
  ),
  block("We may also automatically collect:"),
  ...bullets([
    "Browser type and version",
    "Pages visited and time spent on each page",
    "IP address and approximate location",
    "Referring website or search engine",
  ]),

  block("2. How We Use Your Information", "h3"),
  block("We use your information to:"),
  ...bullets([
    "Process and confirm excursion bookings",
    "Send booking confirmations and important trip updates",
    "Respond to your inquiries via email or WhatsApp",
    "Improve our website and services",
    "Send promotional offers (only if you have opted in)",
  ]),

  block("3. Data Sharing", "h3"),
  block(
    "We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers (such as payment processors and booking platforms) who assist us in operating our business, under strict confidentiality agreements.",
  ),

  block("4. Cookies", "h3"),
  block(
    "Our website uses cookies to enhance your browsing experience and analyze website traffic. You may disable cookies in your browser settings, though some features of the site may not function properly without them.",
  ),

  block("5. Data Security", "h3"),
  block(
    "We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
  ),

  block("6. Your Rights", "h3"),
  block("You have the right to:"),
  ...bullets([
    "Access the personal data we hold about you",
    "Request correction of inaccurate data",
    "Request deletion of your personal data (subject to legal requirements)",
    "Withdraw consent for marketing communications at any time",
  ]),

  block("7. Third-Party Links", "h3"),
  block(
    "Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.",
  ),

  block("8. Changes to This Policy", "h3"),
  block(
    "We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date. Continued use of our services after changes constitutes your acceptance of the updated policy.",
  ),

  block("9. Contact Us", "h3"),
  block(
    "If you have questions about this Privacy Policy or how we handle your personal data, please contact us via the Contact page on our website or by WhatsApp.",
  ),
];

const privacyPolicyEs = [
  block("Política de Privacidad", "h2"),
  block(
    `Grand Bay Excursions ("nosotros" o "nuestra empresa") opera puntacana-excursions.com. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestro sitio web o reserva una excursión con nosotros.`,
  ),

  block("1. Información que Recopilamos", "h3"),
  block(
    "Recopilamos la información que usted nos proporciona directamente, como su nombre, correo electrónico, número de teléfono y datos de pago cuando realiza una reserva o nos contacta.",
  ),
  block("También podemos recopilar automáticamente:"),
  ...bullets([
    "Tipo y versión del navegador",
    "Páginas visitadas y tiempo en cada página",
    "Dirección IP y ubicación aproximada",
    "Sitio web o motor de búsqueda de referencia",
  ]),

  block("2. Cómo Usamos su Información", "h3"),
  block("Usamos su información para:"),
  ...bullets([
    "Procesar y confirmar reservas de excursiones",
    "Enviar confirmaciones de reserva y actualizaciones importantes",
    "Responder a sus consultas por correo electrónico o WhatsApp",
    "Mejorar nuestro sitio web y servicios",
    "Enviar ofertas promocionales (solo si usted ha dado su consentimiento)",
  ]),

  block("3. Compartir Datos", "h3"),
  block(
    "No vendemos, intercambiamos ni alquilamos su información personal a terceros. Solo podemos compartir su información con proveedores de servicios de confianza (como procesadores de pago y plataformas de reservas) que nos ayudan a operar nuestro negocio, bajo estrictos acuerdos de confidencialidad.",
  ),

  block("4. Cookies", "h3"),
  block(
    "Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación y analizar el tráfico del sitio. Puede desactivar las cookies en la configuración de su navegador, aunque es posible que algunas funciones del sitio no funcionen correctamente sin ellas.",
  ),

  block("5. Seguridad de los Datos", "h3"),
  block(
    "Implementamos medidas de seguridad estándar de la industria para proteger sus datos personales del acceso, divulgación o destrucción no autorizados. Sin embargo, ningún método de transmisión por internet es 100% seguro.",
  ),

  block("6. Sus Derechos", "h3"),
  block("Usted tiene derecho a:"),
  ...bullets([
    "Acceder a los datos personales que tenemos sobre usted",
    "Solicitar la corrección de datos inexactos",
    "Solicitar la eliminación de sus datos personales (sujeto a requisitos legales)",
    "Retirar el consentimiento para comunicaciones de marketing en cualquier momento",
  ]),

  block("7. Enlaces de Terceros", "h3"),
  block(
    "Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad de esos sitios y le recomendamos revisar sus políticas de privacidad.",
  ),

  block("8. Cambios en Esta Política", "h3"),
  block(
    "Podemos actualizar esta Política de Privacidad periódicamente. Los cambios se publicarán en esta página con la fecha actualizada. El uso continuado de nuestros servicios después de los cambios constituye su aceptación de la política actualizada.",
  ),

  block("9. Contáctenos", "h3"),
  block(
    "Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos sus datos personales, contáctenos a través de la página de Contacto de nuestro sitio web o por WhatsApp.",
  ),
];

// ---------------------------------------------------------------------------
// Terms of Service
// ---------------------------------------------------------------------------

const termsOfServiceEn = [
  block("Terms of Service", "h2"),
  block(
    "These Terms of Service govern your use of puntacana-excursions.com and any excursions booked through Grand Bay Excursions. By booking an excursion or using our website, you agree to these terms.",
  ),

  block("1. Bookings and Payments", "h3"),
  block(
    "All excursion bookings require a deposit to confirm your reservation. The deposit amount is shown on each excursion page. The remaining balance is due on the day of the excursion before departure.",
  ),
  block("Deposits may be paid via:"),
  ...bullets([
    "Credit or debit card through our secure payment link",
    "PayPal",
    "Bank transfer (contact us for details)",
  ]),
  block(
    "Prices are listed in US Dollars (USD). We reserve the right to adjust prices without notice, but confirmed bookings will not be affected.",
  ),

  block("2. Cancellations and Refunds", "h3"),
  block(
    "Please review our Cancellation Policy for full details on cancellation timelines and refund eligibility. In general, cancellations made more than 48 hours before the excursion may qualify for a refund of the deposit.",
  ),

  block("3. Participant Responsibilities", "h3"),
  block("By booking an excursion, you agree to:"),
  ...bullets([
    "Arrive at the designated meeting point at the specified time",
    "Follow all instructions from Grand Bay guides and staff",
    "Disclose any health conditions, disabilities, or restrictions that may affect participation",
    "Respect wildlife, marine ecosystems, and local communities",
    "Comply with all local laws and regulations",
  ]),
  block(
    "Grand Bay Excursions reserves the right to refuse participation to anyone who is intoxicated, displays unsafe behavior, or fails to meet the activity requirements stated in the excursion description.",
  ),

  block("4. Health and Safety", "h3"),
  block(
    "Some excursions have minimum age, weight, or health requirements. These are listed on each excursion page. It is your responsibility to ensure you and your group meet these requirements before booking.",
  ),
  block(
    "Grand Bay Excursions carries liability insurance for all guided activities. However, participation in adventure activities carries inherent risk. By booking, you acknowledge and accept these risks.",
  ),

  block("5. Changes and Cancellations by Grand Bay", "h3"),
  block(
    "We reserve the right to cancel or modify excursions due to weather, safety conditions, or circumstances beyond our control (such as natural disasters or government restrictions). In such cases, we will offer a full refund or reschedule at no additional cost.",
  ),

  block("6. Limitation of Liability", "h3"),
  block(
    "Grand Bay Excursions is not liable for any indirect, incidental, or consequential damages arising from the use of our website or participation in our excursions, beyond the amount paid for the specific booking.",
  ),

  block("7. Intellectual Property", "h3"),
  block(
    "All content on puntacana-excursions.com — including text, images, logos, and video — is the property of Grand Bay Excursions and may not be reproduced without written permission.",
  ),

  block("8. Governing Law", "h3"),
  block(
    "These Terms of Service are governed by the laws of the Dominican Republic. Any disputes shall be resolved in the courts of La Altagracia Province.",
  ),

  block("9. Changes to These Terms", "h3"),
  block(
    "We may update these Terms of Service at any time. Continued use of our website after changes constitutes acceptance of the updated terms.",
  ),

  block("10. Contact", "h3"),
  block(
    "For questions about these Terms, please contact us via our website's Contact page or by WhatsApp.",
  ),
];

const termsOfServiceEs = [
  block("Términos de Servicio", "h2"),
  block(
    "Estos Términos de Servicio rigen el uso de puntacana-excursions.com y cualquier excursión reservada a través de Grand Bay Excursions. Al reservar una excursión o utilizar nuestro sitio web, usted acepta estos términos.",
  ),

  block("1. Reservas y Pagos", "h3"),
  block(
    "Todas las reservas de excursiones requieren un depósito para confirmar su reserva. El monto del depósito se muestra en cada página de excursión. El saldo restante vence el día de la excursión antes de la salida.",
  ),
  block("Los depósitos pueden pagarse mediante:"),
  ...bullets([
    "Tarjeta de crédito o débito a través de nuestro enlace de pago seguro",
    "PayPal",
    "Transferencia bancaria (contáctenos para más detalles)",
  ]),
  block(
    "Los precios están en Dólares Estadounidenses (USD). Nos reservamos el derecho de ajustar los precios sin previo aviso, pero las reservas confirmadas no se verán afectadas.",
  ),

  block("2. Cancelaciones y Reembolsos", "h3"),
  block(
    "Consulte nuestra Política de Cancelación para obtener información completa sobre los plazos de cancelación y la elegibilidad para reembolsos. En general, las cancelaciones realizadas con más de 48 horas de anticipación pueden calificar para un reembolso del depósito.",
  ),

  block("3. Responsabilidades del Participante", "h3"),
  block("Al reservar una excursión, usted acepta:"),
  ...bullets([
    "Llegar al punto de encuentro designado a la hora especificada",
    "Seguir todas las instrucciones de los guías y el personal de Grand Bay",
    "Declarar cualquier condición de salud, discapacidad o restricción que pueda afectar su participación",
    "Respetar la vida silvestre, los ecosistemas marinos y las comunidades locales",
    "Cumplir con todas las leyes y regulaciones locales",
  ]),
  block(
    "Grand Bay Excursions se reserva el derecho de rechazar la participación de cualquier persona que esté intoxicada, muestre un comportamiento inseguro o no cumpla con los requisitos de la actividad indicados en la descripción de la excursión.",
  ),

  block("4. Salud y Seguridad", "h3"),
  block(
    "Algunas excursiones tienen requisitos mínimos de edad, peso o salud. Estos se indican en cada página de excursión. Es su responsabilidad asegurarse de que usted y su grupo cumplan con estos requisitos antes de reservar.",
  ),
  block(
    "Grand Bay Excursions cuenta con seguro de responsabilidad civil para todas las actividades guiadas. Sin embargo, la participación en actividades de aventura conlleva riesgos inherentes. Al reservar, usted reconoce y acepta estos riesgos.",
  ),

  block("5. Cambios y Cancelaciones por Grand Bay", "h3"),
  block(
    "Nos reservamos el derecho de cancelar o modificar excursiones debido a condiciones climáticas, de seguridad o circunstancias fuera de nuestro control (como desastres naturales o restricciones gubernamentales). En tales casos, ofreceremos un reembolso completo o reprogramaremos sin costo adicional.",
  ),

  block("6. Limitación de Responsabilidad", "h3"),
  block(
    "Grand Bay Excursions no es responsable de daños indirectos, incidentales o consecuentes derivados del uso de nuestro sitio web o la participación en nuestras excursiones, más allá del monto pagado por la reserva específica.",
  ),

  block("7. Propiedad Intelectual", "h3"),
  block(
    "Todo el contenido de puntacana-excursions.com — incluidos textos, imágenes, logotipos y videos — es propiedad de Grand Bay Excursions y no puede reproducirse sin permiso escrito.",
  ),

  block("8. Ley Aplicable", "h3"),
  block(
    "Estos Términos de Servicio se rigen por las leyes de la República Dominicana. Cualquier disputa se resolverá en los tribunales de la Provincia La Altagracia.",
  ),

  block("9. Cambios en Estos Términos", "h3"),
  block(
    "Podemos actualizar estos Términos de Servicio en cualquier momento. El uso continuado de nuestro sitio web después de los cambios constituye la aceptación de los términos actualizados.",
  ),

  block("10. Contacto", "h3"),
  block(
    "Para preguntas sobre estos Términos, contáctenos a través de la página de Contacto de nuestro sitio web o por WhatsApp.",
  ),
];

// ---------------------------------------------------------------------------
// Cancellation Policy
// ---------------------------------------------------------------------------

const cancellationPolicyEn = [
  block("Cancellation Policy", "h2"),
  block(
    "We understand that travel plans can change. This policy outlines the cancellation terms for excursions booked through Grand Bay Excursions. Please read it carefully before booking.",
  ),

  block("Standard Cancellation Terms", "h3"),
  ...bullets([
    "72+ hours before excursion: Full deposit refund",
    "48–72 hours before excursion: 50% of deposit refunded",
    "Less than 48 hours before excursion: No refund on deposit",
    "No-show on the day: No refund",
  ]),
  block(
    "Any balance paid beyond the deposit (paid on the day of the excursion) is fully refunded if you cancel with more than 24 hours' notice.",
  ),

  block("How to Cancel", "h3"),
  block(
    "To cancel your booking, contact us as soon as possible via WhatsApp or the Contact page. Please have your booking confirmation number ready. Cancellations are effective from the time we confirm receipt of your request.",
  ),

  block("Weather and Safety Cancellations", "h3"),
  block(
    "If Grand Bay Excursions must cancel your excursion due to bad weather, sea conditions, or other safety concerns, you will receive a full refund of all amounts paid — including the deposit. We will contact you as soon as the cancellation is confirmed.",
  ),
  block(
    "Alternatively, we can reschedule your excursion at no extra charge if your travel dates allow.",
  ),

  block("Medical and Emergency Cancellations", "h3"),
  block(
    "If you or a member of your group experiences a medical emergency, we ask that you contact us immediately. We review medical cancellation requests on a case-by-case basis and will work with you to find a fair solution, which may include rescheduling or a partial refund.",
  ),

  block("Group Bookings", "h3"),
  block(
    "For groups of 8 or more, separate cancellation terms may apply. Please contact us before booking large groups so we can provide a customized agreement.",
  ),

  block("Non-Refundable Booking Fees", "h3"),
  block(
    "Any processing or platform fees charged at the time of booking (if applicable) are non-refundable regardless of cancellation timing.",
  ),

  block("Modifications to Your Booking", "h3"),
  block(
    "If you need to change your excursion date or type, contact us as soon as possible. Date changes are subject to availability. We will do our best to accommodate your request without additional charges if notice is given at least 48 hours before the original excursion time.",
  ),

  block("Contact Us", "h3"),
  block(
    "For cancellations or to discuss your booking, reach us via WhatsApp for the fastest response, or use the Contact page on our website.",
  ),
];

const cancellationPolicyEs = [
  block("Política de Cancelación", "h2"),
  block(
    "Entendemos que los planes de viaje pueden cambiar. Esta política describe los términos de cancelación para las excursiones reservadas a través de Grand Bay Excursions. Por favor, léala detenidamente antes de reservar.",
  ),

  block("Términos de Cancelación Estándar", "h3"),
  ...bullets([
    "Más de 72 horas antes de la excursión: Reembolso completo del depósito",
    "Entre 48 y 72 horas antes de la excursión: 50% del depósito reembolsado",
    "Menos de 48 horas antes de la excursión: Sin reembolso del depósito",
    "No presentarse el día de la excursión: Sin reembolso",
  ]),
  block(
    "Cualquier saldo pagado más allá del depósito (pagado el día de la excursión) se reembolsa completamente si cancela con más de 24 horas de anticipación.",
  ),

  block("Cómo Cancelar", "h3"),
  block(
    "Para cancelar su reserva, contáctenos lo antes posible por WhatsApp o a través de la página de Contacto. Tenga a mano su número de confirmación de reserva. Las cancelaciones son efectivas a partir del momento en que confirmemos la recepción de su solicitud.",
  ),

  block("Cancelaciones por Clima y Seguridad", "h3"),
  block(
    "Si Grand Bay Excursions debe cancelar su excursión debido a mal tiempo, condiciones del mar u otras preocupaciones de seguridad, recibirá un reembolso completo de todos los montos pagados, incluido el depósito. Lo contactaremos tan pronto como se confirme la cancelación.",
  ),
  block(
    "Alternativamente, podemos reprogramar su excursión sin cargo adicional si sus fechas de viaje lo permiten.",
  ),

  block("Cancelaciones por Emergencia Médica", "h3"),
  block(
    "Si usted o un miembro de su grupo experimenta una emergencia médica, le pedimos que nos contacte de inmediato. Revisamos las solicitudes de cancelación médica caso por caso y trabajaremos con usted para encontrar una solución justa, que puede incluir reprogramar o un reembolso parcial.",
  ),

  block("Reservas de Grupos", "h3"),
  block(
    "Para grupos de 8 o más personas, pueden aplicarse términos de cancelación separados. Por favor, contáctenos antes de reservar grupos grandes para que podamos proporcionarle un acuerdo personalizado.",
  ),

  block("Tarifas de Reserva No Reembolsables", "h3"),
  block(
    "Cualquier tarifa de procesamiento o plataforma cobrada en el momento de la reserva (si aplica) no es reembolsable independientemente del momento de cancelación.",
  ),

  block("Modificaciones a su Reserva", "h3"),
  block(
    "Si necesita cambiar la fecha o el tipo de excursión, contáctenos lo antes posible. Los cambios de fecha están sujetos a disponibilidad. Haremos todo lo posible para acomodar su solicitud sin cargos adicionales si se avisa con al menos 48 horas de anticipación.",
  ),

  block("Contáctenos", "h3"),
  block(
    "Para cancelaciones o para hablar sobre su reserva, comuníquese con nosotros por WhatsApp para obtener una respuesta más rápida, o use la página de Contacto de nuestro sitio web.",
  ),
];

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

const documents = [
  {
    _id: "privacy-policy",
    _type: "legalDocument",
    title: { en: "Privacy Policy", es: "Política de Privacidad" },
    lastUpdated: "2025-01-01",
    body: { en: privacyPolicyEn, es: privacyPolicyEs },
  },
  {
    _id: "terms-of-service",
    _type: "legalDocument",
    title: { en: "Terms of Service", es: "Términos de Servicio" },
    lastUpdated: "2025-01-01",
    body: { en: termsOfServiceEn, es: termsOfServiceEs },
  },
  {
    _id: "cancellation-policy",
    _type: "legalDocument",
    title: { en: "Cancellation Policy", es: "Política de Cancelación" },
    lastUpdated: "2025-01-01",
    body: { en: cancellationPolicyEn, es: cancellationPolicyEs },
  },
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function seed() {
  for (const doc of documents) {
    await client.createOrReplace(doc);
    console.log(`✅ ${doc._id}`);
  }
  console.log("\nAll legal documents seeded.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
