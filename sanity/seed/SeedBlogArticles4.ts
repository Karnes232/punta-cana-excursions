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
const key = () => `blk-${++k}`;

// ---------------------------------------------------------------------------
// Portable Text helpers — inline links: [[label|url]] · bold: **text**
// ---------------------------------------------------------------------------

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  children: Span[];
  markDefs: MarkDef[];
  listItem?: "bullet" | "number";
  level?: number;
};

function parseInline(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const tokenRegex = /\[\[([^\]|]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > cursor) {
      const plain = text.slice(cursor, match.index);
      if (plain.length > 0) {
        children.push({ _type: "span", _key: key(), text: plain, marks: [] });
      }
    }
    if (match[1] && match[2]) {
      const linkKey = key();
      markDefs.push({ _type: "link", _key: linkKey, href: match[2] });
      children.push({ _type: "span", _key: key(), text: match[1], marks: [linkKey] });
    } else if (match[3]) {
      children.push({ _type: "span", _key: key(), text: match[3], marks: ["strong"] });
    }
    cursor = tokenRegex.lastIndex;
  }
  if (cursor < text.length) {
    const tail = text.slice(cursor);
    if (tail.length > 0) {
      children.push({ _type: "span", _key: key(), text: tail, marks: [] });
    }
  }
  if (children.length === 0) {
    children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }
  return { children, markDefs };
}

function para(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return { _type: "block", _key: key(), style: "normal", children, markDefs };
}
function h2(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return { _type: "block", _key: key(), style: "h2", children, markDefs };
}
function h3(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return { _type: "block", _key: key(), style: "h3", children, markDefs };
}
function li(text: string, kind: "bullet" | "number" = "bullet"): Block {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    children,
    markDefs,
    listItem: kind,
    level: 1,
  };
}

function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  language: string;
  keywords: string[];
}) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: opts.headline,
      description: opts.description,
      inLanguage: opts.language,
      datePublished: opts.datePublished,
      dateModified: opts.datePublished,
      author: {
        "@type": "Organization",
        name: "Punta Cana Excursions by Grand Bay",
        url: "https://puntacana-excursions.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Punta Cana Excursions by Grand Bay",
        url: "https://puntacana-excursions.com",
        logo: {
          "@type": "ImageObject",
          url: "https://puntacana-excursions.com/logo.png",
        },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
      keywords: opts.keywords.join(", "),
    },
    null,
    2,
  );
}

// ===========================================================================
// ARTICLE 1 — Punta Cana with Toddlers and Babies (EN, ES, FR)
// ===========================================================================

const toddlersBodyEn = [
  para(
    "Traveling to Punta Cana with a baby or toddler is entirely doable, often delightful, and occasionally chaotic — exactly like traveling with a small child anywhere else. The Caribbean climate, the all-inclusive infrastructure, and the family-friendly resorts make Punta Cana one of the easier international destinations to navigate with young children. But there are real considerations that don't apply to childless travel: which resorts actually accommodate babies well, how to handle feeding and naps with a long flight, what medical setup exists, and which beach you choose matters more than usual.",
  ),
  para(
    "This guide is written from practical, on-the-ground experience working with families who arrive with kids from a few months old up through age four. If you'd like help planning excursions or transfers that work with nap schedules and feeding times, [[contact our team|https://puntacana-excursions.com/contact]] — we coordinate with parents constantly and know what works.",
  ),

  h2("Is Punta Cana a Good Destination for Babies and Toddlers?"),
  para(
    "Yes, with caveats. The positives are substantial: warm water, soft sand, predictable weather, English widely spoken at major resorts, modern medical facilities nearby, family-friendly all-inclusive infrastructure, and short flights from most of North America (3.5 hours from Miami, 4 from New York, 4.5 from Toronto, 5 from Montreal). The negatives are also real: strong sun that's unforgiving for fair-skinned children, mosquitos during certain seasons, water that you don't want to drink from the tap, and a general infrastructure that's designed for adults relaxing rather than parents managing toddler logistics.",
  ),
  para(
    "The verdict for most families: a good resort plus thoughtful planning makes Punta Cana excellent. A poor resort choice or unrealistic expectations makes it stressful. The single most important decision you'll make is which resort, because that's where 70 percent of your time with a small child will actually happen.",
  ),

  h2("Choosing the Right Resort"),
  para(
    "Not all Punta Cana resorts are equally toddler-friendly. The marketing language can be misleading — almost every resort says it's family-friendly because they all have a kids' pool and a kids' club. The features that actually matter for under-5 travelers are different.",
  ),
  h3("Features That Actually Matter"),
  li("**Calm-water beach access:** Some Bávaro beaches have gentle, shallow water perfect for toddlers; others have stronger surf and steeper drop-offs. Cap Cana and certain stretches of Bávaro are calmer than the central Bávaro beach."),
  li("**Babysitting and childcare options:** Resorts vary widely. Some offer formal babysitting starting at age 6 months, others only have group kids' clubs starting at age 4. Verify before booking if you need adult-only time."),
  li("**Cribs and high chairs available:** Confirm with the resort directly before arrival, not just through your tour operator. Quantities are sometimes limited."),
  li("**Baby food and milk availability:** Major resort buffets have plain rice, plain pasta, fruits, eggs, and yogurt. Specific baby food jars are not commonly stocked — bring what your child needs from home or accept that you'll feed adapted versions of resort food."),
  li("**Pool depth variety:** A graduated pool with very shallow zones (15 to 30 cm) is much more useful than a single 1.2-meter pool with a separate kiddie splash area."),
  li("**Room layout:** Suites with separate bedrooms or rooms with partitions are far more comfortable than studio-style rooms when you need to keep the lights low for early bedtime."),
  li("**On-site medical staff:** Larger resorts have 24-hour clinics. Smaller boutique resorts may rely on call-out service. The difference matters at 2 AM with a feverish toddler."),
  h3("Resort Categories to Consider"),
  para(
    "Family-focused major brands (Nickelodeon, Hyatt Ziva, Excellence's family properties, Iberostar Selection, certain Hard Rock configurations) lean into the family experience and tend to have the infrastructure above. Adults-oriented luxury resorts (Excellence Punta Cana adults-only, Sanctuary Cap Cana, Secrets) either don't allow children under 18 or actively discourage families. Mid-range all-inclusives are mixed — read recent family-specific reviews before committing.",
  ),

  h2("Flying with Babies and Toddlers"),
  h3("Choosing Flight Times"),
  para(
    "If possible, fly during your child's natural sleep window. Overnight flights from Europe land in Punta Cana in the morning, which usually works well — the child sleeps en route and arrives ready for a normal-ish day. Daytime flights from North America are trickier because nap times collide with takeoff and landing. Early morning departures (so you arrive by early afternoon) are usually less stressful than evening arrivals, because you have daylight to handle the transfer and get to your resort while the child is still alert.",
  ),
  h3("Documentation"),
  para(
    "Babies and children need their own passport. The Dominican Republic accepts most passports from major nationalities for tourism without a visa. Both parents traveling with the child only need passports; one parent traveling alone with the child sometimes needs a notarized consent letter from the other parent — check your home country's requirements and the airline's policy before flying. Single parents or divorced parents traveling internationally with a child are frequently asked for this letter at check-in.",
  ),
  h3("Onboard Essentials"),
  para(
    "Pack twice as many diapers as you think you'll need. Bring a change of clothes for both the child and yourself (spit-up, leaks, and spilled food all happen). Pre-packaged snacks the child already likes are worth more than gold on a 4-hour flight. Tablet pre-loaded with familiar content, with headphones sized for small heads, prevents most boredom meltdowns. A small comfort item (lovey, blanket, pacifier) helps with ear pressure during descent — sucking, drinking from a bottle, or chewing a snack at descent reduces ear discomfort.",
  ),

  h2("Best Beaches for Toddlers in the Punta Cana Area"),
  para(
    "The Punta Cana coast has multiple distinct beach zones with different conditions. For small children, calm water and gradual entry matter more than which resort is on the beach.",
  ),
  h3("Cap Cana Beaches"),
  para(
    "Cap Cana (south of central Punta Cana) has some of the calmest, clearest water and a long flat entry that's ideal for toddlers. Juanillo Beach is the standout — gentle waves, soft sand, generally cleaner than central Bávaro on most days. The downside: Cap Cana resorts trend more expensive, and the area has fewer dining-out options.",
  ),
  h3("Bávaro Beaches"),
  para(
    "Central Bávaro is the longest and most-developed beach strip. Conditions vary along its length — the southern end (near El Cortecito) sometimes has stronger surf, while the northern Bávaro stretches (Arena Gorda, Cabeza de Toro) tend to be calmer. Most family resorts cluster on Bávaro, which means lots of options but also crowded sections in peak season. Check the daily wave conditions; many resorts post beach flags.",
  ),
  h3("Uvero Alto and Macao"),
  para(
    "These beaches north of Bávaro are less developed and often have more wave action — generally not ideal for very small toddlers, though older children who can play in the sand without needing to enter the water can be fine. The resorts in this area sometimes offer transfer service to calmer beaches.",
  ),

  h2("Feeding a Baby or Toddler at a Resort"),
  para(
    "Resort buffets have plenty of baby- and toddler-appropriate food once you know what to look for. Plain rice, plain pasta, scrambled eggs, oatmeal, yogurt, sliced fruits (mango, papaya, banana, melon), boiled vegetables, grilled chicken, mashed potatoes, and bread are universally available. Specific brand-name baby food and formula are not commonly stocked at the resort gift shop — bring what your child specifically uses from home, or accept the trip will adapt your child's diet temporarily.",
  ),
  h3("Formula and Bottle Feeding"),
  para(
    "Bring your child's specific formula brand. Resorts cannot reliably source international formula brands, and switching mid-trip can upset a sensitive baby. Use bottled water (provided in the room) for mixing formula, not tap water. Sterilize bottles either with your own travel sterilizer or by asking the resort's room service for boiling water. Most resorts will accommodate this request without issue.",
  ),
  h3("Snacks Throughout the Day"),
  para(
    "Between meals, resorts have limited snack options — fruit and pastries are common but not always available between 11 AM and the next mealtime. Bring familiar snacks the child likes (cereal bars, crackers, dried fruit) for the inevitable hungry moments at the beach or pool. Avoid relying on the gift shop for these — markups are heavy and selection is narrow.",
  ),

  h2("Naps, Schedules, and Sleep"),
  para(
    "Maintaining some semblance of your child's normal schedule is the single biggest difference between a relaxing trip and a difficult one. The trip will already disrupt timing somewhat (different time zone, late dinners, new environment, excitement) — protect what you can.",
  ),
  h3("Room Strategy"),
  para(
    "Request a room with a separate sleeping area for the child if possible. Suites cost more but pay off when you can read or have a quiet conversation while the child sleeps. If you're in a single-room configuration, plan to be quiet in the room during the child's nap and bedtime, or to use the room only for the child's sleep and the lobby or pool deck for adult time. Bring a portable blackout curtain or large clip-up blanket if your child is light-sensitive — Caribbean light comes in earlier and brighter than at home.",
  ),
  h3("Pool and Beach Timing"),
  para(
    "Mornings (8 to 11 AM) and late afternoons (3 to 6 PM) are the best times for pool and beach with small children. The sun is less intense, the heat is more manageable, and the kid is fresh. Midday (11 AM to 3 PM) is exactly the time you should be in shade or back in the room for a nap — this aligns conveniently with the strongest sun and a typical post-lunch nap.",
  ),

  h2("Medical and Health Considerations"),
  h3("Pre-Trip Medical Prep"),
  para(
    "Check that routine vaccinations are up to date for the child. Bring a small first-aid kit with: children's pain and fever medicine (acetaminophen and ibuprofen) in age-appropriate dosing, oral rehydration salts, diaper rash cream, antibacterial cream for cuts, plasters, baby sunscreen (mineral-based for under-2s), bug spray formulated for children. Pack medications in carry-on, not checked bags. If your child takes prescription medication, bring more than enough for the trip plus a copy of the prescription.",
  ),
  h3("Sun Protection"),
  para(
    "The Caribbean sun is significantly stronger than what most North American and European children experience at home. For babies under 6 months, the recommendation is to keep them out of direct sun entirely (shade, hat, long sleeves). For older babies and toddlers, mineral-based sunscreen (SPF 30+), wide-brim hat, UV-protective swim shirt (\"rash guard\"), and limited midday exposure. Reapply sunscreen every 90 minutes and after every water exposure — not the 2-hour adult interval. A bad sunburn on day one can ruin the entire week.",
  ),
  h3("Water Safety"),
  para(
    "Toddlers and weak swimmers should wear coast-guard-approved life vests in pools, not just floaty arm bands. Drowning in toddlers is silent and fast. Adult supervision must be active and undistracted — no phones, no books, no conversations that take your eyes off the water. Most resort pools don't have lifeguards reliably positioned. The single biggest preventable risk on a Caribbean family trip is pool drowning, and it almost always happens during a moment when adults assume someone else is watching.",
  ),
  h3("If Your Child Gets Sick"),
  para(
    "Common minor issues: heat rash (cool the child, light clothing), mild diarrhea (oral rehydration, BRAT diet if the child is old enough), fever (fluids, age-appropriate antipyretic, monitor). For anything more serious — high fever, persistent vomiting, breathing difficulty, severe rash, lethargy, dehydration signs — go to Hospiten Bávaro, which has English-speaking pediatric care available 24/7. Costs run $150 to $400+ USD for a clinic visit, paid upfront; travel insurance with medical coverage handles reimbursement.",
  ),

  h2("Excursions with Babies and Toddlers"),
  para(
    "Not every Punta Cana excursion suits a baby or toddler, but several work well with the right planning. The general rule: shorter is better, calmer is better, and \"can return to resort early\" is better than \"all-day commitment.\"",
  ),
  h3("Excursions That Work Well"),
  li("**Catamaran trips with short snorkel stops:** Babies stay in shade on board with a parent while older toddlers can splash in the natural pool. Half-day trips work better than full-day."),
  li("**Beach-club day passes at gentler beaches:** A change of scenery without the structure of a fixed excursion."),
  li("**Saona Island day trips:** Long but the boat ride is shaded, the beach is calm, and the structure works for toddlers who can nap on the boat. Only consider if your child does well with new environments."),
  li("**Private excursions over group excursions:** Worth the cost difference because you control the schedule and can return early or change plans."),
  h3("Excursions to Skip Until Kids Are Older"),
  li("Buggy or quad bike tours (no age safety, dusty, jarring)"),
  li("Zip-lining (age restrictions and not appropriate for young children regardless)"),
  li("Deep-sea fishing (long, hot, no shade, often rough)"),
  li("Anything billed as \"adventure\" or \"adrenaline\" — these target older kids and adults"),
  para(
    "For [[family-appropriate excursions|https://puntacana-excursions.com/excursions]], we coordinate with parents on pickup times, return times, and what to expect — especially important when you're managing schedules with a small child.",
  ),

  h2("What to Pack: A Practical List"),
  li("**Diapers and wipes** for the trip plus 25 percent extra (running out at midnight is real)"),
  li("**Familiar formula or food** in original packaging"),
  li("**Mineral-based sunscreen** (the resort sells some but selection is limited)"),
  li("**Hat, UV swim shirt, and water shoes** for the child"),
  li("**Travel-sized comfort items**: blanket, lovey, pacifier (bring duplicates)"),
  li("**Tablet, headphones, and pre-downloaded content** for flights and downtime"),
  li("**Compact baby carrier or stroller** — most resorts have walking paths, and a baby carrier is better than a stroller on the beach"),
  li("**Portable blackout blanket** or large dark cloth for windows if your child is light-sensitive"),
  li("**Children's first-aid kit** including thermometer and age-appropriate medications"),
  li("**Sippy cups, bibs, and one set of plastic plates/spoons** for resort meals"),
  li("**Backup phone charger and power bank** for the airport and excursions"),
  li("**Travel insurance documentation** including emergency contact numbers"),

  h2("Day-to-Day Practicalities"),
  h3("Laundry"),
  para(
    "Babies and toddlers go through clothes fast in a tropical climate — sand, food spills, sweat, pool water. Most resorts have paid laundry service ($15 to $30 USD per bag) and some offer self-service laundromats. For a week-long stay, plan to do at least one mid-trip wash. Quick-dry kids' clothes are worth packing because they handle hand-rinsing in the bathroom sink for small accidents. A few inexpensive packing cubes help separate clean from worn during the trip."),
  h3("Crib Setup in the Room"),
  para(
    "Resort cribs vary in quality. Some are nearly-new pack-and-plays; others are older wooden cribs that meet local standards but may not match what you're used to at home. Inspect the crib on arrival, check that the mattress fits snugly, and request a replacement if anything seems unsafe. Many parents bring a fitted sheet from home — resort sheets are usually full-bed sized and don't fit cribs well. A small night light is useful for nighttime feedings without turning on overhead lights."),
  h3("Stroller vs. Carrier Decision"),
  para(
    "Resort pathways are mostly paved and stroller-friendly, but beach access and most excursions are not. A lightweight stroller for resort grounds plus a soft-structured baby carrier for excursions, beach time, and uneven surfaces covers most situations. If you can only bring one, the carrier is more versatile."),

  h2("Final Thoughts"),
  para(
    "Punta Cana with babies and toddlers works when you choose the right resort, pack the right essentials, protect schedules where you can, and adjust your expectations from \"vacation\" to \"family travel\" — which is different but can be wonderful in its own way. The Caribbean climate and resort infrastructure make this a much easier first-international-trip-with-a-small-child than many other destinations.",
  ),
  para(
    "If you're planning a trip and want help coordinating excursions, transfers, or restaurant choices that work with a small child's schedule, [[contact us|https://puntacana-excursions.com/contact]]. We work with families constantly and can tell you what realistically works at your child's age. Some things sound great in a brochure but don't survive a 4-hour boat ride with a 2-year-old; we'll save you the trial and error.",
  ),
];

