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
// Portable Text helpers
// ---------------------------------------------------------------------------
//
// Inline-link syntax used by `para()` and `li()`:
//   "Plain text [[label|https://example.com]] more text."
// The bracketed segment becomes a real <a href="..."> in Portable Text via
// the `link` markDef, producing clickable, SEO-friendly anchors.
//
// Use **double asterisks** for bold:
//   "This is **bold** text."
// ---------------------------------------------------------------------------

type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type MarkDef = {
  _type: "link";
  _key: string;
  href: string;
};

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

  // Regex: match [[label|url]] OR **bold** tokens; everything else is plain.
  const tokenRegex = /\[\[([^\]|]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Plain text before the match
    if (match.index > cursor) {
      const plain = text.slice(cursor, match.index);
      if (plain.length > 0) {
        children.push({
          _type: "span",
          _key: key(),
          text: plain,
          marks: [],
        });
      }
    }

    if (match[1] && match[2]) {
      // Link token: [[label|url]]
      const linkKey = key();
      markDefs.push({ _type: "link", _key: linkKey, href: match[2] });
      children.push({ _type: "span", _key: key(), text: match[1], marks: [linkKey] });
    } else if (match[3]) {
      // Bold token: **text**
      children.push({ _type: "span", _key: key(), text: match[3], marks: ["strong"] });
    }

    cursor = tokenRegex.lastIndex;
  }

  // Trailing plain text
  if (cursor < text.length) {
    const tail = text.slice(cursor);
    if (tail.length > 0) {
      children.push({ _type: "span", _key: key(), text: tail, marks: [] });
    }
  }

  // Portable Text requires at least one child span
  if (children.length === 0) {
    children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }

  return { children, markDefs };
}

function para(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    children,
    markDefs,
  };
}

function h2(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: key(),
    style: "h2",
    children,
    markDefs,
  };
}

function h3(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: key(),
    style: "h3",
    children,
    markDefs,
  };
}

function quote(text: string): Block {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: key(),
    style: "blockquote",
    children,
    markDefs,
  };
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

// ===========================================================================
// ARTICLE 1 — Dominican Food Guide: A Local's Take (EN, ES, FR)
// ===========================================================================

const foodBodyEn = [
  para(
    "Dominican food is one of the great underappreciated cuisines of the Caribbean. It draws from Taíno, Spanish, and West African roots, layered over five centuries of trade, migration, and improvisation. The result is a kitchen built on a few staples — rice, beans, plantain, root vegetables, pork, chicken, fresh fish — combined in ways that range from the everyday to the genuinely refined. If you stay only within your resort, you'll eat well, but you'll miss most of what makes Dominican food distinctive.",
  ),
  para(
    "This guide walks through the dishes worth trying, the meals that anchor Dominican daily life, the regional specialties, and the practical advice on where to actually find authentic versions while you're in Punta Cana. If you want to explore beyond the resort, our [[culture and nature excursions|https://puntacana-excursions.com/excursions?category=culture-nature]] include several food-focused day trips.",
  ),

  h2("The Foundations: Rice, Beans, and Meat"),
  para(
    "The single most important meal in Dominican daily life is called \"la bandera dominicana\" — the Dominican flag. It's a plate of white rice, red or black beans (habichuelas guisadas), stewed chicken or beef, and almost always a side of fried plantains or green salad. The dish gets its name from the colors that loosely echo the national flag: white rice, red beans, brown meat, green salad. Variations exist in every corner of the country, and every Dominican family makes it slightly differently.",
  ),
  para(
    "What makes la bandera worth seeking out is the bean stew itself. Dominican habichuelas are slow-cooked with sofrito, calabaza (a sweet local squash), oregano, garlic, and bell pepper. They have body and depth that no quick canned bean dish can match. A good bandera at a comedor (small family-run restaurant) costs 200 to 350 Dominican pesos — about four to seven US dollars — and feeds you for the rest of the day.",
  ),

  h2("Mangú: The Breakfast Dish That Defines a Country"),
  para(
    "If there's one Dominican dish that travelers consistently fall in love with, it's mangú. The preparation is simple: green plantains boiled until tender, then mashed with butter and a splash of the cooking water until smooth, topped with red onions sautéed in vinegar. The texture is somewhere between mashed potatoes and a thick polenta, with the unmistakable starchy sweetness of green plantain underneath. It's served at breakfast, almost always alongside three accompaniments — fried cheese, fried Dominican salami, and fried eggs. This combination has a name: \"los tres golpes\" (the three hits).",
  ),
  para(
    "Mangú is the unofficial national breakfast. It's eaten on weekends, on holidays, on Sundays after Mass, and at small breakfast restaurants any day of the week. The first time you try a real mangú at a Dominican family table is the moment most visitors stop thinking about Dominican food as Caribbean buffet fare and start thinking about it as a serious cuisine in its own right. The dish has so much cultural weight that there's a popular saying — \"yo soy más dominicano que el mangú\" (I'm more Dominican than mangú) — used to claim deep Dominican identity.",
  ),
  h3("Where to Try Mangú Near Punta Cana"),
  para(
    "Most all-inclusive resorts now serve mangú at the breakfast buffet, and the quality varies widely. The plantains are usually overcooked or under-mashed, the onions inadequately reduced. The real version is at small restaurants in towns like Veron, Friusa, and the inland neighborhoods of Bávaro. Ask any taxi driver where his mother eats breakfast, and you'll get a better answer than any review site can provide. The drive from a resort is typically 15 to 25 minutes, and breakfast for two costs under twenty dollars.",
  ),

  h2("Sancocho: The Sunday Stew"),
  para(
    "Sancocho is the dish that Dominican families gather around. It's a thick, deeply layered stew of multiple meats (traditionally seven, in the most elaborate version) cooked with root vegetables — yuca, yautía, ñame, auyama (squash) — plus green plantains, corn, and a generous base of sofrito. The cooking takes most of a day. The result is something between a stew and a soup, served in a bowl with rice on the side and avocado slices. The first spoonful explains a great deal about why Dominicans treat sancocho as a celebration food.",
  ),
  para(
    "The most legendary version is \"sancocho de siete carnes\" — seven-meat sancocho — which traditionally includes beef, pork, chicken, sausage, smoked pork, goat, and sometimes a seventh meat depending on the family. This version is made for weddings, baptisms, family reunions, and major holidays. Simpler everyday versions might use just chicken or just beef, but they share the same layered depth. Sancocho is the dish you make when there's something to celebrate and time to cook properly.",
  ),
  h3("Where to Try Sancocho"),
  para(
    "Sancocho is rare on resort menus and rarely done well when it appears there. Most resorts serve it on Sundays in their \"local cuisine\" stations, but the version is usually watered down. To experience real sancocho, you need to either visit a Dominican home (which our [[contact team|https://puntacana-excursions.com/contact]] can sometimes arrange through community connections) or visit a comedor on a Sunday afternoon, when many families prepare it specifically for the after-church meal.",
  ),

  h2("Mofongo: The Plantain Mountain"),
  para(
    "Mofongo is Puerto Rican in origin but has been thoroughly adopted into Dominican cuisine. It's made from fried green plantains pounded in a wooden mortar (pilón) with garlic, salt, and chicharrón (fried pork rind), then shaped into a dense, savory mound. Dominican mofongo is often served with a meat protein on the side — usually shrimp in garlic sauce, stewed chicken, or pork — and a small bowl of garlic-tomato broth poured into a well at the top.",
  ),
  para(
    "The dish has range. A simple mofongo at a roadside stand might be ten dollars and entirely satisfying; a refined mofongo at a high-end Dominican restaurant can be twenty-five dollars and architectural. Either version is worth trying. The pounding of the plantains creates a texture you can't replicate with any other method — slightly chewy, dense, deeply garlicky. Mofongo is the dish that visitors most often try to recreate at home and immediately understand they need to come back to the Dominican Republic for the real thing.",
  ),

  h2("Pollo Guisado and the Art of Stewed Meats"),
  para(
    "If you eat at a Dominican home, the chances are very high that the centerpiece protein is pollo guisado — stewed chicken. The preparation involves marinating the chicken with sofrito, oregano, lime juice, and garlic, then browning the pieces in caramelized sugar (yes, sugar — this is the Dominican color-and-depth technique) before stewing them with bell peppers, tomatoes, and a small amount of water. The chicken comes out the deep mahogany color of long cooking, with a sauce that's served liberally over rice.",
  ),
  para(
    "The caramelized-sugar technique is what makes Dominican stewed meats distinctive. It's also used for beef (carne guisada), pork (cerdo guisado), and even fish. The technique sounds odd until you try it — the sugar doesn't make the dish sweet; it deepens the color and adds a subtle, almost smoky background note. Once you've eaten pollo guisado done properly, the boneless chicken breast at the resort buffet starts to feel like a different food entirely.",
  ),

  h2("Seafood: The Coastal Specialties"),
  para(
    "Punta Cana sits on the coast, and Dominican seafood culture is genuinely good. The default preparation is grilled or fried whole fish — usually a small snapper or grouper — served with tostones (twice-fried green plantain rounds), white rice, and salad. The fish is typically caught within hours of being served at smaller beachside restaurants. The quality at the high-end seafood restaurants in Bávaro and Cap Cana is excellent and easy to find; the more interesting experience is at the small beach shacks in Bayahibe, Macao, and El Cortecito.",
  ),
  h3("Pescado con Coco — Coconut Fish"),
  para(
    "On the Samaná Peninsula, several hours from Punta Cana, the local specialty is pescado con coco — whole fish stewed in fresh coconut milk with green plantain, garlic, and herbs. It's one of the most distinctive Dominican dishes and a clear example of West African culinary influence. Samaná is a day trip from Punta Cana (about three hours each way), and on the trip you can sometimes combine the dish with humpback whale watching from January through March.",
  ),
  h3("Locrio — Dominican Rice Dishes"),
  para(
    "Locrio is the Dominican equivalent of paella or arroz con pollo, but with its own distinct character. Rice is cooked with sofrito, tomato paste, and a protein — usually chicken (locrio de pollo), shrimp (locrio de camarones), or sardines (locrio de arenque). The grains come out yellow-orange, lightly oily, deeply flavored. A good plate of locrio at a comedor is one of the most satisfying lunches you can have for under ten dollars.",
  ),

  h2("Street Food and Snacks"),
  h3("Empanadas and Pastelitos"),
  para(
    "Dominican empanadas (called pastelitos in some regions) are fried turnovers filled with seasoned meat, cheese, or vegetables. They appear at breakfast, as snacks, at parties, at roadside stands. The dough is thin and slightly crisp; the filling is generous. A plate of three or four pastelitos plus a fresh fruit juice is a classic mid-morning street meal. Most resort areas have at least one bakery or panadería that makes them properly.",
  ),
  h3("Chimichurri — The Dominican Burger"),
  para(
    "The name is confusing — Argentinian chimichurri is a green herb sauce. Dominican chimichurri (often spelled \"chimi\") is a street burger: ground meat patty, cabbage, tomato, onion, and a special pink sauce made from ketchup, mayo, and Worcestershire, served on a soft round bun. The food trucks selling chimis appear on roadsides every evening and are a beloved late-night snack across the country. They cost two to three dollars and are most authentic at night around 10:00 PM, when the local trucks are at their busiest.",
  ),
  h3("Yaniqueques and Johnny Cakes"),
  para(
    "Yaniqueques are flat fried discs of dough, somewhere between a tortilla and a fried bread. They originated in the Samaná Peninsula's English-speaking African-descendant communities (the name comes from \"johnny cakes\"). Sold by beach vendors, they're salty, light, addictive. They pair perfectly with the cold local beer (Presidente). If a beach vendor passes by with a basket of yaniqueques, buy one — even if you're not hungry.",
  ),

  h2("Sweets and Desserts"),
  para(
    "Dominican desserts lean sweet and milky. The most famous is dulce de leche cortada — a fresh-cheese-and-milk dessert that resembles a sweet ricotta with a hint of cinnamon. Dulce de coco (coconut dulce) and dulce de batata (sweet-potato dulce) are equally common. They're sold in roadside stands across the country, often in small plastic containers. At more elaborate restaurants, look for arroz con leche (rice pudding made with condensed milk and cinnamon) and majarete (a corn-based pudding).",
  ),
  para(
    "Fresh tropical fruit is the everyday dessert. Mango, papaya, passion fruit, pineapple, soursop (guanábana), zapote, and lechosa are all in season at different points of the year and are dramatically better than the imported versions found in supermarkets in colder countries. A roadside fruit stand selling cut mango with lime juice and a pinch of salt is one of the cheap pleasures of Dominican travel.",
  ),

  h2("Drinks: Rum, Coffee, and Mamajuana"),
  h3("Coffee"),
  para(
    "Dominican coffee is grown in the central mountains and is excellent. It tends to be dark-roasted and rich, often served as a small espresso-style cup with substantial sugar already added. \"Café\" at a Dominican home or comedor means this small sweet cup, not the large American filter coffee. If you want it without sugar, ask for \"café sin azúcar\" — but try it the local way at least once.",
  ),
  h3("Rum"),
  para(
    "The Dominican Republic is one of the great rum-producing nations of the Caribbean. The three main brands are Brugal, Barceló, and Bermúdez — each with multiple expressions ranging from white rum to aged sipping rums. Brugal Añejo is the everyday workhorse; Barceló Imperial and Bermúdez Aniversario are the premium aged bottles worth a tasting flight. The rum is served straight in small glasses, often with a splash of lime, or as the base of the classic Cuba Libre (rum, Coca-Cola, lime).",
  ),
  h3("Mamajuana"),
  para(
    "Mamajuana is the country's traditional herbal liqueur — a mixture of rum, red wine, honey, tree bark, and dried herbs steeped together for weeks. The result is a deep brown liquid with a complex, slightly medicinal taste that grows on you across a few sips. Dominicans have many traditional claims about its restorative properties; the modern reality is that it's a unique cultural drink worth trying once. Most bars in Punta Cana serve it, and bottles of it make excellent souvenirs to bring home.",
  ),

  h2("How to Find Authentic Dominican Food Near Punta Cana"),
  para(
    "The single biggest barrier to eating authentic Dominican food in Punta Cana is that the resort experience is designed to insulate you from local life. The all-inclusive buffet does include some local dishes, but they're inevitably softened to international palates. To find the real food, you need to leave the resort. Three practical strategies:",
  ),
  li("**Take a taxi 15 to 25 minutes inland.** Most resort zones have nearby towns — Veron, Friusa, Higüey, El Cortecito — where Dominicans actually live and eat. Comedores and family restaurants are abundant and inexpensive. A taxi for the round trip costs $30 to $50 USD."),
  li("**Join a food-focused excursion.** Our [[culture-and-nature excursions|https://puntacana-excursions.com/excursions?category=culture-nature]] include several day trips that combine cultural sites with stops at local restaurants. The advantage is that the operator handles transportation and translates for you."),
  li("**Use the resort's a la carte restaurants strategically.** The \"local\" or \"Dominican\" restaurant at your resort is usually the most authentic option on-site. The cuisine is still adapted for international palates, but the dishes themselves are recognizable. Ask the staff which dishes are most traditional and order those, not the international substitutes."),

  h2("A Day of Eating Like a Dominican"),
  para(
    "If you want to construct a real Dominican food day, here's how it would look. Breakfast: mangú with los tres golpes at a small breakfast restaurant in Veron, around 8:00 AM. Mid-morning: a fresh fruit juice (chinola, also called passion fruit) from a roadside stand. Lunch: la bandera at a comedor, around 1:00 PM — most Dominicans eat their main meal at midday. Mid-afternoon: a small sweet coffee. Late afternoon snack: a yaniqueque or empanada from a beach vendor. Dinner: grilled whole fish with tostones at a coastal restaurant, around 8:00 PM. Late night: a chimi from a street truck around 10:30 PM, walking back to the resort or eating at the truck itself.",
  ),
  para(
    "Total cost for two people, including all transportation: probably forty to sixty US dollars. The experience is a different country than the resort version, and the food is dramatically better.",
  ),

  h2("Final Thoughts"),
  para(
    "Dominican cuisine doesn't have the international fame of Mexican, Cuban, or Peruvian food, but it's quietly one of the strongest food cultures in the Caribbean. Every dish carries history — Taíno root vegetables, African slow-cooking, Spanish sofrito, regional Caribbean improvisation. To eat Dominican food properly is to understand the country itself in a way that no museum visit can match.",
  ),
  para(
    "If you'd like recommendations specific to where you're staying, or want to add a food-focused excursion to your trip, [[contact our team|https://puntacana-excursions.com/contact]] with your dates and dietary preferences. We'll suggest the spots that match what you're hoping to try, and we'll be honest about which experiences are easy and which take some planning. Good Dominican food is everywhere in this country — you just have to know to step outside the resort walls to find it.",
  ),
];

