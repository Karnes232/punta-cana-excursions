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
// Helpers
// =============================================================================

let keyCounter = 0;
function key() {
  return `k${(++keyCounter).toString(36)}`;
}

function block(text: string, style: string = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

// =============================================================================
// Full descriptions per excursion (patch only — images are preserved)
// =============================================================================

const descriptions: Record<
  string,
  { en: ReturnType<typeof block>[]; es: ReturnType<typeof block>[] }
> = {
  // ─── Saona Island Full Day ─────────────────────────────────────────────────
  "excursion-saona-island-full-day": {
    en: [
      block("Saona Island Full Day — The Classic Dominican Experience", "h2"),
      block(
        "There's a reason Saona Island is on every Punta Cana bucket list. Nestled within the Cotubanamá National Park, this slice of paradise sits where the Caribbean Sea meets the Atlantic Ocean, producing crystal-clear turquoise waters, powdery white sand, and swaying palm trees straight from a travel magazine.",
      ),
      block(
        "Your day begins with a catamaran ride along the stunning southern coastline of the Dominican Republic. As the boat skims through turquoise water, open bar drinks flow and the music sets the mood — this is the Caribbean at its finest. Halfway to the island, the boat drops anchor at the famous natural pool, a shallow sandbar where starfish gather in the warm, waist-deep water. Wade in, take photos, and feel the magic of standing in the middle of the ocean.",
      ),
      block("What to Expect on the Island", "h3"),
      block(
        "Once you arrive at Saona, you'll have hours of free time to enjoy the beach exactly as you like. Stretch out on a lounge chair under a palm tree, wade into the impossibly warm shallows, or try snorkeling along the shoreline. A full buffet lunch awaits with fresh Dominican flavors — rice, beans, grilled chicken, and fresh seafood — served beachside with a cold drink in hand.",
      ),
      block(
        "The return trip takes a speedboat back to the marina, cutting through the water for an exhilarating end to a perfect day. By the time you're back at your hotel, sun-kissed and satisfied, Saona will already feel like a dream.",
      ),
      block("Good to Know", "h3"),
      block(
        "This excursion operates rain or shine — the Caribbean weather moves fast, and even a brief shower rarely dampens the experience. Children are welcome and tend to love the natural pool stop. Pregnant women and guests with serious mobility limitations should contact us before booking.",
      ),
    ],
    es: [
      block("Isla Saona Día Completo — La Experiencia Dominicana Clásica", "h2"),
      block(
        "Hay una razón por la que la Isla Saona está en la lista de deseos de todos en Punta Cana. Enclavada dentro del Parque Nacional Cotubanamá, esta joya del paraíso se encuentra donde el Mar Caribe se une con el Océano Atlántico, produciendo aguas turquesas cristalinas, arena blanca como el polvo y palmeras mecidas por el viento, todo directo de una revista de viajes.",
      ),
      block(
        "Tu día comienza con un paseo en catamarán a lo largo de la impresionante costa sur de la República Dominicana. Mientras el barco surca las aguas turquesas, la barra libre fluye y la música marca el ritmo — así es el Caribe en su máximo esplendor. A mitad de camino a la isla, el barco ancla en la famosa piscina natural, un banco de arena donde las estrellas de mar se congregan en aguas cálidas que llegan a la cintura. Entra al agua, saca fotos y siente la magia de estar parado en medio del océano.",
      ),
      block("Qué esperar en la isla", "h3"),
      block(
        "Una vez que llegues a Saona, tendrás horas de tiempo libre para disfrutar la playa como más te guste. Recuéstate en una silla bajo una palmera, entra en los increíblemente cálidos bajíos o prueba el snorkel a lo largo de la costa. Un almuerzo buffet completo te espera con sabores dominicanos frescos — arroz, habichuelas, pollo a la brasa y mariscos frescos — servido en la playa con una bebida fría en mano.",
      ),
      block(
        "El viaje de regreso es en lancha rápida de vuelta a la marina, cortando las aguas para una final emocionante de un día perfecto. Para cuando estés de vuelta en tu hotel, bronceado y satisfecho, Saona ya se sentirá como un sueño.",
      ),
      block("Bueno saber", "h3"),
      block(
        "Esta excursión opera llueva o haga sol — el clima caribeño cambia rápido y una lluvia breve raramente arruina la experiencia. Los niños son bienvenidos y suelen adorar la parada en la piscina natural. Las mujeres embarazadas y huéspedes con limitaciones de movilidad deben contactarnos antes de reservar.",
      ),
    ],
  },

  // ─── Catamaran Party Cruise ────────────────────────────────────────────────
  "excursion-catamaran-party-cruise": {
    en: [
      block("Catamaran Party Cruise — Sail, Snorkel, Dance", "h2"),
      block(
        "If you're looking for the most fun you can have on the water in Punta Cana, the Catamaran Party Cruise is it. This half-day adventure packs in sailing, snorkeling, swimming, and non-stop music into four hours you won't forget — all with an open bar that keeps the good vibes flowing from departure to dock.",
      ),
      block(
        "You'll board a spacious, professionally crewed catamaran and head out along the Punta Cana coastline. The on-board DJ sets the soundtrack as the boat glides through turquoise water, with the trade winds filling the sails and the sun warm on your skin. This is Caribbean sailing at its most festive.",
      ),
      block("Snorkeling & Natural Pool Stops", "h3"),
      block(
        "Mid-cruise, the boat drops anchor at a vibrant coral reef for a snorkeling stop. Masks and fins are provided — even if you've never snorkeled before, the calm, clear water makes it easy. After snorkeling, the crew navigates to a natural pool for a swim stop before heading back to port.",
      ),
      block(
        "The open bar includes rum cocktails, cold beer, soft drinks, and water throughout the entire trip. There's no designated dance floor per se — the whole catamaran is the dance floor, and the crew loves to get guests moving.",
      ),
      block("Morning or Afternoon Departure", "h3"),
      block(
        "We offer two departures: a morning cruise (great for those who want the rest of the day free) and an afternoon cruise (perfect for starting your evening with good energy). Both offer the same great experience — just a different light and vibe on the water.",
      ),
    ],
    es: [
      block("Crucero Fiesta en Catamarán — Navega, Bucea, Baila", "h2"),
      block(
        "Si buscas la diversión más grande que puedas tener en el agua en Punta Cana, el Crucero Fiesta en Catamarán es la respuesta. Esta aventura de medio día combina navegación, snorkel, natación y música sin parar en cuatro horas que no olvidarás — todo con una barra libre que mantiene el buen ambiente desde la salida hasta el regreso al muelle.",
      ),
      block(
        "Subirás a un espacioso catamarán con tripulación profesional y saldrás a lo largo de la costa de Punta Cana. El DJ a bordo pone la banda sonora mientras el barco desliza por aguas turquesas, con los vientos alisios llenando las velas y el sol cálido sobre tu piel. Así es la navegación caribeña en su versión más festiva.",
      ),
      block("Paradas de snorkel y piscina natural", "h3"),
      block(
        "A mitad del crucero, el barco ancla en un arrecife de coral para una parada de snorkel. Se proporcionan máscaras y aletas — incluso si nunca has hecho snorkel, las aguas tranquilas y claras lo hacen fácil. Después del snorkel, la tripulación navega hacia una piscina natural para una parada de natación antes de regresar al puerto.",
      ),
      block(
        "La barra libre incluye cócteles de ron, cerveza fría, refrescos y agua durante todo el viaje. No hay una pista de baile específica — todo el catamarán es la pista, y la tripulación adora animar a los huéspedes a moverse.",
      ),
      block("Salida por la mañana o por la tarde", "h3"),
      block(
        "Ofrecemos dos salidas: un crucero matutino (ideal para quienes quieren el resto del día libre) y un crucero vespertino (perfecto para comenzar la noche con buena energía). Ambos ofrecen la misma gran experiencia — solo con una luz y ambiente diferente en el agua.",
      ),
    ],
  },

  // ─── Zip Line & Eco Adventure Park ────────────────────────────────────────
  "excursion-zip-line-eco-adventure-park": {
    en: [
      block("Zip Line & Eco Adventure Park — Into the Dominican Jungle", "h2"),
      block(
        "Most visitors to Punta Cana never see what lies beyond the resort gates. This excursion takes you deep into the Dominican countryside — through lush tropical forest, past rushing rivers, and over rolling green hills — for a day of adventure that leaves behind the beach lounger and wakes up every part of you.",
      ),
      block(
        "The centerpiece is the zip line course: 12 lines stretching through the tropical canopy, offering jaw-dropping views of the jungle and valleys below. Each line is longer and higher than the last, building up to a finale that will leave even seasoned thrill-seekers grinning. Professional guides brief you on safety before every line — no experience required.",
      ),
      block("More Than Just Zip Lines", "h3"),
      block(
        "This is a full eco-adventure, not just a zip line park. After soaring through the treetops, you'll saddle up for a horseback ride through the countryside, following trails used by Dominican farmers for generations. The horses are calm and well-trained — perfect for first-timers and experienced riders alike.",
      ),
      block(
        "The natural river pool is one of the best-kept secrets on the excursion. Tucked into the jungle floor, the cool, clear water is a refreshing contrast to the heat of the zip lines. Wade in, swim around, or simply sit on the rocks and take in the surroundings — it feels completely removed from the resort world.",
      ),
      block("Dominican Culture & Flavors", "h3"),
      block(
        "Before heading back, the park serves an authentic Dominican lunch: slow-cooked rice and beans, grilled chicken or pork, fresh plantains, and tropical fruit juice. You'll also get a coffee and cacao tasting, learning how two of the Dominican Republic's most famous exports are grown and processed right here on the land.",
      ),
      block(
        "Closed-toe shoes are required for the zip lines — sandals and flip-flops won't do. If you don't have them, let us know in advance and we can arrange a rental.",
      ),
    ],
    es: [
      block("Tirolesa y Parque de Eco Aventura — Hacia la Selva Dominicana", "h2"),
      block(
        "La mayoría de los visitantes de Punta Cana nunca ven lo que hay más allá de los portones del resort. Esta excursión te lleva al corazón del campo dominicano — a través de exuberante bosque tropical, junto a ríos caudalosos y sobre verdes colinas onduladas — para un día de aventura que deja atrás la silla de playa y despierta cada parte de ti.",
      ),
      block(
        "El centro de atención es el circuito de tirolesas: 12 líneas que se extienden por el dosel tropical, ofreciendo vistas impresionantes de la selva y los valles de abajo. Cada línea es más larga y alta que la anterior, acumulando hasta un final que dejará sonriendo incluso a los amantes de la adrenalina más experimentados. Los guías profesionales te instruyen sobre seguridad antes de cada línea — no se requiere experiencia.",
      ),
      block("Más que solo tirolesas", "h3"),
      block(
        "Esta es una eco-aventura completa, no solo un parque de tirolesas. Después de volar por las copas de los árboles, montarás a caballo por el campo, siguiendo senderos que los agricultores dominicanos han usado por generaciones. Los caballos son tranquilos y bien entrenados — perfectos tanto para principiantes como para jinetes experimentados.",
      ),
      block(
        "La piscina natural de río es uno de los secretos mejor guardados de la excursión. Escondida en el suelo de la selva, el agua fresca y clara es un contraste refrescante con el calor de las tirolesas. Entra, nada, o simplemente siéntate en las rocas y absorbe el entorno — se siente completamente alejado del mundo del resort.",
      ),
      block("Cultura y sabores dominicanos", "h3"),
      block(
        "Antes de regresar, el parque sirve un almuerzo dominicano auténtico: arroz con habichuelas cocinado a fuego lento, pollo o cerdo a la brasa, plátanos frescos y jugo de frutas tropicales. También disfrutarás de una degustación de café y cacao, aprendiendo cómo dos de las exportaciones más famosas de la República Dominicana se cultivan y procesan aquí mismo en estas tierras.",
      ),
      block(
        "Se requieren zapatos cerrados para las tirolesas — las sandalias y chancletas no son aptas. Si no los tienes, avísanos con anticipación y podemos gestionar un alquiler.",
      ),
    ],
  },

  // ─── Snorkeling & Reef Explorer ────────────────────────────────────────────
  "excursion-snorkeling-reef-explorer": {
    en: [
      block("Snorkeling & Reef Explorer — Punta Cana Below the Surface", "h2"),
      block(
        "The Caribbean reef system off the coast of Punta Cana is one of the most biodiverse in the region — and most tourists never see it. The Snorkeling & Reef Explorer excursion puts you face-to-face with it: vibrant coral formations, schools of tropical fish in electric colors, graceful sea turtles, and the occasional spotted eagle ray gliding silently below.",
      ),
      block(
        "This is a small-group experience led by certified Grand Bay dive instructors who know these waters intimately. Unlike large catamaran tours where snorkeling is an afterthought, this excursion is built entirely around the reef. We visit two different sites per trip, selected based on conditions, marine activity, and tide — giving you the best possible window into what's down there.",
      ),
      block("No Experience Needed", "h3"),
      block(
        "You don't need any prior snorkeling or diving experience. We provide a thorough briefing before entering the water, covering breathing technique, how to clear your mask, and what to do if you feel uncomfortable. Life vests and flotation noodles are available for anyone who wants extra support. Most first-timers are comfortable within five minutes.",
      ),
      block(
        "All equipment is professional-grade: wide-view masks that minimize fogging, full-foot fins for comfortable propulsion, and snorkels with splash guards. If you wear prescription glasses, let us know — we may be able to source prescription-compatible masks.",
      ),
      block("What You Might See", "h3"),
      block(
        "Parrotfish, angelfish, blue tang, wrasse, sergeant majors, and trumpetfish are regulars at our reef sites. Sea turtles surface for air and often let curious snorkelers drift nearby without disturbance. Spotted eagle rays are less predictable but a genuine possibility, especially on morning tours. The coral itself — brain coral, elkhorn, staghorn, and soft sea fans — is worth the trip alone.",
      ),
      block(
        "We practice responsible reef interaction: no touching the coral, no chasing marine life, and reef-safe sunscreen only. We ask all guests to honor this — the health of the reef is why we have such consistently remarkable sightings.",
      ),
    ],
    es: [
      block("Snorkel y Exploración de Arrecifes — Punta Cana Bajo la Superficie", "h2"),
      block(
        "El sistema de arrecifes del Caribe frente a la costa de Punta Cana es uno de los más biodiversos de la región — y la mayoría de los turistas nunca lo ven. La excursión Snorkel y Exploración de Arrecifes te pone cara a cara con él: vibrantes formaciones de coral, cardúmenes de peces tropicales en colores eléctricos, majestuosas tortugas marinas y la ocasional raya águila manchada deslizándose silenciosamente por debajo.",
      ),
      block(
        "Esta es una experiencia de grupo pequeño liderada por instructores de buceo certificados de Grand Bay que conocen estas aguas profundamente. A diferencia de los grandes tours en catamarán donde el snorkel es una actividad secundaria, esta excursión está construida enteramente alrededor del arrecife. Visitamos dos sitios diferentes por viaje, seleccionados según las condiciones, la actividad marina y la marea — dándote la mejor ventana posible a lo que hay allá abajo.",
      ),
      block("No se necesita experiencia", "h3"),
      block(
        "No necesitas experiencia previa en snorkel o buceo. Proporcionamos un briefing completo antes de entrar al agua, cubriendo técnica de respiración, cómo limpiar la máscara y qué hacer si te sientes incómodo. Los chalecos salvavidas y flotadores están disponibles para quien desee apoyo adicional. La mayoría de los principiantes se sienten cómodos en cinco minutos.",
      ),
      block(
        "Todo el equipo es de grado profesional: máscaras de visión amplia que minimizan el empañamiento, aletas de pie completo para una propulsión cómoda y snorkels con protectores contra salpicaduras. Si usas lentes de prescripción, avísanos — es posible que podamos conseguir máscaras compatibles con prescripción.",
      ),
      block("Lo que podrías ver", "h3"),
      block(
        "Peces loro, peces ángel, pez cirujano azul, doncella, sargento y pez trompeta son habituales en nuestros sitios de arrecife. Las tortugas marinas suben a respirar y frecuentemente permiten que los buceadores curiosos se acerquen sin perturbarse. Las rayas águila manchadas son menos predecibles pero una posibilidad real, especialmente en los tours matutinos. El coral en sí mismo — coral cerebro, cuerno de alce, cuerno de ciervo y abanicos de mar suaves — vale el viaje por sí solo.",
      ),
      block(
        "Practicamos la interacción responsable con el arrecife: sin tocar el coral, sin perseguir la vida marina y solo protector solar biodegradable. Le pedimos a todos los huéspedes que respeten esto — la salud del arrecife es la razón por la que tenemos avistamientos tan consistentemente notables.",
      ),
    ],
  },
};

// =============================================================================
// Patch runner — only touches fullDescription, everything else is preserved
// =============================================================================

async function patchDescriptions() {
  console.log("✍️  Patching fullDescription on excursion documents...\n");
  console.log("   Images and all other fields will NOT be modified.\n");

  for (const [docId, fullDescription] of Object.entries(descriptions)) {
    await client.patch(docId).set({ fullDescription }).commit();
    console.log(`  ✅ ${docId}`);
  }

  console.log("\n🎉 All descriptions patched successfully!");
}

patchDescriptions().catch((err) => {
  console.error("❌ Patch failed:", err);
  process.exit(1);
});