const toddlersBodyEs = [
  para(
    "Viajar a Punta Cana con un bebé o un niño pequeño es totalmente factible, a menudo encantador, y ocasionalmente caótico — exactamente como viajar con un niño pequeño a cualquier otro lugar. El clima caribeño, la infraestructura todo-incluido y los resorts familiares hacen de Punta Cana uno de los destinos internacionales más fáciles de navegar con niños pequeños. Pero hay consideraciones reales que no aplican a los viajes sin niños: qué resorts realmente acomodan bien a los bebés, cómo manejar la alimentación y las siestas con un vuelo largo, qué infraestructura médica existe, y qué playa eliges importa más de lo habitual.",
  ),
  para(
    "Esta guía está escrita desde la experiencia práctica y de campo trabajando con familias que llegan con niños desde unos meses de edad hasta los cuatro años. Si te gustaría ayuda planificando excursiones o traslados que funcionen con horarios de siesta y comidas, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] — coordinamos constantemente con padres y sabemos qué funciona.",
  ),

  h2("¿Es Punta Cana un Buen Destino para Bebés y Niños Pequeños?"),
  para(
    "Sí, con matices. Los aspectos positivos son sustanciales: agua tibia, arena suave, clima predecible, inglés ampliamente hablado en los principales resorts, instalaciones médicas modernas cercanas, infraestructura todo-incluido familiar, y vuelos cortos desde la mayor parte de Norteamérica (3.5 horas desde Miami, 4 desde Nueva York, 4.5 desde Toronto, 5 desde Montreal). Los aspectos negativos también son reales: sol fuerte que es implacable para niños de piel clara, mosquitos durante ciertas temporadas, agua que no quieres beber del grifo, y una infraestructura general diseñada para que los adultos se relajen en lugar de que los padres gestionen la logística del niño pequeño.",
  ),
  para(
    "El veredicto para la mayoría de las familias: un buen resort más una planificación cuidadosa hacen de Punta Cana un destino excelente. Una mala elección de resort o expectativas poco realistas lo hacen estresante. La decisión más importante que tomarás es qué resort, porque ahí es donde el 70 por ciento de tu tiempo con un niño pequeño realmente sucederá.",
  ),

  h2("Eligiendo el Resort Correcto"),
  para(
    "No todos los resorts de Punta Cana son igualmente amigables con los niños pequeños. El lenguaje de marketing puede ser engañoso — casi todos los resorts dicen ser familiares porque todos tienen una piscina infantil y un club infantil. Las características que realmente importan para los viajeros menores de 5 años son diferentes.",
  ),
  h3("Características Que Realmente Importan"),
  li("**Acceso a playa con aguas tranquilas:** Algunas playas de Bávaro tienen aguas suaves y poco profundas perfectas para niños pequeños; otras tienen un oleaje más fuerte y caídas más pronunciadas. Cap Cana y ciertos tramos de Bávaro son más tranquilos que la playa central de Bávaro."),
  li("**Opciones de niñera y cuidado infantil:** Los resorts varían ampliamente. Algunos ofrecen niñera formal a partir de los 6 meses, otros solo tienen clubes infantiles grupales a partir de los 4 años. Verifica antes de reservar si necesitas tiempo solo para adultos."),
  li("**Cunas y sillas altas disponibles:** Confirma con el resort directamente antes de la llegada, no solo a través de tu operador turístico. Las cantidades a veces son limitadas."),
  li("**Disponibilidad de comida para bebés y leche:** Los buffets de los principales resorts tienen arroz simple, pasta simple, frutas, huevos y yogurt. Los frascos específicos de comida para bebés no se encuentran comúnmente — trae lo que tu hijo necesita desde casa o acepta que alimentarás versiones adaptadas de la comida del resort."),
  li("**Variedad de profundidad de piscina:** Una piscina graduada con zonas muy poco profundas (15 a 30 cm) es mucho más útil que una sola piscina de 1.2 metros con un área separada de chapoteo infantil."),
  li("**Distribución de la habitación:** Las suites con dormitorios separados o las habitaciones con divisiones son mucho más cómodas que las habitaciones tipo estudio cuando necesitas mantener las luces apagadas para una hora de acostarse temprano."),
  li("**Personal médico en el sitio:** Los resorts más grandes tienen clínicas las 24 horas. Los resorts boutique más pequeños pueden depender de servicios de llamada. La diferencia importa a las 2 AM con un niño pequeño con fiebre."),
  h3("Categorías de Resort a Considerar"),
  para(
    "Las marcas principales enfocadas en familias (Nickelodeon, Hyatt Ziva, las propiedades familiares de Excellence, Iberostar Selection, ciertas configuraciones de Hard Rock) se inclinan hacia la experiencia familiar y tienden a tener la infraestructura anterior. Los resorts de lujo orientados a adultos (Excellence Punta Cana solo adultos, Sanctuary Cap Cana, Secrets) no permiten niños menores de 18 años o desalientan activamente a las familias. Los todo-incluido de gama media son variados — lee reseñas recientes específicas de familia antes de comprometerte.",
  ),

  h2("Volando con Bebés y Niños Pequeños"),
  h3("Eligiendo Horarios de Vuelo"),
  para(
    "Si es posible, vuela durante la ventana natural de sueño de tu hijo. Los vuelos nocturnos desde Europa aterrizan en Punta Cana por la mañana, lo cual generalmente funciona bien — el niño duerme en ruta y llega listo para un día más o menos normal. Los vuelos diurnos desde Norteamérica son más complicados porque los horarios de siesta colisionan con el despegue y aterrizaje. Las salidas temprano por la mañana (para que llegues a media tarde) son generalmente menos estresantes que las llegadas nocturnas, porque tienes luz del día para manejar el traslado y llegar a tu resort mientras el niño aún está alerta.",
  ),
  h3("Documentación"),
  para(
    "Los bebés y niños necesitan su propio pasaporte. La República Dominicana acepta la mayoría de los pasaportes de las nacionalidades principales para turismo sin visa. Ambos padres viajando con el niño solo necesitan pasaportes; un padre viajando solo con el niño a veces necesita una carta de consentimiento notariada del otro padre — verifica los requisitos de tu país de origen y la política de la aerolínea antes de volar. Los padres solteros o divorciados que viajan internacionalmente con un niño frecuentemente reciben solicitud de esta carta en el check-in.",
  ),
  h3("Esenciales a Bordo"),
  para(
    "Empaca el doble de pañales de los que crees que necesitarás. Trae un cambio de ropa tanto para el niño como para ti (regurgitación, fugas y comida derramada todas suceden). Los bocadillos pre-empacados que al niño ya le gustan valen más que oro en un vuelo de 4 horas. Una tableta pre-cargada con contenido familiar, con audífonos del tamaño de cabezas pequeñas, previene la mayoría de los berrinches por aburrimiento. Un pequeño objeto de consuelo (peluche, manta, chupete) ayuda con la presión en los oídos durante el descenso — chupar, beber de un biberón, o masticar un bocadillo durante el descenso reduce las molestias en los oídos.",
  ),

  h2("Mejores Playas para Niños Pequeños en el Área de Punta Cana"),
  para(
    "La costa de Punta Cana tiene múltiples zonas de playa distintas con diferentes condiciones. Para niños pequeños, el agua tranquila y la entrada gradual importan más que qué resort está en la playa.",
  ),
  h3("Playas de Cap Cana"),
  para(
    "Cap Cana (al sur del centro de Punta Cana) tiene algunas de las aguas más tranquilas y claras y una larga entrada plana que es ideal para niños pequeños. Playa Juanillo destaca — olas suaves, arena suave, generalmente más limpia que el centro de Bávaro la mayoría de los días. La desventaja: los resorts de Cap Cana tienden a ser más caros, y el área tiene menos opciones para cenar fuera.",
  ),
  h3("Playas de Bávaro"),
  para(
    "El centro de Bávaro es el tramo de playa más largo y desarrollado. Las condiciones varían a lo largo de su longitud — el extremo sur (cerca de El Cortecito) a veces tiene un oleaje más fuerte, mientras que los tramos del norte de Bávaro (Arena Gorda, Cabeza de Toro) tienden a ser más tranquilos. La mayoría de los resorts familiares se concentran en Bávaro, lo que significa muchas opciones pero también secciones concurridas en temporada alta. Verifica las condiciones diarias del oleaje; la mayoría de los resorts publican banderas de playa.",
  ),
  h3("Uvero Alto y Macao"),
  para(
    "Estas playas al norte de Bávaro están menos desarrolladas y a menudo tienen más acción de olas — generalmente no ideal para niños muy pequeños, aunque los niños mayores que pueden jugar en la arena sin necesidad de entrar al agua pueden estar bien. Los resorts en esta área a veces ofrecen servicio de traslado a playas más tranquilas.",
  ),

  h2("Alimentando a un Bebé o Niño Pequeño en un Resort"),
  para(
    "Los buffets de los resorts tienen muchas opciones de comida apropiada para bebés y niños pequeños una vez que sabes qué buscar. Arroz simple, pasta simple, huevos revueltos, avena, yogurt, frutas en rodajas (mango, papaya, plátano, melón), verduras hervidas, pollo a la parrilla, puré de papas y pan están universalmente disponibles. La comida y fórmula específica de marca para bebés no se almacena comúnmente en la tienda de regalos del resort — trae lo que tu hijo usa específicamente desde casa, o acepta que el viaje adaptará temporalmente la dieta de tu hijo.",
  ),
  h3("Fórmula y Alimentación con Biberón"),
  para(
    "Trae la marca específica de fórmula de tu hijo. Los resorts no pueden obtener confiablemente marcas internacionales de fórmula, y cambiar a mitad de viaje puede molestar a un bebé sensible. Usa agua embotellada (proporcionada en la habitación) para mezclar la fórmula, no agua del grifo. Esteriliza los biberones ya sea con tu propio esterilizador de viaje o pidiendo al servicio a la habitación del resort agua hirviendo. La mayoría de los resorts acomodarán esta solicitud sin problema.",
  ),
  h3("Bocadillos Durante el Día"),
  para(
    "Entre comidas, los resorts tienen opciones limitadas de bocadillos — la fruta y la pastelería son comunes pero no siempre disponibles entre las 11 AM y la siguiente comida. Trae bocadillos familiares que al niño le gusten (barras de cereal, galletas, fruta seca) para los inevitables momentos de hambre en la playa o piscina. Evita depender de la tienda de regalos para estos — los precios son altos y la selección es limitada.",
  ),

  h2("Siestas, Horarios y Sueño"),
  para(
    "Mantener cierto parecido del horario normal de tu hijo es la mayor diferencia entre un viaje relajante y uno difícil. El viaje ya alterará algo el horario (zona horaria diferente, cenas tarde, ambiente nuevo, emoción) — protege lo que puedas.",
  ),
  h3("Estrategia de Habitación"),
  para(
    "Solicita una habitación con un área de dormir separada para el niño si es posible. Las suites cuestan más pero valen la pena cuando puedes leer o tener una conversación tranquila mientras el niño duerme. Si estás en una configuración de habitación única, planea estar tranquilo en la habitación durante la siesta y la hora de dormir del niño, o usa la habitación solo para el sueño del niño y el vestíbulo o terraza de la piscina para el tiempo de adultos. Trae una cortina blackout portátil o una manta grande para sujetar si tu niño es sensible a la luz — la luz caribeña entra antes y más brillante que en casa.",
  ),
  h3("Horarios de Piscina y Playa"),
  para(
    "Las mañanas (8 a 11 AM) y las últimas horas de la tarde (3 a 6 PM) son los mejores momentos para la piscina y la playa con niños pequeños. El sol es menos intenso, el calor es más manejable, y el niño está fresco. El mediodía (11 AM a 3 PM) es exactamente el momento en que deberías estar a la sombra o de regreso en la habitación para una siesta — esto se alinea convenientemente con el sol más fuerte y una típica siesta posterior al almuerzo.",
  ),

  h2("Consideraciones Médicas y de Salud"),
  h3("Preparación Médica Pre-Viaje"),
  para(
    "Verifica que las vacunas de rutina del niño estén al día. Trae un pequeño botiquín de primeros auxilios con: medicamento para el dolor y la fiebre para niños (acetaminofén e ibuprofeno) en dosis apropiadas para la edad, sales de rehidratación oral, crema para escaldaduras de pañal, crema antibacteriana para cortes, vendas, protector solar para bebés (mineral para menores de 2 años), spray repelente formulado para niños. Empaca medicamentos en el equipaje de mano, no en el facturado. Si tu hijo toma medicación prescrita, trae más que suficiente para el viaje más una copia de la receta.",
  ),
  h3("Protección Solar"),
  para(
    "El sol caribeño es significativamente más fuerte de lo que la mayoría de los niños norteamericanos y europeos experimentan en casa. Para bebés menores de 6 meses, la recomendación es mantenerlos completamente fuera de la luz solar directa (sombra, sombrero, mangas largas). Para bebés mayores y niños pequeños, protector solar a base mineral (SPF 30+), sombrero de ala ancha, camisa de natación con protección UV (\"rash guard\") y exposición limitada al mediodía. Vuelve a aplicar protector solar cada 90 minutos y después de cada exposición al agua — no el intervalo adulto de 2 horas. Una mala quemadura solar el primer día puede arruinar toda la semana.",
  ),
  h3("Seguridad en el Agua"),
  para(
    "Los niños pequeños y nadadores débiles deben usar chalecos salvavidas aprobados por la guardia costera en las piscinas, no solo brazaletes inflables. El ahogamiento en niños pequeños es silencioso y rápido. La supervisión adulta debe ser activa y sin distracciones — sin teléfonos, sin libros, sin conversaciones que te quiten la vista del agua. La mayoría de las piscinas de resort no tienen salvavidas posicionados de manera confiable. El mayor riesgo prevenible en un viaje familiar al Caribe es el ahogamiento en piscina, y casi siempre sucede durante un momento en que los adultos asumen que alguien más está vigilando.",
  ),
  h3("Si Tu Hijo se Enferma"),
  para(
    "Problemas menores comunes: erupción por calor (refresca al niño, ropa ligera), diarrea leve (rehidratación oral, dieta BRAT si el niño tiene edad suficiente), fiebre (líquidos, antipirético apropiado para la edad, monitoreo). Para cualquier cosa más seria — fiebre alta, vómitos persistentes, dificultad respiratoria, erupción severa, letargo, signos de deshidratación — ve a Hospiten Bávaro, que tiene atención pediátrica en inglés disponible 24/7. Los costos varían de $150 a $400+ USD por una visita a la clínica, pagada por adelantado; el seguro de viaje con cobertura médica maneja el reembolso.",
  ),

  h2("Excursiones con Bebés y Niños Pequeños"),
  para(
    "No todas las excursiones de Punta Cana son adecuadas para un bebé o un niño pequeño, pero varias funcionan bien con la planificación correcta. La regla general: más corta es mejor, más tranquila es mejor, y \"puede regresar al resort temprano\" es mejor que \"compromiso de todo el día.\"",
  ),
  h3("Excursiones Que Funcionan Bien"),
  li("**Viajes en catamarán con paradas cortas de snorkel:** Los bebés se quedan a la sombra a bordo con un padre mientras los niños pequeños mayores pueden chapotear en la piscina natural. Los viajes de medio día funcionan mejor que los de día completo."),
  li("**Pases de día en clubes de playa en playas más suaves:** Un cambio de escenario sin la estructura de una excursión fija."),
  li("**Viajes de día a Isla Saona:** Largo pero el paseo en bote es sombreado, la playa es tranquila, y la estructura funciona para niños pequeños que pueden dormir la siesta en el bote. Solo considerar si tu hijo está bien con nuevos entornos."),
  li("**Excursiones privadas sobre excursiones grupales:** Vale la diferencia de costo porque controlas el horario y puedes regresar temprano o cambiar planes."),
  h3("Excursiones a Evitar Hasta Que los Niños Sean Mayores"),
  li("Tours de buggy o quad (sin seguridad para la edad, polvorientos, golpeados)"),
  li("Tirolesa (restricciones de edad y no apropiado para niños pequeños de todos modos)"),
  li("Pesca en alta mar (largo, caluroso, sin sombra, a menudo agitado)"),
  li("Cualquier cosa etiquetada como \"aventura\" o \"adrenalina\" — están dirigidas a niños mayores y adultos"),
  para(
    "Para [[excursiones apropiadas para familias|https://puntacana-excursions.com/excursions]], coordinamos con los padres sobre horarios de recogida, horarios de regreso y qué esperar — especialmente importante cuando estás manejando horarios con un niño pequeño.",
  ),

  h2("Qué Empacar: Una Lista Práctica"),
  li("**Pañales y toallitas** para el viaje más 25 por ciento extra (quedarse sin a medianoche es real)"),
  li("**Fórmula o comida familiar** en el empaque original"),
  li("**Protector solar a base mineral** (el resort vende algunos pero la selección es limitada)"),
  li("**Sombrero, camisa de natación UV y zapatos de agua** para el niño"),
  li("**Objetos de consuelo en tamaño viaje**: manta, peluche, chupete (trae duplicados)"),
  li("**Tableta, audífonos y contenido pre-descargado** para vuelos y tiempo libre"),
  li("**Portabebés compacto o cochecito** — la mayoría de los resorts tienen senderos para caminar, y un portabebés es mejor que un cochecito en la playa"),
  li("**Manta blackout portátil** o tela oscura grande para las ventanas si tu hijo es sensible a la luz"),
  li("**Botiquín de primeros auxilios para niños** incluyendo termómetro y medicamentos apropiados para la edad"),
  li("**Tazas con boquilla, baberos y un set de platos/cucharas de plástico** para las comidas del resort"),
  li("**Cargador de teléfono de respaldo y batería externa** para el aeropuerto y excursiones"),
  li("**Documentación del seguro de viaje** incluyendo números de contacto de emergencia"),

  h2("Aspectos Prácticos del Día a Día"),
  h3("Lavandería"),
  para(
    "Los bebés y niños pequeños pasan por la ropa rápidamente en un clima tropical — arena, derrames de comida, sudor, agua de piscina. La mayoría de los resorts tienen servicio de lavandería pagado ($15 a $30 USD por bolsa) y algunos ofrecen lavanderías de autoservicio. Para una estadía de una semana, planea hacer al menos una lavada a mitad de viaje. La ropa infantil de secado rápido vale la pena empacar porque maneja el enjuague a mano en el lavabo del baño para pequeños accidentes. Algunos cubos de embalaje económicos ayudan a separar lo limpio de lo usado durante el viaje.",
  ),
  h3("Configuración de la Cuna en la Habitación"),
  para(
    "Las cunas de los resorts varían en calidad. Algunas son corrales pack-and-play casi nuevos; otras son cunas de madera más antiguas que cumplen con los estándares locales pero pueden no coincidir con lo que estás acostumbrado en casa. Inspecciona la cuna a la llegada, verifica que el colchón se ajuste bien, y solicita un reemplazo si algo parece inseguro. Muchos padres traen una sábana ajustable de casa — las sábanas del resort generalmente son de tamaño cama completa y no caben bien en cunas. Una pequeña luz nocturna es útil para alimentaciones nocturnas sin encender luces de techo.",
  ),
  h3("Decisión entre Cochecito y Portabebés"),
  para(
    "Los caminos del resort están en su mayoría pavimentados y son amigables para cochecitos, pero el acceso a la playa y la mayoría de las excursiones no lo son. Un cochecito ligero para los terrenos del resort más un portabebés de estructura suave para excursiones, tiempo de playa y superficies desiguales cubre la mayoría de las situaciones. Si solo puedes traer uno, el portabebés es más versátil.",
  ),

  h2("Reflexiones Finales"),
  para(
    "Punta Cana con bebés y niños pequeños funciona cuando eliges el resort correcto, empacas los esenciales correctos, proteges los horarios donde puedas, y ajustas tus expectativas de \"vacaciones\" a \"viaje familiar\" — que es diferente pero puede ser maravilloso a su manera. El clima caribeño y la infraestructura de resort hacen de este un primer-viaje-internacional-con-niño-pequeño mucho más fácil que muchos otros destinos.",
  ),
  para(
    "Si estás planeando un viaje y quieres ayuda coordinando excursiones, traslados o elecciones de restaurantes que funcionen con el horario de un niño pequeño, [[contáctanos|https://puntacana-excursions.com/contact]]. Trabajamos con familias constantemente y podemos decirte qué funciona realísticamente a la edad de tu hijo. Algunas cosas suenan geniales en un folleto pero no sobreviven a un paseo de 4 horas en bote con un niño de 2 años; te ahorraremos el ensayo y error.",
  ),
];

