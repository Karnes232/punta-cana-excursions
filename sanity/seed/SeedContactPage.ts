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

const contactPageData = {
  _id: "contactPage",
  _type: "contactPage",

  heroHeadline: {
    en: "Get in Touch",
    es: "Contáctenos",
  },
  heroSubheadline: {
    en: "Have a question about an excursion? Ready to book? We're here to help — reach out by WhatsApp, email, or the form below and we'll get back to you fast.",
    es: "¿Tiene una pregunta sobre una excursión? ¿Listo para reservar? Estamos aquí para ayudarle — escríbanos por WhatsApp, correo electrónico o el formulario a continuación y le responderemos rápidamente.",
  },

  formHeadline: {
    en: "Send Us a Message",
    es: "Envíenos un Mensaje",
  },
  infoHeadline: {
    en: "Contact Information",
    es: "Información de Contacto",
  },
};

async function seed() {
  await client.createOrReplace(contactPageData);
  console.log("✅ contactPage seeded");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
