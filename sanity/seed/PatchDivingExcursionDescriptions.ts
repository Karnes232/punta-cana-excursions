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
// Full descriptions — patch only, images and all other fields are preserved
// =============================================================================

const descriptions: Record<
  string,
  { en: ReturnType<typeof block>[]; es: ReturnType<typeof block>[] }
> = {
  // ─── Caribbean Reef Snorkeling ─────────────────────────────────────────────
  "diving-excursion-caribbean-reef-snorkeling": {
    en: [
      block("Caribbean Reef Snorkeling — The Underwater World of Punta Cana", "h2"),
      block(
        "Just a short boat ride from the shore, the reef system off Punta Cana is a world apart. Parrotfish graze on coral, sea turtles glide through shafts of sunlight, and spotted eagle rays sweep silently below. This guided snorkeling experience puts you right in the middle of it — no diving certification, no experience, no problem.",
      ),
      block(
        "We keep groups small for a reason. Large catamaran tours drop 40 people into the water at once, which chases the wildlife away before you've put your mask on. Our boats carry a maximum of 15 guests, and our certified instructors know the two reef sites we visit based on current conditions, tidal activity, and where the marine life is most active that day.",
      ),
      block("What the Reef Looks Like", "h3"),
      block(
        "Punta Cana's reefs are a mosaic of hard and soft corals — brain coral domes the size of small cars, delicate sea fans swaying in the current, and staghorn formations that have been growing for decades. The fish life is dense and colorful: parrotfish in electric blue and green, angelfish with their distinctive markings, schools of sergeant majors hovering near the coral edges, and the occasional trumpetfish hanging motionless in the water column.",
      ),
      block(
        "Sea turtle sightings are frequent at our sites — the turtles feed on sea grass nearby and often rise to the surface to breathe, allowing snorkelers to drift alongside them at a respectful distance. Spotted eagle rays are less predictable but appear regularly, especially on morning tours when the water is glassiest.",
      ),
      block("Getting Comfortable in the Water", "h3"),
      block(
        "Before we head to the reef, the crew runs a short briefing on deck: how to breathe through the snorkel, how to clear your mask if it fogs or floods, and how to move through the water without disturbing the coral. Life vests and flotation noodles are available for anyone who wants them — there's no pressure to go without. Most guests who've never snorkeled before are fully comfortable within five minutes of entering the water.",
      ),
      block(
        "We use professional-grade equipment: wide-view, low-profile masks that minimize fogging, full-foot fins for effortless propulsion, and splash-guard snorkels that keep water out even in choppy conditions. Reef-safe sunscreen is required — we provide it on board — to protect the coral ecosystem we're visiting.",
      ),
    ],
    es: [
      block("Snorkel en el Arrecife Caribeño — El Mundo Submarino de Punta Cana", "h2"),
      block(
        "A tan solo un corto trayecto en bote desde la orilla, el sistema de arrecifes frente a Punta Cana es un mundo aparte. Los peces loro pastan sobre el coral, las tortugas marinas se deslizan entre rayos de sol, y las rayas águila manchadas barren silenciosamente las profundidades. Esta experiencia guiada de snorkel te pone justo en medio de todo eso — sin certificación de buceo, sin experiencia previa, sin problema.",
      ),
      block(
        "Mantenemos los grupos pequeños por una razón. Los tours en catarmarán masivos sueltan 40 personas al agua a la vez, lo que espanta la vida marina antes de que te hayas puesto la máscara. Nuestros botes llevan un máximo de 15 huéspedes, y nuestros instructores certificados conocen los dos sitios de arrecife que visitamos en función de las condiciones actuales, la actividad de las mareas y dónde la vida marina está más activa ese día.",
      ),
      block("Cómo se ve el arrecife", "h3"),
      block(
        "Los arrecifes de Punta Cana son un mosaico de corales duros y blandos — domos de coral cerebro del tamaño de autos pequeños, delicados abanicos de mar que se mecen con la corriente, y formaciones de cuerno de alce que llevan décadas creciendo. La vida marina es densa y colorida: peces loro en azul y verde eléctrico, peces ángel con sus marcas distintivas, cardúmenes de sargento rondando los bordes del coral, y el ocasional pez trompeta colgando inmóvil en la columna de agua.",
      ),
      block(
        "Los avistamientos de tortugas marinas son frecuentes en nuestros sitios — las tortugas se alimentan de pastos marinos cercanos y frecuentemente suben a la superficie para respirar, permitiendo que los buceadores se desplacen a su lado a una distancia respetuosa. Las rayas águila manchadas son menos predecibles pero aparecen con regularidad, especialmente en los tours matutinos cuando el agua está más tranquila.",
      ),
      block("Adaptándote al agua", "h3"),
      block(
        "Antes de dirigirnos al arrecife, la tripulación realiza un breve briefing en cubierta: cómo respirar por el snorkel, cómo limpiar tu máscara si se empaña o se llena de agua, y cómo moverte en el agua sin perturbar el coral. Los chalecos salvavidas y flotadores están disponibles para quien los necesite — sin presión de prescindir de ellos. La mayoría de los huéspedes que nunca han hecho snorkel se sienten completamente cómodos en los primeros cinco minutos en el agua.",
      ),
      block(
        "Usamos equipo de grado profesional: máscaras de visión amplia y perfil bajo que minimizan el empañamiento, aletas de pie completo para una propulsión sin esfuerzo, y snorkels con protector contra salpicaduras que mantienen el agua fuera incluso en condiciones de oleaje. El protector solar biodegradable es obligatorio — lo proporcionamos a bordo — para proteger el ecosistema de coral que estamos visitando.",
      ),
    ],
  },

  // ─── Discover Scuba Diving ─────────────────────────────────────────────────
  "diving-excursion-discover-scuba-diving": {
    en: [
      block("Discover Scuba Diving — Your First Breath Underwater", "h2"),
      block(
        "There's nothing quite like the moment you exhale your first breath underwater and realize you can breathe — calmly, completely — while the reef surrounds you. The Discover Scuba Diving experience is designed to give first-time divers that moment safely, with a PADI-certified instructor by your side at every step.",
      ),
      block(
        "No prior experience required. No certification needed. Just show up, follow the instructions, and trust the process — thousands of people take their first dive this way every year, and the vast majority describe it as one of the most extraordinary things they've ever done.",
      ),
      block("How the Day Works", "h3"),
      block(
        "Your experience begins on land with a relaxed briefing covering the basics: how the equipment works, how to equalize the pressure in your ears as you descend, how to signal your instructor underwater, and what to do if you feel uncomfortable at any point. There are no complicated techniques to master — the instructor handles everything. Your job is simply to relax and look around.",
      ),
      block(
        "From the briefing, we move to a pool (or calm, shallow water) for a short practice session. You'll put on your equipment, practice breathing from the regulator, and get comfortable being underwater before we head to the reef. This step exists to make the ocean portion feel natural and familiar, not surprising.",
      ),
      block("The Dive Itself", "h3"),
      block(
        "The ocean dive descends to a maximum of 12 meters (40 feet) — deep enough to feel truly immersed in the underwater world, shallow enough that the light is clear and the colors are vivid. Nurse sharks rest on the sandy bottom at our dive site, completely unbothered by divers. Sea turtles are a regular presence. Moray eels peer out from coral crevices. Tropical fish in every color surround you.",
      ),
      block(
        "Your instructor stays within arm's reach throughout the entire dive. The ratio is strict: maximum two guests per instructor, which means you get genuine attention and guidance — not a wave goodbye as you're sent off with a group. The dive runs for approximately 30–40 minutes underwater, with the remainder of the experience covering equipment setup, pool practice, boat transfer, and post-dive debrief.",
      ),
      block("What Happens Next", "h3"),
      block(
        "The Discover Scuba experience counts toward PADI's Open Water certification. If you fall in love with diving — which many guests do — ask your instructor about continuing to the full certification course during the rest of your trip. The skills and comfort you build today are the foundation for a lifetime of underwater exploration.",
      ),
    ],
    es: [
      block("Discover Scuba Diving — Tu Primera Respiración Bajo el Agua", "h2"),
      block(
        "No hay nada como el momento en que exhalas tu primera respiración bajo el agua y te das cuenta de que puedes respirar — tranquilamente, completamente — mientras el arrecife te rodea. La experiencia Discover Scuba está diseñada para darte ese momento de forma segura, con un instructor certificado PADI a tu lado en cada paso.",
      ),
      block(
        "No se requiere experiencia previa. No necesitas certificación. Solo preséntate, sigue las instrucciones y confía en el proceso — miles de personas dan su primera inmersión de esta manera cada año, y la gran mayoría lo describe como una de las cosas más extraordinarias que han hecho en su vida.",
      ),
      block("Cómo funciona el día", "h3"),
      block(
        "Tu experiencia comienza en tierra con un briefing relajado que cubre lo básico: cómo funciona el equipo, cómo ecualizar la presión en los oídos al descender, cómo hacer señales a tu instructor bajo el agua, y qué hacer si en algún momento te sientes incómodo. No hay técnicas complicadas que dominar — el instructor se encarga de todo. Tu trabajo es simplemente relajarte y mirar a tu alrededor.",
      ),
      block(
        "Después del briefing, nos trasladamos a una piscina (o aguas tranquilas y poco profundas) para una breve sesión práctica. Te pondrás el equipo, practicarás la respiración con el regulador y te sentirás cómodo bajo el agua antes de ir al arrecife. Este paso existe para que la parte del océano se sienta natural y familiar, no sorpresiva.",
      ),
      block("La inmersión en sí", "h3"),
      block(
        "La inmersión en el océano desciende a un máximo de 12 metros (40 pies) — lo suficientemente profundo para sentirse verdaderamente inmerso en el mundo submarino, lo suficientemente poco profundo para que la luz sea clara y los colores sean vívidos. Los tiburones nodriza descansan en el fondo arenoso de nuestro sitio de buceo, completamente indiferentes a los buzos. Las tortugas marinas son una presencia habitual. Las morenas se asoman desde las grietas del coral. Peces tropicales de todos los colores te rodean.",
      ),
      block(
        "Tu instructor permanece al alcance de tu brazo durante toda la inmersión. La proporción es estricta: máximo dos huéspedes por instructor, lo que significa que recibes atención y orientación genuinas — no un adiós con la mano mientras te mandan con un grupo. La inmersión dura aproximadamente 30-40 minutos bajo el agua, con el resto de la experiencia cubriendo la preparación del equipo, la práctica en piscina, el traslado en bote y el debrief posterior a la inmersión.",
      ),
      block("Qué viene después", "h3"),
      block(
        "La experiencia Discover Scuba cuenta para la certificación PADI Open Water. Si te enamoras del buceo — cosa que muchos huéspedes hacen — pregúntale a tu instructor sobre continuar con el curso de certificación completo durante el resto de tu viaje. Las habilidades y la confianza que desarrollas hoy son la base para toda una vida de exploración submarina.",
      ),
    ],
  },

  // ─── Two-Tank Certified Reef Dive ──────────────────────────────────────────
  "diving-excursion-two-tank-reef-dive": {
    en: [
      block("Two-Tank Certified Reef Dive — Punta Cana's Best Dive Sites", "h2"),
      block(
        "This is the dive experience built for certified divers who want more than a shallow reef tour. Two tanks. Two different sites. Depths down to 18 meters. Barracuda schools, manta rays, moray eels, and coral formations that have been building for decades — all within a short boat ride of the Punta Cana coast.",
      ),
      block(
        "Groups are capped at five certified divers per divemaster, keeping the experience personal and the impact on the reef minimal. We select dive sites on the morning of the excursion based on current conditions, visibility reports, and what's been active in the water — so no two trips are exactly alike.",
      ),
      block("Dive Site Overview", "h3"),
      block(
        "The first dive is typically a deeper wall or reef structure where barracuda congregate in silver schools and grouper cruise the ledges. At 15–18 meters, the light takes on the characteristic deep blue quality that certified divers know well — colors shift, the surface feels distant, and the underwater world asserts itself completely. This is where you're most likely to encounter manta rays passing through, and where the larger marine life tends to roam.",
      ),
      block(
        "After a surface interval with water and snacks on the boat, the second dive visits a shallower site — typically 10–14 meters — with dense coral structure, moray eels in the crevices, and the slower-paced observation that comes from not burning through your air on the way down. Lobster, crabs, and pufferfish are regulars here. The coral variety at this depth is exceptional: elkhorn, staghorn, brain, and sea fans in abundance.",
      ),
      block("Equipment & Logistics", "h3"),
      block(
        "All equipment is included and serviced regularly: BCD, regulator, wetsuit, mask, fins, and — importantly — a dive computer for every diver. We don't run this excursion on time-based profiles. Your computer tracks your actual depth and bottom time, giving you maximum flexibility within safe limits.",
      ),
      block(
        "Bring your C-card and, if you have one, your dive logbook. A recent dive history helps our divemaster tailor the experience to your comfort level, particularly on the deeper first dive. If it's been more than 12 months since your last dive, contact us about adding a brief Scuba Review session beforehand — it makes the experience significantly better.",
      ),
    ],
    es: [
      block("Buceo Certificado de Dos Tanques — Los Mejores Sitios de Buceo de Punta Cana", "h2"),
      block(
        "Esta es la experiencia de buceo creada para buceadores certificados que quieren más que un tour superficial de arrecife. Dos tanques. Dos sitios diferentes. Profundidades de hasta 18 metros. Cardúmenes de barracudas, mantas rayas, morenas y formaciones de coral que llevan décadas construyéndose — todo a un corto trayecto en bote de la costa de Punta Cana.",
      ),
      block(
        "Los grupos están limitados a cinco buceadores certificados por divemaster, manteniendo la experiencia personal y el impacto en el arrecife al mínimo. Seleccionamos los sitios de buceo la mañana de la excursión basándonos en las condiciones actuales, los informes de visibilidad y lo que ha estado activo en el agua — por lo que no hay dos viajes exactamente iguales.",
      ),
      block("Vista general de los sitios de buceo", "h3"),
      block(
        "La primera inmersión es típicamente una pared más profunda o estructura de arrecife donde las barracudas se congregan en cardúmenes plateados y los meros patrullan las repisas. A 15-18 metros, la luz adquiere la característica calidad azul profundo que los buceadores certificados conocen bien — los colores cambian, la superficie se siente distante, y el mundo submarino se afirma completamente. Este es el lugar donde es más probable encontrar mantas rayas pasando, y donde suele rondar la vida marina de mayor tamaño.",
      ),
      block(
        "Después de un intervalo de superficie con agua y snacks en el bote, la segunda inmersión visita un sitio más somero — típicamente 10-14 metros — con una densa estructura de coral, morenas en las grietas, y la observación más pausada que viene de no gastar el aire en el descenso. Langostas, cangrejos y peces globo son habituales aquí. La variedad de coral a esta profundidad es excepcional: cuerno de alce, cuerno de ciervo, coral cerebro y abanicos de mar en abundancia.",
      ),
      block("Equipo y logística", "h3"),
      block(
        "Todo el equipo está incluido y se mantiene regularmente: BCD, regulador, traje de neopreno, máscara, aletas y — lo más importante — una computadora de buceo para cada buceador. No realizamos esta excursión con perfiles basados en tiempo. Tu computadora rastrea tu profundidad y tiempo de fondo reales, dándote la máxima flexibilidad dentro de los límites de seguridad.",
      ),
      block(
        "Trae tu C-card y, si tienes una, tu bitácora de buceo. Un historial de buceo reciente ayuda a nuestro divemaster a adaptar la experiencia a tu nivel de comodidad, especialmente en la primera inmersión más profunda. Si han pasado más de 12 meses desde tu última inmersión, contáctanos para agregar una breve sesión de Scuba Review beforehand — hace que la experiencia sea significativamente mejor.",
      ),
    ],
  },

  // ─── Snuba Adventure ──────────────────────────────────────────────────────
  "diving-excursion-snuba-adventure": {
    en: [
      block("Snuba Adventure — Breathe Underwater Without a Tank on Your Back", "h2"),
      block(
        "Snuba is the experience that sits between snorkeling and scuba diving — and for many people, it's the one that clicks. You breathe through a regulator connected by a long hose to an air tank floating on a raft at the surface. No tank on your back. No heavy equipment to manage. Just the freedom to swim down to 6 meters and explore the reef at your own pace, breathing normally the whole time.",
      ),
      block(
        "No certification is needed, and no prior diving or snorkeling experience is required. The equipment is simple, the briefing is short, and the underwater world you access is the real thing — not a shallow paddle in knee-deep water, but a genuine reef experience with coral, fish, and the full sensation of being underwater.",
      ),
      block("What Makes Snuba Different", "h3"),
      block(
        "Snorkeling keeps you at the surface, looking down through a mask. Scuba requires a full certification course and significant equipment. Snuba occupies the space between: you go under, you breathe comfortably, and you can stay as long as you want within the session time — without any of the logistics of a full scuba setup.",
      ),
      block(
        "The air hose connecting you to the surface raft is approximately 6 meters long, which defines your maximum depth. Within that range, you can hover mid-water, drop down close to the coral, and observe the reef at a level that snorkeling simply can't provide. Fish don't flee from snuba divers the way they sometimes do from large groups on the surface — at depth, you become part of the environment.",
      ),
      block("Perfect for Families", "h3"),
      block(
        "Snuba is one of the most family-friendly underwater experiences available in Punta Cana. Children from 8 years old can participate alongside adults, making it ideal for families who want a shared underwater adventure without splitting into different activity groups. The buoyancy harness keeps everyone stable, and our guides work at the pace that suits the youngest or least experienced member of your group.",
      ),
      block(
        "The session runs for approximately 20–25 minutes in the water, preceded by a 10-minute equipment briefing and followed by time to swim and snorkel at the surface. Most guests describe the underwater portion as going by far too quickly — the sign of a genuinely absorbing experience.",
      ),
      block("Snuba vs. Discover Scuba — Which One?", "h3"),
      block(
        "If you're curious about breathing underwater but not ready for the full scuba setup, Snuba is the ideal entry point — especially with children. If you want to go deeper, explore more of the reef, and are comfortable with slightly more equipment, the Discover Scuba experience takes you to 12 meters with a certified instructor by your side. Many guests do Snuba one day and Discover Scuba the next.",
      ),
    ],
    es: [
      block("Aventura de Snuba — Respira Bajo el Agua Sin un Tanque en la Espalda", "h2"),
      block(
        "El Snuba es la experiencia que se sitúa entre el snorkel y el buceo — y para muchas personas, es la que encaja perfectamente. Respiras a través de un regulador conectado por una larga manguera a un tanque de aire que flota en una balsa en la superficie. Sin tanque en la espalda. Sin equipo pesado que manejar. Solo la libertad de nadar hasta 6 metros y explorar el arrecife a tu propio ritmo, respirando con normalidad todo el tiempo.",
      ),
      block(
        "No se necesita certificación, ni experiencia previa en buceo o snorkel. El equipo es sencillo, el briefing es corto, y el mundo submarino al que accedes es real — no un chapoteo superficial en aguas poco profundas, sino una auténtica experiencia de arrecife con coral, peces y la sensación completa de estar bajo el agua.",
      ),
      block("Qué hace diferente al Snuba", "h3"),
      block(
        "El snorkel te mantiene en la superficie, mirando hacia abajo a través de una máscara. El buceo requiere un curso de certificación completo y un equipo significativo. El Snuba ocupa el espacio intermedio: vas bajo el agua, respiras con comodidad, y puedes quedarte todo el tiempo que quieras dentro del tiempo de la sesión — sin ninguna de las complicaciones logísticas de una configuración completa de buceo.",
      ),
      block(
        "La manguera de aire que te conecta a la balsa de superficie tiene aproximadamente 6 metros de longitud, lo que define tu profundidad máxima. Dentro de ese rango, puedes mantenerte a media agua, descender cerca del coral, y observar el arrecife a un nivel que el snorkel simplemente no puede proporcionar. Los peces no huyen de los buceadores de snuba como a veces lo hacen de los grandes grupos en la superficie — en profundidad, te conviertes en parte del entorno.",
      ),
      block("Perfecto para familias", "h3"),
      block(
        "El Snuba es una de las experiencias subacuáticas más familiares disponibles en Punta Cana. Los niños desde los 8 años pueden participar junto a los adultos, lo que lo hace ideal para familias que quieren una aventura submarina compartida sin dividirse en diferentes grupos de actividades. El arnés de flotabilidad mantiene a todos estables, y nuestros guías trabajan al ritmo que se adapte al miembro más joven o con menos experiencia de tu grupo.",
      ),
      block(
        "La sesión dura aproximadamente 20-25 minutos en el agua, precedida por un briefing de equipamiento de 10 minutos y seguida de tiempo para nadar y hacer snorkel en la superficie. La mayoría de los huéspedes describe la parte subacuática como que pasa demasiado rápido — señal de una experiencia genuinamente absorbente.",
      ),
      block("Snuba vs. Discover Scuba — ¿Cuál elegir?", "h3"),
      block(
        "Si tienes curiosidad por respirar bajo el agua pero no estás listo para la configuración completa de buceo, el Snuba es el punto de entrada ideal — especialmente con niños. Si quieres ir más profundo, explorar más el arrecife y te sientes cómodo con un equipo ligeramente más complejo, la experiencia Discover Scuba te lleva a 12 metros con un instructor certificado a tu lado. Muchos huéspedes hacen Snuba un día y Discover Scuba al siguiente.",
      ),
    ],
  },
};

// =============================================================================
// Patch runner — only touches fullDescription, everything else is preserved
// =============================================================================

async function patchDescriptions() {
  console.log("🤿  Patching fullDescription on divingExcursion documents...\n");
  console.log("   Images and all other fields will NOT be modified.\n");

  for (const [docId, fullDescription] of Object.entries(descriptions)) {
    await client.patch(docId).set({ fullDescription }).commit();
    console.log(`  ✅ ${docId}`);
  }

  console.log("\n🎉 All diving excursion descriptions patched successfully!");
}

patchDescriptions().catch((err) => {
  console.error("❌ Patch failed:", err);
  process.exit(1);
});