const toddlersBodyFr = [
  para(
    "Voyager à Punta Cana avec un bébé ou un tout-petit est tout à fait faisable, souvent délicieux, et parfois chaotique — exactement comme voyager avec un jeune enfant n'importe où ailleurs. Le climat des Caraïbes, l'infrastructure tout-inclus et les complexes familiaux font de Punta Cana l'une des destinations internationales les plus faciles à naviguer avec de jeunes enfants. Mais il y a de vraies considérations qui ne s'appliquent pas aux voyages sans enfants : quels complexes accueillent vraiment bien les bébés, comment gérer l'alimentation et les siestes avec un long vol, quelle infrastructure médicale existe, et quelle plage vous choisissez compte plus que d'habitude.",
  ),
  para(
    "Ce guide est écrit à partir d'une expérience pratique sur le terrain en travaillant avec des familles qui arrivent avec des enfants âgés de quelques mois à quatre ans. Si vous aimeriez de l'aide pour planifier des excursions ou des transferts qui fonctionnent avec les horaires de sieste et d'alimentation, [[contactez notre équipe|https://puntacana-excursions.com/contact]] — nous coordonnons constamment avec les parents et nous savons ce qui fonctionne.",
  ),

  h2("Punta Cana est-elle une Bonne Destination pour les Bébés et Tout-petits ?"),
  para(
    "Oui, avec des nuances. Les avantages sont substantiels : eau chaude, sable doux, climat prévisible, anglais largement parlé dans les grands complexes, installations médicales modernes à proximité, infrastructure familiale tout-inclus, et vols courts depuis la plupart de l'Amérique du Nord (3,5 heures de Miami, 4 de New York, 4,5 de Toronto, 5 de Montréal). Les inconvénients sont également réels : soleil fort qui ne pardonne pas aux enfants à la peau claire, moustiques pendant certaines saisons, eau du robinet à éviter de boire, et une infrastructure générale conçue pour que les adultes se détendent plutôt que pour que les parents gèrent la logistique des tout-petits.",
  ),
  para(
    "Le verdict pour la plupart des familles : un bon complexe plus une planification réfléchie rendent Punta Cana excellent. Un mauvais choix de complexe ou des attentes irréalistes le rendent stressant. La décision la plus importante que vous prendrez est quel complexe, car c'est là que 70 pour cent de votre temps avec un jeune enfant se passera réellement.",
  ),

  h2("Choisir le Bon Complexe"),
  para(
    "Tous les complexes de Punta Cana ne sont pas également adaptés aux tout-petits. Le langage marketing peut être trompeur — presque tous les complexes se disent adaptés aux familles car ils ont tous une piscine pour enfants et un club pour enfants. Les caractéristiques qui comptent vraiment pour les voyageurs de moins de 5 ans sont différentes.",
  ),
  h3("Caractéristiques Qui Comptent Vraiment"),
  li("**Accès à une plage à eau calme :** Certaines plages de Bávaro ont des eaux douces et peu profondes parfaites pour les tout-petits ; d'autres ont des vagues plus fortes et des descentes plus abruptes. Cap Cana et certaines portions de Bávaro sont plus calmes que la plage centrale de Bávaro."),
  li("**Options de babysitting et garde d'enfants :** Les complexes varient considérablement. Certains offrent du babysitting formel à partir de 6 mois, d'autres n'ont que des clubs pour enfants en groupe à partir de 4 ans. Vérifiez avant de réserver si vous avez besoin de temps adulte."),
  li("**Berceaux et chaises hautes disponibles :** Confirmez directement avec le complexe avant l'arrivée, pas seulement via votre opérateur. Les quantités sont parfois limitées."),
  li("**Disponibilité de nourriture pour bébés et lait :** Les buffets des grands complexes ont du riz nature, des pâtes nature, des fruits, des œufs et du yaourt. Les pots de nourriture pour bébés de marque spécifique ne sont pas couramment stockés — apportez ce dont votre enfant a besoin depuis chez vous ou acceptez que vous nourrirez des versions adaptées de la nourriture du complexe."),
  li("**Variété de profondeur de piscine :** Une piscine graduée avec des zones très peu profondes (15 à 30 cm) est beaucoup plus utile qu'une seule piscine de 1,2 mètre avec une aire de jeux d'eau séparée pour enfants."),
  li("**Disposition de la chambre :** Les suites avec chambres séparées ou les chambres avec cloisons sont beaucoup plus confortables que les chambres de type studio quand vous avez besoin de garder les lumières éteintes pour un coucher tôt."),
  li("**Personnel médical sur place :** Les grands complexes ont des cliniques 24h/24. Les petits complexes boutiques peuvent compter sur un service d'appel. La différence compte à 2h du matin avec un tout-petit fiévreux."),
  h3("Catégories de Complexe à Considérer"),
  para(
    "Les grandes marques axées sur la famille (Nickelodeon, Hyatt Ziva, les propriétés familiales d'Excellence, Iberostar Selection, certaines configurations Hard Rock) penchent vers l'expérience familiale et tendent à avoir l'infrastructure ci-dessus. Les complexes de luxe orientés adultes (Excellence Punta Cana adultes uniquement, Sanctuary Cap Cana, Secrets) soit n'autorisent pas les enfants de moins de 18 ans, soit découragent activement les familles. Les tout-inclus de milieu de gamme sont mixtes — lisez les avis récents spécifiques aux familles avant de vous engager.",
  ),

  h2("Voyager en Avion avec Bébés et Tout-petits"),
  h3("Choisir les Horaires de Vol"),
  para(
    "Si possible, volez pendant la fenêtre de sommeil naturelle de votre enfant. Les vols de nuit depuis l'Europe atterrissent à Punta Cana le matin, ce qui fonctionne généralement bien — l'enfant dort en route et arrive prêt pour une journée plus ou moins normale. Les vols de jour depuis l'Amérique du Nord sont plus délicats car les heures de sieste entrent en collision avec le décollage et l'atterrissage. Les départs tôt le matin (pour arriver en début d'après-midi) sont généralement moins stressants que les arrivées en soirée, car vous avez la lumière du jour pour gérer le transfert et arriver à votre complexe pendant que l'enfant est encore alerte.",
  ),
  h3("Documentation"),
  para(
    "Les bébés et les enfants ont besoin de leur propre passeport. La République Dominicaine accepte la plupart des passeports des principales nationalités pour le tourisme sans visa. Les deux parents voyageant avec l'enfant n'ont besoin que de passeports ; un parent voyageant seul avec l'enfant a parfois besoin d'une lettre de consentement notariée de l'autre parent — vérifiez les exigences de votre pays d'origine et la politique de la compagnie aérienne avant de voler. On demande fréquemment cette lettre à l'enregistrement aux parents célibataires ou divorcés voyageant internationalement avec un enfant.",
  ),
  h3("Essentiels à Bord"),
  para(
    "Emballez deux fois plus de couches que vous pensez avoir besoin. Apportez un changement de vêtements pour l'enfant et vous (régurgitations, fuites et nourriture renversée arrivent toutes). Les collations pré-emballées que l'enfant aime déjà valent leur pesant d'or sur un vol de 4 heures. Une tablette pré-chargée avec du contenu familier, avec des écouteurs adaptés aux petites têtes, prévient la plupart des crises d'ennui. Un petit objet de réconfort (doudou, couverture, tétine) aide avec la pression dans les oreilles pendant la descente — sucer, boire au biberon ou mâcher une collation à la descente réduit l'inconfort des oreilles.",
  ),

  h2("Meilleures Plages pour Tout-petits dans la Région de Punta Cana"),
  para(
    "La côte de Punta Cana a plusieurs zones de plage distinctes avec des conditions différentes. Pour les jeunes enfants, l'eau calme et l'entrée progressive comptent plus que quel complexe est sur la plage.",
  ),
  h3("Plages de Cap Cana"),
  para(
    "Cap Cana (au sud du centre de Punta Cana) a certaines des eaux les plus calmes et les plus claires et une longue entrée plate idéale pour les tout-petits. La plage Juanillo se démarque — vagues douces, sable doux, généralement plus propre que le centre de Bávaro la plupart des jours. L'inconvénient : les complexes de Cap Cana tendent à être plus chers, et la zone a moins d'options de restauration à l'extérieur.",
  ),
  h3("Plages de Bávaro"),
  para(
    "Le centre de Bávaro est la bande de plage la plus longue et la plus développée. Les conditions varient le long de sa longueur — l'extrémité sud (près d'El Cortecito) a parfois des vagues plus fortes, tandis que les sections nord de Bávaro (Arena Gorda, Cabeza de Toro) tendent à être plus calmes. La plupart des complexes familiaux se regroupent à Bávaro, ce qui signifie beaucoup d'options mais aussi des sections bondées en haute saison. Vérifiez les conditions quotidiennes des vagues ; la plupart des complexes affichent des drapeaux de plage.",
  ),
  h3("Uvero Alto et Macao"),
  para(
    "Ces plages au nord de Bávaro sont moins développées et ont souvent plus d'action de vagues — généralement pas idéal pour les très jeunes enfants, bien que les enfants plus âgés qui peuvent jouer dans le sable sans avoir besoin d'entrer dans l'eau puissent être bien. Les complexes dans cette zone offrent parfois un service de transfert vers des plages plus calmes.",
  ),

  h2("Nourrir un Bébé ou un Tout-petit dans un Complexe"),
  para(
    "Les buffets des complexes ont beaucoup de nourriture appropriée pour bébés et tout-petits une fois que vous savez quoi chercher. Riz nature, pâtes nature, œufs brouillés, gruau, yaourt, fruits tranchés (mangue, papaye, banane, melon), légumes bouillis, poulet grillé, purée de pommes de terre et pain sont universellement disponibles. La nourriture pour bébés et la formule de marque spécifique ne sont pas couramment stockées au magasin de souvenirs du complexe — apportez ce que votre enfant utilise spécifiquement depuis chez vous, ou acceptez que le voyage adaptera temporairement le régime alimentaire de votre enfant.",
  ),
  h3("Formule et Alimentation au Biberon"),
  para(
    "Apportez la marque spécifique de formule de votre enfant. Les complexes ne peuvent pas se procurer de manière fiable des marques internationales de formule, et changer en milieu de voyage peut perturber un bébé sensible. Utilisez l'eau en bouteille (fournie dans la chambre) pour mélanger la formule, pas l'eau du robinet. Stérilisez les biberons soit avec votre propre stérilisateur de voyage, soit en demandant de l'eau bouillante au service en chambre du complexe. La plupart des complexes répondront à cette demande sans problème.",
  ),
  h3("Collations Tout au Long de la Journée"),
  para(
    "Entre les repas, les complexes ont des options de collations limitées — les fruits et la pâtisserie sont courants mais pas toujours disponibles entre 11h et le prochain repas. Apportez des collations familières que l'enfant aime (barres de céréales, biscuits, fruits secs) pour les inévitables moments de faim à la plage ou à la piscine. Évitez de compter sur le magasin de souvenirs pour ceux-ci — les majorations sont lourdes et la sélection est étroite.",
  ),

  h2("Siestes, Horaires et Sommeil"),
  para(
    "Maintenir un semblant d'horaire normal de votre enfant est la plus grande différence entre un voyage relaxant et un voyage difficile. Le voyage perturbera déjà un peu le timing (fuseau horaire différent, dîners tardifs, nouvel environnement, excitation) — protégez ce que vous pouvez.",
  ),
  h3("Stratégie de Chambre"),
  para(
    "Demandez une chambre avec un espace de sommeil séparé pour l'enfant si possible. Les suites coûtent plus cher mais sont payantes quand vous pouvez lire ou avoir une conversation tranquille pendant que l'enfant dort. Si vous êtes dans une configuration de chambre unique, prévoyez d'être silencieux dans la chambre pendant la sieste et le coucher de l'enfant, ou utilisez la chambre uniquement pour le sommeil de l'enfant et le hall ou la terrasse de la piscine pour le temps adulte. Apportez un rideau occultant portable ou une grande couverture à fixer si votre enfant est sensible à la lumière — la lumière caribéenne entre plus tôt et plus brillante qu'à la maison.",
  ),
  h3("Horaires de Piscine et de Plage"),
  para(
    "Les matins (8h à 11h) et les fins d'après-midi (15h à 18h) sont les meilleurs moments pour la piscine et la plage avec de jeunes enfants. Le soleil est moins intense, la chaleur est plus gérable, et l'enfant est frais. Le milieu de la journée (11h à 15h) est exactement le moment où vous devriez être à l'ombre ou de retour dans la chambre pour une sieste — cela s'aligne commodément avec le soleil le plus fort et une sieste typique d'après-déjeuner.",
  ),

  h2("Considérations Médicales et de Santé"),
  h3("Préparation Médicale Pré-Voyage"),
  para(
    "Vérifiez que les vaccinations de routine de l'enfant sont à jour. Apportez une petite trousse de premiers soins avec : médicaments contre la douleur et la fièvre pour enfants (acétaminophène et ibuprofène) en dosage approprié à l'âge, sels de réhydratation orale, crème pour érythème fessier, crème antibactérienne pour coupures, pansements, écran solaire pour bébé (à base minérale pour les moins de 2 ans), spray anti-insectes formulé pour enfants. Emballez les médicaments dans le bagage à main, pas en soute. Si votre enfant prend des médicaments sur ordonnance, apportez plus qu'assez pour le voyage plus une copie de l'ordonnance.",
  ),
  h3("Protection Solaire"),
  para(
    "Le soleil caribéen est significativement plus fort que ce que la plupart des enfants nord-américains et européens expérimentent à la maison. Pour les bébés de moins de 6 mois, la recommandation est de les garder entièrement hors du soleil direct (ombre, chapeau, manches longues). Pour les bébés plus âgés et les tout-petits, écran solaire à base minérale (SPF 30+), chapeau à large bord, t-shirt de bain à protection UV (\"rash guard\") et exposition limitée en milieu de journée. Réappliquez l'écran solaire toutes les 90 minutes et après chaque exposition à l'eau — pas l'intervalle adulte de 2 heures. Un mauvais coup de soleil le premier jour peut ruiner toute la semaine.",
  ),
  h3("Sécurité Aquatique"),
  para(
    "Les tout-petits et les nageurs faibles doivent porter des gilets de sauvetage approuvés par les garde-côtes dans les piscines, pas seulement des brassards gonflables. La noyade chez les tout-petits est silencieuse et rapide. La supervision adulte doit être active et sans distractions — pas de téléphone, pas de livres, pas de conversations qui détournent vos yeux de l'eau. La plupart des piscines de complexe n'ont pas de sauveteurs positionnés de manière fiable. Le plus grand risque évitable lors d'un voyage familial aux Caraïbes est la noyade en piscine, et cela arrive presque toujours pendant un moment où les adultes supposent que quelqu'un d'autre regarde.",
  ),
  h3("Si Votre Enfant Tombe Malade"),
  para(
    "Problèmes mineurs courants : éruption due à la chaleur (rafraîchir l'enfant, vêtements légers), diarrhée légère (réhydratation orale, régime BRAT si l'enfant est assez grand), fièvre (liquides, antipyrétique approprié à l'âge, surveillance). Pour quoi que ce soit de plus sérieux — fièvre élevée, vomissements persistants, difficulté respiratoire, éruption sévère, léthargie, signes de déshydratation — allez à Hospiten Bávaro, qui a des soins pédiatriques anglophones disponibles 24h/24 et 7j/7. Les coûts varient de 150 à 400+ USD pour une visite à la clinique, payée d'avance ; l'assurance voyage avec couverture médicale gère le remboursement.",
  ),

  h2("Excursions avec Bébés et Tout-petits"),
  para(
    "Toutes les excursions de Punta Cana ne conviennent pas à un bébé ou un tout-petit, mais plusieurs fonctionnent bien avec la bonne planification. La règle générale : plus court c'est mieux, plus calme c'est mieux, et \"peut retourner au complexe tôt\" est mieux que \"engagement de toute la journée.\"",
  ),
  h3("Excursions Qui Fonctionnent Bien"),
  li("**Excursions en catamaran avec courts arrêts de plongée libre :** Les bébés restent à l'ombre à bord avec un parent pendant que les tout-petits plus âgés peuvent éclabousser dans la piscine naturelle. Les excursions d'une demi-journée fonctionnent mieux que celles d'une journée complète."),
  li("**Forfaits journaliers de beach-clubs sur des plages plus douces :** Un changement de décor sans la structure d'une excursion fixe."),
  li("**Excursions d'une journée à l'île Saona :** Long mais le trajet en bateau est ombragé, la plage est calme, et la structure fonctionne pour les tout-petits qui peuvent dormir sur le bateau. À considérer uniquement si votre enfant gère bien les nouveaux environnements."),
  li("**Excursions privées plutôt que de groupe :** La différence de coût en vaut la peine car vous contrôlez l'horaire et pouvez revenir tôt ou changer de plan."),
  h3("Excursions à Éviter Jusqu'à ce que les Enfants Soient Plus Âgés"),
  li("Visites en buggy ou quad (pas de sécurité adaptée à l'âge, poussiéreuses, secouantes)"),
  li("Tyrolienne (restrictions d'âge et pas approprié pour les jeunes enfants de toute façon)"),
  li("Pêche en haute mer (longue, chaude, sans ombre, souvent agitée)"),
  li("Tout ce qui est étiqueté comme \"aventure\" ou \"adrénaline\" — ceux-ci ciblent les enfants plus âgés et les adultes"),
  para(
    "Pour les [[excursions adaptées aux familles|https://puntacana-excursions.com/excursions]], nous coordonnons avec les parents sur les heures de prise en charge, les heures de retour et à quoi s'attendre — particulièrement important quand vous gérez des horaires avec un jeune enfant.",
  ),

  h2("Quoi Emballer : Une Liste Pratique"),
  li("**Couches et lingettes** pour le voyage plus 25 pour cent de plus (manquer à minuit est réel)"),
  li("**Formule ou nourriture familière** dans l'emballage d'origine"),
  li("**Écran solaire à base minérale** (le complexe en vend mais la sélection est limitée)"),
  li("**Chapeau, t-shirt de bain UV et chaussures d'eau** pour l'enfant"),
  li("**Objets de réconfort en format voyage** : couverture, doudou, tétine (apportez des doubles)"),
  li("**Tablette, écouteurs et contenu pré-téléchargé** pour les vols et les temps morts"),
  li("**Porte-bébé compact ou poussette** — la plupart des complexes ont des sentiers, et un porte-bébé est mieux qu'une poussette sur la plage"),
  li("**Couverture occultante portable** ou grand tissu sombre pour les fenêtres si votre enfant est sensible à la lumière"),
  li("**Trousse de premiers soins pour enfants** incluant thermomètre et médicaments adaptés à l'âge"),
  li("**Tasses à bec, bavoirs et un ensemble d'assiettes/cuillères en plastique** pour les repas du complexe"),
  li("**Chargeur de téléphone de secours et batterie externe** pour l'aéroport et les excursions"),
  li("**Documentation d'assurance voyage** incluant numéros de contact d'urgence"),

  h2("Aspects Pratiques au Quotidien"),
  h3("Buanderie"),
  para(
    "Les bébés et tout-petits traversent les vêtements rapidement dans un climat tropical — sable, déversements de nourriture, sueur, eau de piscine. La plupart des complexes ont un service de blanchisserie payant (15 à 30 USD par sac) et certains offrent des laveries en libre-service. Pour un séjour d'une semaine, prévoyez de faire au moins un lavage en milieu de voyage. Les vêtements pour enfants à séchage rapide valent la peine d'être emballés car ils gèrent le rinçage à la main dans le lavabo de la salle de bain pour les petits accidents. Quelques cubes d'emballage peu coûteux aident à séparer le propre du porté pendant le voyage.",
  ),
  h3("Installation du Berceau dans la Chambre"),
  para(
    "Les berceaux des complexes varient en qualité. Certains sont des parcs-bébés pack-and-play presque neufs ; d'autres sont des berceaux en bois plus anciens qui répondent aux normes locales mais peuvent ne pas correspondre à ce dont vous êtes habitué à la maison. Inspectez le berceau à l'arrivée, vérifiez que le matelas s'ajuste bien, et demandez un remplacement si quelque chose semble dangereux. Beaucoup de parents apportent un drap-housse de la maison — les draps du complexe sont généralement de taille lit double et ne s'ajustent pas bien aux berceaux. Une petite veilleuse est utile pour les alimentations nocturnes sans allumer les lumières du plafond.",
  ),
  h3("Décision entre Poussette et Porte-bébé"),
  para(
    "Les allées du complexe sont principalement pavées et adaptées aux poussettes, mais l'accès à la plage et la plupart des excursions ne le sont pas. Une poussette légère pour les terrains du complexe plus un porte-bébé à structure souple pour les excursions, le temps à la plage et les surfaces inégales couvre la plupart des situations. Si vous ne pouvez en apporter qu'un, le porte-bébé est plus polyvalent.",
  ),

  h2("Réflexions Finales"),
  para(
    "Punta Cana avec des bébés et des tout-petits fonctionne quand vous choisissez le bon complexe, emballez les bons essentiels, protégez les horaires où vous le pouvez, et ajustez vos attentes de \"vacances\" à \"voyage en famille\" — ce qui est différent mais peut être merveilleux à sa manière. Le climat caribéen et l'infrastructure des complexes en font un premier-voyage-international-avec-un-jeune-enfant beaucoup plus facile que de nombreuses autres destinations.",
  ),
  para(
    "Si vous planifiez un voyage et voulez de l'aide pour coordonner les excursions, les transferts ou les choix de restaurants qui fonctionnent avec l'horaire d'un jeune enfant, [[contactez-nous|https://puntacana-excursions.com/contact]]. Nous travaillons constamment avec des familles et pouvons vous dire ce qui fonctionne de manière réaliste à l'âge de votre enfant. Certaines choses paraissent géniales dans une brochure mais ne survivent pas à une excursion en bateau de 4 heures avec un enfant de 2 ans ; nous vous éviterons les essais et erreurs.",
  ),
];

// ===========================================================================
// ARTICLE 2 — Best Excursions for Kids by Age (EN, ES, DE)
// ===========================================================================

const kidsAgeBodyEn = [
  para(
    "Picking the right excursion for your child's age is the difference between a memory they'll talk about for years and a hot, bored, tearful afternoon. Punta Cana has dozens of excursions on offer, but the marketing makes most of them sound family-friendly when only some actually are. This guide breaks down which trips work at which ages, what to expect, and which ones to skip until kids are older. It's written from real experience with hundreds of families.",
  ),
  para(
    "If you'd like specific recommendations based on your kids' ages and personalities, [[contact our team|https://puntacana-excursions.com/contact]] — we coordinate family trips constantly and know which excursions actually deliver for which age groups.",
  ),

  h2("How to Think About Picking Kid Excursions"),
  para(
    "Three factors matter more than the excursion description: duration, structure flexibility, and physical demands. A two-hour catamaran trip is different from an eight-hour Saona Island day. A trip you can leave when the kid melts down is different from one you're locked into. An activity that requires the child to walk for an hour is different from one where they sit in a boat. Most family-trip disasters come from underestimating one of these three.",
  ),
  para(
    "The other big factor is your specific kid. Some 4-year-olds handle a full day of beach travel beautifully; others would struggle with two hours of structured activity at age 6. You know your child better than any guide. Use the age ranges below as general starting points, then adjust based on what you know about your specific child's stamina, sensory needs, and comfort with new environments.",
  ),

  h2("Ages 0 to 2 (Babies and Young Toddlers)"),
  para(
    "Excursions at this age are about getting the parents some variety, not entertaining the baby. The baby will sleep, look around, eat, get carried, and mostly do what they would do at the resort, just somewhere else. The goal is short, calm, and easy to bail out of.",
  ),
  h3("What Works"),
  li("**Short catamaran sails (2 to 3 hours):** Calm seas, shaded boats, parent holds baby, brief swimming stop. Avoid the longer party-boat trips."),
  li("**Beach club day passes at calmer beaches:** A change of scenery without locked-in structure."),
  li("**Resort hopping for lunch at a sister property:** If your resort has affiliated properties with day-pass privileges, this counts as an excursion at this age."),
  li("**Private guided drives:** A 2 to 3 hour scenic drive with a stop or two. The car is air-conditioned, the baby naps in the car seat, parents see something new."),
  h3("What to Skip"),
  para(
    "All-day Saona trips (too long), buggy and quad tours (vibration, dust, no infant safety provisions), zip-lining (impossible at this age), parasailing (age and weight restrictions), horseback riding (age restrictions), party catamarans (loud music, lots of drinking, not a baby environment). Anything billed as adventure is built for older kids and adults.",
  ),

  h2("Ages 3 to 5 (Preschoolers)"),
  para(
    "This age has personality and stamina but limited attention span. They want to do things but lose interest quickly. The best excursions for this age have short bursts of activity broken up by snacks, scenery, or rest.",
  ),
  h3("What Works"),
  li("**Half-day catamaran with snorkel stop:** Kids can splash in the natural pool, see fish through a mask, and be back at the resort for nap. About 3 to 4 hours total."),
  li("**Saona Island day trips (with caveats):** Works for resilient 4- and 5-year-olds, especially if you choose the catamaran option (more space to move) over the speedboat option (jarring ride). Be prepared with snacks, sunscreen, and a willingness to leave early if needed."),
  li("**Cap Cana beach club day:** A nicer beach than the resort, with food, shaded lounging, and shallow water for splashing."),
  li("**Manatí Park or similar animal experiences:** Children at this age love seeing animals. Manatí Park near Bávaro has dolphins, parrots, snakes, and a small zoo. Half a day works well."),
  li("**Short cultural visits to nearby towns:** A 2-hour visit to Higüey to see the basilica and try local food can be charming, but only if you build in playground time or other kid-relevant breaks."),
  h3("What to Skip"),
  para(
    "Quad bikes and buggies (still too rough and the seating isn't designed for small bodies), zip-lining at most operators (height and age restrictions), long fishing trips, all-adult party boats, anything with strenuous hiking or walking on uneven ground for more than 30 minutes.",
  ),

  h2("Ages 6 to 9 (Early School Age)"),
  para(
    "Now things get interesting. Kids at this age can engage with most family excursions meaningfully. They can swim, listen to brief instructions, hold attention for several hours, and remember the experience clearly afterward. This is the sweet spot for many of the classic Punta Cana excursions.",
  ),
  h3("What Works"),
  li("**Full-day Saona Island trips:** Works well for most 6+ kids. The boat ride, beach time, lunch, and natural pool stop give variety. Bring snacks for between activities."),
  li("**Snorkeling at calm reefs:** With a basic snorkel set sized for kids, this age can genuinely enjoy seeing fish. Several Punta Cana operators run snorkel-specific trips with shallow, calm spots ideal for beginners."),
  li("**Catalina Island day trips:** Similar structure to Saona but with better snorkeling at this age."),
  li("**Hoyo Azul cenote at Scape Park:** A spectacular freshwater cenote in a jungle setting. Kids love it. The hike in is short and manageable."),
  li("**Zip-lining at family-rated operators:** Several operators have age- and weight-rated lines safe for kids from 6+ depending on size. Confirm the safety setup before booking."),
  li("**Horseback riding (calm, guided trail rides):** Many operators take kids from age 6 or 7 on short, slow trail rides. A guide leads the horse and the experience is more pony-ride than serious riding."),
  li("**Sport fishing if the parent is keen:** A 4-hour mahi-mahi trip works for engaged 8 and 9 year olds. Bring snacks and entertainment for slow patches."),
  h3("What to Skip"),
  para(
    "Quad/buggy still gets a yellow light at this age — the rough ride and dust aren't great, and some operators have age minimums of 8 or 10. Long deep-sea fishing days (8+ hours) are usually too much. Most adventure activities marketed to adults are still ahead of this age.",
  ),

  h2("Ages 10 to 13 (Tweens)"),
  para(
    "Tweens are wonderful excursion partners. They can do almost everything an adult can, they have stamina for full days, they can swim and snorkel independently with supervision, and they're old enough to actually engage with cultural and natural content. They're also old enough to develop preferences — some will love active excursions, others want beach time and chill activities. Ask what they want, don't assume.",
  ),
  h3("What Works"),
  li("**Buggy and quad bike tours (with safety attention):** Now appropriate for most tweens. Look for operators with helmets, proper safety briefings, and routes that don't go on public roads. A 3 to 4 hour tour through the countryside is memorable for this age."),
  li("**Snorkeling and diving experiences:** Discover Scuba programs accept kids from age 10 in most cases. Bayahibe and Catalina reefs offer excellent introductory dives."),
  li("**Zip-lining and aerial adventure parks:** Scape Park, Anamuya, and similar operators have impressive ziplines that tweens enjoy. Most have minimum weights around 25 kg, easily met at this age."),
  li("**Deep-sea fishing:** A half-day mahi-mahi or marlin trip is now a real shared experience. Tweens who don't get seasick often love it."),
  li("**Cenote and cave tours:** Hoyo Azul or Scape Park's underground river network is genuinely impressive at this age."),
  li("**Bavaro Adventure Park and similar adventure parks:** Multiple activities in one location work well for tweens with varied interests in a group."),
  li("**Catamaran party trips during the day:** Quieter daytime versions of catamaran tours (some operators offer family-rated versions) work well; avoid the booze-cruise versions."),
  h3("What to Watch For"),
  para(
    "Sun exposure and sunscreen application — tweens often resist reapplying sunscreen and end up burned. Hydration during active excursions. Sea-sickness risk on fishing trips for kids who haven't experienced it before. Phone/tablet boundaries during the excursion — many tweens default to screen time and miss the experience.",
  ),

  h2("Ages 14 to 17 (Teenagers)"),
  para(
    "Teenagers can do everything an adult can on a Punta Cana excursion. The question is whether they want to do it with their family. Most teenagers can be motivated by genuinely interesting activities (diving, ziplining, sport fishing, sailing instruction) and demotivated by activities marketed at younger kids or by repetitive resort routines. Ask their opinion; involve them in choosing.",
  ),
  h3("What Works"),
  li("**Full PADI Discover Scuba or even Open Water certification:** A teen who learns to dive in Punta Cana takes home a real skill. Multi-day certification courses work for older teens with vacation time."),
  li("**Surf and kitesurf lessons:** Cabarete (about 4 hours north) is one of the world's best kite spots; closer to Punta Cana, Macao has decent surf with lessons available."),
  li("**Adventure activities at full intensity:** Ziplines, advanced quad/buggy routes, ATV beach safari combos."),
  li("**Sport fishing for marlin or mahi-mahi:** Full-day charters now within range for stamina."),
  li("**Sailing lessons or chartered sail experiences:** Some operators offer hands-on involvement that's genuinely educational."),
  li("**Independent beach days at non-resort beaches:** Beach clubs at Cap Cana or Macao offer change of scenery; older teens can be given more independence."),
  li("**Cooking classes or cultural experiences:** Some resorts and outside vendors offer Dominican cooking, mixology, or merengue classes."),
  h3("Motivation Strategies"),
  para(
    "Frame excursions as opt-in rather than mandatory family time. Let the teen pick from a curated set of options that suit them. Avoid scheduling so much that there's no time for them to just chill. Many family vacations to Punta Cana succeed at this age when teens have one or two real adventure highlights plus generous beach and pool time at the resort.",
  ),

  h2("Multi-Age Family Considerations"),
  para(
    "Families with kids spanning multiple age groups face the hardest scheduling challenge. The classic problem: a 4-year-old needs naps and short activities, while a 12-year-old wants zip-lining and snorkeling. A few strategies help.",
  ),
  h3("Split the Family"),
  para(
    "One parent does the active excursion with the older kid while the other parent has a beach-and-pool day with the younger child. This is often the path of least resistance for trips with significant age spreads. Plan one or two excursions per parent rather than one big family expedition.",
  ),
  h3("Choose Excursions With Variety"),
  para(
    "Saona Island day trips work for wide age ranges because there's beach for the younger kids, snorkeling for the older, boat time, lunch — different things for different kids. Catamaran trips with snorkel stops similarly accommodate a range."),
  h3("Private Excursions"),
  para(
    "If the budget allows, a private excursion (just your family, dedicated guide and vehicle) lets you customize for your specific group. Younger kid melts down? You can return early. Older kid wants more snorkeling? You can extend. The group flexibility costs more but eliminates a lot of friction.",
  ),

  h2("Practical Tips That Apply to Every Age"),
  li("**Bring snacks** — even on \"food included\" excursions, snack timing rarely matches kid hunger."),
  li("**Bring water bottles** — refillable, every person gets one labeled."),
  li("**Sunscreen before you leave** — reapply at every transition (boat to beach, beach to lunch)."),
  li("**Plan the toilet** — know where it is on the boat, at the beach club, in the buggy area."),
  li("**Cash for tips** — small bills for guides, drivers, crew."),
  li("**Phone with photos of allergies in Spanish** — useful if a child has food allergies and you're not fluent."),
  li("**Backup clothes** in a dry bag for boat trips."),

  h2("How to Book Kid-Friendly Excursions"),
  para(
    "Where you book matters as much as which excursion you pick. The same trip can be a great experience or a stressful one depending on how the operator handles families. A few principles save trouble.",
  ),
  h3("Skip the Beach Hawkers"),
  para(
    "People selling excursions from the beach or pool deck at resorts often quote prices significantly below the legitimate operator rate, but the trip you actually receive can vary widely. Sometimes it's fine; sometimes the boat is overcrowded, the safety equipment is missing, the lunch is skipped, the return time is two hours later than promised. The risk-to-reward for families specifically isn't worth the savings. Book through your hotel concierge, an established operator's website, or a known travel agent."),
  h3("Read Recent Family Reviews"),
  para(
    "When researching, filter reviews to those mentioning children. A trip rated 4.5 stars overall might still be terrible for families if the average reviewer is a 30-year-old couple. Look specifically for what families say about timing, crew patience with kids, restroom access, food options for picky eaters, and whether the operator allowed flexibility (returning early, adjusting plans). This is the most reliable predictor of whether the trip will work for your group."),
  h3("Confirm Ages and Restrictions Before Booking"),
  para(
    "Age minimums vary by activity and operator. The same activity at two different operators can have different age cutoffs (one allows 6, another requires 10). Confirm before paying any deposit. Also confirm child pricing — most reputable operators charge significantly less for children under 12, but you have to ask."),
  h3("Ask About Group Size"),
  para(
    "A catamaran with 12 guests is a very different experience from one with 60. For families with small kids, smaller groups mean more attention from crew, more space to move, less stress. Group-size matters more than vessel size; ask what the actual passenger count will be on your specific date."),

  h2("Common Excursion Concerns for Families"),
  h3("Motion Sickness"),
  para(
    "Some kids are prone to seasickness; some aren't. If you don't know, do a short test outing (a 30-minute boat ride at the resort marina) before committing to a 4-hour open-water trip. Effective preventives include children's dimenhydrinate (Dramamine for Kids, dosed by weight), ginger candy, and acupressure wristbands. The non-medical version: position the child mid-boat where there's less motion, look at the horizon not at the boat, and avoid heavy meals before sailing. Boats with cabins and shade are easier on prone-to-seasickness kids than open speedboats."),
  h3("Bathroom Access"),
  para(
    "Catamarans and larger boats have basic marine toilets that work but aren't always pristine. Speedboats often have no bathroom at all — for a 90-minute speedboat ride to Saona, plan accordingly. At the destination islands, public toilets exist but vary in quality. For kids in late toilet-training stages, a small portable potty or pull-up underwear for boat days reduces stress significantly. Snorkeling stops are a good moment to encourage a bathroom break."),
  h3("Sun and Heat"),
  para(
    "Caribbean midday sun is intense. On excursions, kids get more exposure than they do at the resort because there's less shade, more reflection off water, and longer continuous time outside. Hat with a chin strap, UV swim shirt, mineral sunscreen reapplied at every transition, water bottle, and a small shade towel or umbrella all help. Watch for the early signs of heat exhaustion in younger kids: unusual tiredness, irritability, refusing food. If you see these, get the child into shade and cool water immediately."),

  h2("Final Thoughts"),
  para(
    "Picking the right excursion at the right age is one of the highest-leverage decisions in family travel. A well-matched trip becomes a core memory; a mismatched one becomes \"that time we should have stayed at the resort.\" Use this guide as a starting point, factor in your specific child's stamina and interests, and don't overschedule.",
  ),
  para(
    "If you'd like help matching excursions to your specific family configuration, [[contact us|https://puntacana-excursions.com/contact]] with your kids' ages, the dates of your trip, and what your group generally enjoys. We do this every day with families from around the world and can recommend trips that we know work, not just trips that exist.",
  ),
];

