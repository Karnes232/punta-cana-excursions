import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

/* ---------------------------------------------------------------------------
   PatchContactSuccess — additive patch for the live contactPage doc.

   Sets the post-submit "What happens next" panel (eyebrow, headline, subheading,
   steps). Uses .set() only — non-destructive, leaves the hero image and other
   fields untouched.

   Run: npx tsx sanity/seed/PatchContactSuccess.ts
   --------------------------------------------------------------------------- */

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36)}`;

const successSteps = [
  {
    _key: key(),
    title: {
      en: "1. We Read It Personally",
      es: "1. Lo Leemos Personalmente",
    },
    body: {
      en: "Every message goes to our team in Punta Cana — not a call center or chatbot. Usually one of two or three people will read and reply to yours, depending on what you're asking about (diving questions go to our PADI team, group bookings go to our coordinator).",
      es: "Cada mensaje llega a nuestro equipo en Punta Cana, no a un call center ni a un chatbot. Normalmente una de dos o tres personas leerá y responderá el tuyo, según lo que consultes (las preguntas de buceo van a nuestro equipo PADI; las reservas de grupo, a nuestro coordinador).",
    },
  },
  {
    _key: key(),
    title: {
      en: "2. We Reply With Real Information",
      es: "2. Respondemos con Información Real",
    },
    body: {
      en: "You'll get a personal email reply with availability, pricing details for your group size, and honest recommendations — including telling you when something isn't a good fit. If we need more info to give a complete answer, we'll ask in the same reply rather than send back-and-forth questions.",
      es: "Recibirás una respuesta personal por correo con disponibilidad, detalles de precios según el tamaño de tu grupo y recomendaciones honestas, incluso diciéndote cuándo algo no es la mejor opción. Si necesitamos más datos para darte una respuesta completa, te lo preguntaremos en el mismo correo en lugar de enviar preguntas de ida y vuelta.",
    },
  },
  {
    _key: key(),
    title: {
      en: "3. You Book When You're Ready",
      es: "3. Reservas Cuando Estés Listo",
    },
    body: {
      en: "If you decide to book, we send you a secure link to pay a small deposit through PayPal. That confirms your dates. The remaining balance is paid on the day of your tour, in cash or by card. No pressure, no follow-up sales pitches — if you decide not to book, that's fine too.",
      es: "Si decides reservar, te enviamos un enlace seguro para pagar un pequeño depósito a través de PayPal. Eso confirma tus fechas. El saldo restante se paga el día de tu tour, en efectivo o con tarjeta. Sin presión, sin llamadas de venta insistentes; y si decides no reservar, también está bien.",
    },
  },
];

async function main() {
  console.log("🩹 Patching Contact Page — post-submit steps...\n");

  await client
    .patch("contactPage")
    .set({
      successEyebrow: { en: "What happens next", es: "Qué sigue" },
      successHeadline: {
        en: "What Happens After You Send a Message",
        es: "Qué Sucede Después de Enviar un Mensaje",
      },
      successSubheading: {
        en: "Three steps from inquiry to confirmation.",
        es: "Tres pasos desde la consulta hasta la confirmación.",
      },
      successSteps,
    })
    .commit();

  console.log("✅ Contact Page patched (post-submit steps).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