const foodBodyEs = [
  para(
    "La comida dominicana es una de las grandes cocinas infravaloradas del Caribe. Bebe de raíces taínas, españolas y africanas, en capas sobre cinco siglos de comercio, migración e improvisación. El resultado es una cocina construida sobre unos pocos ingredientes básicos — arroz, habichuelas, plátano, viandas, cerdo, pollo, pescado fresco — combinados de maneras que van de lo cotidiano a lo genuinamente refinado. Si te quedas solo dentro de tu resort, comerás bien, pero te perderás la mayor parte de lo que hace distintiva a la comida dominicana.",
  ),
  para(
    "Esta guía recorre los platos que vale la pena probar, las comidas que anclan la vida cotidiana dominicana, las especialidades regionales y los consejos prácticos sobre dónde encontrar realmente versiones auténticas mientras estás en Punta Cana. Si quieres explorar más allá del resort, nuestras [[excursiones de cultura y naturaleza|https://puntacana-excursions.com/excursions?category=culture-nature]] incluyen varias salidas de un día centradas en la comida.",
  ),

  h2("Los Fundamentos: Arroz, Habichuelas y Carne"),
  para(
    "La comida más importante de la vida cotidiana dominicana se llama \"la bandera dominicana\". Es un plato de arroz blanco, habichuelas rojas o negras guisadas, pollo o carne de res guisada, y casi siempre un acompañamiento de plátanos fritos o ensalada verde. El plato recibe su nombre de los colores que evocan vagamente la bandera nacional: arroz blanco, habichuelas rojas, carne marrón, ensalada verde. Existen variaciones en cada rincón del país, y cada familia dominicana lo hace de forma ligeramente diferente.",
  ),
  para(
    "Lo que hace que la bandera valga la pena buscar es el propio guiso de habichuelas. Las habichuelas dominicanas se cocinan lentamente con sofrito, calabaza (un zapallo dulce local), orégano, ajo y pimiento. Tienen cuerpo y profundidad que ningún plato rápido de habichuelas enlatadas puede igualar. Una buena bandera en un comedor (pequeño restaurante familiar) cuesta de 200 a 350 pesos dominicanos — unos cuatro a siete dólares estadounidenses — y te alimenta por el resto del día.",
  ),

  h2("Mangú: El Desayuno Que Define un País"),
  para(
    "Si hay un plato dominicano del que los viajeros se enamoran constantemente, es el mangú. La preparación es simple: plátanos verdes hervidos hasta ablandar, luego majados con mantequilla y un chorrito del agua de cocción hasta quedar suaves, cubiertos con cebollas rojas sofritas en vinagre. La textura está entre puré de papas y una polenta espesa, con la inconfundible dulzura almidonada del plátano verde por debajo. Se sirve en el desayuno, casi siempre acompañado de tres adiciones — queso frito, salami dominicano frito y huevos fritos. Esta combinación tiene nombre: \"los tres golpes\".",
  ),
  para(
    "El mangú es el desayuno nacional no oficial. Se come los fines de semana, en los feriados, los domingos después de Misa, y en pequeños restaurantes de desayuno cualquier día de la semana. La primera vez que pruebas un mangú real en una mesa familiar dominicana es el momento en que la mayoría de los visitantes dejan de pensar en la comida dominicana como buffet caribeño y empiezan a pensar en ella como una cocina seria por derecho propio. El plato tiene tanto peso cultural que existe un dicho popular — \"yo soy más dominicano que el mangú\" — usado para reclamar identidad dominicana profunda.",
  ),
  h3("Dónde Probar Mangú Cerca de Punta Cana"),
  para(
    "La mayoría de los resorts todo-incluido ahora sirven mangú en el buffet del desayuno, y la calidad varía ampliamente. Los plátanos suelen estar sobrecocidos o submajados, las cebollas insuficientemente reducidas. La versión real está en pequeños restaurantes de pueblos como Veron, Friusa y los barrios interiores de Bávaro. Pregúntale a cualquier taxista dónde desayuna su madre, y obtendrás una mejor respuesta de la que cualquier sitio de reseñas pueda dar. El trayecto desde un resort es típicamente de 15 a 25 minutos, y el desayuno para dos cuesta menos de veinte dólares.",
  ),

  h2("Sancocho: El Guiso del Domingo"),
  para(
    "El sancocho es el plato alrededor del cual se reúnen las familias dominicanas. Es un guiso espeso y profundamente capeado de múltiples carnes (tradicionalmente siete, en la versión más elaborada) cocidas con viandas — yuca, yautía, ñame, auyama — más plátanos verdes, mazorca y una base generosa de sofrito. La cocción toma la mayor parte de un día. El resultado es algo entre guiso y sopa, servido en un plato hondo con arroz al lado y rebanadas de aguacate. La primera cucharada explica mucho sobre por qué los dominicanos tratan el sancocho como comida de celebración.",
  ),
  para(
    "La versión más legendaria es el \"sancocho de siete carnes\", que tradicionalmente incluye res, cerdo, pollo, longaniza, cerdo ahumado, chivo, y a veces una séptima carne dependiendo de la familia. Esta versión se hace para bodas, bautismos, reuniones familiares y feriados importantes. Las versiones cotidianas más simples pueden usar solo pollo o solo carne de res, pero comparten la misma profundidad en capas. El sancocho es el plato que se hace cuando hay algo que celebrar y tiempo para cocinarlo apropiadamente.",
  ),
  h3("Dónde Probar Sancocho"),
  para(
    "El sancocho es raro en los menús de resort y rara vez bien hecho cuando aparece allí. La mayoría de los resorts lo sirven los domingos en sus estaciones de \"cocina local\", pero la versión suele estar aguada. Para experimentar sancocho real, necesitas visitar una casa dominicana (que nuestro [[equipo de contacto|https://puntacana-excursions.com/contact]] a veces puede gestionar a través de conexiones comunitarias) o visitar un comedor un domingo por la tarde, cuando muchas familias lo preparan específicamente para la comida después de la iglesia.",
  ),

  h2("Mofongo: La Montaña de Plátano"),
  para(
    "El mofongo es de origen puertorriqueño pero ha sido completamente adoptado en la cocina dominicana. Se hace con plátanos verdes fritos majados en un mortero de madera (pilón) con ajo, sal y chicharrón, luego moldeados en un montículo denso y sabroso. El mofongo dominicano suele servirse con una proteína al lado — generalmente camarones al ajillo, pollo guisado o cerdo — y un pequeño tazón de caldo de ajo y tomate vertido en un pocillo en la parte superior.",
  ),
  para(
    "El plato tiene rango. Un mofongo simple en un puesto de carretera puede costar diez dólares y ser completamente satisfactorio; un mofongo refinado en un restaurante dominicano de alta gama puede costar veinticinco dólares y ser arquitectónico. Cualquiera de las versiones vale la pena probar. El majado de los plátanos crea una textura que no se puede replicar con ningún otro método — ligeramente masticable, densa, profundamente ajosa. El mofongo es el plato que los visitantes más a menudo intentan recrear en casa e inmediatamente entienden que necesitan volver a la República Dominicana para tener el real.",
  ),

  h2("Pollo Guisado y el Arte de las Carnes Guisadas"),
  para(
    "Si comes en una casa dominicana, hay muchas probabilidades de que la proteína central sea pollo guisado. La preparación implica marinar el pollo con sofrito, orégano, jugo de limón y ajo, luego dorar las piezas en azúcar caramelizada (sí, azúcar — esta es la técnica dominicana de color y profundidad) antes de guisarlas con pimientos, tomates y una pequeña cantidad de agua. El pollo sale del color caoba profundo de la cocción larga, con una salsa que se sirve generosamente sobre el arroz.",
  ),
  para(
    "La técnica del azúcar caramelizado es lo que hace distintivas a las carnes guisadas dominicanas. También se usa para res (carne guisada), cerdo (cerdo guisado) e incluso pescado. La técnica suena extraña hasta que la pruebas — el azúcar no hace dulce el plato; profundiza el color y añade una nota de fondo sutil, casi ahumada. Una vez que has comido pollo guisado bien hecho, la pechuga de pollo deshuesada del buffet del resort empieza a sentirse como una comida diferente por completo.",
  ),

  h2("Mariscos: Las Especialidades Costeras"),
  para(
    "Punta Cana está en la costa, y la cultura de mariscos dominicana es genuinamente buena. La preparación por defecto es pescado entero a la parrilla o frito — generalmente un pequeño pargo o mero — servido con tostones (rodajas de plátano verde frito dos veces), arroz blanco y ensalada. El pescado típicamente es capturado pocas horas antes de servirse en restaurantes más pequeños en la playa. La calidad en los restaurantes de mariscos de alta gama en Bávaro y Cap Cana es excelente y fácil de encontrar; la experiencia más interesante está en las pequeñas casetas de playa en Bayahibe, Macao y El Cortecito.",
  ),
  h3("Pescado con Coco"),
  para(
    "En la Península de Samaná, a varias horas de Punta Cana, la especialidad local es el pescado con coco — pescado entero guisado en leche de coco fresca con plátano verde, ajo y hierbas. Es uno de los platos dominicanos más distintivos y un claro ejemplo de la influencia culinaria africana occidental. Samaná es una excursión de un día desde Punta Cana (unas tres horas en cada dirección), y en el viaje a veces puedes combinar el plato con avistamiento de ballenas jorobadas de enero a marzo.",
  ),
  h3("Locrio — Los Arroces Dominicanos"),
  para(
    "El locrio es el equivalente dominicano de la paella o el arroz con pollo, pero con su propio carácter distintivo. El arroz se cocina con sofrito, pasta de tomate y una proteína — generalmente pollo (locrio de pollo), camarones (locrio de camarones) o sardinas (locrio de arenque). Los granos salen amarillo-anaranjados, ligeramente aceitosos, profundamente sabrosos. Un buen plato de locrio en un comedor es uno de los almuerzos más satisfactorios que puedes tener por menos de diez dólares.",
  ),

  h2("Comida Callejera y Snacks"),
  h3("Empanadas y Pastelitos"),
  para(
    "Las empanadas dominicanas (llamadas pastelitos en algunas regiones) son hojaldres fritos rellenos de carne sazonada, queso o vegetales. Aparecen en el desayuno, como snacks, en fiestas, en puestos de carretera. La masa es delgada y ligeramente crujiente; el relleno es generoso. Un plato de tres o cuatro pastelitos más un jugo de fruta fresca es una clásica comida callejera de media mañana. La mayoría de las zonas de resort tienen al menos una panadería que los hace adecuadamente.",
  ),
  h3("Chimichurri — La Hamburguesa Dominicana"),
  para(
    "El nombre es confuso — el chimichurri argentino es una salsa verde de hierbas. El chimichurri dominicano (a menudo escrito \"chimi\") es una hamburguesa callejera: hamburguesa de carne molida, repollo, tomate, cebolla y una salsa rosada especial hecha de ketchup, mayonesa y salsa inglesa, servida en un bollo redondo suave. Los camiones de comida que venden chimis aparecen en las carreteras cada noche y son un querido snack nocturno en todo el país. Cuestan dos a tres dólares y son más auténticos por la noche alrededor de las 10:00 PM, cuando los camiones locales están en su momento de mayor actividad.",
  ),
  h3("Yaniqueques y Johnny Cakes"),
  para(
    "Los yaniqueques son discos planos de masa frita, algo entre una tortilla y un pan frito. Se originaron en las comunidades de descendientes africanos angloparlantes de la Península de Samaná (el nombre proviene de \"johnny cakes\"). Vendidos por vendedores de playa, son salados, ligeros, adictivos. Combinan perfectamente con la cerveza local fría (Presidente). Si un vendedor de playa pasa con una canasta de yaniqueques, compra uno — incluso si no tienes hambre.",
  ),

  h2("Dulces y Postres"),
  para(
    "Los postres dominicanos se inclinan hacia lo dulce y lácteo. El más famoso es el dulce de leche cortada — un postre de queso fresco y leche que se parece a una ricotta dulce con un toque de canela. El dulce de coco y el dulce de batata son igualmente comunes. Se venden en puestos de carretera por todo el país, a menudo en pequeños recipientes plásticos. En restaurantes más elaborados, busca arroz con leche (pudín de arroz hecho con leche condensada y canela) y majarete (un pudín a base de maíz).",
  ),
  para(
    "La fruta tropical fresca es el postre cotidiano. Mango, papaya, chinola (maracuyá), piña, guanábana, zapote y lechosa están todas de temporada en diferentes momentos del año y son dramáticamente mejores que las versiones importadas que se encuentran en supermercados de países más fríos. Un puesto de fruta de carretera vendiendo mango cortado con jugo de limón y una pizca de sal es uno de los placeres baratos del viaje dominicano.",
  ),

  h2("Bebidas: Ron, Café y Mamajuana"),
  h3("Café"),
  para(
    "El café dominicano se cultiva en las montañas centrales y es excelente. Tiende a ser tostado oscuro y rico, a menudo servido como una pequeña taza estilo expreso con bastante azúcar ya añadida. \"Café\" en una casa dominicana o comedor significa esta pequeña taza dulce, no el gran café de filtro estadounidense. Si lo quieres sin azúcar, pide \"café sin azúcar\" — pero pruébalo a la manera local al menos una vez.",
  ),
  h3("Ron"),
  para(
    "La República Dominicana es una de las grandes naciones productoras de ron del Caribe. Las tres marcas principales son Brugal, Barceló y Bermúdez — cada una con múltiples expresiones que van del ron blanco a rones añejos para degustar. El Brugal Añejo es el caballo de batalla cotidiano; el Barceló Imperial y el Bermúdez Aniversario son las botellas añejas premium que valen la pena en una degustación. El ron se sirve solo en vasos pequeños, a menudo con un chorrito de limón, o como base del clásico Cuba Libre (ron, Coca-Cola, limón).",
  ),
  h3("Mamajuana"),
  para(
    "La mamajuana es el licor herbal tradicional del país — una mezcla de ron, vino tinto, miel, corteza de árbol y hierbas secas maceradas juntas durante semanas. El resultado es un líquido marrón oscuro con un sabor complejo, ligeramente medicinal que te va gustando a lo largo de algunos sorbos. Los dominicanos tienen muchas afirmaciones tradicionales sobre sus propiedades restauradoras; la realidad moderna es que es una bebida cultural única que vale la pena probar al menos una vez. La mayoría de los bares en Punta Cana la sirven, y las botellas son excelentes souvenirs para llevar a casa.",
  ),

  h2("Cómo Encontrar Comida Dominicana Auténtica Cerca de Punta Cana"),
  para(
    "La mayor barrera para comer comida dominicana auténtica en Punta Cana es que la experiencia del resort está diseñada para aislarte de la vida local. El buffet todo-incluido sí incluye algunos platos locales, pero inevitablemente están suavizados para paladares internacionales. Para encontrar la comida real, necesitas salir del resort. Tres estrategias prácticas:",
  ),
  li("**Toma un taxi 15 a 25 minutos hacia el interior.** La mayoría de las zonas de resort tienen pueblos cercanos — Veron, Friusa, Higüey, El Cortecito — donde los dominicanos realmente viven y comen. Los comedores y restaurantes familiares son abundantes y económicos. Un taxi para el viaje redondo cuesta $30 a $50 USD."),
  li("**Únete a una excursión centrada en comida.** Nuestras [[excursiones de cultura y naturaleza|https://puntacana-excursions.com/excursions?category=culture-nature]] incluyen varias salidas de un día que combinan sitios culturales con paradas en restaurantes locales. La ventaja es que el operador maneja el transporte y traduce por ti."),
  li("**Usa los restaurantes a la carta del resort estratégicamente.** El restaurante \"local\" o \"dominicano\" de tu resort suele ser la opción más auténtica en el sitio. La cocina sigue adaptada a paladares internacionales, pero los platos mismos son reconocibles. Pregúntale al personal qué platos son más tradicionales y pide esos, no los sustitutos internacionales."),

  h2("Un Día Comiendo Como un Dominicano"),
  para(
    "Si quieres construir un día real de comida dominicana, así se vería. Desayuno: mangú con los tres golpes en un pequeño restaurante de desayuno en Veron, alrededor de las 8:00 AM. A media mañana: un jugo de fruta fresca (chinola) de un puesto de carretera. Almuerzo: la bandera en un comedor, alrededor de la 1:00 PM — la mayoría de los dominicanos comen su comida principal a mediodía. A media tarde: un pequeño café dulce. Snack al final de la tarde: un yaniqueque o empanada de un vendedor de playa. Cena: pescado entero a la parrilla con tostones en un restaurante costero, alrededor de las 8:00 PM. Tarde en la noche: un chimi de un camión callejero alrededor de las 10:30 PM, caminando de regreso al resort o comiendo en el propio camión.",
  ),
  para(
    "Costo total para dos personas, incluyendo todo el transporte: probablemente cuarenta a sesenta dólares estadounidenses. La experiencia es un país diferente al de la versión del resort, y la comida es dramáticamente mejor.",
  ),

  h2("Reflexiones Finales"),
  para(
    "La cocina dominicana no tiene la fama internacional de la comida mexicana, cubana o peruana, pero es silenciosamente una de las culturas gastronómicas más fuertes del Caribe. Cada plato lleva historia — viandas taínas, cocción lenta africana, sofrito español, improvisación caribeña regional. Comer comida dominicana apropiadamente es entender el propio país de una manera que ninguna visita a un museo puede igualar.",
  ),
  para(
    "Si te gustaría recibir recomendaciones específicas para donde te alojas, o quieres agregar una excursión centrada en comida a tu viaje, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] con tus fechas y preferencias dietéticas. Sugeriremos los lugares que coincidan con lo que esperas probar, y seremos honestos sobre cuáles experiencias son fáciles y cuáles requieren algo de planificación. La buena comida dominicana está en todas partes en este país — solo tienes que saber salir de los muros del resort para encontrarla.",
  ),
];