const kidsAgeBodyEs = [
  para(
    "Elegir la excursión correcta para la edad de tu hijo es la diferencia entre un recuerdo del que hablarán durante años y una tarde calurosa, aburrida y llena de llanto. Punta Cana tiene docenas de excursiones disponibles, pero el marketing hace que la mayoría suene familiar cuando solo algunas realmente lo son. Esta guía desglosa qué viajes funcionan a qué edades, qué esperar, y cuáles evitar hasta que los niños sean mayores. Está escrita desde la experiencia real con cientos de familias.",
  ),
  para(
    "Si te gustaría recomendaciones específicas basadas en las edades y personalidades de tus hijos, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] — coordinamos viajes familiares constantemente y sabemos qué excursiones realmente funcionan para qué grupos de edad.",
  ),

  h2("Cómo Pensar en la Elección de Excursiones para Niños"),
  para(
    "Tres factores importan más que la descripción de la excursión: duración, flexibilidad de estructura, y demandas físicas. Un viaje en catamarán de dos horas es diferente de un día de ocho horas en Isla Saona. Un viaje del que puedes irte cuando el niño colapsa es diferente de uno en el que estás atrapado. Una actividad que requiere que el niño camine durante una hora es diferente de una donde se sienta en un bote. La mayoría de los desastres de viajes familiares vienen de subestimar uno de estos tres.",
  ),
  para(
    "El otro gran factor es tu niño específico. Algunos niños de 4 años manejan hermosamente un día completo de viaje de playa; otros lucharían con dos horas de actividad estructurada a los 6 años. Tú conoces a tu hijo mejor que cualquier guía. Usa los rangos de edad a continuación como puntos de partida generales, luego ajusta basado en lo que sabes sobre la resistencia, las necesidades sensoriales y la comodidad de tu hijo específico con nuevos entornos.",
  ),

  h2("Edades 0 a 2 (Bebés y Niños Muy Pequeños)"),
  para(
    "Las excursiones a esta edad son para darles variedad a los padres, no para entretener al bebé. El bebé dormirá, mirará alrededor, comerá, será cargado, y mayormente hará lo que haría en el resort, solo que en otro lugar. La meta es corta, tranquila, y fácil de abandonar.",
  ),
  h3("Qué Funciona"),
  li("**Paseos cortos en catamarán (2 a 3 horas):** Mares tranquilos, botes con sombra, padre carga al bebé, breve parada para nadar. Evita los viajes más largos de fiesta."),
  li("**Pases de día en clubes de playa en playas más tranquilas:** Un cambio de escenario sin estructura encajonada."),
  li("**Salto de resort para almorzar en una propiedad hermana:** Si tu resort tiene propiedades afiliadas con privilegios de pase de día, esto cuenta como una excursión a esta edad."),
  li("**Recorridos privados guiados:** Un recorrido escénico de 2 a 3 horas con una o dos paradas. El auto tiene aire acondicionado, el bebé duerme la siesta en la silla del auto, los padres ven algo nuevo."),
  h3("Qué Evitar"),
  para(
    "Viajes de día completo a Saona (demasiado largos), tours de buggy y quad (vibración, polvo, sin provisiones de seguridad para bebés), tirolesa (imposible a esta edad), parasailing (restricciones de edad y peso), montar a caballo (restricciones de edad), catamaranes de fiesta (música fuerte, mucha bebida, no es un ambiente para bebés). Cualquier cosa etiquetada como aventura está construida para niños mayores y adultos.",
  ),

  h2("Edades 3 a 5 (Preescolares)"),
  para(
    "Esta edad tiene personalidad y resistencia pero atención limitada. Quieren hacer cosas pero pierden interés rápidamente. Las mejores excursiones para esta edad tienen ráfagas cortas de actividad interrumpidas por bocadillos, paisajes o descanso.",
  ),
  h3("Qué Funciona"),
  li("**Catamarán de medio día con parada de snorkel:** Los niños pueden chapotear en la piscina natural, ver peces a través de una máscara, y estar de vuelta en el resort para la siesta. Aproximadamente 3 a 4 horas en total."),
  li("**Viajes de día a Isla Saona (con advertencias):** Funciona para niños resilientes de 4 y 5 años, especialmente si eliges la opción de catamarán (más espacio para moverse) sobre la opción de lancha rápida (paseo brusco). Estate preparado con bocadillos, protector solar, y disposición a irte temprano si es necesario."),
  li("**Día en club de playa de Cap Cana:** Una playa más bonita que la del resort, con comida, asoleadero con sombra y agua poco profunda para chapotear."),
  li("**Manatí Park o experiencias similares con animales:** Los niños a esta edad aman ver animales. Manatí Park cerca de Bávaro tiene delfines, loros, serpientes y un pequeño zoológico. Medio día funciona bien."),
  li("**Visitas culturales cortas a pueblos cercanos:** Una visita de 2 horas a Higüey para ver la basílica y probar comida local puede ser encantadora, pero solo si construyes en tiempo de patio de juegos u otros descansos relevantes para niños."),
  h3("Qué Evitar"),
  para(
    "Quads y buggies (todavía demasiado bruscos y el asiento no está diseñado para cuerpos pequeños), tirolesa en la mayoría de los operadores (restricciones de altura y edad), viajes largos de pesca, todos los botes de fiesta para adultos, cualquier cosa con caminata extenuante o caminar en terreno desigual por más de 30 minutos.",
  ),

  h2("Edades 6 a 9 (Edad Escolar Temprana)"),
  para(
    "Ahora las cosas se ponen interesantes. Los niños a esta edad pueden involucrarse significativamente con la mayoría de las excursiones familiares. Pueden nadar, escuchar instrucciones breves, mantener la atención durante varias horas, y recordar la experiencia claramente después. Este es el punto óptimo para muchas de las excursiones clásicas de Punta Cana.",
  ),
  h3("Qué Funciona"),
  li("**Viajes de día completo a Isla Saona:** Funciona bien para la mayoría de los niños de 6+. El paseo en bote, el tiempo en la playa, el almuerzo y la parada en la piscina natural dan variedad. Trae bocadillos para entre actividades."),
  li("**Snorkel en arrecifes tranquilos:** Con un equipo básico de snorkel del tamaño de los niños, esta edad puede genuinamente disfrutar ver peces. Varios operadores de Punta Cana realizan viajes específicos de snorkel con lugares poco profundos y tranquilos ideales para principiantes."),
  li("**Viajes de día a Isla Catalina:** Estructura similar a Saona pero con mejor snorkel a esta edad."),
  li("**Cenote Hoyo Azul en Scape Park:** Un espectacular cenote de agua dulce en un entorno selvático. A los niños les encanta. La caminata de entrada es corta y manejable."),
  li("**Tirolesa en operadores con calificación familiar:** Varios operadores tienen líneas con clasificación de edad y peso seguras para niños de 6+ dependiendo del tamaño. Confirma la configuración de seguridad antes de reservar."),
  li("**Montar a caballo (paseos tranquilos guiados):** Muchos operadores llevan niños desde los 6 o 7 años en paseos cortos y lentos. Un guía conduce el caballo y la experiencia es más paseo de poni que equitación seria."),
  li("**Pesca deportiva si el padre está interesado:** Un viaje de mahi-mahi de 4 horas funciona para niños comprometidos de 8 y 9 años. Trae bocadillos y entretenimiento para los tramos lentos."),
  h3("Qué Evitar"),
  para(
    "Quad/buggy todavía recibe una luz amarilla a esta edad — el paseo brusco y el polvo no son geniales, y algunos operadores tienen edades mínimas de 8 o 10. Los largos días de pesca en alta mar (8+ horas) suelen ser demasiado. La mayoría de las actividades de aventura comercializadas a adultos aún están por delante de esta edad.",
  ),

  h2("Edades 10 a 13 (Preadolescentes)"),
  para(
    "Los preadolescentes son maravillosos compañeros de excursión. Pueden hacer casi todo lo que un adulto puede, tienen resistencia para días completos, pueden nadar y hacer snorkel independientemente con supervisión, y son lo suficientemente mayores para realmente involucrarse con contenido cultural y natural. También son lo suficientemente mayores para desarrollar preferencias — algunos amarán las excursiones activas, otros quieren tiempo de playa y actividades relajadas. Pregunta qué quieren, no asumas.",
  ),
  h3("Qué Funciona"),
  li("**Tours de buggy y quad (con atención a la seguridad):** Ahora apropiado para la mayoría de los preadolescentes. Busca operadores con cascos, informes de seguridad apropiados, y rutas que no vayan por carreteras públicas. Un tour de 3 a 4 horas por el campo es memorable para esta edad."),
  li("**Experiencias de snorkel y buceo:** Los programas Discover Scuba aceptan niños desde los 10 años en la mayoría de los casos. Los arrecifes de Bayahibe y Catalina ofrecen excelentes inmersiones introductorias."),
  li("**Tirolesa y parques de aventura aérea:** Scape Park, Anamuya y operadores similares tienen tirolesas impresionantes que los preadolescentes disfrutan. La mayoría tiene pesos mínimos alrededor de 25 kg, fácilmente cumplidos a esta edad."),
  li("**Pesca en alta mar:** Un viaje de medio día de mahi-mahi o marlín es ahora una verdadera experiencia compartida. Los preadolescentes que no se marean a menudo lo aman."),
  li("**Tours de cenotes y cuevas:** El Hoyo Azul o la red de ríos subterráneos de Scape Park es genuinamente impresionante a esta edad."),
  li("**Bavaro Adventure Park y parques de aventura similares:** Múltiples actividades en una ubicación funcionan bien para preadolescentes con intereses variados en un grupo."),
  li("**Viajes de fiesta en catamarán durante el día:** Las versiones más tranquilas diurnas de tours en catamarán (algunos operadores ofrecen versiones con clasificación familiar) funcionan bien; evita las versiones de crucero alcohólico."),
  h3("Qué Vigilar"),
  para(
    "Exposición al sol y aplicación de protector solar — los preadolescentes a menudo se resisten a reaplicar protector solar y terminan quemados. Hidratación durante excursiones activas. Riesgo de mareo en viajes de pesca para niños que no lo han experimentado antes. Límites de teléfono/tableta durante la excursión — muchos preadolescentes recurren al tiempo de pantalla y se pierden la experiencia.",
  ),

  h2("Edades 14 a 17 (Adolescentes)"),
  para(
    "Los adolescentes pueden hacer todo lo que un adulto puede en una excursión de Punta Cana. La pregunta es si quieren hacerlo con su familia. La mayoría de los adolescentes pueden motivarse con actividades genuinamente interesantes (buceo, tirolesa, pesca deportiva, instrucción de vela) y desmotivarse con actividades comercializadas para niños más pequeños o rutinas de resort repetitivas. Pregunta su opinión; involúcralos en elegir.",
  ),
  h3("Qué Funciona"),
  li("**PADI Discover Scuba completo o incluso certificación Open Water:** Un adolescente que aprende a bucear en Punta Cana se lleva a casa una habilidad real. Los cursos de certificación de múltiples días funcionan para adolescentes mayores con tiempo de vacaciones."),
  li("**Lecciones de surf y kitesurf:** Cabarete (a unas 4 horas al norte) es uno de los mejores lugares de kite del mundo; más cerca de Punta Cana, Macao tiene surf decente con lecciones disponibles."),
  li("**Actividades de aventura a intensidad completa:** Tirolesas, rutas avanzadas de quad/buggy, combos de safari en playa en ATV."),
  li("**Pesca deportiva de marlín o mahi-mahi:** Los charters de día completo ahora dentro del rango para resistencia."),
  li("**Lecciones de vela o experiencias de vela alquiladas:** Algunos operadores ofrecen participación práctica que es genuinamente educativa."),
  li("**Días independientes de playa en playas no de resort:** Los clubes de playa en Cap Cana o Macao ofrecen cambio de escenario; los adolescentes mayores pueden tener más independencia."),
  li("**Clases de cocina o experiencias culturales:** Algunos resorts y vendedores externos ofrecen cocina dominicana, mixología o clases de merengue."),
  h3("Estrategias de Motivación"),
  para(
    "Enmarca las excursiones como opcionales en lugar de tiempo familiar obligatorio. Deja que el adolescente elija de un conjunto curado de opciones que les convengan. Evita programar tanto que no haya tiempo para que simplemente se relajen. Muchas vacaciones familiares a Punta Cana tienen éxito a esta edad cuando los adolescentes tienen uno o dos puntos culminantes de aventura real más generoso tiempo de playa y piscina en el resort.",
  ),

  h2("Consideraciones para Familias con Múltiples Edades"),
  para(
    "Las familias con niños de múltiples grupos de edad enfrentan el desafío de programación más difícil. El problema clásico: un niño de 4 años necesita siestas y actividades cortas, mientras que un niño de 12 años quiere tirolesa y snorkel. Algunas estrategias ayudan.",
  ),
  h3("Dividir la Familia"),
  para(
    "Un padre hace la excursión activa con el niño mayor mientras el otro padre tiene un día de playa y piscina con el niño más pequeño. Este es a menudo el camino de menor resistencia para viajes con diferencias significativas de edad. Planea una o dos excursiones por padre en lugar de una gran expedición familiar.",
  ),
  h3("Elegir Excursiones con Variedad"),
  para(
    "Los viajes de día a Isla Saona funcionan para amplios rangos de edad porque hay playa para los niños más pequeños, snorkel para los mayores, tiempo de bote, almuerzo — cosas diferentes para diferentes niños. Los viajes en catamarán con paradas de snorkel similarmente acomodan un rango.",
  ),
  h3("Excursiones Privadas"),
  para(
    "Si el presupuesto lo permite, una excursión privada (solo tu familia, guía y vehículo dedicados) te permite personalizar para tu grupo específico. ¿El niño más pequeño colapsa? Puedes regresar temprano. ¿El niño mayor quiere más snorkel? Puedes extender. La flexibilidad del grupo cuesta más pero elimina mucha fricción.",
  ),

  h2("Consejos Prácticos Que Aplican a Cada Edad"),
  li("**Trae bocadillos** — incluso en excursiones \"comida incluida\", los horarios de bocadillos rara vez coinciden con el hambre del niño."),
  li("**Trae botellas de agua** — recargables, cada persona recibe una etiquetada."),
  li("**Protector solar antes de salir** — reaplica en cada transición (bote a playa, playa a almuerzo)."),
  li("**Planifica el baño** — sabe dónde está en el bote, en el club de playa, en el área de buggy."),
  li("**Efectivo para propinas** — billetes pequeños para guías, conductores, tripulación."),
  li("**Teléfono con fotos de alergias en español** — útil si un niño tiene alergias alimentarias y no eres fluido."),
  li("**Ropa de respaldo** en una bolsa seca para viajes en bote."),

  h2("Cómo Reservar Excursiones Amigables para Niños"),
  para(
    "Dónde reservas importa tanto como qué excursión eliges. El mismo viaje puede ser una gran experiencia o una estresante dependiendo de cómo el operador maneja a las familias. Algunos principios ahorran problemas.",
  ),
  h3("Evita a los Vendedores de Playa"),
  para(
    "Las personas que venden excursiones desde la playa o la terraza de la piscina en los resorts a menudo cotizan precios significativamente por debajo de la tarifa legítima del operador, pero el viaje que realmente recibes puede variar ampliamente. A veces está bien; a veces el bote está sobrecargado, falta el equipo de seguridad, se omite el almuerzo, el horario de regreso es dos horas más tarde de lo prometido. La relación riesgo-recompensa para familias específicamente no vale los ahorros. Reserva a través del conserje de tu hotel, el sitio web de un operador establecido, o un agente de viajes conocido.",
  ),
  h3("Lee Reseñas Recientes de Familias"),
  para(
    "Al investigar, filtra las reseñas a aquellas que mencionan niños. Un viaje calificado con 4.5 estrellas en general aún podría ser terrible para familias si el revisor promedio es una pareja de 30 años. Busca específicamente lo que dicen las familias sobre el tiempo, la paciencia de la tripulación con los niños, el acceso al baño, las opciones de comida para comensales quisquillosos, y si el operador permitió flexibilidad (regresar temprano, ajustar planes). Este es el predictor más confiable de si el viaje funcionará para tu grupo.",
  ),
  h3("Confirma Edades y Restricciones Antes de Reservar"),
  para(
    "Las edades mínimas varían según la actividad y el operador. La misma actividad en dos operadores diferentes puede tener diferentes cortes de edad (uno permite 6, otro requiere 10). Confirma antes de pagar cualquier depósito. También confirma el precio de niños — la mayoría de los operadores de buena reputación cobran significativamente menos por niños menores de 12 años, pero tienes que preguntar.",
  ),
  h3("Pregunta Sobre el Tamaño del Grupo"),
  para(
    "Un catamarán con 12 huéspedes es una experiencia muy diferente de uno con 60. Para familias con niños pequeños, los grupos más pequeños significan más atención de la tripulación, más espacio para moverse, menos estrés. El tamaño del grupo importa más que el tamaño del barco; pregunta cuál será el conteo real de pasajeros en tu fecha específica.",
  ),

  h2("Preocupaciones Comunes de Excursión para Familias"),
  h3("Mareo por Movimiento"),
  para(
    "Algunos niños son propensos al mareo; otros no. Si no sabes, haz una salida de prueba corta (un paseo en bote de 30 minutos en la marina del resort) antes de comprometerte con un viaje de 4 horas en aguas abiertas. Los preventivos efectivos incluyen dimenhidrinato para niños (Dramamine para Niños, dosificado por peso), caramelos de jengibre y muñequeras de acupresión. La versión no médica: posiciona al niño en el medio del bote donde hay menos movimiento, mira al horizonte no al bote, y evita comidas pesadas antes de navegar. Los botes con cabinas y sombra son más fáciles para los niños propensos al mareo que las lanchas rápidas abiertas.",
  ),
  h3("Acceso al Baño"),
  para(
    "Los catamaranes y los botes más grandes tienen baños marinos básicos que funcionan pero no siempre están impecables. Las lanchas rápidas a menudo no tienen baño en absoluto — para un paseo en lancha rápida de 90 minutos a Saona, planifica en consecuencia. En las islas de destino, existen baños públicos pero varían en calidad. Para niños en etapas tardías de entrenamiento del baño, una pequeña bacinica portátil o ropa interior tipo pull-up para días de bote reduce significativamente el estrés. Las paradas de snorkel son un buen momento para alentar un descanso al baño.",
  ),
  h3("Sol y Calor"),
  para(
    "El sol caribeño al mediodía es intenso. En excursiones, los niños obtienen más exposición de la que obtienen en el resort porque hay menos sombra, más reflexión del agua, y tiempo continuo más largo afuera. Sombrero con correa de barbilla, camisa de natación UV, protector solar mineral reaplicado en cada transición, botella de agua, y una pequeña toalla o sombrilla de sombra todos ayudan. Vigila los primeros signos de agotamiento por calor en niños más pequeños: cansancio inusual, irritabilidad, rechazo de comida. Si ves estos, lleva al niño a la sombra y agua fría inmediatamente.",
  ),

  h2("Reflexiones Finales"),
  para(
    "Elegir la excursión correcta a la edad correcta es una de las decisiones de mayor apalancamiento en los viajes familiares. Un viaje bien emparejado se convierte en un recuerdo central; uno mal emparejado se convierte en \"esa vez que deberíamos habernos quedado en el resort.\" Usa esta guía como punto de partida, considera la resistencia e intereses específicos de tu hijo, y no sobreprograms.",
  ),
  para(
    "Si te gustaría ayuda para combinar excursiones con tu configuración familiar específica, [[contáctanos|https://puntacana-excursions.com/contact]] con las edades de tus hijos, las fechas de tu viaje y lo que tu grupo generalmente disfruta. Hacemos esto todos los días con familias de todo el mundo y podemos recomendar viajes que sabemos funcionan, no solo viajes que existen.",
  ),
];

