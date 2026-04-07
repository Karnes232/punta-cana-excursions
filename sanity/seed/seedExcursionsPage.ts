/**
 * Seed: ExcursionsPage + ExcursionCategory
 *
 * Creates the ExcursionsPage singleton and 8 ExcursionCategory documents.
 *
 * Usage:
 *   npx tsx src/sanity/seed/seedExcursionsPage.ts
 *
 * Safe to re-run: uses createIfNotExists so existing documents won't be overwritten.
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// EXCURSIONS PAGE (singleton)
// ─────────────────────────────────────────────────────────────────────────────

const excursionsPage = {
  _id: "excursionsPage",
  _type: "excursionsPage",
  heroHeadline: {
    _type: "localizedString",
    en: "Explore Our Excursions",
    es: "Explora Nuestras Excursiones",
  },
  heroSubheadline: {
    _type: "localizedText",
    en: "Discover top-rated tours, island adventures, and unforgettable experiences in Punta Cana — all with local support and easy booking.",
    es: "Descubre los mejores tours, aventuras en islas y experiencias inolvidables en Punta Cana — todo con soporte local y reservas fáciles.",
  },
  ctaHeadline: {
    _type: "localizedString",
    en: "Need help choosing?",
    es: "¿Necesitas ayuda para elegir?",
  },
  ctaDescription: {
    _type: "localizedText",
    en: "Our local team knows every excursion firsthand. Send us a message and we'll help you find the perfect tour for your trip.",
    es: "Nuestro equipo local conoce cada excursión de primera mano. Envíanos un mensaje y te ayudaremos a encontrar el tour perfecto para tu viaje.",
  },
  ctaWhatsappButtonText: {
    _type: "localizedString",
    en: "Chat on WhatsApp",
    es: "Chatea por WhatsApp",
  },
  ctaContactButtonText: {
    _type: "localizedString",
    en: "Contact Us",
    es: "Contáctanos",
  },
  seoTitle: {
    _type: "localizedString",
    en: "Excursions in Punta Cana | Tours, Island Trips & Adventures",
    es: "Excursiones en Punta Cana | Tours, Islas y Aventuras",
  },
  seoDescription: {
    _type: "localizedText",
    en: "Browse all excursions in Punta Cana. Island tours, catamaran cruises, snorkeling, adventure trips, and family tours. Easy deposit booking with local support.",
    es: "Explora todas las excursiones en Punta Cana. Tours a islas, catamaranes, snorkeling, aventura y tours familiares. Reserva fácil con depósito y soporte local.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXCURSION CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

const categories = [
  {
    _id: "category-island-tours",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Island Tours",
      es: "Tours a Islas",
    },
    slug: { _type: "slug", current: "island-tours" },
    description: {
      _type: "localizedText",
      en: "Escape to the stunning islands near Punta Cana. Pristine beaches, natural pools, and Caribbean paradise await you on Saona, Catalina, and more.",
      es: "Escápate a las impresionantes islas cerca de Punta Cana. Playas vírgenes, piscinas naturales y el paraíso caribeño te esperan en Saona, Catalina y más.",
    },
    icon: "island",
    sortOrder: 1,
  },
  {
    _id: "category-catamarans",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Catamarans",
      es: "Catamaranes",
    },
    slug: { _type: "slug", current: "catamarans" },
    description: {
      _type: "localizedText",
      en: "Sail the Caribbean coast on a catamaran with snorkeling stops, open bar, music, and natural pool visits. The classic Punta Cana experience.",
      es: "Navega por la costa caribeña en catamarán con paradas de snorkeling, barra libre, música y visitas a la piscina natural. La experiencia clásica de Punta Cana.",
    },
    icon: "catamaran",
    sortOrder: 2,
  },
  {
    _id: "category-adventure",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Adventure",
      es: "Aventura",
    },
    slug: { _type: "slug", current: "adventure" },
    description: {
      _type: "localizedText",
      en: "Get your adrenaline pumping with buggy rides through the countryside, zip lines over the jungle, ATV trails, and extreme off-road adventures.",
      es: "Siente la adrenalina con paseos en buggy por el campo, tirolesas sobre la selva, senderos en ATV y aventuras extremas todoterreno.",
    },
    icon: "adventure",
    sortOrder: 3,
  },
  {
    _id: "category-snorkeling-diving",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Snorkeling & Diving",
      es: "Snorkeling y Buceo",
    },
    slug: { _type: "slug", current: "snorkeling-diving" },
    description: {
      _type: "localizedText",
      en: "Explore vibrant coral reefs, swim with tropical fish, and discover the underwater world of the Caribbean with our guided snorkeling and diving experiences.",
      es: "Explora arrecifes de coral, nada con peces tropicales y descubre el mundo submarino del Caribe con nuestras experiencias guiadas de snorkeling y buceo.",
    },
    icon: "snorkeling",
    sortOrder: 4,
  },
  {
    _id: "category-family-tours",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Family Tours",
      es: "Tours Familiares",
    },
    slug: { _type: "slug", current: "family-tours" },
    description: {
      _type: "localizedText",
      en: "Fun for all ages. From dolphin encounters and animal parks to gentle boat rides and beach days — excursions the whole family will love.",
      es: "Diversión para todas las edades. Desde encuentros con delfines y parques de animales hasta paseos en bote y días de playa — excursiones que toda la familia disfrutará.",
    },
    icon: "family",
    sortOrder: 5,
  },
  {
    _id: "category-sunset-cruises",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Sunset Cruises",
      es: "Cruceros al Atardecer",
    },
    slug: { _type: "slug", current: "sunset-cruises" },
    description: {
      _type: "localizedText",
      en: "Watch the Caribbean sunset from the deck of a luxury vessel. Cocktails, music, and golden hour views over the ocean.",
      es: "Contempla la puesta de sol caribeña desde la cubierta de un barco de lujo. Cócteles, música y vistas doradas sobre el océano.",
    },
    icon: "sunset",
    sortOrder: 6,
  },
  {
    _id: "category-culture-nature",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Culture & Nature",
      es: "Cultura y Naturaleza",
    },
    slug: { _type: "slug", current: "culture-nature" },
    description: {
      _type: "localizedText",
      en: "Discover the real Dominican Republic. Visit cocoa plantations, taste local rum, explore caves, and connect with the culture beyond the resort.",
      es: "Descubre la verdadera República Dominicana. Visita plantaciones de cacao, prueba el ron local, explora cuevas y conecta con la cultura más allá del resort.",
    },
    icon: "culture",
    sortOrder: 7,
  },
  {
    _id: "category-private-tours",
    _type: "excursionCategory",
    title: {
      _type: "localizedString",
      en: "Private Tours",
      es: "Tours Privados",
    },
    slug: { _type: "slug", current: "private-tours" },
    description: {
      _type: "localizedText",
      en: "Exclusive experiences just for your group. Private boats, custom itineraries, and personalized service for couples, families, and celebrations.",
      es: "Experiencias exclusivas solo para tu grupo. Botes privados, itinerarios personalizados y servicio a medida para parejas, familias y celebraciones.",
    },
    icon: "private",
    sortOrder: 8,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RUN SEED
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌴 Seeding ExcursionsPage + ExcursionCategory content...\n");

  const transaction = client.transaction();

  // Singleton page
  transaction.createIfNotExists(excursionsPage);
  console.log("  ✓ ExcursionsPage singleton");

  // Categories
  for (const category of categories) {
    transaction.createIfNotExists(category);
    console.log(`  ✓ Category: ${category.title.en}`);
  }

  const result = await transaction.commit();
  console.log(`\n✅ Done! ${result.results.length} documents created.`);
  console.log(
    "   Open Sanity Studio to upload images for the hero and categories.\n"
  );
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});