const foodBodyFr = [
  para(
    "La cuisine dominicaine est l'une des grandes cuisines sous-estimées des Caraïbes. Elle puise dans des racines taïnos, espagnoles et ouest-africaines, superposées sur cinq siècles de commerce, de migration et d'improvisation. Le résultat est une cuisine construite autour de quelques ingrédients de base — riz, haricots, plantain, légumes-racines, porc, poulet, poisson frais — combinés de manières qui vont du quotidien au véritablement raffiné. Si vous restez uniquement dans votre resort, vous mangerez bien, mais vous manquerez la plupart de ce qui rend la cuisine dominicaine distinctive.",
  ),
  para(
    "Ce guide parcourt les plats à essayer, les repas qui ancrent la vie quotidienne dominicaine, les spécialités régionales et les conseils pratiques sur où trouver réellement des versions authentiques pendant votre séjour à Punta Cana. Si vous voulez explorer au-delà du resort, nos [[excursions culture et nature|https://puntacana-excursions.com/excursions?category=culture-nature]] incluent plusieurs sorties d'une journée axées sur la nourriture.",
  ),

  h2("Les Fondations : Riz, Haricots et Viande"),
  para(
    "Le repas le plus important de la vie quotidienne dominicaine s'appelle \"la bandera dominicana\" — le drapeau dominicain. C'est une assiette de riz blanc, de haricots rouges ou noirs (habichuelas guisadas), de poulet ou de bœuf mijoté, et presque toujours un accompagnement de plantains frits ou de salade verte. Le plat tire son nom des couleurs qui évoquent vaguement le drapeau national : riz blanc, haricots rouges, viande marron, salade verte. Des variations existent dans chaque coin du pays, et chaque famille dominicaine le fait légèrement différemment.",
  ),
  para(
    "Ce qui rend la bandera digne d'être recherchée, c'est le ragoût de haricots lui-même. Les habichuelas dominicaines sont mijotées lentement avec du sofrito, de la calabaza (une courge douce locale), de l'origan, de l'ail et du poivron. Elles ont du corps et de la profondeur qu'aucun plat rapide de haricots en conserve ne peut égaler. Une bonne bandera dans un comedor (petit restaurant familial) coûte de 200 à 350 pesos dominicains — environ quatre à sept dollars américains — et vous nourrit pour le reste de la journée.",
  ),

  h2("Mangú : Le Petit-Déjeuner qui Définit un Pays"),
  para(
    "S'il y a un plat dominicain dont les voyageurs tombent constamment amoureux, c'est le mangú. La préparation est simple : des plantains verts bouillis jusqu'à tendreté, puis écrasés avec du beurre et un peu d'eau de cuisson jusqu'à devenir lisses, garnis d'oignons rouges sautés au vinaigre. La texture se situe entre la purée de pommes de terre et une polenta épaisse, avec l'inimitable douceur féculente du plantain vert en dessous. Il est servi au petit-déjeuner, presque toujours accompagné de trois additions — fromage frit, salami dominicain frit et œufs frits. Cette combinaison a un nom : \"los tres golpes\" (les trois coups).",
  ),
  para(
    "Le mangú est le petit-déjeuner national officieux. On le mange les week-ends, les jours fériés, les dimanches après la Messe, et dans les petits restaurants de petit-déjeuner n'importe quel jour de la semaine. La première fois que vous goûtez un vrai mangú à une table familiale dominicaine est le moment où la plupart des visiteurs cessent de penser à la cuisine dominicaine comme à un buffet caribéen et commencent à y penser comme à une cuisine sérieuse à part entière. Le plat a tellement de poids culturel qu'il existe un dicton populaire — \"yo soy más dominicano que el mangú\" (je suis plus dominicain que le mangú) — utilisé pour revendiquer une identité dominicaine profonde.",
  ),
  h3("Où Goûter le Mangú Près de Punta Cana"),
  para(
    "La plupart des resorts tout-inclus servent maintenant du mangú au buffet du petit-déjeuner, et la qualité varie largement. Les plantains sont généralement trop cuits ou insuffisamment écrasés, les oignons inadéquatement réduits. La vraie version se trouve dans les petits restaurants des villes comme Veron, Friusa et les quartiers intérieurs de Bávaro. Demandez à n'importe quel chauffeur de taxi où sa mère prend son petit-déjeuner, et vous obtiendrez une meilleure réponse que ce que n'importe quel site d'avis peut fournir. Le trajet depuis un resort est typiquement de 15 à 25 minutes, et le petit-déjeuner pour deux coûte moins de vingt dollars.",
  ),

  h2("Sancocho : Le Ragoût du Dimanche"),
  para(
    "Le sancocho est le plat autour duquel les familles dominicaines se rassemblent. C'est un ragoût épais et profondément stratifié de plusieurs viandes (traditionnellement sept, dans la version la plus élaborée) cuites avec des légumes-racines — yuca, yautía, ñame, auyama (courge) — plus des plantains verts, du maïs et une base généreuse de sofrito. La cuisson prend la majeure partie d'une journée. Le résultat est quelque chose entre un ragoût et une soupe, servi dans un bol avec du riz à côté et des tranches d'avocat. La première cuillerée explique beaucoup pourquoi les Dominicains traitent le sancocho comme un plat de célébration.",
  ),
  para(
    "La version la plus légendaire est le \"sancocho de siete carnes\" — sancocho aux sept viandes — qui inclut traditionnellement bœuf, porc, poulet, saucisse, porc fumé, chèvre, et parfois une septième viande selon la famille. Cette version est faite pour les mariages, les baptêmes, les réunions de famille et les grandes fêtes. Les versions quotidiennes plus simples peuvent n'utiliser que du poulet ou seulement du bœuf, mais elles partagent la même profondeur en couches. Le sancocho est le plat que l'on fait quand il y a quelque chose à célébrer et du temps pour cuisiner correctement.",
  ),
  h3("Où Goûter le Sancocho"),
  para(
    "Le sancocho est rare sur les menus de resort et rarement bien fait quand il y apparaît. La plupart des resorts le servent le dimanche dans leurs stations de \"cuisine locale\", mais la version est généralement aqueuse. Pour vivre un vrai sancocho, vous devez soit visiter une maison dominicaine (ce que notre [[équipe de contact|https://puntacana-excursions.com/contact]] peut parfois organiser via des connexions communautaires) soit visiter un comedor un dimanche après-midi, quand de nombreuses familles le préparent spécifiquement pour le repas d'après-messe.",
  ),

  h2("Mofongo : La Montagne de Plantain"),
  para(
    "Le mofongo est d'origine portoricaine mais a été complètement adopté dans la cuisine dominicaine. Il est fait à partir de plantains verts frits pilés dans un mortier en bois (pilón) avec de l'ail, du sel et du chicharrón (couenne de porc frite), puis façonnés en un monticule dense et savoureux. Le mofongo dominicain est souvent servi avec une protéine en accompagnement — généralement crevettes à l'ail, poulet mijoté ou porc — et un petit bol de bouillon ail-tomate versé dans un puits au sommet.",
  ),
  para(
    "Le plat a de la portée. Un mofongo simple dans un stand de bord de route peut coûter dix dollars et être entièrement satisfaisant ; un mofongo raffiné dans un restaurant dominicain haut de gamme peut coûter vingt-cinq dollars et être architectural. L'une ou l'autre version vaut la peine d'être essayée. Le pilage des plantains crée une texture que vous ne pouvez répliquer avec aucune autre méthode — légèrement moelleuse, dense, profondément aillée. Le mofongo est le plat que les visiteurs essaient le plus souvent de recréer chez eux et comprennent immédiatement qu'ils doivent revenir en République dominicaine pour le vrai.",
  ),

  h2("Pollo Guisado et l'Art des Viandes Mijotées"),
  para(
    "Si vous mangez dans une maison dominicaine, il est très probable que la protéine centrale soit le pollo guisado — poulet mijoté. La préparation implique de mariner le poulet avec du sofrito, de l'origan, du jus de citron vert et de l'ail, puis de dorer les morceaux dans du sucre caramélisé (oui, du sucre — c'est la technique dominicaine de couleur et de profondeur) avant de les mijoter avec des poivrons, des tomates et une petite quantité d'eau. Le poulet sort de la couleur acajou profonde de la cuisson longue, avec une sauce qui est servie généreusement sur le riz.",
  ),
  para(
    "La technique du sucre caramélisé est ce qui rend les viandes mijotées dominicaines distinctives. Elle est aussi utilisée pour le bœuf (carne guisada), le porc (cerdo guisado), et même le poisson. La technique sonne bizarrement jusqu'à ce que vous l'essayiez — le sucre ne rend pas le plat sucré ; il approfondit la couleur et ajoute une note d'arrière-plan subtile, presque fumée. Une fois que vous avez mangé un pollo guisado bien fait, la poitrine de poulet désossée du buffet du resort commence à ressembler à une nourriture entièrement différente.",
  ),

  h2("Fruits de Mer : Les Spécialités Côtières"),
  para(
    "Punta Cana est sur la côte, et la culture des fruits de mer dominicaine est véritablement bonne. La préparation par défaut est le poisson entier grillé ou frit — généralement un petit vivaneau ou mérou — servi avec des tostones (rondelles de plantain vert frites deux fois), du riz blanc et de la salade. Le poisson est typiquement pêché quelques heures avant d'être servi dans les petits restaurants en bord de plage. La qualité dans les restaurants de fruits de mer haut de gamme à Bávaro et Cap Cana est excellente et facile à trouver ; l'expérience la plus intéressante se trouve dans les petites cabanes de plage à Bayahibe, Macao et El Cortecito.",
  ),
  h3("Pescado con Coco — Poisson à la Noix de Coco"),
  para(
    "Sur la péninsule de Samaná, à plusieurs heures de Punta Cana, la spécialité locale est le pescado con coco — poisson entier mijoté dans du lait de coco frais avec plantain vert, ail et herbes. C'est l'un des plats dominicains les plus distinctifs et un exemple clair de l'influence culinaire ouest-africaine. Samaná est une excursion d'une journée depuis Punta Cana (environ trois heures dans chaque direction), et lors du voyage vous pouvez parfois combiner le plat avec l'observation des baleines à bosse de janvier à mars.",
  ),
  h3("Locrio — Les Riz Dominicains"),
  para(
    "Le locrio est l'équivalent dominicain de la paella ou de l'arroz con pollo, mais avec son propre caractère distinct. Le riz est cuit avec du sofrito, de la pâte de tomate et une protéine — généralement poulet (locrio de pollo), crevettes (locrio de camarones) ou sardines (locrio de arenque). Les grains sortent jaune-orangé, légèrement huileux, profondément parfumés. Une bonne assiette de locrio dans un comedor est l'un des déjeuners les plus satisfaisants que vous puissiez avoir pour moins de dix dollars.",
  ),

  h2("Cuisine de Rue et Snacks"),
  h3("Empanadas et Pastelitos"),
  para(
    "Les empanadas dominicaines (appelées pastelitos dans certaines régions) sont des chaussons frits remplis de viande assaisonnée, de fromage ou de légumes. Elles apparaissent au petit-déjeuner, comme snacks, dans les fêtes, sur les stands de bord de route. La pâte est fine et légèrement croustillante ; la garniture est généreuse. Une assiette de trois ou quatre pastelitos plus un jus de fruit frais est un classique repas de rue de milieu de matinée. La plupart des zones de resort ont au moins une boulangerie ou panadería qui les fait correctement.",
  ),
  h3("Chimichurri — Le Burger Dominicain"),
  para(
    "Le nom est déroutant — le chimichurri argentin est une sauce verte aux herbes. Le chimichurri dominicain (souvent orthographié \"chimi\") est un burger de rue : steak haché, chou, tomate, oignon et une sauce rose spéciale faite de ketchup, mayonnaise et sauce Worcestershire, servi sur un petit pain rond et moelleux. Les camions de nourriture vendant des chimis apparaissent en bord de route chaque soir et sont un snack nocturne adoré à travers le pays. Ils coûtent deux à trois dollars et sont les plus authentiques la nuit autour de 22h00, quand les camions locaux sont à leur plus animé.",
  ),
  h3("Yaniqueques et Johnny Cakes"),
  para(
    "Les yaniqueques sont des disques plats de pâte frite, quelque part entre une tortilla et un pain frit. Ils ont vu le jour dans les communautés anglophones d'ascendance africaine de la péninsule de Samaná (le nom vient de \"johnny cakes\"). Vendus par les vendeurs de plage, ils sont salés, légers, addictifs. Ils s'associent parfaitement avec la bière locale froide (Presidente). Si un vendeur de plage passe avec un panier de yaniqueques, achetez-en un — même si vous n'avez pas faim.",
  ),

  h2("Sucreries et Desserts"),
  para(
    "Les desserts dominicains tirent vers le sucré et le laitier. Le plus célèbre est le dulce de leche cortada — un dessert de fromage frais et lait qui ressemble à une ricotta sucrée avec une touche de cannelle. Le dulce de coco et le dulce de batata (de patate douce) sont également communs. Ils sont vendus dans des stands en bord de route à travers le pays, souvent dans de petits récipients en plastique. Dans les restaurants plus élaborés, cherchez l'arroz con leche (riz au lait fait avec du lait concentré et de la cannelle) et le majarete (un pudding à base de maïs).",
  ),
  para(
    "Les fruits tropicaux frais sont le dessert quotidien. Mangue, papaye, fruit de la passion, ananas, corossol (guanábana), zapote et lechosa sont tous de saison à différents moments de l'année et sont dramatiquement meilleurs que les versions importées trouvées dans les supermarchés des pays plus froids. Un stand de fruits en bord de route vendant de la mangue coupée avec du jus de citron vert et une pincée de sel est l'un des plaisirs pas chers du voyage dominicain.",
  ),

  h2("Boissons : Rhum, Café et Mamajuana"),
  h3("Café"),
  para(
    "Le café dominicain est cultivé dans les montagnes centrales et il est excellent. Il tend à être torréfié foncé et riche, souvent servi sous forme de petite tasse style expresso avec du sucre déjà substantiellement ajouté. \"Café\" dans une maison dominicaine ou un comedor signifie cette petite tasse sucrée, pas le grand café filtre américain. Si vous le voulez sans sucre, demandez \"café sin azúcar\" — mais essayez-le à la manière locale au moins une fois.",
  ),
  h3("Rhum"),
  para(
    "La République dominicaine est l'une des grandes nations productrices de rhum des Caraïbes. Les trois principales marques sont Brugal, Barceló et Bermúdez — chacune avec de multiples expressions allant du rhum blanc aux rhums vieillis à déguster. Le Brugal Añejo est le cheval de bataille quotidien ; le Barceló Imperial et le Bermúdez Aniversario sont les bouteilles vieillies premium qui valent une dégustation. Le rhum est servi pur dans de petits verres, souvent avec un peu de citron vert, ou comme base du classique Cuba Libre (rhum, Coca-Cola, citron vert).",
  ),
  h3("Mamajuana"),
  para(
    "La mamajuana est la liqueur herbale traditionnelle du pays — un mélange de rhum, vin rouge, miel, écorce d'arbre et herbes séchées macérés ensemble pendant des semaines. Le résultat est un liquide brun foncé avec un goût complexe, légèrement médicinal qui vous gagne au fil de quelques gorgées. Les Dominicains ont de nombreuses revendications traditionnelles sur ses propriétés restauratives ; la réalité moderne est que c'est une boisson culturelle unique qui vaut la peine d'être essayée une fois. La plupart des bars à Punta Cana la servent, et des bouteilles font d'excellents souvenirs à rapporter à la maison.",
  ),

  h2("Comment Trouver de la Vraie Cuisine Dominicaine Près de Punta Cana"),
  para(
    "Le plus grand obstacle pour manger de la vraie cuisine dominicaine à Punta Cana est que l'expérience du resort est conçue pour vous isoler de la vie locale. Le buffet tout-inclus inclut bien quelques plats locaux, mais ils sont inévitablement adoucis pour les palais internationaux. Pour trouver la vraie nourriture, vous devez quitter le resort. Trois stratégies pratiques :",
  ),
  li("**Prenez un taxi 15 à 25 minutes vers l'intérieur.** La plupart des zones de resort ont des villes voisines — Veron, Friusa, Higüey, El Cortecito — où les Dominicains vivent et mangent réellement. Les comedores et restaurants familiaux sont abondants et peu chers. Un taxi pour l'aller-retour coûte 30 à 50 USD."),
  li("**Joignez-vous à une excursion axée sur la nourriture.** Nos [[excursions culture et nature|https://puntacana-excursions.com/excursions?category=culture-nature]] incluent plusieurs sorties d'une journée qui combinent sites culturels et arrêts dans des restaurants locaux. L'avantage est que l'opérateur gère le transport et traduit pour vous."),
  li("**Utilisez les restaurants à la carte du resort stratégiquement.** Le restaurant \"local\" ou \"dominicain\" de votre resort est généralement l'option la plus authentique sur place. La cuisine est encore adaptée aux palais internationaux, mais les plats eux-mêmes sont reconnaissables. Demandez au personnel quels plats sont les plus traditionnels et commandez ceux-là, pas les substituts internationaux."),

  h2("Une Journée à Manger Comme un Dominicain"),
  para(
    "Si vous voulez construire une vraie journée de cuisine dominicaine, voici à quoi elle ressemblerait. Petit-déjeuner : mangú avec los tres golpes dans un petit restaurant de petit-déjeuner à Veron, vers 8h00. Milieu de matinée : un jus de fruit frais (chinola, aussi appelé fruit de la passion) d'un stand de bord de route. Déjeuner : la bandera dans un comedor, vers 13h00 — la plupart des Dominicains prennent leur repas principal à midi. Milieu d'après-midi : un petit café sucré. Snack de fin d'après-midi : un yaniqueque ou empanada d'un vendeur de plage. Dîner : poisson entier grillé avec tostones dans un restaurant côtier, vers 20h00. Tard dans la nuit : un chimi d'un camion de rue vers 22h30, en marchant vers le resort ou en mangeant au camion lui-même.",
  ),
  para(
    "Coût total pour deux personnes, transport inclus : probablement quarante à soixante dollars américains. L'expérience est un pays différent de la version resort, et la nourriture est dramatiquement meilleure.",
  ),

  h2("Réflexions Finales"),
  para(
    "La cuisine dominicaine n'a pas la renommée internationale de la cuisine mexicaine, cubaine ou péruvienne, mais c'est silencieusement l'une des plus fortes cultures culinaires des Caraïbes. Chaque plat porte l'histoire — légumes-racines taïnos, cuisson lente africaine, sofrito espagnol, improvisation caribéenne régionale. Manger de la cuisine dominicaine correctement, c'est comprendre le pays lui-même d'une manière qu'aucune visite de musée ne peut égaler.",
  ),
  para(
    "Si vous voulez des recommandations spécifiques à l'endroit où vous séjournez, ou voulez ajouter une excursion axée sur la nourriture à votre voyage, [[contactez notre équipe|https://puntacana-excursions.com/contact]] avec vos dates et préférences alimentaires. Nous suggérerons les endroits qui correspondent à ce que vous espérez essayer, et nous serons honnêtes sur quelles expériences sont faciles et lesquelles demandent un peu de planification. La bonne cuisine dominicaine est partout dans ce pays — il faut juste savoir sortir des murs du resort pour la trouver.",
  ),
];

// ===========================================================================
// ARTICLE 2 — Beyond the Resort: Higüey & Local Towns (EN, ES, DE)
// ===========================================================================

const localTownsBodyEn = [
  para(
    "Most visitors to Punta Cana spend their entire trip inside a walled all-inclusive resort, separated from the actual country by security gates, manicured landscaping, and ten kilometers of paved access road. The resorts are excellent at what they do — comfortable, safe, beautiful, easy. But they're also a curated version of the Dominican Republic that's a little too clean and a little too quiet. The real country starts when you leave the gate.",
  ),
  para(
    "This guide walks through the towns and cities near Punta Cana that show how Dominicans actually live, work, worship, and shop. Some are tourist-aware, some are not. All of them are worth at least half a day if you want a fuller picture of where you're staying. The most accessible options can be reached with a taxi; the more interesting ones benefit from a guided [[culture and nature excursion|https://puntacana-excursions.com/excursions?category=culture-nature]] that handles transportation and adds context.",
  ),

  h2("Higüey: The Religious Heart of the Region"),
  para(
    "Higüey is the largest city in the eastern Dominican Republic and the spiritual capital of the country. It sits about 40 kilometers inland from Punta Cana — a 45-minute drive on the highway — and houses the most important Catholic shrine in the country: the Basilica of Our Lady of Altagracia. Even if you're not Catholic, the basilica is worth visiting for the architecture alone. Designed by French architects and completed in 1971, the building is a soaring concrete arch shaped like praying hands, rising 80 meters above the surrounding plaza. The interior is open, light-filled, and acoustically remarkable.",
  ),
  para(
    "The Virgin of Altagracia is the patron saint of the Dominican Republic, and on January 21 each year hundreds of thousands of pilgrims walk from across the country to Higüey for her feast day. On most days the basilica is quieter — locals lighting candles, families baptizing babies, occasional tour groups passing through. Mass is held multiple times daily. The plaza outside has vendors selling religious medals, candles, and snacks, and a series of small restaurants and cafes that serve unpretentious, affordable Dominican food.",
  ),
  h3("What to See in Higüey Beyond the Basilica"),
  para(
    "The town's central park, Parque Central, is a few blocks from the basilica and is the kind of place where locals sit on benches, kids play, shoeshine workers ply their trade, and the rhythm of normal Dominican town life unfolds. The older Catholic church on the park, San Dionisio, was originally built in 1572 and is one of the oldest churches in the Americas. The market a few streets away is busy, loud, and entirely uncurated for tourists — produce, butchery, household goods, secondhand clothes, music blaring from a dozen speakers. It's not a tourist attraction; it's a working market, and walking through it for thirty minutes will teach you more about Dominican daily life than any number of guidebook entries.",
  ),
  h3("Practical Information for Higüey"),
  para(
    "A taxi from a Punta Cana resort to Higüey costs $60 to $80 USD round trip, depending on how long you stay. The drive takes 45 minutes each way. You don't need a guide for the basilica itself — the visit is straightforward — but a Spanish-speaking driver or guide is helpful for the market and central park if you don't speak Spanish. Plan three to four hours for the round trip and the visit. The best time of day is mid-morning, before the heat peaks and after the morning commute settles.",
  ),

  h2("Bayahibe: A Fishing Village That Became a Beach Town"),
  para(
    "Bayahibe sits about an hour southwest of Punta Cana and presents a different kind of trip. Originally a small fishing village, it's grown into a midsize beach town that retains far more of its original character than the resort zones. The village center is small enough to walk in twenty minutes — a stretch of beachfront restaurants, dive shops, fishing boats pulled up on the sand, a Catholic church, a few hotels. The water is exceptional — calm, clear, surrounded by reef. Bayahibe is the launching point for boat trips to Saona and Catalina Islands, and the [[Catalina day trip|https://www.grandbay-puntacana.com/trips/catalina]] departs from here.",
  ),
  para(
    "Spending half a day in Bayahibe rather than just passing through it is worthwhile. The village hosts a few good seafood restaurants where local fishermen sell directly. The fishing wharf in the early morning is a working scene — boats unloading, fish being sorted and weighed, dive operators preparing for the day's trips. Late afternoon brings out the local kids playing on the beach and the older men gathering at outdoor bars. Unlike the resort zones, Bayahibe has a population that lives there year-round, which gives it texture the resort areas lack.",
  ),

  h2("La Romana and Altos de Chavón"),
  para(
    "La Romana is the third-largest city in the Dominican Republic and sits about 1 hour and 45 minutes west of Punta Cana. It's the home of the sugar industry that historically defined the eastern part of the country, and parts of the city still reflect that — large sugar mills, worker housing, an old industrial railway. But the reason most travelers visit La Romana is the Casa de Campo resort complex on its eastern edge, which contains one of the country's most remarkable cultural sites: Altos de Chavón.",
  ),
  para(
    "Altos de Chavón is a recreation of a 16th-century Mediterranean village, built from local coral stone in the 1970s as a cultural project. The result is part theme park, part genuine art and design school. The buildings include a small church (where Frank Sinatra played a memorable concert at the village's opening), a 5,000-seat amphitheater modeled on Greek and Roman originals, a regional archaeological museum, and several artisan workshops where local craftspeople work with stone, ceramics, leather, and metal. The amphitheater hosts major concerts throughout the year.",
  ),
  para(
    "Whether Altos de Chavón is your taste depends on how you feel about themed historic recreations. It's not authentic in the strict sense — it was built fifty years ago. But the craftsmanship is genuine, the views over the Chavón River below are spectacular, and the experience is unlike anything else in the country. The on-site restaurants are good, though not cheap.",
  ),

  h2("Boca de Yuma: The Quiet Coast"),
  para(
    "Boca de Yuma is a small fishing village about an hour southwest of Punta Cana, at the mouth of the Yuma River where it meets the Caribbean Sea. It's the kind of place travelers find by accident and then return to deliberately. There are no resorts here, no large hotels, no all-inclusive infrastructure. Just a handful of small restaurants, a fishing wharf, dramatic coastal cliffs, and the cave systems of the East National Park visible across the water.",
  ),
  para(
    "The village hosts an annual Caribbean fishing festival in late May that draws boats from across the region. The rest of the year it's quiet. Lunch at one of the cliffside restaurants — usually grilled lobster or whole fish, with whatever the boats brought in that morning — is one of the most memorable meals you can have in this part of the country. The drive from Punta Cana takes about an hour each way, with a few of the small towns and farms passing along the way that give a feel for inland Dominican life.",
  ),

  h2("Macao Beach and the Northern Coast"),
  para(
    "If you want a stretch of beach that's been almost untouched by resort development, drive 30 minutes north of the main Punta Cana strip to Macao. The beach is long, broad, and backed by low cliffs and palm groves. It's a working beach — local Dominican families come here on weekends, surfers ride the small but consistent waves, beach vendors sell fish and coconuts directly to swimmers. The water is rougher than in the Bávaro resort zone (Atlantic, not Caribbean-protected), which gives Macao its own character. Several small beach restaurants serve fresh seafood at prices a fraction of what resorts charge.",
  ),
  para(
    "Heading further north along the coast, you reach smaller communities — El Macao village, then the inland route toward El Seibo and the Cordillera Oriental. Most of this area is rural, with sugar cane fields, cattle ranches, and small farming towns. It's not the kind of place that supports a polished tourist itinerary, but a half-day driving loop through this area gives you a sense of the country's rural eastern interior that no resort experience can match.",
  ),

  h2("Veron and Friusa: The Towns Where Resort Workers Live"),
  para(
    "Most resorts are staffed by people who don't live in the resort itself. They live in nearby towns — primarily Veron and Friusa — that have grown up specifically to support the tourism industry. These are not pretty colonial towns or charming villages. They're working-class commuter communities with rough roads, busy streets, and the everyday rhythm of working Dominican life.",
  ),
  para(
    "But that's exactly what makes them worth visiting if you want context for where you're staying. The comedores where resort workers eat breakfast and lunch serve some of the best Dominican food in the area at a fraction of resort prices. The small shops sell produce and household goods at local prices. The barber shops, hair salons, and small mechanic shops show the actual commercial life of the region. A taxi ride through Veron in the late afternoon, watching the streets fill with workers coming off their shifts, is a different view of the area than the resort version.",
  ),
  para(
    "If you go, go to eat lunch or breakfast at a comedor, and accept that the experience will be loud and busy. Don't expect tourist-friendly English or a polished welcome. You're a guest in a town that doesn't exist for tourism in the way Punta Cana itself does. The people are friendly, the food is excellent, and the prices are a fraction of what you'd pay inside a resort.",
  ),

  h2("Santo Domingo: The Capital, If You Have a Full Day"),
  para(
    "Santo Domingo is the capital of the Dominican Republic and the oldest continuously inhabited European-founded city in the Americas, settled in 1496. It's a 2-hour-15-minute drive west of Punta Cana — long for a day trip but achievable. If you have a flexible schedule and want to understand the country, it's worth the trip. The Zona Colonial (Colonial Zone) is a UNESCO World Heritage site with 16th-century architecture, the first cathedral in the Americas (the Catedral Primada de América), the Alcázar de Colón (where Christopher Columbus's son lived), and a network of stone streets you can walk in a couple of hours.",
  ),
  para(
    "Beyond the Colonial Zone, Santo Domingo is a modern, sprawling city of three million people with all the energy and chaos that implies. The Malecón seafront drive is dramatic. The food and music scenes are genuinely vibrant. The contrast with the resort areas is profound — you'll see actual urban Dominican life, with the wealth and the poverty that go with it. A day trip is intense; an overnight stay is better if you can manage it.",
  ),
  h3("Practical Day-Trip Logistics"),
  para(
    "Most travelers do Santo Domingo as an organized day trip through an operator. The advantages: comfortable air-conditioned bus, English-speaking guide, all logistics handled, food included. The disadvantages: you see what the operator decides to show you, time at each stop is limited, the group sets the pace. If you want a deeper experience, hiring a private guide-driver is more expensive but gives you control. Either way, leaving the resort at 7:00 AM and returning by 8:00 PM is the typical day.",
  ),

  h2("Why It's Worth Leaving the Resort"),
  para(
    "There's a real argument for staying in the resort the entire time. It's relaxing, comfortable, and you're not on vacation to deal with logistics. Many travelers come specifically for that experience and have a great time. But the people who tell us they really fell in love with the Dominican Republic — who came back, who learned Spanish, who eventually bought property here — are almost always the ones who spent some time outside the resort walls.",
  ),
  para(
    "Even a half-day in Higüey, or an afternoon at Macao, or a lunch in Bayahibe changes how you understand the country. The resort experience is curated and pleasant. The country itself is louder, more complicated, more interesting. Both are real. Both are worth experiencing. If you're spending a week here and you don't venture outside even once, you're seeing one slice of a much larger and more interesting place.",
  ),

  h2("Practical Tips for Leaving the Resort"),
  li("**Bring small bills.** Outside resorts, large US dollar notes are sometimes hard to break. A mix of $1, $5, $10, and $20 bills is most useful. Dominican pesos are best for small purchases."),
  li("**Travel light.** Don't carry valuables you wouldn't want to lose. Take a phone, a small amount of cash, sunscreen, water, and a hat. Leave the rest in your hotel safe."),
  li("**Hire local taxis through your hotel concierge.** Resort-arranged taxis are slightly more expensive than waving down a random one, but they're reliable, the driver speaks English, and the price is fixed before you go. For longer trips, this is worth the small premium."),
  li("**Don't drink tap water.** Bottled water is cheap and available everywhere. Use it for drinking and brushing teeth outside the resort."),
  li("**Greet people.** A simple \"Buenos días\" or \"Buenas tardes\" goes a long way. Dominicans are warm and friendly, and basic greetings open conversations and friendly service."),
  li("**Tip in cash, in pesos when possible.** Standard tip is 10 percent in restaurants; small tips of 50 to 100 pesos for taxi drivers, bag handlers, and helpful staff are appreciated."),

  h2("How to Build a Day Outside the Resort"),
  para(
    "If you have one day to leave the resort and want a balanced experience, here's a workable plan. Leave the resort at 8:30 AM. Drive 45 minutes to Higüey. Spend 90 minutes at the basilica and central park area, including coffee at a local café. Drive 30 minutes back toward the coast, stopping at a small roadside comedor for lunch (around noon, when Dominicans eat). Spend the afternoon at Macao Beach or Boca de Yuma, depending on your preference for swimming or coastal scenery. Return to the resort by 6:00 PM. Total cost for two people including taxi, food, and entrance fees: under $150 USD.",
  ),
  para(
    "Alternatively, book a [[guided cultural and nature excursion|https://puntacana-excursions.com/excursions?category=culture-nature]] that builds the day for you. The premium over going independently is real but reasonable, and you get someone managing all the logistics and providing context throughout.",
  ),

  h2("Final Thoughts"),
  para(
    "Leaving the resort isn't required to have a great vacation in Punta Cana. The resorts are excellent and many travelers don't need anything beyond them. But the people who leave even once, even just for an afternoon in Higüey, almost always tell us afterward that the trip outside was the part they remembered most clearly. The country exists outside the gate. It's louder, less polished, more interesting. A few hours in it is one of the highest-value things you can do with your trip.",
  ),
  para(
    "If you'd like recommendations specific to your interests — historical sites, food, beaches, music, family-friendly stops — [[contact our team|https://puntacana-excursions.com/contact]] and we'll suggest the right combination for your dates and group. We live in this country year-round and we know which places are worth your time. One last piece of practical advice: don't try to do too much. Many first-time visitors plan ambitious itineraries with three or four towns in a single day, and they come back exhausted having barely experienced any of them. One destination, done properly with time to walk around, eat a real meal, and talk to a few people, is worth more than three rushed stops. The Dominican Republic rewards slowness, and the moments that stay with you tend to be the ones you didn't plan — a conversation with a fruit vendor, the way the late afternoon light hits the basilica plaza, an unexpected stop at a roadside dulce stand. Build your day around being open to those moments rather than checking off destinations.",
  ),
];