const kidsAgeBodyDe = [
  para(
    "Den richtigen Ausflug für das Alter Ihres Kindes auszuwählen, ist der Unterschied zwischen einer Erinnerung, von der sie jahrelang sprechen werden, und einem heißen, langweiligen, tränenreichen Nachmittag. Punta Cana bietet Dutzende von Ausflügen, aber das Marketing lässt die meisten familienfreundlich klingen, obwohl nur einige es tatsächlich sind. Dieser Leitfaden schlüsselt auf, welche Reisen in welchem Alter funktionieren, was zu erwarten ist und welche bis die Kinder älter sind zu überspringen sind. Er ist aus echter Erfahrung mit Hunderten von Familien geschrieben.",
  ),
  para(
    "Wenn Sie spezifische Empfehlungen basierend auf den Altersgruppen und Persönlichkeiten Ihrer Kinder möchten, [[kontaktieren Sie unser Team|https://puntacana-excursions.com/contact]] — wir koordinieren ständig Familienreisen und wissen, welche Ausflüge tatsächlich für welche Altersgruppen liefern.",
  ),

  h2("Wie Man über die Auswahl von Kinder-Ausflügen Nachdenkt"),
  para(
    "Drei Faktoren sind wichtiger als die Ausflugsbeschreibung: Dauer, strukturelle Flexibilität und körperliche Anforderungen. Eine zweistündige Katamaranfahrt ist anders als ein achtstündiger Saona-Insel-Tag. Eine Reise, die Sie verlassen können, wenn das Kind zusammenbricht, ist anders als eine, an die Sie gebunden sind. Eine Aktivität, die erfordert, dass das Kind eine Stunde lang läuft, ist anders als eine, bei der es in einem Boot sitzt. Die meisten Familienreise-Katastrophen kommen davon, einen dieser drei zu unterschätzen.",
  ),
  para(
    "Der andere große Faktor ist Ihr spezifisches Kind. Manche 4-Jährige bewältigen einen ganzen Tag Strandreise wunderbar; andere würden mit zwei Stunden strukturierter Aktivität im Alter von 6 Jahren kämpfen. Sie kennen Ihr Kind besser als jeder Leitfaden. Verwenden Sie die unten stehenden Altersgruppen als allgemeine Ausgangspunkte und passen Sie sich dann an, basierend auf dem, was Sie über die Ausdauer, sensorischen Bedürfnisse und Komfort Ihres spezifischen Kindes mit neuen Umgebungen wissen.",
  ),

  h2("Alter 0 bis 2 (Babys und Jungkinder)"),
  para(
    "Ausflüge in diesem Alter dienen dazu, den Eltern Abwechslung zu verschaffen, nicht dem Baby Unterhaltung zu bieten. Das Baby wird schlafen, sich umsehen, essen, getragen werden und meistens tun, was es im Resort tun würde, nur woanders. Das Ziel ist kurz, ruhig und einfach abzubrechen.",
  ),
  h3("Was Funktioniert"),
  li("**Kurze Katamaranfahrten (2 bis 3 Stunden):** Ruhige See, schattige Boote, Elternteil hält Baby, kurzer Schwimmstopp. Vermeiden Sie die längeren Party-Boot-Fahrten."),
  li("**Beach-Club-Tagespässe an ruhigeren Stränden:** Ein Tapetenwechsel ohne festgelegte Struktur."),
  li("**Resort-Hopping zum Mittagessen an einer Schwesteranlage:** Wenn Ihr Resort verbundene Anlagen mit Tagespass-Privilegien hat, zählt das in diesem Alter als Ausflug."),
  li("**Private geführte Fahrten:** Eine 2- bis 3-stündige Panoramafahrt mit ein oder zwei Stopps. Das Auto ist klimatisiert, das Baby schläft im Autositz, die Eltern sehen etwas Neues."),
  h3("Was zu Vermeiden Ist"),
  para(
    "Ganztägige Saona-Touren (zu lang), Buggy- und Quad-Touren (Vibrationen, Staub, keine Sicherheitsvorkehrungen für Säuglinge), Zipline (in diesem Alter unmöglich), Parasailing (Alters- und Gewichtsbeschränkungen), Reiten (Altersbeschränkungen), Party-Katamarane (laute Musik, viel Trinken, kein Baby-Umfeld). Alles, was als Abenteuer beworben wird, ist für ältere Kinder und Erwachsene gebaut.",
  ),

  h2("Alter 3 bis 5 (Vorschulkinder)"),
  para(
    "Dieses Alter hat Persönlichkeit und Ausdauer, aber begrenzte Aufmerksamkeitsspanne. Sie wollen Dinge tun, verlieren aber schnell das Interesse. Die besten Ausflüge für dieses Alter haben kurze Aktivitätsschübe, unterbrochen von Snacks, Landschaft oder Ruhe.",
  ),
  h3("Was Funktioniert"),
  li("**Halbtägiger Katamaran mit Schnorchel-Stopp:** Kinder können im natürlichen Pool planschen, Fische durch eine Maske sehen und für den Mittagsschlaf zurück im Resort sein. Insgesamt etwa 3 bis 4 Stunden."),
  li("**Tagesausflüge zur Saona-Insel (mit Vorbehalten):** Funktioniert für widerstandsfähige 4- und 5-Jährige, besonders wenn Sie die Katamaran-Option (mehr Bewegungsraum) gegenüber der Schnellboot-Option (ruckartige Fahrt) wählen. Seien Sie vorbereitet mit Snacks, Sonnencreme und der Bereitschaft, bei Bedarf früh zu gehen."),
  li("**Cap Cana Beach Club Tag:** Ein schönerer Strand als der des Resorts, mit Essen, schattigem Liegen und seichtem Wasser zum Planschen."),
  li("**Manatí Park oder ähnliche Tiererlebnisse:** Kinder in diesem Alter lieben es, Tiere zu sehen. Manatí Park bei Bávaro hat Delfine, Papageien, Schlangen und einen kleinen Zoo. Ein halber Tag funktioniert gut."),
  li("**Kurze Kulturbesuche in nahe gelegenen Städten:** Ein 2-stündiger Besuch in Higüey, um die Basilika zu sehen und lokales Essen zu probieren, kann reizvoll sein, aber nur, wenn Sie Spielplatzzeit oder andere kinderrelevante Pausen einbauen."),
  h3("Was zu Vermeiden Ist"),
  para(
    "Quad-Bikes und Buggies (noch zu rau und die Sitze sind nicht für kleine Körper ausgelegt), Zipline bei den meisten Anbietern (Höhen- und Altersbeschränkungen), lange Angelausflüge, alle Erwachsenen-Party-Boote, alles mit anstrengendem Wandern oder Gehen auf unebenem Boden für mehr als 30 Minuten.",
  ),

  h2("Alter 6 bis 9 (Frühes Schulalter)"),
  para(
    "Jetzt wird es interessant. Kinder in diesem Alter können sich sinnvoll mit den meisten Familienausflügen beschäftigen. Sie können schwimmen, kurzen Anweisungen folgen, mehrere Stunden lang Aufmerksamkeit halten und sich danach klar an die Erfahrung erinnern. Dies ist der Sweet Spot für viele der klassischen Punta-Cana-Ausflüge.",
  ),
  h3("Was Funktioniert"),
  li("**Ganztägige Saona-Insel-Reisen:** Funktioniert gut für die meisten 6+ Kinder. Die Bootsfahrt, Strandzeit, das Mittagessen und der Stopp am Naturpool bieten Abwechslung. Bringen Sie Snacks für zwischen den Aktivitäten mit."),
  li("**Schnorcheln an ruhigen Riffen:** Mit einem grundlegenden, kinderlichen Schnorchel-Set kann dieses Alter genuin Spaß daran haben, Fische zu sehen. Mehrere Punta-Cana-Anbieter führen schnorchel-spezifische Touren mit flachen, ruhigen Stellen, die ideal für Anfänger sind."),
  li("**Tagesausflüge zur Catalina-Insel:** Ähnliche Struktur wie Saona, aber mit besserem Schnorcheln in diesem Alter."),
  li("**Hoyo Azul Cenote im Scape Park:** Ein spektakulärer Süßwasser-Cenote in einer Dschungel-Umgebung. Kinder lieben es. Die Wanderung dorthin ist kurz und überschaubar."),
  li("**Zipline bei familienorientierten Anbietern:** Mehrere Anbieter haben alters- und gewichtsbewertete Linien, die für Kinder ab 6 Jahren sicher sind, je nach Größe. Bestätigen Sie das Sicherheits-Setup vor der Buchung."),
  li("**Reiten (ruhige, geführte Trail-Rides):** Viele Anbieter nehmen Kinder ab 6 oder 7 Jahren auf kurze, langsame Trail-Rides mit. Ein Führer führt das Pferd und die Erfahrung ist mehr Ponyreiten als ernsthaftes Reiten."),
  li("**Sportfischen, wenn die Eltern Lust haben:** Eine 4-stündige Mahi-Mahi-Tour funktioniert für engagierte 8- und 9-Jährige. Bringen Sie Snacks und Unterhaltung für langsame Phasen mit."),
  h3("Was zu Vermeiden Ist"),
  para(
    "Quad/Buggy bekommt in diesem Alter immer noch ein gelbes Licht — die raue Fahrt und der Staub sind nicht großartig, und einige Anbieter haben Mindestalter von 8 oder 10. Lange Hochsee-Angeltage (8+ Stunden) sind in der Regel zu viel. Die meisten Abenteueraktivitäten, die an Erwachsene vermarktet werden, liegen noch vor diesem Alter.",
  ),

  h2("Alter 10 bis 13 (Tweens)"),
  para(
    "Tweens sind wunderbare Ausflugspartner. Sie können fast alles tun, was ein Erwachsener kann, sie haben Ausdauer für ganze Tage, sie können unter Aufsicht selbstständig schwimmen und schnorcheln, und sie sind alt genug, um sich tatsächlich mit kulturellem und natürlichem Inhalt zu beschäftigen. Sie sind auch alt genug, um Vorlieben zu entwickeln — manche werden aktive Ausflüge lieben, andere wollen Strandzeit und entspannte Aktivitäten. Fragen Sie, was sie wollen, nehmen Sie nichts an.",
  ),
  h3("Was Funktioniert"),
  li("**Buggy- und Quad-Bike-Touren (mit Sicherheitsfokus):** Jetzt für die meisten Tweens geeignet. Suchen Sie Anbieter mit Helmen, richtigen Sicherheitsbriefings und Routen, die nicht auf öffentlichen Straßen verlaufen. Eine 3- bis 4-stündige Tour durch das Land ist in diesem Alter unvergesslich."),
  li("**Schnorchel- und Taucherlebnisse:** Discover-Scuba-Programme akzeptieren in den meisten Fällen Kinder ab 10 Jahren. Die Riffe von Bayahibe und Catalina bieten ausgezeichnete Einsteigertauchgänge."),
  li("**Zipline und Hochseilgärten:** Scape Park, Anamuya und ähnliche Anbieter haben beeindruckende Ziplines, die Tweens genießen. Die meisten haben Mindestgewichte um 25 kg, die in diesem Alter leicht erreicht werden."),
  li("**Hochseefischen:** Eine halbtägige Mahi-Mahi- oder Marlin-Tour ist jetzt eine echte gemeinsame Erfahrung. Tweens, die nicht seekrank werden, lieben es oft."),
  li("**Cenote- und Höhlen-Touren:** Hoyo Azul oder das unterirdische Flussnetzwerk von Scape Park ist in diesem Alter wirklich beeindruckend."),
  li("**Bavaro Adventure Park und ähnliche Abenteuerparks:** Mehrere Aktivitäten an einem Ort funktionieren gut für Tweens mit unterschiedlichen Interessen in einer Gruppe."),
  li("**Tagsüber Katamaran-Partyfahrten:** Ruhigere Tagesversionen von Katamaran-Touren (einige Anbieter bieten familienbewertete Versionen) funktionieren gut; vermeiden Sie die Booze-Cruise-Versionen."),
  h3("Worauf zu Achten"),
  para(
    "Sonneneinstrahlung und Sonnencreme-Auftragung — Tweens widersetzen sich oft dem Wiederauftragen von Sonnencreme und enden verbrannt. Hydratation während aktiver Ausflüge. Seekrankheitsrisiko auf Angelausflügen für Kinder, die das noch nicht erlebt haben. Telefon-/Tablet-Grenzen während des Ausflugs — viele Tweens greifen standardmäßig zu Bildschirmzeit und verpassen das Erlebnis.",
  ),

  h2("Alter 14 bis 17 (Teenager)"),
  para(
    "Teenager können bei einem Punta-Cana-Ausflug alles tun, was ein Erwachsener kann. Die Frage ist, ob sie es mit ihrer Familie tun wollen. Die meisten Teenager können durch wirklich interessante Aktivitäten (Tauchen, Zipline, Sportfischen, Segelunterricht) motiviert werden und durch Aktivitäten demotiviert werden, die an jüngere Kinder vermarktet werden oder durch sich wiederholende Resort-Routinen. Fragen Sie nach ihrer Meinung; beziehen Sie sie in die Auswahl ein.",
  ),
  h3("Was Funktioniert"),
  li("**Voll PADI Discover Scuba oder sogar Open Water Zertifizierung:** Ein Teenager, der in Punta Cana tauchen lernt, nimmt eine echte Fähigkeit mit nach Hause. Mehrtägige Zertifizierungskurse funktionieren für ältere Teenager mit Urlaubszeit."),
  li("**Surf- und Kitesurf-Unterricht:** Cabarete (etwa 4 Stunden nördlich) ist einer der besten Kite-Spots der Welt; näher an Punta Cana hat Macao anständigen Surf mit verfügbarem Unterricht."),
  li("**Abenteueraktivitäten mit voller Intensität:** Ziplines, fortgeschrittene Quad-/Buggy-Routen, ATV-Strand-Safari-Kombinationen."),
  li("**Sportfischen auf Marlin oder Mahi-Mahi:** Ganztägige Charter sind jetzt in Reichweite für Ausdauer."),
  li("**Segelunterricht oder gecharterte Segelerfahrungen:** Einige Anbieter bieten praktische Beteiligung, die wirklich lehrreich ist."),
  li("**Unabhängige Strandtage an Nicht-Resort-Stränden:** Beach Clubs in Cap Cana oder Macao bieten Tapetenwechsel; älteren Teenagern kann mehr Unabhängigkeit gewährt werden."),
  li("**Kochkurse oder kulturelle Erfahrungen:** Einige Resorts und externe Anbieter bieten dominikanisches Kochen, Mixologie- oder Merengue-Kurse an."),
  h3("Motivationsstrategien"),
  para(
    "Rahmen Sie Ausflüge als freiwillig statt als verpflichtende Familienzeit ein. Lassen Sie den Teenager aus einer kuratierten Reihe von Optionen wählen, die ihnen passen. Vermeiden Sie es, so viel zu planen, dass keine Zeit für sie bleibt, einfach zu entspannen. Viele Familienurlaube in Punta Cana sind in diesem Alter erfolgreich, wenn Teenager ein oder zwei echte Abenteuer-Höhepunkte plus großzügige Strand- und Poolzeit im Resort haben.",
  ),

  h2("Überlegungen für Familien mit Mehreren Altersgruppen"),
  para(
    "Familien mit Kindern, die mehrere Altersgruppen umfassen, stehen vor der schwierigsten Planungs-Herausforderung. Das klassische Problem: Ein 4-Jähriger braucht Nickerchen und kurze Aktivitäten, während ein 12-Jähriger Zipline und Schnorcheln möchte. Einige Strategien helfen.",
  ),
  h3("Die Familie Teilen"),
  para(
    "Ein Elternteil macht den aktiven Ausflug mit dem älteren Kind, während der andere Elternteil einen Strand- und Pool-Tag mit dem jüngeren Kind hat. Dies ist oft der Weg des geringsten Widerstands für Reisen mit signifikanten Altersspreizungen. Planen Sie ein oder zwei Ausflüge pro Elternteil statt einer großen Familienexpedition.",
  ),
  h3("Ausflüge mit Vielfalt Wählen"),
  para(
    "Saona-Insel-Tagesausflüge funktionieren für breite Altersgruppen, weil es Strand für die jüngeren Kinder, Schnorcheln für die älteren, Bootszeit, Mittagessen gibt — verschiedene Dinge für verschiedene Kinder. Katamaranfahrten mit Schnorchelstopps ähnlich passen einer Bandbreite.",
  ),
  h3("Private Ausflüge"),
  para(
    "Wenn das Budget es erlaubt, lässt Sie ein privater Ausflug (nur Ihre Familie, dedizierter Führer und Fahrzeug) für Ihre spezifische Gruppe anpassen. Jüngeres Kind bricht zusammen? Sie können früh zurückkehren. Älteres Kind möchte mehr Schnorcheln? Sie können verlängern. Die Gruppenflexibilität kostet mehr, beseitigt aber viel Reibung.",
  ),

  h2("Praktische Tipps, die für Jedes Alter Gelten"),
  li("**Bringen Sie Snacks** — selbst auf Ausflügen mit \"Essen inklusive\" passt das Snack-Timing selten zum Hunger des Kindes."),
  li("**Bringen Sie Wasserflaschen** — nachfüllbar, jede Person bekommt eine etikettierte."),
  li("**Sonnencreme bevor Sie gehen** — bei jedem Übergang erneut auftragen (Boot zu Strand, Strand zu Mittagessen)."),
  li("**Planen Sie die Toilette** — wissen Sie, wo sie auf dem Boot, im Beach Club, im Buggy-Bereich ist."),
  li("**Bargeld für Trinkgelder** — kleine Scheine für Führer, Fahrer, Besatzung."),
  li("**Telefon mit Fotos von Allergien auf Spanisch** — nützlich, wenn ein Kind Nahrungsmittelallergien hat und Sie nicht fließend sind."),
  li("**Backup-Kleidung** in einer trockenen Tasche für Bootsfahrten."),

  h2("Wie Man Kinderfreundliche Ausflüge Bucht"),
  para(
    "Wo Sie buchen, ist genauso wichtig wie welchen Ausflug Sie wählen. Die gleiche Reise kann je nach Umgang des Betreibers mit Familien eine großartige Erfahrung oder eine stressige sein. Einige Prinzipien sparen Ärger.",
  ),
  h3("Überspringen Sie die Strandverkäufer"),
  para(
    "Menschen, die Ausflüge vom Strand oder Pool-Deck an Resorts verkaufen, zitieren oft Preise deutlich unter dem legitimen Betreibertarif, aber die Reise, die Sie tatsächlich erhalten, kann stark variieren. Manchmal ist es in Ordnung; manchmal ist das Boot überfüllt, die Sicherheitsausrüstung fehlt, das Mittagessen wird übersprungen, die Rückkehrzeit ist zwei Stunden später als versprochen. Das Risiko-Belohnungs-Verhältnis für Familien speziell ist die Einsparungen nicht wert. Buchen Sie über den Concierge Ihres Hotels, die Website eines etablierten Betreibers oder ein bekanntes Reisebüro.",
  ),
  h3("Lesen Sie Aktuelle Familien-Bewertungen"),
  para(
    "Beim Recherchieren filtern Sie die Bewertungen nach denen, die Kinder erwähnen. Eine Reise, die insgesamt mit 4,5 Sternen bewertet wurde, könnte für Familien immer noch schrecklich sein, wenn der durchschnittliche Rezensent ein 30-jähriges Paar ist. Achten Sie speziell auf das, was Familien über Timing, Geduld der Besatzung mit Kindern, Toilettenzugang, Essensoptionen für wählerische Esser sagen, und ob der Betreiber Flexibilität erlaubte (früher zurückkehren, Pläne anpassen). Dies ist der zuverlässigste Prädiktor, ob die Reise für Ihre Gruppe funktioniert.",
  ),
  h3("Bestätigen Sie Alter und Einschränkungen Vor dem Buchen"),
  para(
    "Mindestalter variieren je nach Aktivität und Betreiber. Die gleiche Aktivität bei zwei verschiedenen Betreibern kann unterschiedliche Altersgrenzen haben (einer erlaubt 6, ein anderer erfordert 10). Bestätigen Sie vor der Zahlung einer Anzahlung. Bestätigen Sie auch die Kinderpreise — die meisten seriösen Betreiber berechnen deutlich weniger für Kinder unter 12, aber Sie müssen fragen.",
  ),
  h3("Fragen Sie Nach der Gruppengröße"),
  para(
    "Ein Katamaran mit 12 Gästen ist eine ganz andere Erfahrung als einer mit 60. Für Familien mit kleinen Kindern bedeuten kleinere Gruppen mehr Aufmerksamkeit von der Besatzung, mehr Bewegungsraum, weniger Stress. Die Gruppengröße ist wichtiger als die Schiffsgröße; fragen Sie, wie viele Passagiere tatsächlich an Ihrem spezifischen Datum sein werden.",
  ),

  h2("Häufige Ausflugsbedenken für Familien"),
  h3("Bewegungskrankheit"),
  para(
    "Manche Kinder sind anfällig für Seekrankheit; andere nicht. Wenn Sie es nicht wissen, machen Sie einen kurzen Testausflug (eine 30-minütige Bootsfahrt im Resort-Hafen), bevor Sie sich auf eine 4-stündige Fahrt auf offener See festlegen. Wirksame Präventionen umfassen Dimenhydrinat für Kinder (Dramamine für Kinder, dosiert nach Gewicht), Ingwerbonbons und Akupressur-Armbänder. Die nicht-medizinische Version: Positionieren Sie das Kind in der Mitte des Bootes, wo weniger Bewegung ist, schauen Sie auf den Horizont und nicht auf das Boot, und vermeiden Sie schwere Mahlzeiten vor dem Segeln. Boote mit Kabinen und Schatten sind für anfällige Kinder einfacher als offene Schnellboote.",
  ),
  h3("Toilettenzugang"),
  para(
    "Katamarane und größere Boote haben einfache Marine-Toiletten, die funktionieren, aber nicht immer makellos sind. Schnellboote haben oft gar keine Toilette — für eine 90-minütige Schnellbootfahrt nach Saona planen Sie entsprechend. An den Zielinseln gibt es öffentliche Toiletten, aber die Qualität variiert. Für Kinder in späten Toilettentraining-Stadien reduziert ein kleiner tragbarer Topf oder Pull-up-Unterwäsche für Bootstage den Stress erheblich. Schnorchelstopps sind ein guter Moment, um eine Toilettenpause zu fördern.",
  ),
  h3("Sonne und Hitze"),
  para(
    "Die karibische Mittagssonne ist intensiv. Auf Ausflügen bekommen Kinder mehr Sonneneinstrahlung als im Resort, weil es weniger Schatten gibt, mehr Reflexion vom Wasser, und längere kontinuierliche Zeit draußen. Hut mit Kinnriemen, UV-Badehemd, mineralische Sonnencreme bei jedem Übergang erneut aufgetragen, Wasserflasche und ein kleines Schattentuch oder Schirm helfen alle. Achten Sie auf die frühen Anzeichen von Hitzeerschöpfung bei jüngeren Kindern: ungewöhnliche Müdigkeit, Reizbarkeit, Essen verweigern. Wenn Sie diese sehen, bringen Sie das Kind sofort in den Schatten und kühles Wasser.",
  ),

  h2("Abschließende Gedanken"),
  para(
    "Den richtigen Ausflug im richtigen Alter zu wählen, ist eine der hebelreichsten Entscheidungen im Familienreise. Eine gut abgestimmte Reise wird zu einer Kernerinnerung; eine nicht abgestimmte wird zu \"diesem Mal, als wir im Resort hätten bleiben sollen.\" Verwenden Sie diesen Leitfaden als Ausgangspunkt, berücksichtigen Sie die spezifische Ausdauer und Interessen Ihres Kindes, und planen Sie nicht zu viel.",
  ),
  para(
    "Wenn Sie Hilfe bei der Anpassung von Ausflügen an Ihre spezifische Familienkonfiguration möchten, [[kontaktieren Sie uns|https://puntacana-excursions.com/contact]] mit den Altersgruppen Ihrer Kinder, den Daten Ihrer Reise, und was Ihre Gruppe im Allgemeinen genießt. Wir tun dies jeden Tag mit Familien aus der ganzen Welt und können Reisen empfehlen, von denen wir wissen, dass sie funktionieren, nicht nur Reisen, die existieren. Eine 20-Minuten-Beratung im Voraus erspart Ihnen oft Stunden an späterer Reue.",
  ),
];

