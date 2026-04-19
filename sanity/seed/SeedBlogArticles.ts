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

function para(text: string) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function h2(text: string) {
  return {
    _type: "block",
    _key: key(),
    style: "h2",
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

// ---------------------------------------------------------------------------
// Article set 1 — Top 5 Snorkeling Spots (EN, ES, FR)
// ---------------------------------------------------------------------------

const snorkelingBodyEn = [
  h2("Why Punta Cana is a Snorkeler's Paradise"),
  para(
    "With crystal-clear waters, thriving coral reefs, and an abundance of tropical marine life, Punta Cana is one of the Caribbean's top snorkeling destinations. Whether you're a first-timer or a seasoned snorkeler, there's a spot here that will take your breath away.",
  ),
  h2("1. Catalina Island"),
  para(
    "Just off the coast, Catalina Island boasts some of the clearest waters and most vibrant coral formations in the region. Sea turtles and eagle rays are frequent visitors, making every dive an unforgettable experience.",
  ),
  h2("2. The Wall at La Romana"),
  para(
    "For those who want to snorkel along a dramatic underwater wall, La Romana's famous dive wall descends to impressive depths. Even at the surface, the colors and marine life are extraordinary.",
  ),
  h2("3. Saona Island"),
  para(
    "A UNESCO-protected natural park, Saona Island is surrounded by shallow, warm waters teeming with starfish, conch, and tropical fish. The white sand beaches and turquoise lagoons make it perfect for a full-day excursion.",
  ),
  h2("4. Bayahibe Reef"),
  para(
    "The Bayahibe reef system is one of the most diverse in the Dominican Republic. Moray eels, parrotfish, and nurse sharks call this reef home — and patient snorkelers are often rewarded with rare sightings.",
  ),
  h2("5. Cap Cana Blue Lagoon"),
  para(
    "Just 20 minutes from the main resort zone, Cap Cana's Blue Lagoon is a hidden gem with exceptionally calm waters — ideal for beginners and families with young children.",
  ),
];

const snorkelingBodyEs = [
  h2("Por Qué Punta Cana es el Paraíso del Snorkel"),
  para(
    "Con aguas cristalinas, arrecifes de coral prósperos y una abundancia de vida marina tropical, Punta Cana es uno de los mejores destinos de snorkel del Caribe. Ya sea que seas principiante o un buceador experimentado, hay un lugar aquí que te dejará sin aliento.",
  ),
  h2("1. Isla Catalina"),
  para(
    "A poca distancia de la costa, la Isla Catalina presenta algunas de las aguas más claras y formaciones de coral más vibrantes de la región. Las tortugas marinas y las rayas águila son visitantes frecuentes, haciendo que cada inmersión sea una experiencia inolvidable.",
  ),
  h2("2. El Muro en La Romana"),
  para(
    "Para quienes quieran hacer snorkel a lo largo de una dramática pared submarina, el famoso muro de buceo de La Romana desciende a profundidades impresionantes. Incluso en la superficie, los colores y la vida marina son extraordinarios.",
  ),
  h2("3. Isla Saona"),
  para(
    "Un parque natural protegido por la UNESCO, la Isla Saona está rodeada de aguas cálidas y poco profundas repletas de estrellas de mar, caracoles y peces tropicales. Las playas de arena blanca y las lagunas turquesas la hacen perfecta para una excursión de día completo.",
  ),
  h2("4. Arrecife de Bayahibe"),
  para(
    "El sistema de arrecifes de Bayahibe es uno de los más diversos de la República Dominicana. Morenas, peces loro y tiburones nodriza llaman hogar a este arrecife, y los buceadores pacientes a menudo son recompensados con avistamientos raros.",
  ),
  h2("5. Laguna Azul de Cap Cana"),
  para(
    "A solo 20 minutos de la zona principal de resorts, la Laguna Azul de Cap Cana es una joya escondida con aguas excepcionalmente tranquilas, ideal para principiantes y familias con niños pequeños.",
  ),
];

const snorkelingBodyFr = [
  h2("Pourquoi Punta Cana est le Paradis du Snorkeling"),
  para(
    "Avec ses eaux cristallines, ses récifs coralliens luxuriants et son abondance de vie marine tropicale, Punta Cana est l'une des meilleures destinations de snorkeling des Caraïbes. Que vous soyez débutant ou plongeur chevronné, il y a un endroit ici qui vous coupera le souffle.",
  ),
  h2("1. L'Île Catalina"),
  para(
    "Au large des côtes, l'Île Catalina offre certaines des eaux les plus claires et des formations coralliennes les plus vibrantes de la région. Les tortues marines et les raies aigle sont des visiteurs fréquents, rendant chaque plongée inoubliable.",
  ),
  h2("2. Le Mur de La Romana"),
  para(
    "Pour ceux qui veulent faire du snorkeling le long d'un mur sous-marin spectaculaire, le célèbre mur de plongée de La Romana descend à des profondeurs impressionnantes. Même en surface, les couleurs et la vie marine sont extraordinaires.",
  ),
  h2("3. L'Île Saona"),
  para(
    "Parc naturel protégé par l'UNESCO, l'Île Saona est entourée d'eaux peu profondes et chaudes regorgeant d'étoiles de mer, de conques et de poissons tropicaux. Les plages de sable blanc et les lagons turquoise en font un endroit parfait pour une excursion d'une journée.",
  ),
  h2("4. Le Récif de Bayahibe"),
  para(
    "Le système de récifs de Bayahibe est l'un des plus diversifiés de la République Dominicaine. Les murènes, les poissons perroquets et les requins nourrices habitent ce récif, et les plongeurs patients sont souvent récompensés par des observations rares.",
  ),
  h2("5. Le Lagon Bleu de Cap Cana"),
  para(
    "À seulement 20 minutes de la zone principale des complexes hôteliers, le Lagon Bleu de Cap Cana est un joyau caché aux eaux exceptionnellement calmes, idéal pour les débutants et les familles avec de jeunes enfants.",
  ),
];

// ---------------------------------------------------------------------------
// Article set 2 — Scuba Diving Guide (EN, DE, PT)
// ---------------------------------------------------------------------------

const scubaBodyEn = [
  h2("Getting Started with Scuba Diving in Punta Cana"),
  para(
    "The Dominican Republic's Caribbean coastline offers some of the most accessible and rewarding scuba diving in the world. From shallow reef dives perfect for beginners to dramatic wall dives for certified divers, Punta Cana has something for every level.",
  ),
  h2("Do I Need to Be Certified?"),
  para(
    "Not necessarily. Grand Bay's Discover Scuba Diving program allows complete beginners to experience the underwater world at up to 12 meters (40 feet) depth — no certification required. A certified PADI instructor guides you every step of the way.",
  ),
  h2("What Marine Life Will I See?"),
  para(
    "The reefs around Punta Cana are home to nurse sharks, sea turtles, eagle rays, moray eels, lionfish, and hundreds of tropical fish species. Visibility is typically 15–25 meters, making for spectacular underwater photography.",
  ),
  h2("Best Time to Dive"),
  para(
    "Diving conditions are excellent year-round in Punta Cana. Water temperatures range from 26°C in winter to 30°C in summer. The calmer seas of April through June and September through November make these the ideal months for beginners.",
  ),
];

const scubaBodyDe = [
  h2("Einstieg ins Tauchen in Punta Cana"),
  para(
    "Die karibische Küste der Dominikanischen Republik bietet einige der zugänglichsten und lohnendsten Tauchmöglichkeiten der Welt. Von flachen Riff-Tauchgängen, die perfekt für Anfänger sind, bis hin zu dramatischen Wandtauchgängen für zertifizierte Taucher — Punta Cana hat für jedes Niveau etwas zu bieten.",
  ),
  h2("Brauche ich einen Tauchschein?"),
  para(
    "Nicht unbedingt. Das Discover Scuba Diving-Programm von Grand Bay ermöglicht es absoluten Anfängern, die Unterwasserwelt bis zu einer Tiefe von 12 Metern zu erleben — ohne Zertifizierung. Ein zertifizierter PADI-Instrukteur begleitet Sie bei jedem Schritt.",
  ),
  h2("Welche Meereslebewesen werde ich sehen?"),
  para(
    "Die Riffe rund um Punta Cana beherbergen Ammenhaie, Meeresschildkröten, Adlerrochen, Muränen, Rotfeuerfische und Hunderte von tropischen Fischarten. Die Sichtweite beträgt typischerweise 15–25 Meter, was spektakuläre Unterwasserfotografie ermöglicht.",
  ),
  h2("Die beste Zeit zum Tauchen"),
  para(
    "Die Tauchbedingungen in Punta Cana sind ganzjährig ausgezeichnet. Die Wassertemperaturen reichen von 26°C im Winter bis 30°C im Sommer. Die ruhigeren Meere von April bis Juni und September bis November machen diese Monate ideal für Anfänger.",
  ),
];

const scubaBodyPt = [
  h2("Começando com o Mergulho em Punta Cana"),
  para(
    "A costa caribenha da República Dominicana oferece alguns dos mergulhos mais acessíveis e recompensadores do mundo. Desde mergulhos em recifes rasos, perfeitos para iniciantes, até dramáticos mergulhos em paredes para mergulhadores certificados, Punta Cana tem algo para todos os níveis.",
  ),
  h2("Preciso ser Certificado?"),
  para(
    "Não necessariamente. O programa Discover Scuba Diving da Grand Bay permite que iniciantes completos experimentem o mundo subaquático até 12 metros de profundidade — sem certificação necessária. Um instrutor PADI certificado o guia em cada passo.",
  ),
  h2("Que Vida Marinha Verei?"),
  para(
    "Os recifes ao redor de Punta Cana abrigam tubarões-lixa, tartarugas marinhas, raias-águia, moréias, peixes-leão e centenas de espécies de peixes tropicais. A visibilidade é tipicamente de 15–25 metros, proporcionando fotografia subaquática espetacular.",
  ),
  h2("Melhor Época para Mergulhar"),
  para(
    "As condições de mergulho são excelentes durante todo o ano em Punta Cana. As temperaturas da água variam de 26°C no inverno a 30°C no verão. Os mares mais calmos de abril a junho e de setembro a novembro tornam esses os meses ideais para iniciantes.",
  ),
];

// ---------------------------------------------------------------------------
// Article set 3 — Family Excursions (EN, IT, ES)
// ---------------------------------------------------------------------------

const familyBodyEn = [
  h2("Planning the Perfect Family Excursion in Punta Cana"),
  para(
    "Punta Cana is one of the Caribbean's most family-friendly destinations, with a wide range of excursions designed to create lasting memories for guests of all ages. Here's our guide to the best family activities in the area.",
  ),
  h2("Catamaran Sailing & Snorkeling"),
  para(
    "A catamaran trip is the quintessential Punta Cana experience. Children love the open sea, the excitement of spotting marine life through their snorkeling masks, and the beach stop for swimming and sandcastle building. Most catamarans include lunch, drinks, and all equipment.",
  ),
  h2("Isla Saona Day Trip"),
  para(
    "A visit to Isla Saona national park is a highlight of any Punta Cana holiday. The calm, shallow waters around the island are ideal for young children, and the pristine beaches make for an unforgettable family photo album.",
  ),
  h2("Buggy Adventure"),
  para(
    "For older children and teenagers, a buggy adventure through the Dominican countryside is an incredible way to experience local life, banana plantations, and jungle trails. Basic driving is required, so this is best for families with children 12+.",
  ),
  h2("Zip-Lining at Scape Park"),
  para(
    "Scape Park offers a zip-line course through a tropical forest canopy that's thrilling for the whole family. Combined with cave swimming and cenote exploration, it's a full-day adventure that children will talk about for years.",
  ),
];

const familyBodyIt = [
  h2("Pianificare l'Escursione Perfetta per la Famiglia a Punta Cana"),
  para(
    "Punta Cana è una delle destinazioni più a misura di famiglia dei Caraibi, con un'ampia gamma di escursioni progettate per creare ricordi indimenticabili per ospiti di tutte le età. Ecco la nostra guida alle migliori attività familiari della zona.",
  ),
  h2("Vela su Catamarano e Snorkeling"),
  para(
    "Una gita in catamarano è l'esperienza quintessenziale di Punta Cana. I bambini adorano il mare aperto, l'eccitazione di avvistare la vita marina attraverso le loro maschere da snorkel e la sosta in spiaggia per nuotare e costruire castelli di sabbia. La maggior parte dei catamarani include pranzo, bevande e tutta l'attrezzatura.",
  ),
  h2("Gita di un Giorno all'Isla Saona"),
  para(
    "Una visita al parco nazionale di Isla Saona è un punto culminante di qualsiasi vacanza a Punta Cana. Le acque calme e poco profonde intorno all'isola sono ideali per i bambini piccoli, e le spiagge incontaminate creano un album fotografico familiare indimenticabile.",
  ),
  h2("Avventura in Buggy"),
  para(
    "Per i bambini più grandi e gli adolescenti, un'avventura in buggy attraverso la campagna dominicana è un modo incredibile per vivere la vita locale, le piantagioni di banane e i sentieri nella giungla. È richiesta la guida di base, quindi è meglio per famiglie con bambini di 12+ anni.",
  ),
  h2("Zip-Line allo Scape Park"),
  para(
    "Lo Scape Park offre un percorso di zip-line attraverso la volta di una foresta tropicale che è emozionante per tutta la famiglia. Combinato con il nuoto nelle grotte e l'esplorazione dei cenotes, è un'avventura di un giorno intero di cui i bambini parleranno per anni.",
  ),
];

const familyBodyEs = [
  h2("Planificando la Excursión Familiar Perfecta en Punta Cana"),
  para(
    "Punta Cana es uno de los destinos más familiares del Caribe, con una amplia gama de excursiones diseñadas para crear recuerdos duraderos para huéspedes de todas las edades. Aquí está nuestra guía de las mejores actividades familiares en la zona.",
  ),
  h2("Navegación en Catamarán y Snorkel"),
  para(
    "Un viaje en catamarán es la experiencia quintaesencial de Punta Cana. Los niños adoran el mar abierto, la emoción de ver vida marina a través de sus máscaras de snorkel y la parada en la playa para nadar y construir castillos de arena. La mayoría de los catamaranes incluyen almuerzo, bebidas y todo el equipo.",
  ),
  h2("Excursión de un Día a Isla Saona"),
  para(
    "Una visita al parque nacional Isla Saona es un punto destacado de cualquier vacación en Punta Cana. Las aguas tranquilas y poco profundas alrededor de la isla son ideales para niños pequeños, y las playas vírgenes crean un álbum fotográfico familiar inolvidable.",
  ),
  h2("Aventura en Buggy"),
  para(
    "Para niños mayores y adolescentes, una aventura en buggy por el campo dominicano es una manera increíble de experimentar la vida local, las plantaciones de bananas y los senderos en la jungla. Se requiere conducción básica, por lo que es mejor para familias con niños de 12 o más años.",
  ),
  h2("Tirolesa en Scape Park"),
  para(
    "Scape Park ofrece un recorrido de tirolesa a través del dosel de un bosque tropical que es emocionante para toda la familia. Combinado con natación en cuevas y exploración de cenotes, es una aventura de un día completo de la que los niños hablarán durante años.",
  ),
];

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

const articles = [
  // Set 1 — Snorkeling
  {
    _id: "blog-article-snorkeling-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "top-snorkeling-spots",
    slug: { _type: "slug", current: "top-5-snorkeling-spots-punta-cana" },
    title: "Top 5 Snorkeling Spots in Punta Cana",
    excerpt:
      "Discover the best snorkeling spots around Punta Cana — from the vibrant reefs of Catalina Island to the hidden lagoons of Cap Cana.",
    publishedAt: "2025-03-15",
    readingTime: 5,
    category: { _type: "reference", _ref: "blog-category-marine-life" },
    body: snorkelingBodyEn,
  },
  {
    _id: "blog-article-snorkeling-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "top-snorkeling-spots",
    slug: { _type: "slug", current: "los-5-mejores-lugares-de-snorkel-punta-cana" },
    title: "Los 5 Mejores Lugares de Snorkel en Punta Cana",
    excerpt:
      "Descubre los mejores lugares de snorkel alrededor de Punta Cana — desde los vibrantes arrecifes de la Isla Catalina hasta las lagunas ocultas de Cap Cana.",
    publishedAt: "2025-03-15",
    readingTime: 5,
    category: { _type: "reference", _ref: "blog-category-marine-life" },
    body: snorkelingBodyEs,
  },
  {
    _id: "blog-article-snorkeling-fr",
    _type: "blogArticle",
    language: "fr",
    translationGroup: "top-snorkeling-spots",
    slug: { _type: "slug", current: "les-5-meilleurs-spots-de-snorkeling-punta-cana" },
    title: "Les 5 Meilleurs Spots de Snorkeling à Punta Cana",
    excerpt:
      "Découvrez les meilleurs spots de snorkeling autour de Punta Cana — des récifs vibrants de l'Île Catalina aux lagons cachés de Cap Cana.",
    publishedAt: "2025-03-15",
    readingTime: 5,
    category: { _type: "reference", _ref: "blog-category-marine-life" },
    body: snorkelingBodyFr,
  },

  // Set 2 — Scuba Diving
  {
    _id: "blog-article-scuba-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "scuba-diving-guide",
    slug: { _type: "slug", current: "guide-to-scuba-diving-caribbean" },
    title: "A Guide to Scuba Diving in the Caribbean",
    excerpt:
      "Everything you need to know before your first Caribbean scuba dive — from certification requirements to the best marine life to look out for.",
    publishedAt: "2025-02-20",
    readingTime: 6,
    category: { _type: "reference", _ref: "blog-category-adventure" },
    body: scubaBodyEn,
  },
  {
    _id: "blog-article-scuba-de",
    _type: "blogArticle",
    language: "de",
    translationGroup: "scuba-diving-guide",
    slug: { _type: "slug", current: "leitfaden-zum-tauchen-in-der-karibik" },
    title: "Ein Leitfaden zum Tauchen in der Karibik",
    excerpt:
      "Alles, was Sie vor Ihrem ersten karibischen Tauchgang wissen müssen — von Zertifizierungsanforderungen bis hin zu den besten Meereslebewesen, auf die Sie achten sollten.",
    publishedAt: "2025-02-20",
    readingTime: 6,
    category: { _type: "reference", _ref: "blog-category-adventure" },
    body: scubaBodyDe,
  },
  {
    _id: "blog-article-scuba-pt",
    _type: "blogArticle",
    language: "pt",
    translationGroup: "scuba-diving-guide",
    slug: { _type: "slug", current: "guia-de-mergulho-no-caribe" },
    title: "Um Guia para Mergulho no Caribe",
    excerpt:
      "Tudo que você precisa saber antes do seu primeiro mergulho no Caribe — desde requisitos de certificação até a melhor vida marinha para observar.",
    publishedAt: "2025-02-20",
    readingTime: 6,
    category: { _type: "reference", _ref: "blog-category-adventure" },
    body: scubaBodyPt,
  },

  // Set 3 — Family
  {
    _id: "blog-article-family-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "family-excursions",
    slug: { _type: "slug", current: "best-family-excursions-punta-cana" },
    title: "The Best Family Excursions in Punta Cana",
    excerpt:
      "Planning a family holiday in Punta Cana? Here are the best kid-friendly excursions that will create memories for the whole family.",
    publishedAt: "2025-01-10",
    readingTime: 7,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: familyBodyEn,
  },
  {
    _id: "blog-article-family-it",
    _type: "blogArticle",
    language: "it",
    translationGroup: "family-excursions",
    slug: { _type: "slug", current: "le-migliori-escursioni-per-famiglie-punta-cana" },
    title: "Le Migliori Escursioni per Famiglie a Punta Cana",
    excerpt:
      "Stai pianificando una vacanza in famiglia a Punta Cana? Ecco le migliori escursioni adatte ai bambini che creeranno ricordi per tutta la famiglia.",
    publishedAt: "2025-01-10",
    readingTime: 7,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: familyBodyIt,
  },
  {
    _id: "blog-article-family-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "family-excursions",
    slug: { _type: "slug", current: "mejores-excursiones-familiares-punta-cana" },
    title: "Las Mejores Excursiones para Familias en Punta Cana",
    excerpt:
      "¿Planeando unas vacaciones familiares en Punta Cana? Estas son las mejores excursiones para niños que crearán recuerdos para toda la familia.",
    publishedAt: "2025-01-10",
    readingTime: 7,
    category: { _type: "reference", _ref: "blog-category-family" },
    body: familyBodyEs,
  },
];

async function seed() {
  for (const article of articles) {
    await client.createOrReplace(article);
    console.log(`✅ ${article._id}`);
  }
  console.log("\nAll blog articles seeded.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