const localTownsBodyEs = [
  para(
    "La mayoría de los visitantes de Punta Cana pasan todo su viaje dentro de un resort todo-incluido amurallado, separados del país real por puertas de seguridad, paisajismo cuidado y diez kilómetros de carretera de acceso pavimentada. Los resorts son excelentes en lo que hacen — cómodos, seguros, hermosos, fáciles. Pero también son una versión curada de la República Dominicana que es un poco demasiado limpia y un poco demasiado silenciosa. El país real comienza cuando sales de la puerta.",
  ),
  para(
    "Esta guía recorre los pueblos y ciudades cerca de Punta Cana que muestran cómo viven, trabajan, adoran y compran realmente los dominicanos. Algunos están al tanto del turismo, otros no. Todos ellos valen al menos medio día si quieres una imagen más completa de dónde te estás alojando. Las opciones más accesibles se pueden alcanzar con un taxi; las más interesantes se benefician de una [[excursión guiada de cultura y naturaleza|https://puntacana-excursions.com/excursions?category=culture-nature]] que maneja el transporte y agrega contexto.",
  ),

  h2("Higüey: El Corazón Religioso de la Región"),
  para(
    "Higüey es la ciudad más grande del este de República Dominicana y la capital espiritual del país. Se encuentra a unos 40 kilómetros tierra adentro desde Punta Cana — un trayecto de 45 minutos en autopista — y alberga el santuario católico más importante del país: la Basílica de Nuestra Señora de la Altagracia. Incluso si no eres católico, la basílica vale la pena visitarla solo por la arquitectura. Diseñada por arquitectos franceses y completada en 1971, el edificio es un imponente arco de concreto en forma de manos rezando, elevándose 80 metros sobre la plaza circundante. El interior es abierto, lleno de luz y acústicamente notable.",
  ),
  para(
    "La Virgen de la Altagracia es la santa patrona de la República Dominicana, y cada 21 de enero cientos de miles de peregrinos caminan desde todo el país hasta Higüey por su día festivo. La mayoría de los días la basílica está más tranquila — locales encendiendo velas, familias bautizando bebés, grupos turísticos ocasionales pasando. La Misa se celebra varias veces al día. La plaza exterior tiene vendedores que venden medallas religiosas, velas y snacks, y una serie de pequeños restaurantes y cafés que sirven comida dominicana sin pretensiones y asequible.",
  ),
  h3("Qué Ver en Higüey Más Allá de la Basílica"),
  para(
    "El parque central de la ciudad, Parque Central, está a unas cuadras de la basílica y es el tipo de lugar donde los locales se sientan en bancos, los niños juegan, los limpiabotas hacen su trabajo y se despliega el ritmo de la vida normal de pueblo dominicano. La iglesia católica más antigua del parque, San Dionisio, fue construida originalmente en 1572 y es una de las iglesias más antiguas de las Américas. El mercado a unas pocas calles de distancia es bullicioso, ruidoso y completamente sin curar para turistas — productos agrícolas, carnicería, artículos para el hogar, ropa de segunda mano, música a todo volumen de una docena de altavoces. No es una atracción turística; es un mercado funcional, y caminar por él durante treinta minutos te enseñará más sobre la vida cotidiana dominicana que cualquier cantidad de entradas en guías turísticas.",
  ),
  h3("Información Práctica para Higüey"),
  para(
    "Un taxi desde un resort de Punta Cana a Higüey cuesta de $60 a $80 USD ida y vuelta, dependiendo de cuánto te quedes. El trayecto toma 45 minutos en cada dirección. No necesitas guía para la basílica misma — la visita es sencilla — pero un conductor o guía que hable español es útil para el mercado y el parque central si no hablas español. Planifica tres a cuatro horas para el viaje redondo y la visita. El mejor momento del día es media mañana, antes de que el calor alcance su pico y después de que se asiente el tráfico matutino.",
  ),

  h2("Bayahibe: Un Pueblo de Pescadores que Se Convirtió en Pueblo Playero"),
  para(
    "Bayahibe está a aproximadamente una hora al suroeste de Punta Cana y presenta un tipo diferente de viaje. Originalmente un pequeño pueblo de pescadores, ha crecido hasta convertirse en un pueblo playero de tamaño mediano que conserva mucho más de su carácter original que las zonas de resort. El centro del pueblo es lo suficientemente pequeño para caminarlo en veinte minutos — un tramo de restaurantes frente a la playa, tiendas de buceo, barcos de pesca sacados sobre la arena, una iglesia católica, algunos hoteles. El agua es excepcional — tranquila, clara, rodeada de arrecife. Bayahibe es el punto de partida para excursiones en barco a las Islas Saona y Catalina, y la [[excursión de un día a Catalina|https://www.grandbay-puntacana.com/trips/catalina]] sale desde aquí.",
  ),
  para(
    "Pasar medio día en Bayahibe en lugar de solo pasar por él vale la pena. El pueblo alberga algunos buenos restaurantes de mariscos donde los pescadores locales venden directamente. El muelle de pesca temprano en la mañana es una escena de trabajo — barcos descargando, pescado siendo clasificado y pesado, operadores de buceo preparándose para los viajes del día. La tarde tardía saca a los niños locales jugando en la playa y a los hombres mayores reuniéndose en bares al aire libre. A diferencia de las zonas de resort, Bayahibe tiene una población que vive allí todo el año, lo que le da textura que carecen las áreas de resort.",
  ),

  h2("La Romana y Altos de Chavón"),
  para(
    "La Romana es la tercera ciudad más grande de la República Dominicana y está a aproximadamente 1 hora y 45 minutos al oeste de Punta Cana. Es la sede de la industria azucarera que históricamente definió la parte este del país, y partes de la ciudad aún reflejan eso — grandes ingenios azucareros, viviendas de trabajadores, un viejo ferrocarril industrial. Pero la razón por la que la mayoría de los viajeros visitan La Romana es el complejo turístico Casa de Campo en su extremo oriental, que contiene uno de los sitios culturales más notables del país: Altos de Chavón.",
  ),
  para(
    "Altos de Chavón es una recreación de un pueblo mediterráneo del siglo XVI, construido con piedra coralina local en los años 70 como proyecto cultural. El resultado es en parte parque temático, en parte genuina escuela de arte y diseño. Los edificios incluyen una pequeña iglesia (donde Frank Sinatra dio un concierto memorable en la apertura del pueblo), un anfiteatro de 5.000 asientos inspirado en originales griegos y romanos, un museo arqueológico regional, y varios talleres artesanales donde artesanos locales trabajan con piedra, cerámica, cuero y metal. El anfiteatro alberga grandes conciertos durante todo el año.",
  ),
  para(
    "Si Altos de Chavón es de tu gusto depende de cómo te sientas sobre las recreaciones históricas temáticas. No es auténtico en el sentido estricto — fue construido hace cincuenta años. Pero la artesanía es genuina, las vistas sobre el Río Chavón abajo son espectaculares, y la experiencia no se parece a nada más en el país. Los restaurantes en el sitio son buenos, aunque no baratos.",
  ),

  h2("Boca de Yuma: La Costa Tranquila"),
  para(
    "Boca de Yuma es un pequeño pueblo de pescadores aproximadamente a una hora al suroeste de Punta Cana, en la desembocadura del Río Yuma donde se encuentra con el Mar Caribe. Es el tipo de lugar que los viajeros encuentran por accidente y luego regresan deliberadamente. No hay resorts aquí, no hay hoteles grandes, no hay infraestructura todo-incluido. Solo un puñado de pequeños restaurantes, un muelle de pesca, dramáticos acantilados costeros, y los sistemas de cuevas del Parque Nacional del Este visibles a través del agua.",
  ),
  para(
    "El pueblo alberga un festival anual de pesca del Caribe a finales de mayo que atrae barcos de toda la región. El resto del año está tranquilo. El almuerzo en uno de los restaurantes en los acantilados — generalmente langosta a la parrilla o pescado entero, con lo que los barcos trajeron esa mañana — es una de las comidas más memorables que puedes tener en esta parte del país. El trayecto desde Punta Cana toma aproximadamente una hora en cada dirección, con algunos de los pequeños pueblos y granjas pasando en el camino que dan una sensación de la vida dominicana del interior.",
  ),

  h2("Playa Macao y la Costa Norte"),
  para(
    "Si quieres un tramo de playa que ha sido casi intacto por el desarrollo de resorts, conduce 30 minutos al norte del corredor principal de Punta Cana hasta Macao. La playa es larga, amplia, y respaldada por bajos acantilados y palmeras. Es una playa funcional — las familias dominicanas locales vienen aquí los fines de semana, los surfistas montan las pequeñas pero consistentes olas, los vendedores de playa venden pescado y cocos directamente a los nadadores. El agua es más áspera que en la zona de resort de Bávaro (Atlántico, no protegida del Caribe), lo que le da a Macao su propio carácter. Varios pequeños restaurantes de playa sirven mariscos frescos a precios que son una fracción de lo que cobran los resorts.",
  ),
  para(
    "Yendo más al norte por la costa, llegas a comunidades más pequeñas — el pueblo de El Macao, luego la ruta interior hacia El Seibo y la Cordillera Oriental. La mayor parte de esta área es rural, con campos de caña de azúcar, ranchos ganaderos y pequeños pueblos agrícolas. No es el tipo de lugar que apoya un itinerario turístico pulido, pero un circuito de medio día por esta área te da una sensación del interior rural oriental del país que ninguna experiencia de resort puede igualar.",
  ),

  h2("Veron y Friusa: Los Pueblos Donde Viven los Trabajadores del Resort"),
  para(
    "La mayoría de los resorts están atendidos por personas que no viven en el resort mismo. Viven en pueblos cercanos — principalmente Veron y Friusa — que han crecido específicamente para apoyar la industria turística. Estos no son bonitos pueblos coloniales ni encantadoras aldeas. Son comunidades de viajeros pendulares de clase trabajadora con caminos ásperos, calles ocupadas, y el ritmo cotidiano de la vida dominicana trabajadora.",
  ),
  para(
    "Pero eso es exactamente lo que hace que valgan la pena visitar si quieres contexto para donde te estás alojando. Los comedores donde los trabajadores del resort desayunan y almuerzan sirven algunas de las mejores comidas dominicanas del área a una fracción de los precios del resort. Las pequeñas tiendas venden productos y artículos para el hogar a precios locales. Las barberías, salones de belleza y pequeños talleres mecánicos muestran la vida comercial real de la región. Un viaje en taxi a través de Veron al final de la tarde, viendo las calles llenarse de trabajadores que salen de sus turnos, es una vista diferente del área que la versión del resort.",
  ),
  para(
    "Si vas, ve a almorzar o desayunar a un comedor, y acepta que la experiencia será ruidosa y bulliciosa. No esperes inglés amigable para turistas o una bienvenida pulida. Eres un invitado en un pueblo que no existe para el turismo de la manera que sí lo hace Punta Cana. La gente es amigable, la comida es excelente, y los precios son una fracción de lo que pagarías dentro de un resort.",
  ),

  h2("Santo Domingo: La Capital, Si Tienes un Día Completo"),
  para(
    "Santo Domingo es la capital de la República Dominicana y la ciudad fundada por europeos más antigua continuamente habitada de las Américas, asentada en 1496. Está a 2 horas y 15 minutos en coche al oeste de Punta Cana — largo para una excursión de un día pero alcanzable. Si tienes un horario flexible y quieres entender el país, vale la pena el viaje. La Zona Colonial es un sitio Patrimonio de la Humanidad de la UNESCO con arquitectura del siglo XVI, la primera catedral de las Américas (la Catedral Primada de América), el Alcázar de Colón (donde vivió el hijo de Cristóbal Colón), y una red de calles de piedra que puedes caminar en un par de horas.",
  ),
  para(
    "Más allá de la Zona Colonial, Santo Domingo es una ciudad moderna y extensa de tres millones de personas con toda la energía y caos que eso implica. El Malecón frente al mar es dramático. Las escenas gastronómicas y musicales son genuinamente vibrantes. El contraste con las áreas de resort es profundo — verás la vida urbana dominicana real, con la riqueza y la pobreza que la acompañan. Una excursión de un día es intensa; pasar una noche es mejor si puedes manejarlo.",
  ),
  h3("Logística Práctica para Excursión de un Día"),
  para(
    "La mayoría de los viajeros hacen Santo Domingo como una excursión organizada de un día a través de un operador. Las ventajas: cómodo autobús con aire acondicionado, guía que habla inglés, toda la logística manejada, comida incluida. Las desventajas: ves lo que el operador decide mostrarte, el tiempo en cada parada es limitado, el grupo marca el ritmo. Si quieres una experiencia más profunda, contratar un guía-conductor privado es más caro pero te da control. De cualquier manera, salir del resort a las 7:00 AM y regresar a las 8:00 PM es el día típico.",
  ),

  h2("Por Qué Vale la Pena Salir del Resort"),
  para(
    "Hay un argumento real para quedarse todo el tiempo en el resort. Es relajante, cómodo, y no estás de vacaciones para lidiar con logística. Muchos viajeros vienen específicamente para esa experiencia y la pasan muy bien. Pero las personas que nos dicen que realmente se enamoraron de la República Dominicana — que regresaron, que aprendieron español, que finalmente compraron propiedad aquí — son casi siempre las que pasaron algún tiempo fuera de los muros del resort.",
  ),
  para(
    "Incluso medio día en Higüey, o una tarde en Macao, o un almuerzo en Bayahibe cambia cómo entiendes el país. La experiencia del resort está curada y es agradable. El país mismo es más ruidoso, más complicado, más interesante. Ambos son reales. Ambos valen la pena experimentar. Si estás pasando una semana aquí y no te aventuras afuera ni siquiera una vez, estás viendo una rebanada de un lugar mucho más grande y más interesante.",
  ),

  h2("Consejos Prácticos para Salir del Resort"),
  li("**Lleva billetes pequeños.** Fuera de los resorts, las grandes denominaciones de dólares estadounidenses son a veces difíciles de cambiar. Una mezcla de billetes de $1, $5, $10 y $20 es la más útil. Los pesos dominicanos son los mejores para compras pequeñas."),
  li("**Viaja ligero.** No lleves valores que no quisieras perder. Lleva un teléfono, una pequeña cantidad de efectivo, protector solar, agua y un sombrero. Deja el resto en la caja fuerte del hotel."),
  li("**Contrata taxis locales a través del conserje del hotel.** Los taxis arreglados por el resort son ligeramente más caros que llamar a uno al azar, pero son confiables, el conductor habla inglés, y el precio es fijo antes de irte. Para viajes más largos, esto vale el pequeño extra."),
  li("**No bebas agua de la llave.** El agua embotellada es barata y está disponible en todas partes. Úsala para beber y cepillarte los dientes fuera del resort."),
  li("**Saluda a la gente.** Un simple \"Buenos días\" o \"Buenas tardes\" hace mucho. Los dominicanos son cálidos y amigables, y los saludos básicos abren conversaciones y servicio amigable."),
  li("**Da propinas en efectivo, en pesos cuando sea posible.** La propina estándar es del 10 por ciento en restaurantes; pequeñas propinas de 50 a 100 pesos para taxistas, maleteros y personal útil son apreciadas."),

  h2("Cómo Construir un Día Fuera del Resort"),
  para(
    "Si tienes un día para salir del resort y quieres una experiencia equilibrada, aquí hay un plan funcional. Sal del resort a las 8:30 AM. Conduce 45 minutos a Higüey. Pasa 90 minutos en la basílica y el área del parque central, incluyendo café en un café local. Conduce 30 minutos de regreso hacia la costa, deteniéndote en un pequeño comedor de carretera para almorzar (alrededor del mediodía, cuando comen los dominicanos). Pasa la tarde en Playa Macao o Boca de Yuma, dependiendo de tu preferencia por nadar o por paisaje costero. Regresa al resort a las 6:00 PM. Costo total para dos personas incluyendo taxi, comida y tarifas de entrada: menos de $150 USD.",
  ),
  para(
    "Alternativamente, reserva una [[excursión cultural y de naturaleza guiada|https://puntacana-excursions.com/excursions?category=culture-nature]] que construya el día para ti. La prima sobre ir independientemente es real pero razonable, y obtienes a alguien manejando toda la logística y proporcionando contexto durante todo el día.",
  ),

  h2("Reflexiones Finales"),
  para(
    "Salir del resort no es necesario para tener unas excelentes vacaciones en Punta Cana. Los resorts son excelentes y muchos viajeros no necesitan nada más allá de ellos. Pero las personas que salen aunque sea una vez, aunque sea solo por una tarde en Higüey, casi siempre nos dicen después que el viaje afuera fue la parte que recordaron más claramente. El país existe fuera de la puerta. Es más ruidoso, menos pulido, más interesante. Unas pocas horas en él es una de las cosas de mayor valor que puedes hacer con tu viaje.",
  ),
  para(
    "Si te gustaría recibir recomendaciones específicas para tus intereses — sitios históricos, comida, playas, música, paradas familiares — [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] y sugeriremos la combinación correcta para tus fechas y grupo. Vivimos en este país todo el año y sabemos qué lugares valen tu tiempo. Un último consejo práctico: no intentes hacer demasiado. Muchos visitantes primerizos planifican itinerarios ambiciosos con tres o cuatro pueblos en un solo día, y regresan exhaustos habiendo apenas experimentado ninguno de ellos. Un destino, hecho apropiadamente con tiempo para caminar, comer una comida real y hablar con algunas personas, vale más que tres paradas apuradas. La República Dominicana recompensa la lentitud, y los momentos que se quedan contigo tienden a ser los que no planificaste — una conversación con un vendedor de frutas, la forma en que la luz del final de la tarde golpea la plaza de la basílica, una parada inesperada en un puesto de dulces de carretera. Construye tu día alrededor de estar abierto a esos momentos en lugar de marcar destinos.",
  ),
];