// ===========================================================================
// ARTICLE 3 — Multi-Generation Family Trip to Punta Cana (EN, ES, IT)
// ===========================================================================

const multigenBodyEn = [
  para(
    "A multi-generation family trip — grandparents, parents, and kids all on one vacation — is one of the most rewarding ways to travel and also one of the easiest to overcomplicate. Three generations have three different sets of needs, three different daily rhythms, and three different ideas of what a great day looks like. Punta Cana is actually one of the better Caribbean destinations for this kind of trip because the all-inclusive infrastructure absorbs a lot of the friction. But there are real considerations specific to traveling with older parents, parents-in-law, and kids of various ages all at once.",
  ),
  para(
    "This guide is built around what we've seen actually work — and what doesn't — for the multi-gen families we host every season. If you'd like help coordinating a trip with mixed ages and varying mobility, [[contact our team|https://puntacana-excursions.com/contact]] — we plan these constantly and can suggest specific resorts, room configurations, and excursions that handle the complexity gracefully.",
  ),

  h2("Why Punta Cana Works for Multi-Generation Trips"),
  para(
    "The fundamental advantage of Punta Cana for this kind of trip is the all-inclusive format. Everyone eats whatever they want without the daily debate about restaurants, prices, or dietary constraints. The grandparents who eat early can have dinner at 5:30 PM at the buffet while parents and teenagers eat at 8:00 PM at the a la carte. The kids who reject everything except chicken nuggets one day and demand sushi the next can both be satisfied without anyone paying separately. The bill is settled.",
  ),
  para(
    "The second advantage is geographic compactness. The resort grounds are typically large enough for variety (multiple restaurants, several pools, a beach, a spa, kids' clubs, evening shows) but small enough that everyone can find each other when needed. Compare this to a European city trip where the multi-gen group has to negotiate transit, restaurants, and tickets every single day, and you see why Caribbean all-inclusives have become the default for this kind of vacation.",
  ),
  para(
    "The third advantage is the climate-to-effort ratio. Punta Cana rewards low-effort enjoyment more than most destinations. A grandparent who can no longer hike the streets of Rome can absolutely enjoy a shaded beach chair, a slow swim, and an early dinner — and still feel like they're having a real vacation experience.",
  ),

  h2("Choosing the Right Resort for Multi-Generation Groups"),
  para(
    "Not every Punta Cana resort handles mixed-age groups equally well. The features that matter:",
  ),
  h3("Room Configurations"),
  para(
    "The single biggest decision is how to split rooms. The options:",
  ),
  li("**Connecting rooms:** Two standard rooms with a connecting door. Grandparents in one, parents and kids in the other. Works well for groups of 4 to 6. Verify the connecting door availability with the specific resort, not just \"some rooms have this.\""),
  li("**Family suites:** A larger suite with a separate sleeping area for kids. Works for nuclear families with grandparents in a separate room nearby."),
  li("**Multi-bedroom villas:** Some resorts (Karisma's El Dorado, Excellence Punta Cana, some Cap Cana properties) offer 2-bedroom and 3-bedroom villas. Best for groups of 7 to 10 who want shared living space with private bedrooms."),
  li("**Adjacent regular rooms:** Two or three rooms on the same floor near each other. Works for groups that genuinely want their own private space but proximity for coordination."),
  para(
    "The right configuration depends on group dynamics. Some grandparents want their own room with quiet evenings; others want to be in the same suite as the grandkids to share the experience. Ask before you book.",
  ),
  h3("Mobility Considerations"),
  para(
    "Resort grounds in Punta Cana are typically large — walks of 5 to 15 minutes between the room, the beach, the lobby restaurant, and other amenities are normal. For grandparents with limited mobility this becomes a real issue. Features that help:",
  ),
  li("**Elevator access** to all guest floors (not just stairs)"),
  li("**Room located near the lobby or main beach** so daily walks are short"),
  li("**Golf cart shuttles or beach buggies** that move guests around the property — verify they actually run regularly, not just \"on request\""),
  li("**Wheelchair-accessible rooms** if needed (book early; quantities are limited)"),
  li("**Buffet restaurants on or near the lobby level** so the longer walks aren't combined with mealtime"),
  para(
    "If a grandparent uses a walker, wheelchair, or has a cardiac condition that limits exertion, the resort choice matters enormously. Some properties are sprawling and beautiful but punishing for limited mobility; others are more compact and easier to navigate. Smaller boutique resorts are sometimes more practical than the largest five-star sprawls.",
  ),
  h3("Pool and Beach Setup"),
  para(
    "Look for resorts with both calm-water beaches and pools with shallow zones. Multi-gen groups often want to be near each other while doing different things — grandma wants a shaded lounger, parents want to swim, kids want a kiddie splash area. A property where all of this is in one zone is much easier than one where the family ends up scattered across three separate pools.",
  ),

  h2("Pre-Trip Planning"),
  h3("The Health Conversation"),
  para(
    "Have an honest conversation about medical considerations before you book. This isn't always easy, especially with older parents who might minimize their own limitations, but it's necessary. Questions worth asking:",
  ),
  li("Are there activities that aren't realistic this trip? Better to know in advance than learn at the catamaran dock."),
  li("Are medications easy to refrigerate, refill, or travel with? Some require special handling."),
  li("Is there a pre-existing condition that travel insurance needs to know about?"),
  li("Are vaccinations up to date — including any boosters that might be timely?"),
  li("Does the older traveler have their cardiologist's, primary doctor's, and emergency contact numbers easily accessible?"),
  para(
    "These conversations make trips smoother. Hospiten Bávaro is a high-quality private hospital but you don't want to use it because nobody thought to bring a cardiac medication list.",
  ),
  h3("Documentation and Insurance"),
  para(
    "Travel insurance for older travelers is more expensive and the fine print matters more. Pre-existing condition coverage, emergency medical evacuation, and trip cancellation are all worth thinking about specifically. The cheap policies that work fine for healthy 30-year-olds may exclude exactly the scenarios most relevant to a 75-year-old grandparent. Spend the extra and read the policy.",
  ),
  para(
    "Passports for everyone, valid for 6+ months past travel dates. For grandparents who don't travel often, double-check the passport now — renewals can take 4 to 8 weeks. Consent letters for kids traveling without both biological parents may be needed depending on circumstances; this is worth confirming with your airline weeks before the flight, not at the check-in counter.",
  ),
  h3("Pace Expectations"),
  para(
    "The classic multi-gen trip mistake is the over-scheduled week — a different big excursion every day, dinners at different restaurants, packed activities. This works for active families with everyone in similar shape and rhythm. For mixed groups it usually fails. A more realistic structure: one or two real excursion days, a half-day local activity or two, plenty of \"resort days\" where people do their own thing and reconvene for dinner.",
  ),

  h2("Activities That Work for Multi-Generation Groups"),
  h3("Catamaran Trips"),
  para(
    "A half-day catamaran with a snorkel stop and a beach time is genuinely accessible across generations. Grandparents can stay in shade on the boat, take a gentle swim or skip the swimming entirely. Kids can splash in the natural pool. Parents can do everything. The boat is the constant — the conversation happens, the photos get taken, the day is shared even when individual activities differ. Choose smaller, family-oriented catamaran operators rather than the large party-boat operations."),
  h3("Saona Island Day Trips"),
  para(
    "Saona works for some multi-gen groups and is too much for others. The positives: stunning beaches, lots of variety, lunch included, a long-shared day. The negatives: the boat ride can be rough on the way back (afternoon seas are choppier), the day is long (8+ hours total), and the beach is hot and exposed. If grandparents have stamina and the boat doesn't bother them, this can be the highlight of the trip. If they're frail or prone to seasickness, skip it."),
  h3("Cultural Day Trips"),
  para(
    "A guided visit to Higüey to see the Basilica of Our Lady of Altagracia, a tour of a sugar cane mill, a lunch at a Dominican family restaurant — these work beautifully across ages. The pace is moderate, the content is genuinely interesting, the day isn't physically demanding. For groups with grandparents who appreciate cultural depth and kids old enough to engage, cultural day trips are often the standout moments of a multi-gen vacation."),
  h3("Beach Club Day Passes"),
  para(
    "A day at a more upscale beach club (Cap Cana, Juanillo Beach) is a change of scenery without the structure of a formal excursion. Lunch is on site, the beach is calmer than central Bávaro, and everyone can do what they want at their own pace. Easier than the resort but easier than an excursion."),
  h3("On-Resort Bonding Activities"),
  para(
    "Don't underestimate the value of low-effort time together. A pool float race, an evening at the theater show, a long buffet dinner with extended family, a games night at the resort lounge — these aren't Instagram-worthy but they're often what people remember years later. Build space for them.",
  ),

  h2("Splitting Up vs. Together"),
  para(
    "One of the most useful concepts for multi-gen travel: not every activity needs everyone. The most successful trips usually balance group time with sub-group time. Some structures that work:",
  ),
  h3("Parents and Older Kids Do an Adventure Day"),
  para(
    "While grandparents have a quieter day at the resort with younger grandchildren, the parents and teenagers do a zipline park, a quad tour, or a longer snorkeling trip. Everyone has the day they actually want. Reunite for dinner with stories to share. This is often the highest-satisfaction structure for groups with active parents and grandparents who appreciate quiet time."),
  h3("Grandparents and Grandkids Have a Special Day"),
  para(
    "While parents have a date day (an adults-only beach club, a spa day, a romantic lunch), grandparents have a day with the grandkids — pool time, ice cream, a short beach walk, evening show together. This is often the most cherished memory for the grandkids years later, and parents come back refreshed."),
  h3("Multi-Generation Excursions"),
  para(
    "Reserve one or two excursions where everyone goes together — catamaran day, a cultural trip, Saona if appropriate. These are the photo moments and the shared stories. Don't try to make every day this; one or two is the sweet spot.",
  ),

  h2("Common Multi-Gen Trip Problems and How to Avoid Them"),
  h3("Conflict Over Pace"),
  para(
    "The active members of the group want to do more; the slower-paced members feel pressured. Solution: design the trip with explicit \"slow days\" built in, not as a backup but as the norm. Make resort days the default, with excursions as add-ons rather than the structure."),
  h3("Disagreement Over Money"),
  para(
    "Multi-gen groups need to clarify before the trip who pays for what. Common arrangements: each family unit pays its own room and excursions; grandparents treat the whole group; everyone splits major expenses. There's no right answer, but clarity prevents resentment. Decide at booking time who's paying for what, and document it in writing if needed."),
  h3("Different Childcare Expectations"),
  para(
    "Grandparents who want to spend time with the grandkids and parents who want a break can work together — but only with explicit expectations. Set up specific times: \"Grandma and grandpa have the kids from 4 PM to 7 PM on Tuesday so we can have dinner.\" Don't assume grandparents want unlimited grandkid time; they may want it some days and rest other days. Talk about it."),
  h3("Forced Together Time"),
  para(
    "Don't put the group in scenarios where they're together all day every day with no break. Even the closest families need some separation. Build in independent time as a feature, not a failure."),

  h2("Practical Logistics"),
  h3("Airport Transfers"),
  para(
    "Coordinate arrival times if possible — having everyone arrive on the same day or close together makes the first day simpler. If arrivals are staggered over multiple days, plan for who's at the resort to greet whom. For groups of 6 or more, a private transfer van is often more comfortable than separate taxis and isn't significantly more expensive once you factor in the group size."),
  h3("Resort Check-In"),
  para(
    "If the group is large, designate one person to handle the group check-in — preferably someone who's calm with paperwork. Bring all confirmation emails, passports, and any pre-paid receipts. Group check-ins are slower than individual ones; expect 30 to 60 minutes."),
  h3("Meal Coordination"),
  para(
    "All-inclusives have multiple restaurants and dining times. For groups, agree the night before on the next day's dinner plan: which restaurant, what time, who's in. Last-minute coordination at 7 PM with a hungry toddler and a tired grandparent never goes well. Resort a la carte restaurants often require reservations, sometimes days in advance — handle this at check-in."),
  h3("Photos and Memories"),
  para(
    "Multi-gen trips create lasting memories specifically because they document a moment in time when this configuration of people was together. Take the photos. Print one or two as a gift for the grandparents after the trip. Ten years later, this is what people remember.",
  ),

  h2("Special Occasions and Restaurant Strategy"),
  para(
    "Many multi-generation trips are organized around a milestone — a 70th birthday, a 50th anniversary, a graduation, or simply a once-in-a-decade gathering. The trip itself is the celebration, but specific moments within it carry more weight than others. Plan for them deliberately rather than hoping they happen.",
  ),
  h3("The Special Dinner"),
  para(
    "Most resort à la carte restaurants can accommodate a private table for 8 to 16 if requested at check-in or a day in advance. For a milestone night, this is worth arranging. The resort may also coordinate a cake, a song from the staff, or a small decoration if you mention the occasion when booking. The cost is usually minimal or included; the moment is what people remember. Steakhouse, Italian, and seafood restaurants tend to handle large family groups better than the smaller specialty venues like teppanyaki or sushi, which often have limited seating per table.",
  ),
  h3("Family Photos"),
  para(
    "Beach photo sessions at sunset are widely available — most resorts have an in-house photographer, and independent photographers can be hired through the concierge for 200 to 500 USD depending on length and edits. Book this for an early-trip evening rather than the last night, so weather rescheduling is possible. A 45-minute session yields enough images for everyone to have something to print. For larger groups (10+), confirm the photographer is comfortable directing big family compositions, not just couples.",
  ),
  h3("The Quiet Toast"),
  para(
    "Not every meaningful moment needs a production. A morning coffee with the grandparents on the terrace, an afternoon hour where the whole group sits on the beach together watching the kids, an evening drink at the lobby bar before the kids' bedtime — these understated moments often carry more emotional weight than the big planned event. Resist the urge to over-engineer every moment. Some of the best memories happen when nothing was planned at all.",
  ),

  h2("Final Thoughts"),
  para(
    "Multi-generation trips to Punta Cana work when you design for the slowest pace, build in independent time, choose a resort that accommodates mobility and varied interests, and don't try to do everything together. The all-inclusive infrastructure makes the basics easy; thoughtful choices about rooms, excursions, and time structure make the trip excellent.",
  ),
  para(
    "If you're planning a multi-gen trip and want help with resort selection, room configuration, accessibility considerations, or excursion choices that work across generations, [[contact us|https://puntacana-excursions.com/contact]] with your group composition and dates. We've handled these trips with families ranging from 4 people to 25, and we can tell you what's worked for groups like yours.",
  ),
];