const localTownsBodyDe = [
  para(
    "Die meisten Besucher von Punta Cana verbringen ihre gesamte Reise innerhalb eines ummauerten All-inclusive-Resorts, vom eigentlichen Land getrennt durch Sicherheitstore, gepflegte Landschaftsgestaltung und zehn Kilometer asphaltierte Zufahrtsstraße. Die Resorts sind ausgezeichnet in dem, was sie tun — bequem, sicher, schön, einfach. Aber sie sind auch eine kuratierte Version der Dominikanischen Republik, die ein bisschen zu sauber und ein bisschen zu ruhig ist. Das echte Land beginnt, wenn Sie das Tor verlassen.",
  ),
  para(
    "Diese Anleitung führt durch die Städte und Orte in der Nähe von Punta Cana, die zeigen, wie Dominikaner tatsächlich leben, arbeiten, beten und einkaufen. Einige sind touristisch bewusst, andere nicht. Alle sind mindestens einen halben Tag wert, wenn Sie ein vollständigeres Bild davon haben möchten, wo Sie wohnen. Die zugänglichsten Optionen können mit einem Taxi erreicht werden; die interessanteren profitieren von einer geführten [[Kultur- und Naturexkursion|https://puntacana-excursions.com/excursions?category=culture-nature]], die den Transport übernimmt und Kontext hinzufügt.",
  ),

  h2("Higüey: Das Religiöse Herz der Region"),
  para(
    "Higüey ist die größte Stadt im östlichen Teil der Dominikanischen Republik und die spirituelle Hauptstadt des Landes. Sie liegt etwa 40 Kilometer landeinwärts von Punta Cana — eine 45-minütige Fahrt auf der Autobahn — und beherbergt das wichtigste katholische Heiligtum des Landes: die Basilika Unserer Lieben Frau von Altagracia. Auch wenn Sie nicht katholisch sind, lohnt sich ein Besuch der Basilika allein wegen der Architektur. Entworfen von französischen Architekten und 1971 fertiggestellt, ist das Gebäude ein aufragender Betonbogen in Form betender Hände, der sich 80 Meter über den umgebenden Platz erhebt. Das Innere ist offen, lichtdurchflutet und akustisch bemerkenswert.",
  ),
  para(
    "Die Jungfrau von Altagracia ist die Schutzpatronin der Dominikanischen Republik, und jedes Jahr am 21. Januar pilgern Hunderttausende von Menschen aus dem ganzen Land nach Higüey zu ihrem Festtag. An den meisten Tagen ist die Basilika ruhiger — Einheimische zünden Kerzen an, Familien taufen Babys, gelegentliche Touristengruppen ziehen durch. Die Messe wird mehrmals täglich gefeiert. Auf dem Platz draußen gibt es Verkäufer, die religiöse Medaillen, Kerzen und Snacks verkaufen, sowie eine Reihe kleiner Restaurants und Cafés, die unprätentiöse, erschwingliche dominikanische Küche servieren.",
  ),
  h3("Was Man in Higüey Außer der Basilika Sehen Kann"),
  para(
    "Der Stadtplatz, Parque Central, liegt einige Blocks von der Basilika entfernt und ist die Art von Ort, an dem Einheimische auf Bänken sitzen, Kinder spielen, Schuhputzer ihrer Arbeit nachgehen und sich der Rhythmus des normalen dominikanischen Stadtlebens entfaltet. Die ältere katholische Kirche am Park, San Dionisio, wurde ursprünglich 1572 erbaut und ist eine der ältesten Kirchen Amerikas. Der Markt einige Straßen entfernt ist geschäftig, laut und völlig unkuriert für Touristen — Produkte, Metzgerei, Haushaltswaren, Second-Hand-Kleidung, Musik dröhnt aus einem Dutzend Lautsprechern. Es ist keine Touristenattraktion; es ist ein funktionierender Markt, und ihn dreißig Minuten lang zu durchqueren wird Sie mehr über das dominikanische Alltagsleben lehren als jede Anzahl von Reiseführer-Einträgen.",
  ),
  h3("Praktische Informationen für Higüey"),
  para(
    "Ein Taxi von einem Punta-Cana-Resort nach Higüey kostet 60 bis 80 USD Hin und Zurück, je nachdem, wie lange Sie bleiben. Die Fahrt dauert 45 Minuten in jede Richtung. Sie brauchen keinen Führer für die Basilika selbst — der Besuch ist unkompliziert — aber ein spanischsprachiger Fahrer oder Führer ist hilfreich für den Markt und den Stadtplatz, wenn Sie kein Spanisch sprechen. Planen Sie drei bis vier Stunden für die Hin- und Rückfahrt und den Besuch ein. Die beste Tageszeit ist der späte Vormittag, bevor die Hitze ihren Höhepunkt erreicht und nachdem sich der morgendliche Berufsverkehr beruhigt hat.",
  ),

  h2("Bayahibe: Ein Fischerdorf, das zu einem Strandort Wurde"),
  para(
    "Bayahibe liegt etwa eine Stunde südwestlich von Punta Cana und stellt eine andere Art von Reise dar. Ursprünglich ein kleines Fischerdorf, ist es zu einer mittelgroßen Strandstadt herangewachsen, die weitaus mehr von ihrem ursprünglichen Charakter bewahrt als die Resortzonen. Das Dorfzentrum ist klein genug, um in zwanzig Minuten durchquert zu werden — ein Abschnitt von Strandrestaurants, Tauchshops, Fischerbooten, die auf den Sand gezogen sind, eine katholische Kirche, einige Hotels. Das Wasser ist außergewöhnlich — ruhig, klar, von Riffen umgeben. Bayahibe ist der Ausgangspunkt für Bootsfahrten zu den Inseln Saona und Catalina, und der [[Catalina-Tagesausflug|https://www.grandbay-puntacana.com/trips/catalina]] startet von hier.",
  ),
  para(
    "Es lohnt sich, einen halben Tag in Bayahibe zu verbringen, anstatt nur durchzufahren. Das Dorf beherbergt einige gute Fischrestaurants, in denen lokale Fischer direkt verkaufen. Der Fischereihafen am frühen Morgen ist eine Arbeitsszene — Boote, die entladen, Fisch, der sortiert und gewogen wird, Tauchanbieter, die sich auf die Touren des Tages vorbereiten. Der späte Nachmittag bringt die örtlichen Kinder zum Spielen am Strand und die älteren Männer, die sich an Outdoor-Bars versammeln. Im Gegensatz zu den Resortzonen hat Bayahibe eine Bevölkerung, die das ganze Jahr über dort lebt, was ihm eine Textur verleiht, die den Resortgebieten fehlt.",
  ),

  h2("La Romana und Altos de Chavón"),
  para(
    "La Romana ist die drittgrößte Stadt der Dominikanischen Republik und liegt etwa 1 Stunde und 45 Minuten westlich von Punta Cana. Sie ist die Heimat der Zuckerindustrie, die den östlichen Teil des Landes historisch geprägt hat, und Teile der Stadt spiegeln das immer noch wider — große Zuckermühlen, Arbeiterwohnungen, eine alte Industriebahn. Aber der Grund, warum die meisten Reisenden La Romana besuchen, ist der Casa de Campo-Resortkomplex am östlichen Rand, der einen der bemerkenswertesten Kulturstätten des Landes enthält: Altos de Chavón.",
  ),
  para(
    "Altos de Chavón ist eine Nachbildung eines Mittelmeerdorfs aus dem 16. Jahrhundert, erbaut aus lokalem Korallenstein in den 1970er Jahren als Kulturprojekt. Das Ergebnis ist teils Themenpark, teils echte Kunst- und Designschule. Die Gebäude umfassen eine kleine Kirche (wo Frank Sinatra ein denkwürdiges Konzert bei der Eröffnung des Dorfes spielte), ein Amphitheater mit 5.000 Plätzen, das nach griechischen und römischen Originalen modelliert ist, ein regionales archäologisches Museum und mehrere Handwerksateliers, in denen lokale Handwerker mit Stein, Keramik, Leder und Metall arbeiten. Das Amphitheater veranstaltet das ganze Jahr über große Konzerte.",
  ),
  para(
    "Ob Altos de Chavón Ihrem Geschmack entspricht, hängt davon ab, was Sie von themenbezogenen historischen Nachbildungen halten. Es ist nicht authentisch im strengen Sinne — es wurde vor fünfzig Jahren erbaut. Aber die Handwerkskunst ist echt, die Aussicht über den Chavón-Fluss unten ist spektakulär, und die Erfahrung ist anders als alles andere im Land. Die Restaurants vor Ort sind gut, wenn auch nicht günstig.",
  ),

  h2("Boca de Yuma: Die Stille Küste"),
  para(
    "Boca de Yuma ist ein kleines Fischerdorf etwa eine Stunde südwestlich von Punta Cana, an der Mündung des Yuma-Flusses, wo er auf das Karibische Meer trifft. Es ist die Art von Ort, den Reisende zufällig entdecken und dann absichtlich wieder aufsuchen. Es gibt hier keine Resorts, keine großen Hotels, keine All-inclusive-Infrastruktur. Nur eine Handvoll kleiner Restaurants, ein Fischereihafen, dramatische Küstenklippen und die Höhlensysteme des East-Nationalparks, die über das Wasser hinweg sichtbar sind.",
  ),
  para(
    "Das Dorf veranstaltet Ende Mai ein jährliches karibisches Fischereifestival, das Boote aus der ganzen Region anzieht. Den Rest des Jahres ist es ruhig. Das Mittagessen in einem der Klippenrestaurants — normalerweise gegrillter Hummer oder ganzer Fisch, mit dem, was die Boote an diesem Morgen mitgebracht haben — ist eine der unvergesslichsten Mahlzeiten, die Sie in diesem Teil des Landes haben können. Die Fahrt von Punta Cana dauert etwa eine Stunde in jede Richtung, mit einigen der kleinen Städte und Höfe, die auf dem Weg vorbeiziehen und ein Gefühl für das Leben im Binnenland Dominikas vermitteln.",
  ),

  h2("Macao-Strand und die Nordküste"),
  para(
    "Wenn Sie einen Strandabschnitt suchen, der von Resortentwicklung nahezu unberührt ist, fahren Sie 30 Minuten nördlich von der Hauptstrandzone von Punta Cana nach Macao. Der Strand ist lang, breit und von niedrigen Klippen und Palmenhainen umgeben. Es ist ein Arbeitsstrand — lokale dominikanische Familien kommen am Wochenende hierher, Surfer reiten die kleinen, aber konstanten Wellen, Strandverkäufer verkaufen Fisch und Kokosnüsse direkt an Schwimmer. Das Wasser ist rauer als in der Bávaro-Resortzone (Atlantik, nicht karibisch geschützt), was Macao seinen eigenen Charakter verleiht. Mehrere kleine Strandrestaurants servieren frische Meeresfrüchte zu Preisen, die einen Bruchteil dessen ausmachen, was Resorts verlangen.",
  ),
  para(
    "Wenn Sie weiter nach Norden entlang der Küste fahren, erreichen Sie kleinere Gemeinden — das Dorf El Macao, dann die Landroute in Richtung El Seibo und der Cordillera Oriental. Der größte Teil dieses Gebiets ist ländlich, mit Zuckerrohrfeldern, Viehfarmen und kleinen landwirtschaftlichen Städten. Es ist nicht die Art von Ort, die eine polierte Touristenreiseroute unterstützt, aber eine halbtägige Rundfahrt durch dieses Gebiet vermittelt Ihnen ein Gefühl für das ländliche östliche Hinterland des Landes, das keine Resorterfahrung erreichen kann.",
  ),

  h2("Veron und Friusa: Die Städte, in Denen die Resort-Mitarbeiter Wohnen"),
  para(
    "Die meisten Resorts werden von Menschen besetzt, die nicht im Resort selbst wohnen. Sie leben in nahegelegenen Städten — hauptsächlich Veron und Friusa — die speziell dafür entstanden sind, die Tourismusindustrie zu unterstützen. Dies sind keine schönen Kolonialstädte oder charmanten Dörfer. Es sind Pendler-Arbeitergemeinden mit rauen Straßen, geschäftigen Straßen und dem Alltagsrhythmus des arbeitenden dominikanischen Lebens.",
  ),
  para(
    "Aber genau das macht sie einen Besuch wert, wenn Sie Kontext für den Ort wünschen, an dem Sie wohnen. Die Comedores, in denen Resort-Mitarbeiter frühstücken und zu Mittag essen, servieren einige der besten dominikanischen Speisen der Gegend zu einem Bruchteil der Resortpreise. Die kleinen Läden verkaufen Produkte und Haushaltsartikel zu lokalen Preisen. Die Friseursalons, Schönheitssalons und kleinen Werkstätten zeigen das tatsächliche kommerzielle Leben der Region. Eine Taxifahrt durch Veron am späten Nachmittag, während die Straßen sich mit Arbeitern füllen, die aus ihren Schichten kommen, ist eine andere Sicht auf das Gebiet als die Resortversion.",
  ),
  para(
    "Wenn Sie gehen, gehen Sie zum Mittag- oder Frühstücksessen in einen Comedor und akzeptieren Sie, dass die Erfahrung laut und geschäftig sein wird. Erwarten Sie nicht touristenfreundliches Englisch oder einen polierten Empfang. Sie sind Gast in einer Stadt, die nicht für den Tourismus existiert, wie es Punta Cana selbst tut. Die Menschen sind freundlich, das Essen ist ausgezeichnet, und die Preise sind ein Bruchteil dessen, was Sie in einem Resort bezahlen würden.",
  ),

  h2("Santo Domingo: Die Hauptstadt, wenn Sie einen ganzen Tag Haben"),
  para(
    "Santo Domingo ist die Hauptstadt der Dominikanischen Republik und die älteste kontinuierlich bewohnte, von Europäern gegründete Stadt Amerikas, gegründet 1496. Sie liegt 2 Stunden und 15 Minuten westlich von Punta Cana — lang für einen Tagesausflug, aber machbar. Wenn Sie einen flexiblen Zeitplan haben und das Land verstehen möchten, lohnt sich die Reise. Die Zona Colonial ist ein UNESCO-Weltkulturerbe mit Architektur aus dem 16. Jahrhundert, der ersten Kathedrale Amerikas (der Catedral Primada de América), dem Alcázar de Colón (wo Christoph Kolumbus' Sohn lebte) und einem Netz von Steinstraßen, die Sie in ein paar Stunden durchqueren können.",
  ),
  para(
    "Jenseits der Zona Colonial ist Santo Domingo eine moderne, weitläufige Stadt mit drei Millionen Einwohnern, mit all der Energie und dem Chaos, die das impliziert. Die Strandpromenade Malecón ist dramatisch. Die Gastronomie- und Musikszene sind wirklich lebendig. Der Kontrast zu den Resortgebieten ist tiefgreifend — Sie werden das tatsächliche urbane dominikanische Leben sehen, mit dem Reichtum und der Armut, die damit einhergehen. Ein Tagesausflug ist intensiv; eine Übernachtung ist besser, wenn Sie es schaffen können.",
  ),
  h3("Praktische Tagesausflugslogistik"),
  para(
    "Die meisten Reisenden machen Santo Domingo als organisierten Tagesausflug über einen Anbieter. Die Vorteile: bequemer klimatisierter Bus, englischsprachiger Führer, alle Logistik übernommen, Essen inbegriffen. Die Nachteile: Sie sehen, was der Anbieter beschließt, Ihnen zu zeigen, die Zeit an jedem Halt ist begrenzt, die Gruppe gibt das Tempo vor. Wenn Sie eine tiefere Erfahrung wünschen, ist die Einstellung eines privaten Führer-Fahrers teurer, gibt Ihnen aber Kontrolle. So oder so, das Resort um 7:00 Uhr morgens zu verlassen und um 20:00 Uhr zurückzukehren, ist der typische Tag.",
  ),

  h2("Warum es Sich Lohnt, das Resort zu Verlassen"),
  para(
    "Es gibt ein echtes Argument dafür, die ganze Zeit im Resort zu bleiben. Es ist entspannend, bequem, und Sie sind nicht im Urlaub, um sich mit Logistik zu befassen. Viele Reisende kommen speziell für diese Erfahrung und haben eine großartige Zeit. Aber die Menschen, die uns sagen, dass sie sich wirklich in die Dominikanische Republik verliebt haben — die zurückgekehrt sind, die Spanisch gelernt haben, die schließlich Eigentum hier gekauft haben — sind fast immer diejenigen, die etwas Zeit außerhalb der Resortmauern verbracht haben.",
  ),
  para(
    "Schon ein halber Tag in Higüey oder ein Nachmittag in Macao oder ein Mittagessen in Bayahibe verändert, wie Sie das Land verstehen. Die Resorterfahrung ist kuratiert und angenehm. Das Land selbst ist lauter, komplizierter, interessanter. Beide sind echt. Beide sind es wert, erlebt zu werden. Wenn Sie eine Woche hier verbringen und sich nicht einmal nach draußen wagen, sehen Sie eine Scheibe von einem viel größeren und interessanteren Ort.",
  ),

  h2("Praktische Tipps zum Verlassen des Resorts"),
  li("**Bringen Sie kleine Scheine mit.** Außerhalb der Resorts sind große US-Dollar-Noten manchmal schwer zu wechseln. Eine Mischung aus $1-, $5-, $10- und $20-Scheinen ist am nützlichsten. Dominikanische Pesos sind am besten für kleine Einkäufe."),
  li("**Reisen Sie leicht.** Tragen Sie keine Wertsachen, die Sie nicht verlieren möchten. Nehmen Sie ein Telefon, eine kleine Menge Bargeld, Sonnenschutzmittel, Wasser und einen Hut mit. Lassen Sie den Rest in Ihrem Hotelsafe."),
  li("**Mieten Sie lokale Taxis über den Hotelconcierge.** Vom Resort arrangierte Taxis sind etwas teurer als ein zufälliges anzuwinken, aber sie sind zuverlässig, der Fahrer spricht Englisch und der Preis ist vor der Abfahrt festgelegt. Für längere Fahrten lohnt sich der kleine Aufpreis."),
  li("**Trinken Sie kein Leitungswasser.** Flaschenwasser ist günstig und überall erhältlich. Verwenden Sie es zum Trinken und Zähneputzen außerhalb des Resorts."),
  li("**Grüßen Sie die Menschen.** Ein einfaches \"Buenos días\" oder \"Buenas tardes\" hilft sehr. Dominikaner sind warmherzig und freundlich, und einfache Begrüßungen öffnen Gespräche und freundlichen Service."),
  li("**Trinkgeld in bar geben, wenn möglich in Pesos.** Standard-Trinkgeld in Restaurants beträgt 10 Prozent; kleine Trinkgelder von 50 bis 100 Pesos für Taxifahrer, Gepäckträger und hilfsbereites Personal werden geschätzt."),

  h2("Wie Man einen Tag Außerhalb des Resorts Plant"),
  para(
    "Wenn Sie einen Tag haben, um das Resort zu verlassen und eine ausgewogene Erfahrung wünschen, hier ist ein praktikabler Plan. Verlassen Sie das Resort um 8:30 Uhr morgens. Fahren Sie 45 Minuten nach Higüey. Verbringen Sie 90 Minuten in der Basilika und im Stadtparkbereich, einschließlich Kaffee in einem örtlichen Café. Fahren Sie 30 Minuten zurück in Richtung Küste und halten Sie an einem kleinen Comedor an der Straße zum Mittagessen an (gegen Mittag, wenn Dominikaner essen). Verbringen Sie den Nachmittag am Macao-Strand oder Boca de Yuma, je nach Ihrer Vorliebe für Schwimmen oder Küstenlandschaft. Kehren Sie um 18:00 Uhr ins Resort zurück. Gesamtkosten für zwei Personen einschließlich Taxi, Essen und Eintrittsgebühren: unter 150 USD.",
  ),
  para(
    "Alternativ buchen Sie eine [[geführte Kultur- und Naturexkursion|https://puntacana-excursions.com/excursions?category=culture-nature]], die den Tag für Sie aufbaut. Der Aufschlag gegenüber der unabhängigen Reise ist real, aber angemessen, und Sie bekommen jemanden, der die gesamte Logistik verwaltet und den ganzen Tag über Kontext liefert.",
  ),

  h2("Abschließende Gedanken"),
  para(
    "Das Verlassen des Resorts ist nicht erforderlich, um einen großartigen Urlaub in Punta Cana zu haben. Die Resorts sind ausgezeichnet, und viele Reisende brauchen nichts darüber hinaus. Aber die Menschen, die auch nur einmal hinausgehen, auch nur für einen Nachmittag in Higüey, erzählen uns danach fast immer, dass die Reise nach draußen der Teil war, an den sie sich am deutlichsten erinnerten. Das Land existiert außerhalb des Tors. Es ist lauter, weniger poliert, interessanter. Ein paar Stunden darin sind eines der wertvollsten Dinge, die Sie mit Ihrer Reise tun können.",
  ),
  para(
    "Wenn Sie Empfehlungen speziell zu Ihren Interessen wünschen — historische Stätten, Essen, Strände, Musik, familienfreundliche Stopps — [[kontaktieren Sie unser Team|https://puntacana-excursions.com/contact]], und wir schlagen die richtige Kombination für Ihre Daten und Gruppe vor. Wir leben das ganze Jahr über in diesem Land und wissen, welche Orte Ihre Zeit wert sind. Ein letzter praktischer Ratschlag: Versuchen Sie nicht, zu viel zu tun. Viele Erstbesucher planen ehrgeizige Reiserouten mit drei oder vier Städten an einem einzigen Tag und kehren erschöpft zurück, ohne wirklich eine davon erlebt zu haben. Ein Ziel, ordnungsgemäß durchgeführt mit Zeit zum Herumlaufen, einer echten Mahlzeit und Gesprächen mit ein paar Menschen, ist mehr wert als drei hektische Stopps. Die Dominikanische Republik belohnt Langsamkeit, und die Momente, die bei Ihnen bleiben, sind tendenziell diejenigen, die Sie nicht geplant haben — ein Gespräch mit einem Obstverkäufer, die Art, wie das späte Nachmittagslicht auf den Basilikaplatz fällt, ein unerwarteter Halt an einem Straßen-Dulce-Stand. Bauen Sie Ihren Tag darauf auf, offen für diese Momente zu sein, anstatt Ziele abzuhaken.",
  ),
];