const multigenBodyEs = [
  para(
    "Un viaje familiar multigeneracional — abuelos, padres e hijos todos en unas mismas vacaciones — es una de las formas más gratificantes de viajar y también una de las más fáciles de complicar en exceso. Tres generaciones tienen tres conjuntos diferentes de necesidades, tres ritmos diarios diferentes y tres ideas diferentes de cómo se ve un gran día. Punta Cana es en realidad uno de los mejores destinos del Caribe para este tipo de viaje porque la infraestructura todo-incluido absorbe mucha de la fricción. Pero hay consideraciones reales específicas para viajar con padres mayores, suegros y niños de varias edades todos a la vez.",
  ),
  para(
    "Esta guía está construida en torno a lo que hemos visto que realmente funciona — y lo que no — para las familias multigeneracionales que recibimos cada temporada. Si te gustaría ayuda para coordinar un viaje con edades mixtas y movilidad variada, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] — planificamos estos constantemente y podemos sugerir resorts específicos, configuraciones de habitaciones y excursiones que manejan la complejidad con gracia.",
  ),

  h2("Por Qué Punta Cana Funciona para Viajes Multigeneracionales"),
  para(
    "La ventaja fundamental de Punta Cana para este tipo de viaje es el formato todo-incluido. Todos comen lo que quieren sin el debate diario sobre restaurantes, precios o restricciones dietéticas. Los abuelos que comen temprano pueden cenar a las 5:30 PM en el buffet mientras los padres y adolescentes comen a las 8:00 PM en el a la carta. Los niños que rechazan todo excepto los nuggets de pollo un día y exigen sushi al siguiente pueden ser ambos satisfechos sin que nadie pague por separado. La cuenta está saldada.",
  ),
  para(
    "La segunda ventaja es la compacidad geográfica. Los terrenos del resort son típicamente lo suficientemente grandes para variedad (múltiples restaurantes, varias piscinas, una playa, un spa, clubes infantiles, espectáculos nocturnos) pero lo suficientemente pequeños para que todos puedan encontrarse cuando sea necesario. Compara esto con un viaje a una ciudad europea donde el grupo multigeneracional tiene que negociar tránsito, restaurantes y boletos cada día, y verás por qué los todo-incluido caribeños se han convertido en el predeterminado para este tipo de vacaciones.",
  ),
  para(
    "La tercera ventaja es la relación clima-esfuerzo. Punta Cana recompensa el disfrute de bajo esfuerzo más que la mayoría de los destinos. Un abuelo que ya no puede caminar por las calles de Roma puede disfrutar absolutamente de una silla de playa con sombra, un nado lento y una cena temprana — y aún sentir que está teniendo una verdadera experiencia de vacaciones.",
  ),

  h2("Eligiendo el Resort Correcto para Grupos Multigeneracionales"),
  para(
    "No todos los resorts de Punta Cana manejan grupos de edades mixtas igualmente bien. Las características que importan:",
  ),
  h3("Configuraciones de Habitación"),
  para(
    "La decisión más importante es cómo dividir las habitaciones. Las opciones:",
  ),
  li("**Habitaciones conectadas:** Dos habitaciones estándar con una puerta conectora. Abuelos en una, padres e hijos en la otra. Funciona bien para grupos de 4 a 6. Verifica la disponibilidad de la puerta conectora con el resort específico, no solo \"algunas habitaciones tienen esto.\""),
  li("**Suites familiares:** Una suite más grande con un área de dormir separada para niños. Funciona para familias nucleares con abuelos en una habitación separada cercana."),
  li("**Villas de múltiples dormitorios:** Algunos resorts (El Dorado de Karisma, Excellence Punta Cana, algunas propiedades de Cap Cana) ofrecen villas de 2 y 3 dormitorios. Mejor para grupos de 7 a 10 que quieren espacio de vida compartido con dormitorios privados."),
  li("**Habitaciones regulares adyacentes:** Dos o tres habitaciones en el mismo piso cerca una de la otra. Funciona para grupos que genuinamente quieren su propio espacio privado pero proximidad para la coordinación."),
  para(
    "La configuración correcta depende de la dinámica del grupo. Algunos abuelos quieren su propia habitación con noches tranquilas; otros quieren estar en la misma suite que los nietos para compartir la experiencia. Pregunta antes de reservar.",
  ),
  h3("Consideraciones de Movilidad"),
  para(
    "Los terrenos del resort en Punta Cana son típicamente grandes — caminatas de 5 a 15 minutos entre la habitación, la playa, el restaurante del lobby y otras amenidades son normales. Para abuelos con movilidad limitada esto se convierte en un problema real. Características que ayudan:",
  ),
  li("**Acceso al ascensor** a todos los pisos de huéspedes (no solo escaleras)"),
  li("**Habitación ubicada cerca del lobby o la playa principal** para que las caminatas diarias sean cortas"),
  li("**Lanzaderas de carritos de golf o buggies de playa** que mueven a los huéspedes por la propiedad — verifica que realmente funcionen regularmente, no solo \"bajo petición\""),
  li("**Habitaciones accesibles para sillas de ruedas** si es necesario (reserva temprano; las cantidades son limitadas)"),
  li("**Restaurantes buffet en o cerca del nivel del lobby** para que las caminatas más largas no se combinen con la hora de comer"),
  para(
    "Si un abuelo usa andador, silla de ruedas, o tiene una condición cardíaca que limita el esfuerzo, la elección del resort importa enormemente. Algunas propiedades son extensas y hermosas pero castigadoras para movilidad limitada; otras son más compactas y más fáciles de navegar. Los resorts boutique más pequeños son a veces más prácticos que los más grandes de cinco estrellas extendidos.",
  ),
  h3("Configuración de Piscina y Playa"),
  para(
    "Busca resorts con playas de aguas tranquilas y piscinas con zonas poco profundas. Los grupos multigeneracionales a menudo quieren estar cerca uno del otro mientras hacen cosas diferentes — la abuela quiere una hamaca con sombra, los padres quieren nadar, los niños quieren un área de chapoteo infantil. Una propiedad donde todo esto está en una zona es mucho más fácil que una donde la familia termina dispersa en tres piscinas separadas.",
  ),

  h2("Planificación Pre-Viaje"),
  h3("La Conversación de Salud"),
  para(
    "Ten una conversación honesta sobre las consideraciones médicas antes de reservar. Esto no siempre es fácil, especialmente con padres mayores que podrían minimizar sus propias limitaciones, pero es necesario. Preguntas que vale la pena hacer:",
  ),
  li("¿Hay actividades que no son realistas para este viaje? Mejor saber por adelantado que aprender en el muelle del catamarán."),
  li("¿Los medicamentos son fáciles de refrigerar, rellenar o viajar con ellos? Algunos requieren manejo especial."),
  li("¿Hay una condición preexistente que el seguro de viaje necesita saber?"),
  li("¿Están las vacunas al día — incluyendo cualquier refuerzo que pueda ser oportuno?"),
  li("¿El viajero mayor tiene los números de su cardiólogo, médico de atención primaria y contactos de emergencia fácilmente accesibles?"),
  para(
    "Estas conversaciones hacen que los viajes sean más fluidos. Hospiten Bávaro es un hospital privado de alta calidad pero no quieres usarlo porque nadie pensó en traer una lista de medicamentos cardíacos.",
  ),
  h3("Documentación y Seguro"),
  para(
    "El seguro de viaje para viajeros mayores es más caro y la letra pequeña importa más. La cobertura de condiciones preexistentes, la evacuación médica de emergencia y la cancelación de viaje son todas dignas de pensar específicamente. Las pólizas baratas que funcionan bien para personas saludables de 30 años pueden excluir exactamente los escenarios más relevantes para un abuelo de 75 años. Gasta el extra y lee la póliza.",
  ),
  para(
    "Pasaportes para todos, válidos por 6+ meses después de las fechas de viaje. Para abuelos que no viajan a menudo, vuelve a verificar el pasaporte ahora — las renovaciones pueden tomar de 4 a 8 semanas. Las cartas de consentimiento para niños que viajan sin ambos padres biológicos pueden ser necesarias dependiendo de las circunstancias; esto vale la pena confirmar con tu aerolínea semanas antes del vuelo, no en el mostrador de check-in.",
  ),
  h3("Expectativas de Ritmo"),
  para(
    "El error clásico del viaje multigeneracional es la semana sobrecargada — una gran excursión diferente cada día, cenas en restaurantes diferentes, actividades empacadas. Esto funciona para familias activas con todos en forma y ritmo similar. Para grupos mixtos generalmente falla. Una estructura más realista: uno o dos días reales de excursión, una actividad local de medio día o dos, muchos \"días de resort\" donde la gente hace lo suyo y se reúne para la cena.",
  ),

  h2("Actividades Que Funcionan para Grupos Multigeneracionales"),
  h3("Viajes en Catamarán"),
  para(
    "Un catamarán de medio día con una parada de snorkel y tiempo de playa es genuinamente accesible a través de generaciones. Los abuelos pueden quedarse en la sombra en el bote, tomar un nado suave o saltarse la natación por completo. Los niños pueden chapotear en la piscina natural. Los padres pueden hacer todo. El bote es la constante — la conversación sucede, las fotos se toman, el día se comparte incluso cuando las actividades individuales difieren. Elige operadores de catamarán más pequeños y orientados a la familia en lugar de las grandes operaciones de bote de fiesta.",
  ),
  h3("Viajes de Día a Isla Saona"),
  para(
    "Saona funciona para algunos grupos multigeneracionales y es demasiado para otros. Los positivos: playas impresionantes, mucha variedad, almuerzo incluido, un día largo compartido. Los negativos: el viaje en bote puede ser duro en el camino de regreso (los mares de la tarde son más agitados), el día es largo (8+ horas en total), y la playa es caliente y expuesta. Si los abuelos tienen resistencia y el bote no les molesta, esto puede ser el punto culminante del viaje. Si son frágiles o propensos al mareo, sáltalo.",
  ),
  h3("Viajes Culturales de Día"),
  para(
    "Una visita guiada a Higüey para ver la Basílica de Nuestra Señora de Altagracia, un tour de un ingenio de caña de azúcar, un almuerzo en un restaurante familiar dominicano — estos funcionan hermosamente a través de las edades. El ritmo es moderado, el contenido es genuinamente interesante, el día no es físicamente exigente. Para grupos con abuelos que aprecian la profundidad cultural y niños lo suficientemente mayores para involucrarse, los viajes culturales de día son a menudo los momentos destacados de unas vacaciones multigeneracionales.",
  ),
  h3("Pases de Día en Clubes de Playa"),
  para(
    "Un día en un club de playa más elegante (Cap Cana, Playa Juanillo) es un cambio de escenario sin la estructura de una excursión formal. El almuerzo es en el lugar, la playa es más tranquila que el centro de Bávaro, y todos pueden hacer lo que quieran a su propio ritmo. Más fácil que el resort pero más fácil que una excursión.",
  ),
  h3("Actividades de Vinculación en el Resort"),
  para(
    "No subestimes el valor del tiempo de bajo esfuerzo juntos. Una carrera de flotadores de piscina, una noche en el espectáculo del teatro, una larga cena de buffet con familia extendida, una noche de juegos en el salón del resort — estos no son dignos de Instagram pero son a menudo lo que la gente recuerda años después. Construye espacio para ellos.",
  ),

  h2("Separarse vs. Juntos"),
  para(
    "Uno de los conceptos más útiles para el viaje multigeneracional: no toda actividad necesita a todos. Los viajes más exitosos generalmente equilibran el tiempo grupal con el tiempo de subgrupo. Algunas estructuras que funcionan:",
  ),
  h3("Padres y Niños Mayores Hacen un Día de Aventura"),
  para(
    "Mientras los abuelos tienen un día más tranquilo en el resort con los nietos más jóvenes, los padres y los adolescentes hacen un parque de tirolesa, un tour de quad, o un viaje de snorkel más largo. Todos tienen el día que realmente quieren. Reúnete para la cena con historias para compartir. Esta es a menudo la estructura de mayor satisfacción para grupos con padres activos y abuelos que aprecian el tiempo tranquilo.",
  ),
  h3("Abuelos y Nietos Tienen un Día Especial"),
  para(
    "Mientras los padres tienen un día de cita (un club de playa solo para adultos, un día de spa, un almuerzo romántico), los abuelos tienen un día con los nietos — tiempo de piscina, helado, una corta caminata por la playa, espectáculo nocturno juntos. Este es a menudo el recuerdo más apreciado para los nietos años después, y los padres regresan refrescados.",
  ),
  h3("Excursiones Multigeneracionales"),
  para(
    "Reserva una o dos excursiones donde todos vayan juntos — día de catamarán, un viaje cultural, Saona si es apropiado. Estos son los momentos de fotos y las historias compartidas. No intentes hacer cada día así; uno o dos es el punto óptimo.",
  ),

  h2("Problemas Comunes de Viajes Multigeneracionales y Cómo Evitarlos"),
  h3("Conflicto Sobre el Ritmo"),
  para(
    "Los miembros activos del grupo quieren hacer más; los miembros de ritmo más lento se sienten presionados. Solución: diseña el viaje con \"días lentos\" explícitos construidos, no como respaldo sino como la norma. Haz que los días de resort sean el predeterminado, con excursiones como complementos en lugar de la estructura.",
  ),
  h3("Desacuerdo Sobre el Dinero"),
  para(
    "Los grupos multigeneracionales necesitan aclarar antes del viaje quién paga qué. Arreglos comunes: cada unidad familiar paga su propia habitación y excursiones; los abuelos invitan a todo el grupo; todos dividen los gastos mayores. No hay respuesta correcta, pero la claridad previene el resentimiento. Decide al momento de reservar quién paga qué, y documéntalo por escrito si es necesario.",
  ),
  h3("Diferentes Expectativas de Cuidado de Niños"),
  para(
    "Los abuelos que quieren pasar tiempo con los nietos y los padres que quieren un descanso pueden trabajar juntos — pero solo con expectativas explícitas. Establece momentos específicos: \"La abuela y el abuelo tienen a los niños desde las 4 PM hasta las 7 PM el martes para que podamos cenar.\" No asumas que los abuelos quieren tiempo ilimitado con los nietos; pueden quererlo algunos días y descansar otros días. Habla de ello.",
  ),
  h3("Tiempo Junto Forzado"),
  para(
    "No pongas al grupo en escenarios donde están juntos todo el día todos los días sin descanso. Incluso las familias más unidas necesitan algo de separación. Construye en tiempo independiente como una característica, no un fracaso.",
  ),

  h2("Logística Práctica"),
  h3("Traslados al Aeropuerto"),
  para(
    "Coordina los horarios de llegada si es posible — tener a todos llegando el mismo día o cerca uno del otro hace el primer día más simple. Si las llegadas están escalonadas durante múltiples días, planifica quién está en el resort para recibir a quién. Para grupos de 6 o más, una camioneta privada de traslado es a menudo más cómoda que taxis separados y no es significativamente más cara una vez que factorizas el tamaño del grupo.",
  ),
  h3("Check-In del Resort"),
  para(
    "Si el grupo es grande, designa a una persona para manejar el check-in del grupo — preferiblemente alguien que sea tranquilo con el papeleo. Trae todos los correos electrónicos de confirmación, pasaportes, y cualquier recibo prepagado. Los check-ins de grupo son más lentos que los individuales; espera de 30 a 60 minutos.",
  ),
  h3("Coordinación de Comidas"),
  para(
    "Los todo-incluido tienen múltiples restaurantes y horarios de comida. Para grupos, acuerda la noche anterior sobre el plan de cena del día siguiente: qué restaurante, a qué hora, quién está adentro. La coordinación de último minuto a las 7 PM con un niño hambriento y un abuelo cansado nunca va bien. Los restaurantes a la carta del resort a menudo requieren reservaciones, a veces con días de anticipación — maneja esto en el check-in.",
  ),
  h3("Fotos y Recuerdos"),
  para(
    "Los viajes multigeneracionales crean recuerdos duraderos específicamente porque documentan un momento en el tiempo cuando esta configuración de personas estaba junta. Toma las fotos. Imprime una o dos como regalo para los abuelos después del viaje. Diez años después, esto es lo que la gente recuerda.",
  ),

  h2("Ocasiones Especiales y Estrategia de Restaurante"),
  para(
    "Muchos viajes multigeneracionales se organizan alrededor de un hito — un cumpleaños de 70, un aniversario de 50, una graduación, o simplemente una reunión única en una década. El viaje en sí es la celebración, pero momentos específicos dentro de él tienen más peso que otros. Planifica para ellos deliberadamente en lugar de esperar que sucedan.",
  ),
  h3("La Cena Especial"),
  para(
    "La mayoría de los restaurantes a la carta del resort pueden acomodar una mesa privada para 8 a 16 si se solicita en el check-in o con un día de anticipación. Para una noche de hito, esto vale la pena arreglar. El resort también puede coordinar un pastel, una canción del personal, o una pequeña decoración si mencionas la ocasión al reservar. El costo suele ser mínimo o incluido; el momento es lo que la gente recuerda. Los restaurantes de carnes, italianos y de mariscos tienden a manejar grandes grupos familiares mejor que los lugares de especialidad más pequeños como el teppanyaki o el sushi, que a menudo tienen asientos limitados por mesa.",
  ),
  h3("Fotos Familiares"),
  para(
    "Las sesiones de fotos en la playa al atardecer están ampliamente disponibles — la mayoría de los resorts tienen un fotógrafo interno, y los fotógrafos independientes pueden ser contratados a través del conserje por 200 a 500 USD dependiendo de la duración y las ediciones. Reserva esto para una noche temprana del viaje en lugar de la última noche, para que sea posible reprogramar por el clima. Una sesión de 45 minutos produce suficientes imágenes para que todos tengan algo para imprimir. Para grupos más grandes (10+), confirma que el fotógrafo esté cómodo dirigiendo grandes composiciones familiares, no solo parejas.",
  ),
  h3("El Brindis Tranquilo"),
  para(
    "No todo momento significativo necesita una producción. Un café matutino con los abuelos en la terraza, una hora de la tarde donde todo el grupo se sienta en la playa juntos viendo a los niños, una bebida nocturna en el bar del lobby antes de la hora de dormir de los niños — estos momentos discretos a menudo cargan más peso emocional que el gran evento planeado. Resiste el impulso de sobre-ingeniería cada momento. Algunos de los mejores recuerdos suceden cuando nada estaba planeado en absoluto.",
  ),

  h2("Reflexiones Finales"),
  para(
    "Los viajes multigeneracionales a Punta Cana funcionan cuando diseñas para el ritmo más lento, construyes en tiempo independiente, eliges un resort que acomoda movilidad e intereses variados, y no intentas hacer todo juntos. La infraestructura todo-incluido hace los conceptos básicos fáciles; las decisiones reflexivas sobre habitaciones, excursiones y estructura de tiempo hacen el viaje excelente.",
  ),
  para(
    "Si estás planificando un viaje multigeneracional y quieres ayuda con la selección de resort, configuración de habitación, consideraciones de accesibilidad, o elecciones de excursión que funcionen a través de generaciones, [[contáctanos|https://puntacana-excursions.com/contact]] con la composición de tu grupo y fechas. Hemos manejado estos viajes con familias que van desde 4 personas hasta 25, y podemos decirte qué ha funcionado para grupos como el tuyo.",
  ),
];

const multigenBodyIt = [
  para(
    "Un viaggio familiare multigenerazionale — nonni, genitori e bambini tutti in una stessa vacanza — è uno dei modi più gratificanti di viaggiare e anche uno dei più facili da complicare eccessivamente. Tre generazioni hanno tre diversi insiemi di esigenze, tre ritmi quotidiani diversi e tre idee diverse su come dovrebbe apparire una bella giornata. Punta Cana è in realtà una delle migliori destinazioni dei Caraibi per questo tipo di viaggio perché l'infrastruttura all-inclusive assorbe gran parte dell'attrito. Ma ci sono considerazioni reali specifiche per viaggiare con genitori anziani, suoceri e bambini di varie età tutti insieme.",
  ),
  para(
    "Questa guida è costruita attorno a ciò che abbiamo visto funzionare davvero — e ciò che non funziona — per le famiglie multigenerazionali che ospitiamo ogni stagione. Se desideri aiuto per coordinare un viaggio con età miste e mobilità variabile, [[contatta il nostro team|https://puntacana-excursions.com/contact]] — pianifichiamo questi viaggi costantemente e possiamo suggerire resort specifici, configurazioni di camere ed escursioni che gestiscono la complessità con grazia.",
  ),

  h2("Perché Punta Cana Funziona per Viaggi Multigenerazionali"),
  para(
    "Il vantaggio fondamentale di Punta Cana per questo tipo di viaggio è il formato all-inclusive. Tutti mangiano ciò che vogliono senza il dibattito quotidiano sui ristoranti, prezzi o vincoli dietetici. I nonni che cenano presto possono cenare alle 17:30 al buffet mentre genitori e adolescenti mangiano alle 20:00 all'à la carte. I bambini che rifiutano tutto tranne i nuggets di pollo un giorno e chiedono sushi il successivo possono essere entrambi soddisfatti senza che nessuno paghi separatamente. Il conto è saldato.",
  ),
  para(
    "Il secondo vantaggio è la compattezza geografica. I terreni del resort sono tipicamente abbastanza grandi per la varietà (più ristoranti, diverse piscine, una spiaggia, una spa, club per bambini, spettacoli serali) ma abbastanza piccoli che tutti possono ritrovarsi quando necessario. Confronta questo con un viaggio in una città europea dove il gruppo multigenerazionale deve negoziare trasporti, ristoranti e biglietti ogni singolo giorno, e vedrai perché gli all-inclusive caraibici sono diventati la scelta predefinita per questo tipo di vacanza.",
  ),
  para(
    "Il terzo vantaggio è il rapporto clima-sforzo. Punta Cana premia il godimento a basso sforzo più della maggior parte delle destinazioni. Un nonno che non può più camminare per le strade di Roma può assolutamente godersi una sedia a sdraio ombreggiata, un nuoto lento e una cena anticipata — e sentirsi comunque come se stesse avendo una vera esperienza di vacanza.",
  ),

  h2("Scegliere il Resort Giusto per Gruppi Multigenerazionali"),
  para(
    "Non tutti i resort di Punta Cana gestiscono ugualmente bene i gruppi di età miste. Le caratteristiche che contano:",
  ),
  h3("Configurazioni delle Camere"),
  para(
    "La decisione più importante è come dividere le camere. Le opzioni:",
  ),
  li("**Camere comunicanti:** Due camere standard con una porta comunicante. Nonni in una, genitori e bambini nell'altra. Funziona bene per gruppi da 4 a 6. Verifica la disponibilità della porta comunicante con il resort specifico, non solo \"alcune camere hanno questo.\""),
  li("**Suite familiari:** Una suite più grande con un'area dormiente separata per i bambini. Funziona per famiglie nucleari con nonni in una camera separata vicina."),
  li("**Ville con più camere da letto:** Alcuni resort (El Dorado di Karisma, Excellence Punta Cana, alcune proprietà di Cap Cana) offrono ville da 2 e 3 camere. Migliori per gruppi da 7 a 10 che vogliono spazio abitativo condiviso con camere private."),
  li("**Camere regolari adiacenti:** Due o tre camere sullo stesso piano vicine l'una all'altra. Funziona per gruppi che vogliono genuinamente il proprio spazio privato ma la vicinanza per il coordinamento."),
  para(
    "La configurazione giusta dipende dalle dinamiche del gruppo. Alcuni nonni vogliono la propria camera con serate tranquille; altri vogliono essere nella stessa suite dei nipoti per condividere l'esperienza. Chiedi prima di prenotare.",
  ),
  h3("Considerazioni sulla Mobilità"),
  para(
    "I terreni dei resort a Punta Cana sono tipicamente grandi — camminate di 5-15 minuti tra la camera, la spiaggia, il ristorante della lobby e altri servizi sono normali. Per nonni con mobilità limitata questo diventa un vero problema. Caratteristiche che aiutano:",
  ),
  li("**Accesso con ascensore** a tutti i piani degli ospiti (non solo scale)"),
  li("**Camera situata vicino alla lobby o alla spiaggia principale** in modo che le camminate quotidiane siano brevi"),
  li("**Navette di golf cart o buggy da spiaggia** che spostano gli ospiti per la proprietà — verifica che funzionino regolarmente, non solo \"su richiesta\""),
  li("**Camere accessibili in sedia a rotelle** se necessario (prenota presto; le quantità sono limitate)"),
  li("**Ristoranti buffet al o vicino al livello della lobby** in modo che le camminate più lunghe non si combinino con l'ora dei pasti"),
  para(
    "Se un nonno usa un deambulatore, una sedia a rotelle, o ha una condizione cardiaca che limita lo sforzo, la scelta del resort conta enormemente. Alcune proprietà sono estese e belle ma punitive per la mobilità limitata; altre sono più compatte e più facili da navigare. I resort boutique più piccoli sono talvolta più pratici dei più grandi cinque stelle estesi.",
  ),
  h3("Configurazione Piscina e Spiaggia"),
  para(
    "Cerca resort con spiagge ad acqua calma e piscine con zone poco profonde. I gruppi multigenerazionali spesso vogliono essere vicini l'uno all'altro mentre fanno cose diverse — la nonna vuole una sdraio ombreggiata, i genitori vogliono nuotare, i bambini vogliono un'area per spruzzi per bambini. Una proprietà dove tutto questo è in una zona è molto più facile di una dove la famiglia finisce sparpagliata in tre piscine separate.",
  ),

  h2("Pianificazione Pre-Viaggio"),
  h3("La Conversazione sulla Salute"),
  para(
    "Fai una conversazione onesta sulle considerazioni mediche prima di prenotare. Questo non è sempre facile, specialmente con genitori anziani che potrebbero minimizzare le proprie limitazioni, ma è necessario. Domande da porre:",
  ),
  li("Ci sono attività che non sono realistiche per questo viaggio? Meglio saperlo in anticipo che impararlo al molo del catamarano."),
  li("I farmaci sono facili da refrigerare, ricaricare o portare in viaggio? Alcuni richiedono una gestione speciale."),
  li("C'è una condizione preesistente che l'assicurazione di viaggio deve sapere?"),
  li("Le vaccinazioni sono aggiornate — inclusi eventuali richiami che potrebbero essere tempestivi?"),
  li("Il viaggiatore anziano ha i numeri del cardiologo, del medico di base e dei contatti di emergenza facilmente accessibili?"),
  para(
    "Queste conversazioni rendono i viaggi più fluidi. Hospiten Bávaro è un ospedale privato di alta qualità ma non vuoi usarlo perché nessuno ha pensato di portare una lista di farmaci cardiaci.",
  ),
  h3("Documentazione e Assicurazione"),
  para(
    "L'assicurazione di viaggio per viaggiatori anziani è più costosa e i dettagli contano di più. La copertura delle condizioni preesistenti, l'evacuazione medica di emergenza e la cancellazione del viaggio meritano tutti di essere considerati specificamente. Le polizze economiche che funzionano bene per trentenni in salute possono escludere esattamente gli scenari più rilevanti per un nonno di 75 anni. Spendi l'extra e leggi la polizza.",
  ),
  para(
    "Passaporti per tutti, validi 6+ mesi oltre le date di viaggio. Per i nonni che non viaggiano spesso, ricontrolla il passaporto ora — i rinnovi possono richiedere 4-8 settimane. Le lettere di consenso per i bambini che viaggiano senza entrambi i genitori biologici possono essere necessarie a seconda delle circostanze; vale la pena confermare con la tua compagnia aerea settimane prima del volo, non al banco del check-in.",
  ),
  h3("Aspettative sul Ritmo"),
  para(
    "L'errore classico del viaggio multigenerazionale è la settimana sovra-programmata — una diversa grande escursione ogni giorno, cene in ristoranti diversi, attività zeppe. Questo funziona per famiglie attive con tutti in forma e ritmo simili. Per gruppi misti di solito fallisce. Una struttura più realistica: uno o due giorni di vera escursione, un'attività locale di mezza giornata o due, molti \"giorni di resort\" dove le persone fanno le proprie cose e si riuniscono per cena.",
  ),

  h2("Attività Che Funzionano per Gruppi Multigenerazionali"),
  h3("Gite in Catamarano"),
  para(
    "Un catamarano di mezza giornata con una fermata di snorkeling e un tempo in spiaggia è genuinamente accessibile attraverso le generazioni. I nonni possono restare all'ombra sulla barca, fare un nuoto gentile o saltare il nuoto completamente. I bambini possono spruzzare nella piscina naturale. I genitori possono fare tutto. La barca è la costante — la conversazione accade, le foto vengono scattate, la giornata è condivisa anche quando le attività individuali differiscono. Scegli operatori di catamarano più piccoli e orientati alla famiglia piuttosto che le grandi operazioni di barche da festa.",
  ),
  h3("Gite di un Giorno all'Isola Saona"),
  para(
    "Saona funziona per alcuni gruppi multigenerazionali ed è troppo per altri. I positivi: spiagge mozzafiato, molta varietà, pranzo incluso, una lunga giornata condivisa. I negativi: il viaggio in barca può essere duro al ritorno (il mare pomeridiano è più agitato), la giornata è lunga (8+ ore in totale), e la spiaggia è calda ed esposta. Se i nonni hanno resistenza e la barca non li disturba, questo può essere il momento clou del viaggio. Se sono fragili o inclini al mal di mare, saltalo.",
  ),
  h3("Gite Culturali di un Giorno"),
  para(
    "Una visita guidata a Higüey per vedere la Basilica di Nostra Signora di Altagracia, un tour di un mulino di canna da zucchero, un pranzo in un ristorante familiare dominicano — questi funzionano meravigliosamente attraverso le età. Il ritmo è moderato, il contenuto è genuinamente interessante, la giornata non è fisicamente impegnativa. Per gruppi con nonni che apprezzano la profondità culturale e bambini abbastanza grandi da impegnarsi, le gite culturali di un giorno sono spesso i momenti di spicco di una vacanza multigenerazionale.",
  ),
  h3("Pass Giornalieri per Beach Club"),
  para(
    "Una giornata in un beach club più elegante (Cap Cana, Playa Juanillo) è un cambio di scenario senza la struttura di un'escursione formale. Il pranzo è sul posto, la spiaggia è più tranquilla del centro di Bávaro, e tutti possono fare ciò che vogliono al proprio ritmo. Più facile del resort ma più facile di un'escursione.",
  ),
  h3("Attività di Legame nel Resort"),
  para(
    "Non sottovalutare il valore del tempo a basso sforzo insieme. Una corsa di galleggianti in piscina, una serata al teatro, una lunga cena buffet con famiglia allargata, una serata di giochi nel lounge del resort — questi non sono degni di Instagram ma sono spesso ciò che le persone ricordano anni dopo. Costruisci spazio per loro.",
  ),

  h2("Separarsi vs. Insieme"),
  para(
    "Uno dei concetti più utili per il viaggio multigenerazionale: non ogni attività ha bisogno di tutti. I viaggi più riusciti di solito bilanciano il tempo di gruppo con il tempo di sottogruppo. Alcune strutture che funzionano:",
  ),
  h3("Genitori e Figli Maggiori Fanno una Giornata di Avventura"),
  para(
    "Mentre i nonni hanno una giornata più tranquilla al resort con i nipoti più piccoli, i genitori e gli adolescenti fanno un parco di zipline, un tour in quad, o una gita di snorkeling più lunga. Tutti hanno la giornata che vogliono davvero. Ritrovatevi per cena con storie da condividere. Questa è spesso la struttura di massima soddisfazione per gruppi con genitori attivi e nonni che apprezzano il tempo tranquillo.",
  ),
  h3("Nonni e Nipoti Hanno una Giornata Speciale"),
  para(
    "Mentre i genitori hanno una giornata di appuntamento (un beach club solo per adulti, una giornata in spa, un pranzo romantico), i nonni hanno una giornata con i nipoti — tempo in piscina, gelato, una breve passeggiata in spiaggia, spettacolo serale insieme. Questo è spesso il ricordo più caro per i nipoti anni dopo, e i genitori tornano riposati.",
  ),
  h3("Escursioni Multigenerazionali"),
  para(
    "Riserva una o due escursioni in cui tutti vanno insieme — giornata in catamarano, una gita culturale, Saona se appropriato. Questi sono i momenti per le foto e le storie condivise. Non cercare di fare ogni giorno così; uno o due è il punto giusto.",
  ),

  h2("Problemi Comuni dei Viaggi Multigenerazionali e Come Evitarli"),
  h3("Conflitto sul Ritmo"),
  para(
    "I membri attivi del gruppo vogliono fare di più; i membri dal ritmo più lento si sentono pressati. Soluzione: progetta il viaggio con \"giorni lenti\" espliciti incorporati, non come riserva ma come norma. Rendi le giornate al resort il default, con le escursioni come aggiunte piuttosto che la struttura.",
  ),
  h3("Disaccordo sul Denaro"),
  para(
    "I gruppi multigenerazionali devono chiarire prima del viaggio chi paga cosa. Disposizioni comuni: ogni unità familiare paga la propria camera ed escursioni; i nonni offrono all'intero gruppo; tutti dividono le spese maggiori. Non c'è una risposta giusta, ma la chiarezza previene il risentimento. Decidi al momento della prenotazione chi paga cosa, e documentalo per iscritto se necessario.",
  ),
  h3("Diverse Aspettative sulla Cura dei Bambini"),
  para(
    "I nonni che vogliono passare tempo con i nipoti e i genitori che vogliono una pausa possono lavorare insieme — ma solo con aspettative esplicite. Stabilisci orari specifici: \"La nonna e il nonno hanno i bambini dalle 16:00 alle 19:00 di martedì così possiamo cenare.\" Non dare per scontato che i nonni vogliano tempo illimitato con i nipoti; potrebbero volerlo alcuni giorni e riposare altri giorni. Parlane.",
  ),
  h3("Tempo Insieme Forzato"),
  para(
    "Non mettere il gruppo in scenari in cui sono insieme tutto il giorno tutti i giorni senza pause. Anche le famiglie più unite hanno bisogno di un po' di separazione. Costruisci il tempo indipendente come una caratteristica, non un fallimento.",
  ),

  h2("Logistica Pratica"),
  h3("Trasferimenti dall'Aeroporto"),
  para(
    "Coordina gli orari di arrivo se possibile — avere tutti che arrivano lo stesso giorno o vicini rende il primo giorno più semplice. Se gli arrivi sono scaglionati su più giorni, pianifica chi è al resort per accogliere chi. Per gruppi di 6 o più, un furgone di trasferimento privato è spesso più comodo di taxi separati e non è significativamente più costoso una volta che fattorizzi la dimensione del gruppo.",
  ),
  h3("Check-In al Resort"),
  para(
    "Se il gruppo è grande, designa una persona per gestire il check-in del gruppo — preferibilmente qualcuno calmo con le pratiche burocratiche. Porta tutte le email di conferma, passaporti, e qualsiasi ricevuta prepagata. I check-in di gruppo sono più lenti di quelli individuali; aspettati 30-60 minuti.",
  ),
  h3("Coordinamento dei Pasti"),
  para(
    "Gli all-inclusive hanno più ristoranti e orari per i pasti. Per i gruppi, concorda la sera prima sul piano cena del giorno successivo: quale ristorante, a che ora, chi c'è. Il coordinamento dell'ultimo minuto alle 19:00 con un bambino affamato e un nonno stanco non va mai bene. I ristoranti à la carte del resort spesso richiedono prenotazioni, a volte con giorni di anticipo — gestisci questo al check-in.",
  ),
  h3("Foto e Ricordi"),
  para(
    "I viaggi multigenerazionali creano ricordi duraturi proprio perché documentano un momento nel tempo in cui questa configurazione di persone era insieme. Scatta le foto. Stampane una o due come regalo per i nonni dopo il viaggio. Dieci anni dopo, questo è ciò che le persone ricordano.",
  ),

  h2("Occasioni Speciali e Strategia del Ristorante"),
  para(
    "Molti viaggi multigenerazionali sono organizzati attorno a una pietra miliare — un 70° compleanno, un 50° anniversario, una laurea, o semplicemente un raduno una-volta-in-un-decennio. Il viaggio stesso è la celebrazione, ma momenti specifici al suo interno portano più peso di altri. Pianifica per loro deliberatamente piuttosto che sperare che accadano.",
  ),
  h3("La Cena Speciale"),
  para(
    "La maggior parte dei ristoranti à la carte del resort può accogliere un tavolo privato per 8-16 persone se richiesto al check-in o con un giorno di anticipo. Per una serata di pietra miliare, vale la pena organizzare questo. Il resort può anche coordinare una torta, una canzone dal personale, o una piccola decorazione se menzioni l'occasione al momento della prenotazione. Il costo è solitamente minimo o incluso; il momento è ciò che le persone ricordano. I ristoranti di bistecche, italiani e di pesce tendono a gestire grandi gruppi familiari meglio dei locali di specialità più piccoli come il teppanyaki o il sushi, che spesso hanno posti limitati per tavolo.",
  ),
  h3("Foto di Famiglia"),
  para(
    "Le sessioni fotografiche in spiaggia al tramonto sono ampiamente disponibili — la maggior parte dei resort ha un fotografo interno, e i fotografi indipendenti possono essere assunti tramite il concierge per 200-500 USD a seconda della durata e delle modifiche. Prenota questo per una serata all'inizio del viaggio piuttosto che l'ultima sera, in modo che sia possibile riprogrammare per il maltempo. Una sessione di 45 minuti produce abbastanza immagini perché tutti abbiano qualcosa da stampare. Per gruppi più grandi (10+), conferma che il fotografo sia a suo agio nel dirigere grandi composizioni familiari, non solo coppie.",
  ),
  h3("Il Brindisi Tranquillo"),
  para(
    "Non ogni momento significativo ha bisogno di una produzione. Un caffè mattutino con i nonni sulla terrazza, un'ora pomeridiana in cui tutto il gruppo si siede in spiaggia insieme a guardare i bambini, un drink serale al bar della lobby prima dell'ora di coricarsi dei bambini — questi momenti sottovalutati spesso portano più peso emotivo del grande evento pianificato. Resisti all'impulso di sovra-ingegnerizzare ogni momento. Alcuni dei migliori ricordi accadono quando nulla era pianificato affatto.",
  ),

  h2("Riflessioni Finali"),
  para(
    "I viaggi multigenerazionali a Punta Cana funzionano quando progetti per il ritmo più lento, costruisci tempo indipendente, scegli un resort che accoglie mobilità e interessi vari, e non cerchi di fare tutto insieme. L'infrastruttura all-inclusive rende facili le basi; scelte ponderate su camere, escursioni e struttura del tempo rendono il viaggio eccellente.",
  ),
  para(
    "Se stai pianificando un viaggio multigenerazionale e vuoi aiuto con la selezione del resort, la configurazione delle camere, le considerazioni sull'accessibilità, o le scelte di escursioni che funzionano attraverso le generazioni, [[contattaci|https://puntacana-excursions.com/contact]] con la composizione del tuo gruppo e le date. Abbiamo gestito questi viaggi con famiglie che vanno da 4 a 25 persone, e possiamo dirti cosa ha funzionato per gruppi come il tuo.",
  ),
];