// ===========================================================================
// ARTICLE 3 — Merengue, Bachata & Dominican Music (EN, ES, IT)
// ===========================================================================

const musicBodyEn = [
  para(
    "Music in the Dominican Republic is not an entertainment category — it's the country's pulse. You hear it from the moment you step off the plane: in the airport corridors, in the taxis, from rolling speakers on motorbikes, in cafés, in barber shops, on the beach, in the resort restaurants. The two genres that define Dominican identity are merengue and bachata, and both were invented here. Understanding even a little about them changes how you experience the country.",
  ),
  para(
    "This guide walks through what each genre is, where they came from, who the major artists are, and where you can actually experience live Dominican music while you're in Punta Cana. If you want a structured introduction, several of our [[culture and nature excursions|https://puntacana-excursions.com/excursions?category=culture-nature]] include musical performances or visits to venues where live music is part of the experience.",
  ),

  h2("Merengue: The National Genre"),
  para(
    "Merengue is the official national music of the Dominican Republic, designated as such by presidential decree in 2005 and listed as Intangible Cultural Heritage by UNESCO in 2016. It's a fast-tempo dance music in 2/4 time, traditionally driven by three instruments: the tambora (a two-headed drum played with one stick and one hand), the güira (a metal scraper played with a stiff brush), and an accordion. Modern merengue ensembles add saxophones, piano, bass, and sometimes brass sections, but the foundational rhythm stays the same.",
  ),
  para(
    "The origins are contested but the genre clearly emerged in the rural Cibao region of the northern Dominican Republic during the mid-19th century. It blended African rhythmic elements (the tambora, the syncopation), European harmonic structure (the accordion, brought by traders), and indigenous Taíno influence (the güira evolved from a Taíno percussion instrument). For decades it was considered low-class music — too rural, too African, too associated with the working poor. Wealthy Dominicans preferred imported European music. That changed under the dictator Rafael Trujillo, who in the 1930s deliberately elevated merengue as a symbol of Dominican nationalism. The political use of the music was cynical, but the cultural effect was lasting: by the 1960s merengue was the unambiguous national music.",
  ),
  h3("How to Recognize Merengue"),
  para(
    "If you hear fast tempo, an accordion or saxophone playing a quick melodic line, a tambora producing a continuous bouncing rhythm, and a steel-scraper sound running underneath everything — that's merengue. The dance is straightforward: a quick two-step, hip movement on the second beat, partners moving close but not as tightly held as in salsa. Most Dominicans learn the basic step before they learn to read. Even casual dance floors at resorts feature it.",
  ),
  h3("Key Merengue Artists to Know"),
  para(
    "**Juan Luis Guerra** is the most internationally famous Dominican musician of any genre. His group 4.40 modernized merengue and bachata in the 1980s and 1990s, bringing them to global audiences without losing their roots. Songs like \"Ojalá Que Llueva Café\" and \"Bachata Rosa\" are part of the cultural canon. Guerra is from Santo Domingo and still records actively.",
  ),
  para(
    "**Wilfrido Vargas** is the godfather of modern commercial merengue. His big-band arrangements in the 1970s and 1980s defined the sound that conquered Latin America. **Johnny Ventura** was the most beloved merengue showman of the second half of the 20th century, with a career spanning decades. **Fernando Villalona** is the most popular merengue singer of the current generation — his songs are everywhere on Dominican radio. **Sergio Vargas, Eddy Herrera, and Toño Rosario** complete the contemporary canon.",
  ),

  h2("Bachata: The Music of Heartbreak"),
  para(
    "Bachata is the second great Dominican genre and the one that has exploded in international popularity over the past twenty years. It's slower than merengue, in 4/4 time, with a distinctive guitar-driven sound. The traditional bachata ensemble has lead guitar (requinto), rhythm guitar (segunda), electric bass, bongos, and güira. The vocals are emotional, usually about romantic loss, unfaithfulness, longing, or the bitterness of failed love. The genre's nickname in its early years was \"música de amargue\" — music of bitterness.",
  ),
  para(
    "Bachata emerged in the 1960s in the rural and working-class neighborhoods of Santo Domingo, particularly among migrants from the countryside who brought guitar-based serenade traditions with them. For its first thirty years, bachata was considered the music of poverty and prostitution. It was banned from radio stations, dismissed by music critics, and looked down upon by middle-class Dominicans. The music thrived anyway, in cantinas, brothels, and the homes of the people who actually loved it. The breakthrough came in 1991, when Juan Luis Guerra released the album \"Bachata Rosa,\" which gave the genre a polished, romantic presentation that finally won middle-class acceptance.",
  ),
  para(
    "From that point bachata exploded. The Bronx-based group Aventura, fronted by Romeo Santos, took the genre global in the 2000s with songs that combined traditional bachata structure with hip-hop sensibilities and bilingual lyrics. Romeo Santos went on to a solo career that has made him one of the biggest Latin music stars in the world. Prince Royce, Anthony Santos, Luis Vargas, Frank Reyes, and Joe Veras all contributed major songs to the canon.",
  ),
  h3("How to Recognize Bachata"),
  para(
    "Listen for the requinto guitar — a high, ringing, picked melodic line that's the genre's signature sound. Underneath you'll hear a slower 4/4 rhythm with bongo accents and the unmistakable güira scraping. The vocals are emotional and usually slow. The dance is romantic, partners close together, four-step pattern with a hip movement on the fourth beat. Bachata is far easier for tourists to dance than merengue — most resort instructors teach it during evening dance classes.",
  ),

  h2("Other Dominican Genres Worth Knowing"),
  h3("Dembow"),
  para(
    "Dembow is the contemporary urban genre of Dominican youth — a fusion of reggaeton, hip-hop, and Caribbean rhythms with an aggressive, repetitive beat. It emerged in the early 2000s and has dominated Dominican popular music for the past decade. The biggest current dembow artists are El Alfa, Tokischa, Rochy RD, and Bulin 47. The lyrics are often controversial — explicit, slangy, sometimes violent — and the genre is divisive even within the Dominican Republic. But it's what young Dominicans listen to, and dembow songs dominate the charts and the streets.",
  ),
  h3("Salsa, Cumbia, and Other Latin Imports"),
  para(
    "While merengue and bachata are home-grown, Dominicans also dance and listen to imported Latin genres. Salsa is widely played but considered foreign. Cumbia (from Colombia) is popular. Reggaeton (originally Panamanian and Puerto Rican) has been fused with local sensibilities and competes with dembow for youth attention. The result is that Dominican dance floors play a mix of all these genres, often switching every few songs.",
  ),
  h3("Palo and Gagá: The Older Traditions"),
  para(
    "Older than merengue or bachata are the African-diasporic religious music traditions known as palo and gagá. These are drum-based ceremonial musics with deep roots in the country's African heritage. They are not commonly heard in resort settings, but they remain alive in rural communities, especially in the Haitian-Dominican border regions and in some Afro-Dominican communities. If you're interested in deeper cultural exploration, asking a [[culture-focused excursion guide|https://puntacana-excursions.com/excursions?category=culture-nature]] about these traditions can lead to unexpected and meaningful experiences.",
  ),

  h2("Where to Experience Live Dominican Music"),
  h3("Inside the Resort"),
  para(
    "Almost every all-inclusive resort has a nightly entertainment schedule that includes some combination of merengue, bachata, and salsa. The quality varies enormously. The best resort shows feature genuine Dominican performers and good live bands; the worst are recorded music with dance instructors. The animators (entertainment staff) at most resorts also teach evening dance classes, usually free, that are a great low-pressure introduction. Even if you don't think you'll dance, sign up for one class — most travelers tell us afterward that it was a highlight.",
  ),
  h3("Bávaro and Cap Cana Nightlife"),
  para(
    "Outside the resorts, the main nightlife corridors in Bávaro and El Cortecito have several venues that feature live Dominican music. Some are tourist-aware and lean toward the polished commercial sound; others are more local in character. Hard Rock Café in Cap Cana hosts decent live shows. Coco Bongo (originally from Cancún but with a Punta Cana location) features high-production cabaret-style performances that include Dominican music. For a more local feeling, ask your concierge or driver about smaller venues in Friusa or El Cortecito — the bars where the resort workers go after their shifts.",
  ),
  h3("Santo Domingo's Live Music Scene"),
  para(
    "If you make the day trip to Santo Domingo (or better, an overnight), the music scene there is far deeper than anything in the resort areas. The Colonial Zone has dozens of bars and small venues featuring live performances. Mama Rumba is a long-running salsa and merengue venue in the Gazcue neighborhood. Jet Set in the Naco district has hosted major bachata and merengue stars for decades. The Malecón seafront has open-air venues. Live music in Santo Domingo on a weekend night is one of the best ways to experience the actual capital city beyond the colonial postcard version.",
  ),
  h3("Festivals and Big Events"),
  para(
    "The Festival de Merengue in Santo Domingo takes place in late July or early August each year, with multiple days of free outdoor concerts on the Malecón. The Bachata Festival is held in October. Carnival season in February features parades and street music across the country. Major Dominican artists frequently perform at the Hard Rock Hotel amphitheater and the Altos de Chavón amphitheater near La Romana, so checking the schedules at both venues for your travel dates is worthwhile.",
  ),

  h2("Learning to Dance: Realistic Expectations"),
  para(
    "Most travelers want to leave the Dominican Republic with at least a basic ability to dance merengue and bachata. The good news: both are accessible. Bachata is simpler than merengue for a first-time dancer because its slower tempo gives you time to think. Merengue requires more rhythm but the basic step is genuinely just walking in place. The bad news: looking confident takes practice, and a few resort classes won't make you a Dominican-level dancer.",
  ),
  para(
    "What works for most travelers: take at least two resort dance classes (typically free, scheduled in the late afternoon), then dance with locals at the evening shows. Dominicans are extremely patient with beginning dancers and will gently guide you. The cultural rule is that asking to dance is a compliment, not an imposition — saying yes is the norm. Don't try to learn complicated turns or styling on your first attempt. Stick to the basic step, let your partner lead, and trust the music. The confidence comes from doing it, not from watching tutorials.",
  ),
  h3("Private Lessons"),
  para(
    "If you want a real foundation, hire a private instructor for an hour or two. Most resorts can arrange this; alternatively, private studios in Bávaro and Punta Cana offer beginner sessions starting around 30 USD per hour. A single thirty-minute session focused on the merengue basic step and a single thirty-minute session focused on the bachata basic step is enough to dance with confidence in social situations. The investment pays off the rest of the trip.",
  ),

  h2("The Music in Daily Life"),
  para(
    "More than the formal venues, Dominican music is woven into the texture of everyday life. The motorbike with the speaker strapped to it riding by playing dembow at dawn. The barber shop with merengue on the radio while the men get their morning shaves. The colmado (small corner store) with bachata playing as the older customers chat about politics. The wedding next door where the band plays until 4:00 AM. The taxi driver singing along to Romeo Santos. The kids on the beach with portable speakers playing the latest dembow track at top volume.",
  ),
  para(
    "If you really want to understand Dominican music, you don't need to seek it out — you need to stop wearing headphones. Walk through any town or neighborhood, sit at any outdoor bar, take any local bus, and the soundtrack will find you. The music is the country's emotional vocabulary. Joy, heartbreak, frustration, longing, political anger, sexual desire — all of it gets expressed through these genres, and listening to a few songs with the lyrics translated will teach you more about how Dominicans actually feel about their lives than any guidebook.",
  ),

  h2("Dominican Music and the Diaspora"),
  para(
    "One of the most important things to understand about contemporary Dominican music is that it doesn't all come from the Dominican Republic. The Dominican diaspora — particularly the large community in New York City — has been a creative engine for the genre for over forty years. Washington Heights in upper Manhattan has been called the bachata capital of the world, despite being three thousand kilometers from the country itself. Romeo Santos and his bandmates in Aventura were born and raised in the Bronx. Many of the artists you hear in Dominican taxis grew up moving between Santo Domingo and New York, between Spanish-only neighborhoods in the DR and bilingual ones in the United States, and the music reflects that border-crossing experience.",
  ),
  para(
    "This is why so much modern bachata and dembow has English phrases mixed into the Spanish lyrics, why production styles borrow from American hip-hop, why themes increasingly include American urban experiences alongside traditional Dominican rural ones. Some traditionalists complain that the music has become less authentic, but the reality is the opposite — the diaspora is part of the Dominican experience now, and the music has simply expanded to include it. Listening to a Romeo Santos song is listening to a Dominican-American story as much as a Dominican one.",
  ),
  para(
    "The same is true for Spanish-speaking communities in Madrid, Boston, Miami, and Puerto Rico, where Dominican music finds large audiences and influences other Latin genres in turn. The result is that the music you hear in Punta Cana is not isolated — it's part of a transnational conversation that includes millions of Spanish-speaking listeners across the Western hemisphere. Understanding this context makes the songs more interesting, because you start to hear the multiple places they come from.",
  ),

  h2("A Starter Playlist"),
  para(
    "If you want to arrive in the country already familiar with the sound, here's a list of songs that will give you a working introduction across the major Dominican genres. Listen to them in the order below for a sense of how the music evolved.",
  ),
  li("**\"Ojalá Que Llueva Café\"** — Juan Luis Guerra y 4.40 (classic merengue with deep cultural meaning, 1989)"),
  li("**\"La Bilirrubina\"** — Juan Luis Guerra y 4.40 (joyful merengue, easy to dance to, 1990)"),
  li("**\"Bachata Rosa\"** — Juan Luis Guerra y 4.40 (the song that made bachata middle-class, 1991)"),
  li("**\"Como El Primer Día\"** — Frank Reyes (classic traditional bachata, the heart of the genre)"),
  li("**\"Obsesión\"** — Aventura (the song that made bachata global, 2002)"),
  li("**\"Propuesta Indecente\"** — Romeo Santos (modern bachata at its most popular, 2013)"),
  li("**\"El Africano\"** — Wilfrido Vargas (definitive 1980s big-band merengue)"),
  li("**\"Tarzan\"** — Fernando Villalona (contemporary merengue at its most danceable)"),
  li("**\"Coronao Now\"** — El Alfa (urban dembow, the youth sound)"),
  li("**\"Singapur\"** — Tokischa & Tivi Gunz (current dembow, often divisive but everywhere)"),
  para(
    "Searching any of these on Spotify or YouTube will give you the sound of the country well before you arrive.",
  ),

  h2("Final Thoughts"),
  para(
    "Music in the Dominican Republic is not background; it's foreground. The country talks to itself through merengue and bachata the way other countries talk through literature or film. You can have a perfectly pleasant trip without engaging with it, but you will have a deeper one if you do. Take one dance lesson. Listen to two or three Juan Luis Guerra songs before you arrive. Ask a taxi driver what he's playing. Stay out at one venue past midnight to see what the locals are dancing to. These are small choices that make the country come alive in ways the resort buffet cannot.",
  ),
  para(
    "If you'd like recommendations for live music venues, dance classes, or cultural excursions during your stay, [[contact our team|https://puntacana-excursions.com/contact]] with your dates and interests. We can match you with the experiences that fit your schedule and your comfort level with going outside the resort. The music is one of the great gifts of this country, and it's available to anyone willing to listen.",
  ),
];