// ===========================================================================
// ARTICLES ARRAY — 9 documents with full SEO objects
// ===========================================================================

const articles = [
  // ARTICLE 1 — TODDLERS (EN/ES/FR)
  {
    _id: "blog-article-toddlers-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "punta-cana-with-toddlers",
    slug: { _type: "slug", current: "punta-cana-with-toddlers-babies-guide" },
    title: "Punta Cana with Toddlers and Babies: A Practical Guide",
    excerpt:
      "Practical guide to Punta Cana with babies and toddlers — resort picks, calm-water beaches, feeding, naps, medical care, and exactly what to pack.",
    publishedAt: "2026-02-10T10:00:00.000Z",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: toddlersBodyEn,
    seo: {
      metaTitle: "Punta Cana with Toddlers and Babies: A Guide",
      metaDescription:
        "Practical guide to Punta Cana with babies and toddlers — resort picks, beach safety, feeding, naps, medical care, and what to pack.",
      keywords: [
        "Punta Cana with babies",
        "Punta Cana with toddlers",
        "family resort Punta Cana",
        "Caribbean with baby",
        "Dominican Republic family travel",
        "Punta Cana toddler activities",
      ],
      ogTitle: "Punta Cana with Toddlers and Babies: A Guide",
      ogDescription:
        "Resort picks, beach safety, feeding, naps, and medical care — a practical Punta Cana guide for parents of babies and toddlers.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Punta Cana with Toddlers and Babies: A Practical Guide",
        description:
          "Practical guide to Punta Cana with babies and toddlers — resort picks, beaches, feeding, naps, medical, and packing.",
        url: "https://puntacana-excursions.com/blog/punta-cana-with-toddlers-babies-guide",
        datePublished: "2026-02-10",
        language: "en",
        keywords: [
          "Punta Cana with babies",
          "Punta Cana with toddlers",
          "family resort Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-toddlers-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "punta-cana-with-toddlers",
    slug: { _type: "slug", current: "punta-cana-con-bebes-ninos-pequenos" },
    title: "Punta Cana con Bebés y Niños Pequeños: Una Guía Práctica",
    excerpt:
      "Guía práctica de Punta Cana con bebés y niños pequeños — elección de resort, playas tranquilas, alimentación, siestas, atención médica y qué empacar.",
    publishedAt: "2026-02-10T10:00:00.000Z",
    readingTime: 16,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: toddlersBodyEs,
    seo: {
      metaTitle: "Punta Cana con Bebés y Niños Pequeños: Guía",
      metaDescription:
        "Guía práctica para visitar Punta Cana con bebés y niños pequeños — resorts, playas, alimentación, siestas, atención médica y empaque.",
      keywords: [
        "Punta Cana con bebés",
        "Punta Cana con niños pequeños",
        "resort familiar Punta Cana",
        "Caribe con bebé",
        "viaje familiar República Dominicana",
        "actividades Punta Cana niños pequeños",
      ],
      ogTitle: "Punta Cana con Bebés y Niños Pequeños: Guía",
      ogDescription:
        "Resorts, playas seguras, alimentación, siestas y atención médica — guía práctica para padres viajando a Punta Cana con bebés y niños pequeños.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Punta Cana con Bebés y Niños Pequeños: Una Guía Práctica",
        description:
          "Guía práctica de Punta Cana con bebés y niños pequeños — resort, playas, alimentación, siestas, médica y empaque.",
        url: "https://puntacana-excursions.com/es/blog/punta-cana-con-bebes-ninos-pequenos",
        datePublished: "2026-02-10",
        language: "es",
        keywords: [
          "Punta Cana con bebés",
          "Punta Cana con niños pequeños",
          "resort familiar Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-toddlers-fr",
    _type: "blogArticle",
    language: "fr",
    translationGroup: "punta-cana-with-toddlers",
    slug: { _type: "slug", current: "punta-cana-avec-bebes-tout-petits" },
    title: "Punta Cana avec Bébés et Tout-petits : Un Guide Pratique",
    excerpt:
      "Guide pratique de Punta Cana avec bébés et tout-petits — choix de complexe, plages calmes, alimentation, siestes, soins médicaux et quoi emballer.",
    publishedAt: "2026-02-10T10:00:00.000Z",
    readingTime: 17,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: toddlersBodyFr,
    seo: {
      metaTitle: "Punta Cana avec Bébés et Tout-petits : Guide",
      metaDescription:
        "Guide pratique pour visiter Punta Cana avec bébés et tout-petits — complexes, plages, alimentation, siestes, soins médicaux et emballage.",
      keywords: [
        "Punta Cana avec bébés",
        "Punta Cana avec tout-petits",
        "complexe familial Punta Cana",
        "Caraïbes avec bébé",
        "voyage famille République Dominicaine",
        "activités Punta Cana enfants",
      ],
      ogTitle: "Punta Cana avec Bébés et Tout-petits : Guide",
      ogDescription:
        "Complexes, plages sûres, alimentation, siestes et soins médicaux — guide pratique pour les parents voyageant à Punta Cana avec de jeunes enfants.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Punta Cana avec Bébés et Tout-petits : Un Guide Pratique",
        description:
          "Guide pratique de Punta Cana avec bébés et tout-petits — complexe, plages, alimentation, siestes, médical et emballage.",
        url: "https://puntacana-excursions.com/fr/blog/punta-cana-avec-bebes-tout-petits",
        datePublished: "2026-02-10",
        language: "fr",
        keywords: [
          "Punta Cana avec bébés",
          "Punta Cana avec tout-petits",
          "complexe familial Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },

  // ARTICLE 2 — KIDS BY AGE (EN/ES/DE)
  {
    _id: "blog-article-kidsage-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "kids-excursions-by-age",
    slug: { _type: "slug", current: "best-excursions-for-kids-punta-cana-by-age" },
    title: "Best Excursions for Kids in Punta Cana by Age",
    excerpt:
      "Age-by-age guide to Punta Cana excursions — what works for babies, preschoolers, school-age kids, tweens, and teens, plus what to skip.",
    publishedAt: "2026-03-05T10:00:00.000Z",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: kidsAgeBodyEn,
    seo: {
      metaTitle: "Best Excursions for Kids in Punta Cana by Age",
      metaDescription:
        "Age-by-age guide to Punta Cana excursions — what works for babies, preschoolers, school-age kids, tweens, and teens, plus what to skip.",
      keywords: [
        "Punta Cana excursions for kids",
        "Punta Cana with children",
        "family excursions Punta Cana",
        "kid-friendly Punta Cana",
        "Saona Island with kids",
        "Punta Cana family activities",
      ],
      ogTitle: "Best Excursions for Kids in Punta Cana by Age",
      ogDescription:
        "Which Punta Cana excursions actually work at which ages — from babies to teens — and which ones to skip.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Best Excursions for Kids in Punta Cana by Age",
        description:
          "Age-by-age guide to Punta Cana excursions for families with children from babies through teenagers.",
        url: "https://puntacana-excursions.com/blog/best-excursions-for-kids-punta-cana-by-age",
        datePublished: "2026-03-05",
        language: "en",
        keywords: [
          "Punta Cana excursions for kids",
          "Punta Cana with children",
          "family excursions Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-kidsage-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "kids-excursions-by-age",
    slug: { _type: "slug", current: "mejores-excursiones-ninos-punta-cana-edad" },
    title: "Mejores Excursiones para Niños en Punta Cana por Edad",
    excerpt:
      "Guía edad por edad de excursiones en Punta Cana — qué funciona para bebés, preescolares, niños escolares, preadolescentes y adolescentes, y qué evitar.",
    publishedAt: "2026-03-05T10:00:00.000Z",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: kidsAgeBodyEs,
    seo: {
      metaTitle: "Mejores Excursiones para Niños en Punta Cana",
      metaDescription:
        "Guía edad por edad de excursiones de Punta Cana — qué funciona para bebés, preescolares, niños escolares, preadolescentes y adolescentes.",
      keywords: [
        "excursiones niños Punta Cana",
        "Punta Cana con niños",
        "excursiones familiares Punta Cana",
        "Isla Saona con niños",
        "actividades familiares Punta Cana",
        "Punta Cana para preadolescentes",
      ],
      ogTitle: "Mejores Excursiones para Niños en Punta Cana",
      ogDescription:
        "Qué excursiones de Punta Cana funcionan realmente a qué edades — desde bebés hasta adolescentes — y cuáles evitar.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Mejores Excursiones para Niños en Punta Cana por Edad",
        description:
          "Guía edad por edad de excursiones en Punta Cana para familias con niños desde bebés hasta adolescentes.",
        url: "https://puntacana-excursions.com/es/blog/mejores-excursiones-ninos-punta-cana-edad",
        datePublished: "2026-03-05",
        language: "es",
        keywords: [
          "excursiones niños Punta Cana",
          "Punta Cana con niños",
          "excursiones familiares Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-kidsage-de",
    _type: "blogArticle",
    language: "de",
    translationGroup: "kids-excursions-by-age",
    slug: { _type: "slug", current: "beste-ausfluege-kinder-punta-cana-alter" },
    title: "Beste Ausflüge für Kinder in Punta Cana nach Alter",
    excerpt:
      "Altersgerechter Leitfaden zu Ausflügen in Punta Cana — was funktioniert für Babys, Vorschulkinder, Schulkinder, Tweens und Teenager, und was zu vermeiden ist.",
    publishedAt: "2026-03-05T10:00:00.000Z",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: kidsAgeBodyDe,
    seo: {
      metaTitle: "Beste Ausflüge für Kinder in Punta Cana",
      metaDescription:
        "Altersgerechter Leitfaden zu Punta Cana Ausflügen — was für Babys, Vorschulkinder, Schulkinder, Tweens und Teenager funktioniert.",
      keywords: [
        "Punta Cana Ausflüge Kinder",
        "Punta Cana mit Kindern",
        "Familienausflüge Punta Cana",
        "Saona Insel mit Kindern",
        "Punta Cana Familienaktivitäten",
        "Punta Cana für Teenager",
      ],
      ogTitle: "Beste Ausflüge für Kinder in Punta Cana",
      ogDescription:
        "Welche Punta Cana Ausflüge in welchem Alter wirklich funktionieren — von Babys bis Teenagern — und welche zu vermeiden sind.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Beste Ausflüge für Kinder in Punta Cana nach Alter",
        description:
          "Altersgerechter Leitfaden zu Ausflügen in Punta Cana für Familien mit Kindern von Babys bis Teenagern.",
        url: "https://puntacana-excursions.com/de/blog/beste-ausfluege-kinder-punta-cana-alter",
        datePublished: "2026-03-05",
        language: "de",
        keywords: [
          "Punta Cana Ausflüge Kinder",
          "Punta Cana mit Kindern",
          "Familienausflüge Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },

  // ARTICLE 3 — MULTIGEN (EN/ES/IT)
  {
    _id: "blog-article-multigen-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "multi-generation-punta-cana",
    slug: { _type: "slug", current: "multi-generation-family-trip-punta-cana" },
    title: "Multi-Generation Family Trip to Punta Cana",
    excerpt:
      "How to plan a Punta Cana trip with grandparents, parents, and kids — resort picks, mobility, excursions, and avoiding common multi-gen pitfalls.",
    publishedAt: "2026-04-08T10:00:00.000Z",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: multigenBodyEn,
    seo: {
      metaTitle: "Multi-Generation Family Trip to Punta Cana",
      metaDescription:
        "How to plan a Punta Cana trip with grandparents, parents, and kids — resort picks, mobility, excursions, and avoiding common multi-gen pitfalls.",
      keywords: [
        "multi-generation Punta Cana",
        "Punta Cana with grandparents",
        "family vacation Punta Cana",
        "large family resort",
        "Punta Cana extended family",
        "accessible Punta Cana",
      ],
      ogTitle: "Multi-Generation Family Trip to Punta Cana",
      ogDescription:
        "Plan a multi-gen Punta Cana trip that works for grandparents, parents, and kids — resort choice, mobility, and excursion strategy.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Multi-Generation Family Trip to Punta Cana",
        description:
          "Plan a Punta Cana trip across grandparents, parents, and kids — resort, mobility, excursions, common pitfalls.",
        url: "https://puntacana-excursions.com/blog/multi-generation-family-trip-punta-cana",
        datePublished: "2026-04-08",
        language: "en",
        keywords: [
          "multi-generation Punta Cana",
          "Punta Cana with grandparents",
          "family vacation Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-multigen-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "multi-generation-punta-cana",
    slug: { _type: "slug", current: "viaje-familiar-multigeneracional-punta-cana" },
    title: "Viaje Familiar Multigeneracional a Punta Cana",
    excerpt:
      "Cómo planificar un viaje a Punta Cana con abuelos, padres y niños — elección de resort, movilidad, excursiones y cómo evitar errores multigeneracionales.",
    publishedAt: "2026-04-08T10:00:00.000Z",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: multigenBodyEs,
    seo: {
      metaTitle: "Viaje Familiar Multigeneracional a Punta Cana",
      metaDescription:
        "Cómo planificar un viaje a Punta Cana con abuelos, padres y niños — resort, movilidad, excursiones y errores comunes a evitar.",
      keywords: [
        "viaje multigeneracional Punta Cana",
        "Punta Cana con abuelos",
        "vacaciones familiares Punta Cana",
        "resort familia grande",
        "Punta Cana familia extendida",
        "Punta Cana accesible",
      ],
      ogTitle: "Viaje Familiar Multigeneracional a Punta Cana",
      ogDescription:
        "Planifica un viaje multigeneracional a Punta Cana que funcione para abuelos, padres y niños — elección de resort, movilidad y excursiones.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Viaje Familiar Multigeneracional a Punta Cana",
        description:
          "Planifica un viaje a Punta Cana con abuelos, padres y niños — resort, movilidad, excursiones y errores comunes.",
        url: "https://puntacana-excursions.com/es/blog/viaje-familiar-multigeneracional-punta-cana",
        datePublished: "2026-04-08",
        language: "es",
        keywords: [
          "viaje multigeneracional Punta Cana",
          "Punta Cana con abuelos",
          "vacaciones familiares Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-multigen-it",
    _type: "blogArticle",
    language: "it",
    translationGroup: "multi-generation-punta-cana",
    slug: { _type: "slug", current: "viaggio-famiglia-multigenerazionale-punta-cana" },
    title: "Viaggio Familiare Multigenerazionale a Punta Cana",
    excerpt:
      "Come pianificare un viaggio a Punta Cana con nonni, genitori e bambini — scelta del resort, mobilità, escursioni ed errori comuni multigenerazionali da evitare.",
    publishedAt: "2026-04-08T10:00:00.000Z",
    readingTime: 14,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: multigenBodyIt,
    seo: {
      metaTitle: "Viaggio Famiglia Multigenerazionale Punta Cana",
      metaDescription:
        "Come pianificare un viaggio a Punta Cana con nonni, genitori e bambini — resort, mobilità, escursioni ed errori comuni da evitare.",
      keywords: [
        "viaggio multigenerazionale Punta Cana",
        "Punta Cana con nonni",
        "vacanze famiglia Punta Cana",
        "resort famiglia grande",
        "Punta Cana famiglia allargata",
        "Punta Cana accessibile",
      ],
      ogTitle: "Viaggio Famiglia Multigenerazionale Punta Cana",
      ogDescription:
        "Pianifica un viaggio multigenerazionale a Punta Cana che funzioni per nonni, genitori e bambini — resort, mobilità ed escursioni.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Viaggio Familiare Multigenerazionale a Punta Cana",
        description:
          "Pianifica un viaggio a Punta Cana con nonni, genitori e bambini — resort, mobilità, escursioni ed errori comuni.",
        url: "https://puntacana-excursions.com/it/blog/viaggio-famiglia-multigenerazionale-punta-cana",
        datePublished: "2026-04-08",
        language: "it",
        keywords: [
          "viaggio multigenerazionale Punta Cana",
          "Punta Cana con nonni",
          "vacanze famiglia Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
];

// ===========================================================================
// SEED FUNCTION
// ===========================================================================

async function seed() {
  console.log(`Seeding ${articles.length} blog articles (batch 4 — family)...`);
  for (const article of articles) {
    try {
      await client.createOrReplace(article as any);
      console.log(`  ✓ ${article._id} (${article.language}) — ${article.title}`);
    } catch (err) {
      console.error(`  ✗ ${article._id}:`, err);
    }
  }
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