const musicBodyEs = [
  para(
    "La música en la República Dominicana no es una categoría de entretenimiento — es el pulso del país. La escuchas desde el momento en que bajas del avión: en los pasillos del aeropuerto, en los taxis, desde altavoces rodantes en motocicletas, en cafés, en barberías, en la playa, en los restaurantes de los resorts. Los dos géneros que definen la identidad dominicana son el merengue y la bachata, y ambos fueron inventados aquí. Entender aunque sea un poco sobre ellos cambia cómo experimentas el país.",
  ),
  para(
    "Esta guía recorre qué es cada género, de dónde vienen, quiénes son los artistas principales y dónde realmente puedes experimentar música dominicana en vivo mientras estás en Punta Cana. Si quieres una introducción estructurada, varias de nuestras [[excursiones de cultura y naturaleza|https://puntacana-excursions.com/excursions?category=culture-nature]] incluyen actuaciones musicales o visitas a lugares donde la música en vivo es parte de la experiencia.",
  ),

  h2("Merengue: El Género Nacional"),
  para(
    "El merengue es la música nacional oficial de la República Dominicana, designada como tal por decreto presidencial en 2005 y catalogada como Patrimonio Cultural Inmaterial por la UNESCO en 2016. Es una música bailable de tempo rápido en compás de 2/4, tradicionalmente impulsada por tres instrumentos: la tambora (un tambor de dos parches tocado con un palo y una mano), la güira (un raspador metálico tocado con un cepillo rígido), y un acordeón. Los conjuntos modernos de merengue añaden saxofones, piano, bajo y a veces secciones de metales, pero el ritmo fundacional permanece igual.",
  ),
  para(
    "Los orígenes son disputados pero el género claramente emergió en la región rural del Cibao en el norte de la República Dominicana a mediados del siglo XIX. Mezcló elementos rítmicos africanos (la tambora, la sincopa), estructura armónica europea (el acordeón, traído por comerciantes), e influencia indígena taína (la güira evolucionó de un instrumento de percusión taíno). Durante décadas se consideró música de clase baja — demasiado rural, demasiado africana, demasiado asociada con los trabajadores pobres. Los dominicanos adinerados preferían música europea importada. Eso cambió bajo el dictador Rafael Trujillo, quien en los años 30 elevó deliberadamente el merengue como símbolo del nacionalismo dominicano. El uso político de la música fue cínico, pero el efecto cultural fue duradero: para los años 60 el merengue era la música nacional inequívoca.",
  ),
  h3("Cómo Reconocer el Merengue"),
  para(
    "Si escuchas tempo rápido, un acordeón o saxofón tocando una rápida línea melódica, una tambora produciendo un ritmo continuo y rebotante, y un sonido de raspador de metal corriendo debajo de todo — eso es merengue. El baile es sencillo: un rápido paso de dos tiempos, movimiento de cadera en el segundo tiempo, parejas moviéndose cerca pero no tan apretadas como en la salsa. La mayoría de los dominicanos aprenden el paso básico antes de aprender a leer. Incluso las pistas de baile casuales en los resorts lo presentan.",
  ),
  h3("Artistas Clave de Merengue Para Conocer"),
  para(
    "**Juan Luis Guerra** es el músico dominicano más famoso internacionalmente de cualquier género. Su grupo 4.40 modernizó el merengue y la bachata en los años 80 y 90, llevándolos a audiencias globales sin perder sus raíces. Canciones como \"Ojalá Que Llueva Café\" y \"Bachata Rosa\" son parte del canon cultural. Guerra es de Santo Domingo y todavía graba activamente.",
  ),
  para(
    "**Wilfrido Vargas** es el padrino del merengue comercial moderno. Sus arreglos de gran banda en los años 70 y 80 definieron el sonido que conquistó América Latina. **Johnny Ventura** fue el showman de merengue más querido de la segunda mitad del siglo XX, con una carrera que abarcó décadas. **Fernando Villalona** es el cantante de merengue más popular de la generación actual — sus canciones están en todas partes de la radio dominicana. **Sergio Vargas, Eddy Herrera y Toño Rosario** completan el canon contemporáneo.",
  ),

  h2("Bachata: La Música del Desamor"),
  para(
    "La bachata es el segundo gran género dominicano y el que ha explotado en popularidad internacional en los últimos veinte años. Es más lenta que el merengue, en compás de 4/4, con un sonido distintivo impulsado por guitarra. El conjunto tradicional de bachata tiene guitarra líder (requinto), guitarra rítmica (segunda), bajo eléctrico, bongos y güira. Las voces son emocionales, generalmente sobre pérdida amorosa, infidelidad, anhelo, o la amargura del amor fallido. El apodo del género en sus primeros años era \"música de amargue\".",
  ),
  para(
    "La bachata emergió en los años 60 en los barrios rurales y de clase trabajadora de Santo Domingo, particularmente entre migrantes del campo que trajeron consigo tradiciones de serenata basadas en guitarra. Durante sus primeros treinta años, la bachata se consideró la música de la pobreza y la prostitución. Estuvo prohibida en las estaciones de radio, descartada por críticos de música, y menospreciada por los dominicanos de clase media. La música prosperó de todos modos, en cantinas, burdeles, y los hogares de las personas que realmente la amaban. El gran avance llegó en 1991, cuando Juan Luis Guerra lanzó el álbum \"Bachata Rosa\", que dio al género una presentación pulida y romántica que finalmente ganó la aceptación de la clase media.",
  ),
  para(
    "A partir de ese punto la bachata explotó. El grupo Aventura, basado en el Bronx y liderado por Romeo Santos, llevó el género a nivel global en los años 2000 con canciones que combinaron la estructura tradicional de bachata con sensibilidades de hip-hop y letras bilingües. Romeo Santos pasó a una carrera en solitario que lo ha convertido en una de las mayores estrellas de música latina del mundo. Prince Royce, Anthony Santos, Luis Vargas, Frank Reyes y Joe Veras contribuyeron todos con grandes canciones al canon.",
  ),
  h3("Cómo Reconocer la Bachata"),
  para(
    "Escucha la guitarra requinto — una línea melódica aguda, resonante, punteada que es el sonido característico del género. Debajo escucharás un ritmo más lento de 4/4 con acentos de bongo y el inconfundible raspado de güira. Las voces son emocionales y generalmente lentas. El baile es romántico, parejas juntas, patrón de cuatro pasos con un movimiento de cadera en el cuarto tiempo. La bachata es mucho más fácil para los turistas de bailar que el merengue — la mayoría de los instructores de resort la enseñan durante las clases de baile nocturnas.",
  ),

  h2("Otros Géneros Dominicanos que Vale la Pena Conocer"),
  h3("Dembow"),
  para(
    "El dembow es el género urbano contemporáneo de la juventud dominicana — una fusión de reggaetón, hip-hop y ritmos caribeños con un ritmo agresivo y repetitivo. Emergió a principios de los años 2000 y ha dominado la música popular dominicana durante la última década. Los artistas de dembow más grandes actualmente son El Alfa, Tokischa, Rochy RD y Bulin 47. Las letras a menudo son controversiales — explícitas, llenas de jerga, a veces violentas — y el género es divisivo incluso dentro de la República Dominicana. Pero es lo que los jóvenes dominicanos escuchan, y las canciones de dembow dominan las listas y las calles.",
  ),
  h3("Salsa, Cumbia y Otras Importaciones Latinas"),
  para(
    "Mientras que el merengue y la bachata son de cosecha propia, los dominicanos también bailan y escuchan géneros latinos importados. La salsa se toca ampliamente pero se considera extranjera. La cumbia (de Colombia) es popular. El reggaetón (originalmente panameño y puertorriqueño) ha sido fusionado con sensibilidades locales y compite con el dembow por la atención juvenil. El resultado es que las pistas de baile dominicanas tocan una mezcla de todos estos géneros, a menudo cambiando cada pocas canciones.",
  ),
  h3("Palo y Gagá: Las Tradiciones Más Antiguas"),
  para(
    "Más antiguas que el merengue o la bachata son las tradiciones de música religiosa de origen africano conocidas como palo y gagá. Estas son músicas ceremoniales basadas en tambor con raíces profundas en la herencia africana del país. No se escuchan comúnmente en entornos de resort, pero permanecen vivas en comunidades rurales, especialmente en las regiones fronterizas haitiano-dominicanas y en algunas comunidades afro-dominicanas. Si te interesa una exploración cultural más profunda, preguntar a un [[guía de excursión enfocado en cultura|https://puntacana-excursions.com/excursions?category=culture-nature]] sobre estas tradiciones puede llevar a experiencias inesperadas y significativas.",
  ),

  h2("Dónde Experimentar Música Dominicana en Vivo"),
  h3("Dentro del Resort"),
  para(
    "Casi todos los resorts todo-incluido tienen un horario de entretenimiento nocturno que incluye alguna combinación de merengue, bachata y salsa. La calidad varía enormemente. Los mejores espectáculos de resort presentan a artistas dominicanos genuinos y buenas bandas en vivo; los peores son música grabada con instructores de baile. Los animadores (personal de entretenimiento) en la mayoría de los resorts también enseñan clases de baile nocturnas, generalmente gratuitas, que son una excelente introducción de baja presión. Incluso si no crees que vayas a bailar, inscríbete en una clase — la mayoría de los viajeros nos dicen después que fue un punto destacado.",
  ),
  h3("Vida Nocturna en Bávaro y Cap Cana"),
  para(
    "Fuera de los resorts, los principales corredores de vida nocturna en Bávaro y El Cortecito tienen varios lugares que presentan música dominicana en vivo. Algunos están al tanto del turismo y se inclinan hacia el sonido comercial pulido; otros son de carácter más local. El Hard Rock Café en Cap Cana alberga decentes espectáculos en vivo. Coco Bongo (originalmente de Cancún pero con una ubicación en Punta Cana) presenta espectáculos al estilo cabaret de alta producción que incluyen música dominicana. Para una sensación más local, pregunta a tu conserje o conductor sobre lugares más pequeños en Friusa o El Cortecito — los bares donde van los trabajadores del resort después de sus turnos.",
  ),
  h3("La Escena Musical en Vivo de Santo Domingo"),
  para(
    "Si haces la excursión de un día a Santo Domingo (o mejor, una noche), la escena musical allí es mucho más profunda que cualquier cosa en las áreas de resort. La Zona Colonial tiene docenas de bares y pequeños locales que presentan actuaciones en vivo. Mama Rumba es un lugar de larga trayectoria de salsa y merengue en el barrio de Gazcue. Jet Set en el distrito de Naco ha albergado a grandes estrellas de bachata y merengue durante décadas. El Malecón frente al mar tiene locales al aire libre. La música en vivo en Santo Domingo en una noche de fin de semana es una de las mejores maneras de experimentar la ciudad capital real más allá de la versión colonial de postal.",
  ),
  h3("Festivales y Grandes Eventos"),
  para(
    "El Festival de Merengue en Santo Domingo tiene lugar a finales de julio o principios de agosto cada año, con múltiples días de conciertos gratuitos al aire libre en el Malecón. El Festival de Bachata se celebra en octubre. La temporada de Carnaval en febrero presenta desfiles y música callejera por todo el país. Los principales artistas dominicanos actúan con frecuencia en el anfiteatro del Hard Rock Hotel y en el anfiteatro de Altos de Chavón cerca de La Romana, así que vale la pena revisar los horarios en ambos lugares para tus fechas de viaje.",
  ),

  h2("Aprender a Bailar: Expectativas Realistas"),
  para(
    "La mayoría de los viajeros quieren salir de la República Dominicana con al menos una habilidad básica para bailar merengue y bachata. La buena noticia: ambos son accesibles. La bachata es más simple que el merengue para un bailarín principiante porque su tempo más lento te da tiempo para pensar. El merengue requiere más ritmo pero el paso básico es genuinamente solo caminar en el lugar. La mala noticia: lucir confiado requiere práctica, y unas pocas clases de resort no te convertirán en un bailarín de nivel dominicano.",
  ),
  para(
    "Lo que funciona para la mayoría de los viajeros: toma al menos dos clases de baile en el resort (generalmente gratuitas, programadas al final de la tarde), luego baila con los locales en los espectáculos nocturnos. Los dominicanos son extremadamente pacientes con los bailarines principiantes y te guiarán suavemente. La regla cultural es que pedir bailar es un cumplido, no una imposición — decir que sí es la norma. No intentes aprender giros o estilo complicados en tu primer intento. Apégate al paso básico, deja que tu pareja guíe, y confía en la música. La confianza viene de hacerlo, no de ver tutoriales.",
  ),
  h3("Clases Privadas"),
  para(
    "Si quieres una base real, contrata a un instructor privado por una o dos horas. La mayoría de los resorts pueden arreglar esto; alternativamente, los estudios privados en Bávaro y Punta Cana ofrecen sesiones para principiantes a partir de 30 USD por hora. Una sola sesión de treinta minutos enfocada en el paso básico de merengue y una sola sesión de treinta minutos enfocada en el paso básico de bachata son suficientes para bailar con confianza en situaciones sociales. La inversión rinde durante el resto del viaje.",
  ),

  h2("La Música en la Vida Cotidiana"),
  para(
    "Más que los lugares formales, la música dominicana está tejida en la textura de la vida cotidiana. La motocicleta con el altavoz atado pasando al amanecer tocando dembow. La barbería con merengue en la radio mientras los hombres se afeitan por la mañana. El colmado (pequeña tienda de esquina) con bachata sonando mientras los clientes mayores conversan sobre política. La boda al lado donde la banda toca hasta las 4:00 AM. El taxista cantando junto a Romeo Santos. Los niños en la playa con altavoces portátiles tocando el último tema de dembow a todo volumen.",
  ),
  para(
    "Si realmente quieres entender la música dominicana, no necesitas buscarla — necesitas dejar de usar audífonos. Camina por cualquier pueblo o barrio, siéntate en cualquier bar al aire libre, toma cualquier autobús local, y la banda sonora te encontrará. La música es el vocabulario emocional del país. Alegría, desamor, frustración, anhelo, ira política, deseo sexual — todo eso se expresa a través de estos géneros, y escuchar algunas canciones con las letras traducidas te enseñará más sobre cómo realmente se sienten los dominicanos sobre sus vidas que cualquier guía de viaje.",
  ),

  h2("La Música Dominicana y la Diáspora"),
  para(
    "Una de las cosas más importantes para entender sobre la música dominicana contemporánea es que no toda viene de la República Dominicana. La diáspora dominicana — particularmente la gran comunidad en la ciudad de Nueva York — ha sido un motor creativo para el género durante más de cuarenta años. Washington Heights en el norte de Manhattan ha sido llamado la capital mundial de la bachata, a pesar de estar a tres mil kilómetros del país mismo. Romeo Santos y sus compañeros de banda en Aventura nacieron y crecieron en el Bronx. Muchos de los artistas que escuchas en los taxis dominicanos crecieron moviéndose entre Santo Domingo y Nueva York, entre barrios solo en español en la RD y bilingües en los Estados Unidos, y la música refleja esa experiencia de cruce fronterizo.",
  ),
  para(
    "Por esto tanta bachata moderna y dembow tiene frases en inglés mezcladas en las letras en español, por qué los estilos de producción toman prestado del hip-hop estadounidense, por qué los temas incluyen cada vez más experiencias urbanas estadounidenses junto con las tradicionales experiencias rurales dominicanas. Algunos tradicionalistas se quejan de que la música se ha vuelto menos auténtica, pero la realidad es lo opuesto — la diáspora es parte de la experiencia dominicana ahora, y la música simplemente se ha expandido para incluirla. Escuchar una canción de Romeo Santos es escuchar una historia dominicano-estadounidense tanto como una dominicana.",
  ),
  para(
    "Lo mismo es cierto para las comunidades hispanohablantes en Madrid, Boston, Miami y Puerto Rico, donde la música dominicana encuentra grandes audiencias e influye en otros géneros latinos a su vez. El resultado es que la música que escuchas en Punta Cana no está aislada — es parte de una conversación transnacional que incluye a millones de oyentes hispanohablantes en todo el hemisferio occidental. Entender este contexto hace que las canciones sean más interesantes, porque empiezas a escuchar los múltiples lugares de donde vienen.",
  ),

  h2("Una Lista de Reproducción Inicial"),
  para(
    "Si quieres llegar al país ya familiarizado con el sonido, aquí hay una lista de canciones que te darán una introducción funcional a través de los principales géneros dominicanos. Escúchalas en el orden a continuación para tener una idea de cómo evolucionó la música.",
  ),
  li("**\"Ojalá Que Llueva Café\"** — Juan Luis Guerra y 4.40 (merengue clásico con profundo significado cultural, 1989)"),
  li("**\"La Bilirrubina\"** — Juan Luis Guerra y 4.40 (merengue alegre, fácil de bailar, 1990)"),
  li("**\"Bachata Rosa\"** — Juan Luis Guerra y 4.40 (la canción que hizo de la bachata clase media, 1991)"),
  li("**\"Como El Primer Día\"** — Frank Reyes (bachata tradicional clásica, el corazón del género)"),
  li("**\"Obsesión\"** — Aventura (la canción que hizo de la bachata global, 2002)"),
  li("**\"Propuesta Indecente\"** — Romeo Santos (bachata moderna en su punto más popular, 2013)"),
  li("**\"El Africano\"** — Wilfrido Vargas (definitivo merengue de gran banda de los años 80)"),
  li("**\"Tarzan\"** — Fernando Villalona (merengue contemporáneo en su punto más bailable)"),
  li("**\"Coronao Now\"** — El Alfa (dembow urbano, el sonido juvenil)"),
  li("**\"Singapur\"** — Tokischa & Tivi Gunz (dembow actual, a menudo divisivo pero en todas partes)"),
  para(
    "Buscar cualquiera de estas en Spotify o YouTube te dará el sonido del país mucho antes de que llegues.",
  ),

  h2("Reflexiones Finales"),
  para(
    "La música en la República Dominicana no es fondo; es primer plano. El país se habla a sí mismo a través del merengue y la bachata de la manera en que otros países hablan a través de la literatura o el cine. Puedes tener un viaje perfectamente agradable sin involucrarte con ella, pero tendrás uno más profundo si lo haces. Toma una clase de baile. Escucha dos o tres canciones de Juan Luis Guerra antes de llegar. Pregúntale a un taxista qué está tocando. Quédate hasta tarde en un lugar pasada la medianoche para ver qué están bailando los locales. Estas son pequeñas elecciones que hacen que el país cobre vida de maneras que el buffet del resort no puede.",
  ),
  para(
    "Si te gustaría obtener recomendaciones de lugares de música en vivo, clases de baile o excursiones culturales durante tu estancia, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] con tus fechas e intereses. Podemos emparejarte con las experiencias que se ajusten a tu horario y tu nivel de comodidad para salir del resort. La música es uno de los grandes regalos de este país, y está disponible para cualquiera dispuesto a escuchar.",
  ),
];

const musicBodyIt = [
  para(
    "La musica nella Repubblica Dominicana non è una categoria di intrattenimento — è il battito del paese. La senti dal momento in cui scendi dall'aereo: nei corridoi dell'aeroporto, nei taxi, dagli altoparlanti rotanti sulle motociclette, nei caffè, nei barbieri, in spiaggia, nei ristoranti dei resort. I due generi che definiscono l'identità dominicana sono il merengue e la bachata, ed entrambi sono stati inventati qui. Capire anche solo un po' di loro cambia il modo in cui vivi il paese.",
  ),
  para(
    "Questa guida percorre cosa sia ciascun genere, da dove vengono, chi sono gli artisti principali e dove puoi effettivamente sperimentare la musica dominicana dal vivo mentre sei a Punta Cana. Se vuoi un'introduzione strutturata, diverse delle nostre [[escursioni di cultura e natura|https://puntacana-excursions.com/excursions?category=culture-nature]] includono spettacoli musicali o visite a locali dove la musica dal vivo è parte dell'esperienza.",
  ),

  h2("Merengue: Il Genere Nazionale"),
  para(
    "Il merengue è la musica nazionale ufficiale della Repubblica Dominicana, designata come tale con decreto presidenziale nel 2005 e iscritta come Patrimonio Culturale Immateriale dall'UNESCO nel 2016. È una musica da ballo a tempo veloce in tempo 2/4, tradizionalmente guidata da tre strumenti: la tambora (un tamburo a due teste suonato con un bastone e una mano), la güira (un raschietto metallico suonato con una spazzola rigida), e una fisarmonica. Gli ensemble moderni di merengue aggiungono sassofoni, pianoforte, basso, e talvolta sezioni di ottoni, ma il ritmo fondamentale rimane lo stesso.",
  ),
  para(
    "Le origini sono contese ma il genere è chiaramente emerso nella regione rurale del Cibao nel nord della Repubblica Dominicana durante la metà del XIX secolo. Ha mescolato elementi ritmici africani (la tambora, la sincope), struttura armonica europea (la fisarmonica, portata dai commercianti), e influenza indigena taína (la güira si è evoluta da uno strumento a percussione taíno). Per decenni è stata considerata musica di bassa classe — troppo rurale, troppo africana, troppo associata ai lavoratori poveri. I dominicani ricchi preferivano la musica europea importata. Le cose cambiarono sotto il dittatore Rafael Trujillo, che negli anni '30 elevò deliberatamente il merengue come simbolo del nazionalismo dominicano. L'uso politico della musica fu cinico, ma l'effetto culturale fu duraturo: negli anni '60 il merengue era la musica nazionale inequivocabile.",
  ),
  h3("Come Riconoscere il Merengue"),
  para(
    "Se senti un tempo veloce, una fisarmonica o un sassofono che suonano una rapida linea melodica, una tambora che produce un ritmo continuo e rimbalzante, e un suono di raschietto in metallo che corre sotto tutto — quello è il merengue. La danza è semplice: un rapido passo a due, movimento dell'anca sul secondo battito, partner che si muovono vicini ma non così stretti come nella salsa. La maggior parte dei dominicani imparano il passo base prima di imparare a leggere. Anche le piste da ballo casual nei resort lo presentano.",
  ),
  h3("Artisti Chiave del Merengue da Conoscere"),
  para(
    "**Juan Luis Guerra** è il musicista dominicano più famoso a livello internazionale di qualsiasi genere. Il suo gruppo 4.40 ha modernizzato il merengue e la bachata negli anni '80 e '90, portandoli al pubblico globale senza perdere le loro radici. Canzoni come \"Ojalá Que Llueva Café\" e \"Bachata Rosa\" fanno parte del canone culturale. Guerra è di Santo Domingo e registra ancora attivamente.",
  ),
  para(
    "**Wilfrido Vargas** è il padrino del merengue commerciale moderno. I suoi arrangiamenti per big band negli anni '70 e '80 hanno definito il suono che ha conquistato l'America Latina. **Johnny Ventura** è stato lo showman del merengue più amato della seconda metà del XX secolo, con una carriera di decenni. **Fernando Villalona** è il cantante di merengue più popolare della generazione attuale — le sue canzoni sono ovunque nella radio dominicana. **Sergio Vargas, Eddy Herrera e Toño Rosario** completano il canone contemporaneo.",
  ),

  h2("Bachata: La Musica del Cuore Spezzato"),
  para(
    "La bachata è il secondo grande genere dominicano e quello che è esploso in popolarità internazionale negli ultimi vent'anni. È più lenta del merengue, in tempo 4/4, con un suono distintivo guidato dalla chitarra. L'ensemble tradizionale di bachata ha chitarra solista (requinto), chitarra ritmica (segunda), basso elettrico, bonghi e güira. Le voci sono emotive, di solito sulla perdita romantica, l'infedeltà, il desiderio, o l'amarezza dell'amore fallito. Il soprannome del genere nei suoi primi anni era \"música de amargue\" — musica dell'amarezza.",
  ),
  para(
    "La bachata è emersa negli anni '60 nei quartieri rurali e operai di Santo Domingo, in particolare tra i migranti dalla campagna che hanno portato con sé tradizioni di serenata basate sulla chitarra. Per i suoi primi trent'anni, la bachata era considerata la musica della povertà e della prostituzione. Era bandita dalle stazioni radio, scartata dai critici musicali, e disprezzata dai dominicani della classe media. La musica prosperò comunque, in cantine, bordelli, e nelle case delle persone che la amavano davvero. La svolta arrivò nel 1991, quando Juan Luis Guerra pubblicò l'album \"Bachata Rosa\", che diede al genere una presentazione raffinata e romantica che finalmente conquistò l'accettazione della classe media.",
  ),
  para(
    "Da quel momento la bachata esplose. Il gruppo Aventura, con sede nel Bronx e guidato da Romeo Santos, portò il genere a livello globale negli anni 2000 con canzoni che combinavano la struttura tradizionale della bachata con sensibilità hip-hop e testi bilingui. Romeo Santos passò a una carriera solista che lo ha reso una delle più grandi star della musica latina del mondo. Prince Royce, Anthony Santos, Luis Vargas, Frank Reyes e Joe Veras hanno tutti contribuito con grandi canzoni al canone.",
  ),
  h3("Come Riconoscere la Bachata"),
  para(
    "Ascolta la chitarra requinto — una linea melodica alta, squillante, pizzicata che è il suono caratteristico del genere. Sotto sentirai un ritmo più lento in 4/4 con accenti di bongo e l'inconfondibile raschietto di güira. Le voci sono emotive e di solito lente. La danza è romantica, partner vicini, schema a quattro passi con un movimento dell'anca sul quarto battito. La bachata è molto più facile da ballare per i turisti rispetto al merengue — la maggior parte degli istruttori dei resort la insegna durante le lezioni di ballo serali.",
  ),

  h2("Altri Generi Dominicani che Vale la Pena Conoscere"),
  h3("Dembow"),
  para(
    "Il dembow è il genere urbano contemporaneo dei giovani dominicani — una fusione di reggaeton, hip-hop e ritmi caraibici con un beat aggressivo e ripetitivo. È emerso all'inizio degli anni 2000 e ha dominato la musica popolare dominicana nell'ultimo decennio. I più grandi artisti dembow attuali sono El Alfa, Tokischa, Rochy RD e Bulin 47. I testi sono spesso controversi — espliciti, gergali, a volte violenti — e il genere è divisivo anche all'interno della Repubblica Dominicana. Ma è ciò che ascoltano i giovani dominicani, e le canzoni dembow dominano le classifiche e le strade.",
  ),
  h3("Salsa, Cumbia e Altre Importazioni Latine"),
  para(
    "Mentre il merengue e la bachata sono autoctoni, i dominicani ballano e ascoltano anche generi latini importati. La salsa è ampiamente suonata ma considerata straniera. La cumbia (dalla Colombia) è popolare. Il reggaeton (originariamente panamense e portoricano) è stato fuso con sensibilità locali e compete con il dembow per l'attenzione dei giovani. Il risultato è che le piste da ballo dominicane suonano un mix di tutti questi generi, spesso cambiando ogni poche canzoni.",
  ),
  h3("Palo e Gagá: Le Tradizioni più Antiche"),
  para(
    "Più antiche del merengue o della bachata sono le tradizioni musicali religiose afro-diasporiche conosciute come palo e gagá. Queste sono musiche cerimoniali basate sui tamburi con profonde radici nel patrimonio africano del paese. Non si sentono comunemente nei contesti dei resort, ma rimangono vive nelle comunità rurali, specialmente nelle regioni di confine haitiano-dominicane e in alcune comunità afro-dominicane. Se sei interessato a un'esplorazione culturale più profonda, chiedere a una [[guida di escursione focalizzata sulla cultura|https://puntacana-excursions.com/excursions?category=culture-nature]] di queste tradizioni può portare a esperienze inaspettate e significative.",
  ),

  h2("Dove Sperimentare la Musica Dominicana dal Vivo"),
  h3("All'Interno del Resort"),
  para(
    "Quasi tutti i resort all-inclusive hanno un programma di intrattenimento serale che include una combinazione di merengue, bachata e salsa. La qualità varia enormemente. I migliori spettacoli dei resort presentano genuini artisti dominicani e buone band dal vivo; i peggiori sono musica registrata con istruttori di ballo. Gli animatori (personale di intrattenimento) nella maggior parte dei resort insegnano anche lezioni di ballo serali, di solito gratuite, che sono un'eccellente introduzione a bassa pressione. Anche se non pensi di ballare, iscriviti a una lezione — la maggior parte dei viaggiatori ci dice in seguito che è stato un momento clou.",
  ),
  h3("Vita Notturna a Bávaro e Cap Cana"),
  para(
    "Fuori dai resort, i principali corridoi della vita notturna a Bávaro ed El Cortecito hanno diversi locali che presentano musica dominicana dal vivo. Alcuni sono consapevoli del turismo e si orientano verso il suono commerciale raffinato; altri sono di carattere più locale. L'Hard Rock Café a Cap Cana ospita decenti spettacoli dal vivo. Il Coco Bongo (originariamente di Cancún ma con una sede a Punta Cana) presenta spettacoli in stile cabaret ad alta produzione che includono musica dominicana. Per una sensazione più locale, chiedi al tuo concierge o autista di locali più piccoli a Friusa o El Cortecito — i bar dove vanno i lavoratori dei resort dopo i loro turni.",
  ),
  h3("La Scena Musicale dal Vivo di Santo Domingo"),
  para(
    "Se fai la gita di un giorno a Santo Domingo (o meglio, un pernottamento), la scena musicale lì è molto più profonda di qualsiasi cosa nelle aree dei resort. La Zona Coloniale ha decine di bar e piccoli locali che presentano esibizioni dal vivo. Mama Rumba è un locale di lunga durata di salsa e merengue nel quartiere di Gazcue. Jet Set nel distretto di Naco ha ospitato grandi star di bachata e merengue per decenni. Il lungomare del Malecón ha locali all'aperto. La musica dal vivo a Santo Domingo in una sera del fine settimana è uno dei modi migliori per vivere la vera città capitale oltre la versione coloniale da cartolina.",
  ),
  h3("Festival e Grandi Eventi"),
  para(
    "Il Festival de Merengue a Santo Domingo si tiene a fine luglio o inizio agosto di ogni anno, con più giorni di concerti gratuiti all'aperto sul Malecón. Il Festival della Bachata si tiene a ottobre. La stagione del Carnevale a febbraio presenta sfilate e musica di strada in tutto il paese. I principali artisti dominicani si esibiscono frequentemente all'anfiteatro dell'Hard Rock Hotel e all'anfiteatro di Altos de Chavón vicino a La Romana, quindi vale la pena controllare i programmi di entrambi i locali per le tue date di viaggio.",
  ),

  h2("Imparare a Ballare: Aspettative Realistiche"),
  para(
    "La maggior parte dei viaggiatori vuole lasciare la Repubblica Dominicana con almeno una capacità di base di ballare il merengue e la bachata. La buona notizia: entrambi sono accessibili. La bachata è più semplice del merengue per un ballerino alle prime armi perché il suo tempo più lento ti dà il tempo di pensare. Il merengue richiede più ritmo ma il passo base è genuinamente solo camminare sul posto. La cattiva notizia: sembrare sicuro richiede pratica, e poche lezioni del resort non ti renderanno un ballerino di livello dominicano.",
  ),
  para(
    "Quello che funziona per la maggior parte dei viaggiatori: prendi almeno due lezioni di ballo del resort (di solito gratuite, programmate nel tardo pomeriggio), poi balla con i locali agli spettacoli serali. I dominicani sono estremamente pazienti con i ballerini principianti e ti guideranno gentilmente. La regola culturale è che chiedere di ballare è un complimento, non un'imposizione — dire di sì è la norma. Non cercare di imparare giri o stilizzazioni complicati al tuo primo tentativo. Resta al passo base, lascia che il tuo partner guidi, e fidati della musica. La fiducia viene dal farlo, non dal guardare tutorial.",
  ),
  h3("Lezioni Private"),
  para(
    "Se vuoi una vera base, assumi un istruttore privato per un'ora o due. La maggior parte dei resort può organizzarlo; in alternativa, gli studi privati a Bávaro e Punta Cana offrono sessioni per principianti a partire da circa 30 USD all'ora. Una sola sessione di trenta minuti focalizzata sul passo base del merengue e una sola sessione di trenta minuti focalizzata sul passo base della bachata sono sufficienti per ballare con fiducia nelle situazioni sociali. L'investimento ripaga per il resto del viaggio.",
  ),

  h2("La Musica nella Vita Quotidiana"),
  para(
    "Più dei locali formali, la musica dominicana è intrecciata nella trama della vita di tutti i giorni. La motocicletta con l'altoparlante legato che passa all'alba suonando dembow. Il barbiere con il merengue alla radio mentre gli uomini si fanno la barba mattutina. Il colmado (piccolo negozio d'angolo) con la bachata che suona mentre i clienti più anziani chiacchierano di politica. Il matrimonio della porta accanto dove la band suona fino alle 4 del mattino. Il tassista che canta insieme a Romeo Santos. I bambini sulla spiaggia con altoparlanti portatili che suonano l'ultimo brano dembow al massimo volume.",
  ),
  para(
    "Se vuoi davvero capire la musica dominicana, non hai bisogno di cercarla — devi smettere di indossare le cuffie. Cammina per qualsiasi città o quartiere, siediti in qualsiasi bar all'aperto, prendi qualsiasi autobus locale, e la colonna sonora ti troverà. La musica è il vocabolario emotivo del paese. Gioia, cuore spezzato, frustrazione, desiderio, rabbia politica, desiderio sessuale — tutto viene espresso attraverso questi generi, e ascoltare alcune canzoni con i testi tradotti ti insegnerà di più su come i dominicani si sentono realmente sulla loro vita di qualsiasi guida turistica.",
  ),

  h2("La Musica Dominicana e la Diaspora"),
  para(
    "Una delle cose più importanti da capire sulla musica dominicana contemporanea è che non viene tutta dalla Repubblica Dominicana. La diaspora dominicana — in particolare la grande comunità a New York City — è stata un motore creativo per il genere per oltre quarant'anni. Washington Heights nell'Upper Manhattan è stata chiamata la capitale mondiale della bachata, nonostante sia a tremila chilometri dal paese stesso. Romeo Santos e i suoi compagni di band negli Aventura sono nati e cresciuti nel Bronx. Molti degli artisti che senti nei taxi dominicani sono cresciuti spostandosi tra Santo Domingo e New York, tra quartieri solo in spagnolo nella RD e quartieri bilingui negli Stati Uniti, e la musica riflette quell'esperienza di attraversamento del confine.",
  ),
  para(
    "È per questo che tanta bachata moderna e dembow hanno frasi in inglese mescolate ai testi in spagnolo, perché gli stili di produzione prendono in prestito dall'hip-hop americano, perché i temi includono sempre più esperienze urbane americane insieme alle tradizionali esperienze rurali dominicane. Alcuni tradizionalisti si lamentano che la musica è diventata meno autentica, ma la realtà è l'opposto — la diaspora è parte dell'esperienza dominicana ora, e la musica si è semplicemente espansa per includerla. Ascoltare una canzone di Romeo Santos è ascoltare una storia dominicano-americana tanto quanto una dominicana.",
  ),
  para(
    "Lo stesso vale per le comunità ispanofone a Madrid, Boston, Miami e Porto Rico, dove la musica dominicana trova un grande pubblico e influenza a sua volta altri generi latini. Il risultato è che la musica che senti a Punta Cana non è isolata — è parte di una conversazione transnazionale che include milioni di ascoltatori ispanofoni in tutto l'emisfero occidentale. Capire questo contesto rende le canzoni più interessanti, perché inizi a sentire i molteplici luoghi da cui provengono.",
  ),

  h2("Una Playlist di Partenza"),
  para(
    "Se vuoi arrivare nel paese già familiare con il suono, ecco una lista di canzoni che ti daranno un'introduzione funzionante attraverso i principali generi dominicani. Ascoltale nell'ordine seguente per avere un'idea di come la musica si è evoluta.",
  ),
  li("**\"Ojalá Que Llueva Café\"** — Juan Luis Guerra y 4.40 (merengue classico con profondo significato culturale, 1989)"),
  li("**\"La Bilirrubina\"** — Juan Luis Guerra y 4.40 (merengue gioioso, facile da ballare, 1990)"),
  li("**\"Bachata Rosa\"** — Juan Luis Guerra y 4.40 (la canzone che ha reso la bachata classe media, 1991)"),
  li("**\"Como El Primer Día\"** — Frank Reyes (bachata tradizionale classica, il cuore del genere)"),
  li("**\"Obsesión\"** — Aventura (la canzone che ha reso la bachata globale, 2002)"),
  li("**\"Propuesta Indecente\"** — Romeo Santos (bachata moderna al suo apice di popolarità, 2013)"),
  li("**\"El Africano\"** — Wilfrido Vargas (definitivo merengue big-band degli anni '80)"),
  li("**\"Tarzan\"** — Fernando Villalona (merengue contemporaneo al suo più ballabile)"),
  li("**\"Coronao Now\"** — El Alfa (dembow urbano, il suono dei giovani)"),
  li("**\"Singapur\"** — Tokischa & Tivi Gunz (dembow attuale, spesso divisivo ma ovunque)"),
  para(
    "Cercare una qualsiasi di queste su Spotify o YouTube ti darà il suono del paese ben prima di arrivare.",
  ),

  h2("Riflessioni Finali"),
  para(
    "La musica nella Repubblica Dominicana non è sottofondo; è primo piano. Il paese parla a se stesso attraverso il merengue e la bachata nel modo in cui altri paesi parlano attraverso la letteratura o il cinema. Puoi avere un viaggio perfettamente piacevole senza coinvolgerti con essa, ma ne avrai uno più profondo se lo farai. Prendi una lezione di ballo. Ascolta due o tre canzoni di Juan Luis Guerra prima di arrivare. Chiedi a un tassista cosa sta suonando. Resta fuori in un locale dopo mezzanotte per vedere cosa stanno ballando i locali. Queste sono piccole scelte che rendono il paese vivo in modi che il buffet del resort non può.",
  ),
  para(
    "Se desideri raccomandazioni per locali di musica dal vivo, lezioni di ballo, o escursioni culturali durante il tuo soggiorno, [[contatta il nostro team|https://puntacana-excursions.com/contact]] con le tue date e interessi. Possiamo abbinarti alle esperienze che si adattano al tuo programma e al tuo livello di comfort nell'uscire dal resort. La musica è uno dei grandi doni di questo paese, ed è disponibile a chiunque sia disposto ad ascoltare.",
  ),
];

// ===========================================================================
// Articles definitions
// ===========================================================================

const articles = [
  // ----- Article 1: Dominican Food Guide -----
  {
    _id: "blog-article-food-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "dominican-food-guide",
    slug: { _type: "slug", current: "dominican-food-guide" },
    title: "Dominican Food Guide: A Local's Take on the Best Dishes and Where to Find Them",
    excerpt:
      "From mangú at breakfast to sancocho on Sundays — a complete guide to Dominican cuisine and where to find authentic versions near Punta Cana.",
    publishedAt: "2025-08-12",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: foodBodyEn,
  },
  {
    _id: "blog-article-food-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "dominican-food-guide",
    slug: { _type: "slug", current: "guia-comida-dominicana" },
    title: "Guía de Comida Dominicana: La Perspectiva de un Local Sobre los Mejores Platos",
    excerpt:
      "Del mangú en el desayuno al sancocho los domingos — una guía completa de la cocina dominicana y dónde encontrar versiones auténticas cerca de Punta Cana.",
    publishedAt: "2025-08-12",
    readingTime: 14,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: foodBodyEs,
  },
  {
    _id: "blog-article-food-fr",
    _type: "blogArticle",
    language: "fr",
    translationGroup: "dominican-food-guide",
    slug: { _type: "slug", current: "guide-cuisine-dominicaine" },
    title: "Guide de la Cuisine Dominicaine : Le Point de Vue d'un Local sur les Meilleurs Plats",
    excerpt:
      "Du mangú au petit-déjeuner au sancocho du dimanche — un guide complet de la cuisine dominicaine et où trouver des versions authentiques près de Punta Cana.",
    publishedAt: "2025-08-12",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: foodBodyFr,
  },

  // ----- Article 2: Beyond the Resort: Higüey & Local Towns -----
  {
    _id: "blog-article-towns-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "beyond-resort-local-towns",
    slug: { _type: "slug", current: "beyond-resort-higuey-local-towns" },
    title: "Beyond the Resort: Higüey & the Local Towns Near Punta Cana",
    excerpt:
      "Higüey, Bayahibe, La Romana, Boca de Yuma — the towns and cities near Punta Cana that show how Dominicans really live, and how to visit them.",
    publishedAt: "2025-09-18",
    readingTime: 14,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: localTownsBodyEn,
  },
  {
    _id: "blog-article-towns-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "beyond-resort-local-towns",
    slug: { _type: "slug", current: "mas-alla-resort-higuey-pueblos-locales" },
    title: "Más Allá del Resort: Higüey y los Pueblos Locales Cerca de Punta Cana",
    excerpt:
      "Higüey, Bayahibe, La Romana, Boca de Yuma — los pueblos y ciudades cerca de Punta Cana que muestran cómo viven realmente los dominicanos, y cómo visitarlos.",
    publishedAt: "2025-09-18",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: localTownsBodyEs,
  },
  {
    _id: "blog-article-towns-de",
    _type: "blogArticle",
    language: "de",
    translationGroup: "beyond-resort-local-towns",
    slug: { _type: "slug", current: "jenseits-resort-higuey-lokale-staedte" },
    title: "Jenseits des Resorts: Higüey und die Lokalen Städte in der Nähe von Punta Cana",
    excerpt:
      "Higüey, Bayahibe, La Romana, Boca de Yuma — die Städte und Orte in der Nähe von Punta Cana, die zeigen, wie Dominikaner wirklich leben, und wie man sie besucht.",
    publishedAt: "2025-09-18",
    readingTime: 14,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: localTownsBodyDe,
  },

  // ----- Article 3: Merengue, Bachata & Dominican Music -----
  {
    _id: "blog-article-music-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "merengue-bachata-dominican-music",
    slug: { _type: "slug", current: "merengue-bachata-dominican-music-guide" },
    title: "Merengue, Bachata & Dominican Music: A Visitor's Guide to the Sound of the Country",
    excerpt:
      "Origins, key artists, where to hear live music, and how to actually dance — a complete introduction to merengue, bachata, dembow, and Dominican musical culture.",
    publishedAt: "2025-10-22",
    readingTime: 14,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: musicBodyEn,
  },
  {
    _id: "blog-article-music-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "merengue-bachata-dominican-music",
    slug: { _type: "slug", current: "merengue-bachata-musica-dominicana" },
    title: "Merengue, Bachata y Música Dominicana: Guía del Visitante al Sonido del País",
    excerpt:
      "Orígenes, artistas clave, dónde escuchar música en vivo, y cómo realmente bailar — una introducción completa al merengue, bachata, dembow, y la cultura musical dominicana.",
    publishedAt: "2025-10-22",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: musicBodyEs,
  },
  {
    _id: "blog-article-music-it",
    _type: "blogArticle",
    language: "it",
    translationGroup: "merengue-bachata-dominican-music",
    slug: { _type: "slug", current: "merengue-bachata-musica-dominicana-guida" },
    title: "Merengue, Bachata e Musica Dominicana: Una Guida per il Visitatore al Suono del Paese",
    excerpt:
      "Origini, artisti chiave, dove ascoltare musica dal vivo, e come ballare davvero — un'introduzione completa al merengue, bachata, dembow, e alla cultura musicale dominicana.",
    publishedAt: "2025-10-22",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-local-culture" },
    body: musicBodyIt,
  },
];

// ===========================================================================
// Seed function
// ===========================================================================

async function seed() {
  console.log(`Seeding ${articles.length} blog articles...`);

  for (const article of articles) {
    try {
      await client.createOrReplace(article);
      console.log(`  ✓ ${article._id} (${article.language}) — ${article.title}`);
    } catch (err) {
      console.error(`  ✗ ${article._id} failed:`, err);
      throw err;
    }
  }

  console.log(`\nDone. ${articles.length} articles seeded.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
