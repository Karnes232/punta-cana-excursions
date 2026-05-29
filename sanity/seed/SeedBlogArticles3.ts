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

  const tokenRegex = /\[\[([^\]|]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
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

// ---------------------------------------------------------------------------
// SEO helper: builds an Article JSON-LD blob keyed off the article fields.
// ---------------------------------------------------------------------------

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
// ARTICLE 1 — Money in Punta Cana (EN, ES, PT)
// ===========================================================================

const moneyBodyEn = [
  para(
    "Money is one of the most confusing aspects of a Punta Cana trip for first-time visitors. Two currencies are in circulation, tipping rules aren't always obvious, ATM access varies, credit cards work in some places and not others, and the difference between resort prices and outside-the-resort prices can be enormous. This guide walks through everything you need to know to spend confidently in the Dominican Republic without overpaying or feeling lost.",
  ),
  para(
    "If you have specific questions about how payments work for any of our trips, [[contact our team|https://puntacana-excursions.com/contact]] — we accept multiple currencies and payment methods and can clarify the right approach for your booking.",
  ),

  h2("The Two Currencies: USD and Dominican Pesos"),
  para(
    "The official currency is the Dominican peso (DOP), but US dollars circulate freely throughout the tourist zones. In Punta Cana, Bávaro, and Cap Cana, you can pay for almost anything in either currency. Outside the tourist zones — in Higüey, Veron, Santo Domingo neighborhoods, or any small town — pesos are strongly preferred and dollars may not be accepted at all.",
  ),
  para(
    "The exchange rate at the time of writing hovers around 58 to 62 Dominican pesos per US dollar, though it shifts with market conditions. For mental math, a useful approximation is that 1,000 pesos is roughly 17 US dollars. Many restaurants and tour operators display prices in both currencies, and prices in USD are usually rounded for convenience (e.g., $20 instead of 1,180 pesos).",
  ),
  h3("Which Currency Should You Carry?"),
  para(
    "If you're staying inside the resort zone for most of your trip, USD is the simplest option. The resorts, taxis arranged by hotels, restaurants in Bávaro, and major excursion operators all accept dollars without issue. If you plan to leave the resort even occasionally — to visit local towns, eat at family restaurants, shop in markets, or take public transportation — bring some pesos. A useful target is about 50 percent USD and 50 percent pesos for a balanced trip.",
  ),

  h2("Where to Exchange Money"),
  para(
    "Avoid the airport currency exchange counter if possible. The rates are typically the worst you'll find. The best exchange rates are at official Dominican banks (Banco Popular, BHD, Banreservas) which have branches in Bávaro and Punta Cana proper. Banks require your passport for any exchange transaction. Rates are slightly worse at the official currency exchange offices (casas de cambio), but they're faster and require less paperwork.",
  ),
  para(
    "Never exchange money with informal street changers, even if the rate sounds great. The risk of counterfeit notes is real, and there's no legal recourse if something goes wrong. The rate difference between street exchangers and banks is rarely worth the risk.",
  ),
  h3("ATMs in Punta Cana"),
  para(
    "ATMs are widely available in the resort zones. The major bank ATMs (Banco Popular, Banreservas, BHD) dispense both pesos and US dollars, though pesos are more reliable and offered at every machine. ATM withdrawal fees vary: your home bank typically charges a foreign transaction fee (often $3 to $5 per withdrawal plus a percentage), and the Dominican ATM operator charges its own fee (usually around 250 to 350 pesos, or roughly $4 to $6).",
  ),
  para(
    "Practical advice: withdraw larger amounts less frequently. Pulling out 8,000 to 10,000 pesos at once minimizes the per-withdrawal fees compared to multiple smaller withdrawals. Most ATMs have a single-transaction limit of around 10,000 pesos, but you can often run two transactions back-to-back if you need more cash. Always use ATMs inside banks, hotel lobbies, or well-lit shopping areas — never standalone outdoor ATMs late at night.",
  ),

  h2("Credit and Debit Cards"),
  para(
    "Credit cards work at all major resorts, most restaurants in tourist zones, large excursion operators, supermarkets, and bigger shops. Visa and Mastercard are universally accepted; American Express and Discover are accepted at some major resorts but less frequently elsewhere. Outside the tourist zones, cards are accepted at supermarkets and gas stations but not at most small restaurants, market stalls, taxis, or comedores. Always carry some cash for these situations.",
  ),
  para(
    "Important: tell your bank or card issuer before traveling that you'll be using your card in the Dominican Republic. Fraud detection systems frequently flag and block Caribbean transactions for cardholders who don't notify them in advance, and resolving a blocked card from abroad is frustrating. A simple online notification or app message before your trip prevents the problem entirely.",
  ),
  h3("Foreign Transaction Fees"),
  para(
    "Most US and European credit cards charge a foreign transaction fee of 1 to 3 percent on every purchase in the Dominican Republic, even if the merchant charges you in USD. The exception is cards specifically marketed as travel cards (Chase Sapphire, Capital One Venture, several European travel cards, and similar). If you travel internationally even occasionally, getting one of these cards before your trip pays for itself quickly.",
  ),
  h3("Dynamic Currency Conversion"),
  para(
    "Some Dominican card terminals will offer to charge you in your home currency rather than in pesos or USD. This is called \"dynamic currency conversion,\" and the exchange rate they use is almost always worse than your bank's rate. When given the option, always choose to be charged in the local currency (DOP). Your bank will handle the conversion at a much better rate than the merchant's terminal does.",
  ),

  h2("Tipping Culture in the Dominican Republic"),
  para(
    "Tipping is expected throughout the tourism industry. The standard rates are clear but not always communicated to visitors. Here's the practical breakdown.",
  ),
  h3("At Resorts"),
  para(
    "All-inclusive resorts technically include service in the package price, but tips are still expected and appreciated. Recommended amounts: 1 to 2 USD per drink for bartenders if you want consistent good service; 2 to 3 USD per day for housekeeping (leave it on the pillow daily, not at the end); 5 to 10 USD per day for butler service if your room has one; 2 to 5 USD per bag for porters; 1 to 2 USD per round for poolside servers. Tips at the buffet are not necessary but appreciated for table servers who are particularly helpful.",
  ),
  h3("At Restaurants"),
  para(
    "Most Dominican restaurants automatically add a 10 percent service charge (\"propina legal\" or \"servicio\") plus 18 percent ITBIS (sales tax) to the bill. The 10 percent service charge is technically the tip, but it doesn't always reach the server in full. The custom is to leave an additional 5 to 10 percent in cash directly on the table for the server, especially for good service. Check the bill carefully — restaurants in tourist zones sometimes add the service charge plus a separate tip line, which is double-tipping.",
  ),
  h3("Taxis and Transportation"),
  para(
    "Taxis in the Dominican Republic typically don't expect a tip on top of the metered or negotiated fare, but rounding up to the nearest dollar or 50 pesos is appreciated. For pre-arranged hotel transfer drivers, 5 to 10 USD per driver is standard. Tour operators usually have a guide and a driver; tipping both is customary — 10 to 15 USD per guide and 5 to 10 USD per driver for a half-day, doubled for a full-day excursion.",
  ),
  h3("Excursion Crews"),
  para(
    "On boat excursions, snorkeling trips, and day tours, the crew works hard and depends on tips. The standard is 5 to 10 USD per person for a full-day excursion, more if the experience was exceptional. Tip the crew directly at the end of the trip, not the office or booking agent. On our [[excursions|https://puntacana-excursions.com/excursions]] we provide guidance during the trip about who is on the crew and how tips are distributed.",
  ),

  h2("Common Scams and How to Avoid Them"),
  para(
    "The Dominican Republic is generally safe for tourists, but a few specific money scams target visitors. Knowing about them in advance is most of the protection.",
  ),
  h3("Counterfeit Notes"),
  para(
    "Counterfeit pesos appear occasionally, especially in change given at busy markets or by informal taxi drivers. Real Dominican pesos have visible watermarks, holographic strips on larger denominations, and a slightly textured feel. Be wary of soft, smooth, or unusually crisp notes — and never accept change in a denomination higher than the bill you paid with.",
  ),
  h3("Inflated Taxi Fares"),
  para(
    "Some taxi drivers, particularly at the airport or near major resort entrances, will quote tourists fares two to three times the local rate. The protection is simple: agree on the price before you get in, in writing or with the driver clearly confirming verbally. Ask your hotel concierge for typical fares to common destinations before you leave so you have a baseline. For a fair price reference, the airport-to-Bávaro fare in 2025 ranges from $30 to $45 USD depending on the resort.",
  ),
  h3("\"Helpful\" Strangers Near ATMs"),
  para(
    "Someone offering to help you use an ATM, even if they seem to work nearby, is almost always a scammer. Decline politely and complete the transaction alone. If something seems off with the ATM, cancel and use a different one. Real bank employees never approach customers at ATMs.",
  ),
  h3("Excursion \"Special Deals\" at the Beach"),
  para(
    "Beach hawkers selling excursions at the resorts often quote prices significantly higher than the legitimate operator price and may not deliver the trip as described. Book excursions through established operators with verifiable reviews, your hotel concierge, or directly with companies like [[ours|https://puntacana-excursions.com/excursions]] rather than informal beach sellers.",
  ),

  h2("A Realistic Budget for Your Trip"),
  para(
    "Beyond the all-inclusive cost of your hotel, here are realistic daily spending estimates for typical trip components. These are not the cheapest possible costs — they're what most travelers actually spend.",
  ),
  li("**Excursions:** $80 to $150 USD per person for most full-day group trips; $200 to $400 USD per person for premium private experiences"),
  li("**Off-resort meals:** $15 to $30 USD per person for lunch at a tourist-zone restaurant; $5 to $12 USD per person at a local comedor"),
  li("**Drinks at non-resort bars:** $5 to $8 USD per cocktail; $2 to $4 USD per local beer"),
  li("**Taxi for typical trips:** $15 to $30 USD for short hops within Bávaro; $40 to $80 USD for longer day trips to Higüey or Bayahibe"),
  li("**Tipping budget:** $20 to $40 USD per day for a couple staying at an all-inclusive resort with one excursion"),
  li("**Souvenirs and shopping:** highly variable; cigars, rum, and coffee are good quality and reasonable prices; jewelry and art are negotiable"),

  h2("Resort Prices vs. Outside-the-Resort Prices"),
  para(
    "One of the bigger surprises for first-time visitors is the price difference between resort restaurants/shops and local establishments. A cocktail that costs $1 to $4 at a comedor in Veron can run $10 to $15 at a beachfront resort bar. A whole grilled fish meal at a Bayahibe fish shack might be $12 to $18; the same plate at a resort a la carte restaurant easily hits $35 to $45. A bottle of water at the resort gift shop is sometimes $4; the same bottle at a colmado outside is 40 pesos (around 70 cents).",
  ),
  para(
    "This isn't unreasonable on the resort's part — they're paying for infrastructure, all-inclusive service, and convenience — but it's worth knowing if you want to manage spending. If you leave the resort even occasionally, plan to do some shopping for souvenirs, snacks, drinks, and small gifts at local stores rather than the resort gift shop. The savings on a week of small purchases easily covers an extra excursion.",
  ),

  h2("Bank Hours and Banking Logistics"),
  para(
    "Public holidays close all banks completely. The big ones to know are January 21 (Our Lady of Altagracia), February 27 (Independence Day), Holy Week (the Thursday and Friday before Easter), May 1 (Labor Day), August 16 (Restoration Day), and the days around Christmas and New Year. Plan to have cash on hand for those dates because lines at functioning ATMs can be long and many smaller exchange offices close as well. Hotel front desks can sometimes do small dollar-to-peso exchanges in a pinch but at unfavorable rates, so it's better to plan ahead.",
  ),

  h2("Paying for Excursions and Tours"),
  para(
    "Excursion booking practices vary widely. Established operators (including us) typically take a deposit at the time of booking — often 25 to 50 percent of the total — with the balance due before the trip starts, sometimes in cash on the day. Smaller operators may want full payment upfront. Hotel-arranged excursions usually bill to your room and you settle at checkout, which is convenient but rarely the best price.",
  ),
  para(
    "If you're paying a balance in cash on the day of the excursion, bring it in the exact amount and the agreed currency. Drivers and guides don't always carry change, and trying to break a $100 bill at 7:00 AM before a Saona departure has slowed down many trips unnecessarily. If the operator quoted you in USD, pay in USD; if they quoted in pesos, pay in pesos. Mixing currencies for a single payment introduces conversion confusion that's easier to avoid.",
  ),
  h3("Refund and Cancellation Policies"),
  para(
    "Read cancellation terms before booking, especially for trips that depend on weather (boat trips, fishing, snorkeling). Reputable operators offer full refunds or rescheduling when weather forces a cancellation, but the policies on weather-affected-but-not-cancelled trips (rough seas, partial visibility) vary widely. Our [[booking policies|https://puntacana-excursions.com/contact]] are transparent — we tell you exactly what happens in each scenario before you pay anything.",
  ),

  h2("Cash Backup Strategies"),
  para(
    "Even with cards and ATM access, having a cash reserve matters. The recommended setup for a one-week trip: carry about $200 to $300 USD in mixed denominations from home, plus a credit card and a debit card from different banks. Pull pesos from an ATM on arrival or day two. Keep $100 or so in cash in your hotel room safe as an emergency reserve, separate from what you carry day-to-day.",
  ),
  para(
    "If your card gets blocked or lost, having a separate card from a different bank is the single most useful backup. Wire transfers via Western Union or MoneyGram are available throughout the country and can be used as a last-resort cash injection if cards completely fail. Your hotel's front desk can usually help you locate the nearest agent.",
  ),
  h3("What to Do If Your Card Is Lost or Stolen"),
  para(
    "Call your card issuer immediately — the toll-free fraud numbers usually work from the Dominican Republic, though you may need to dial through a local prefix. Most major banks can ship a replacement card to an international hotel address within 2 to 3 business days. File a police report at the local station; you'll need it for insurance claims and sometimes for your bank's fraud investigation. Keep a printed list of your card numbers and customer service phone numbers in your luggage, separate from your wallet, before you leave home.",
  ),

  h2("Final Thoughts"),
  para(
    "Money management in Punta Cana isn't complicated once you understand the basics: bring both currencies, use major bank ATMs sparingly to avoid fees, notify your bank before traveling, tip generously where appropriate, agree on taxi fares in advance, and pay in local currency when given the option on card terminals. The Dominican Republic is genuinely good value for travelers who pay attention to these basics.",
  ),
  para(
    "If you'd like advice on payment options for a specific trip you're considering, our team at [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] handles bookings in multiple currencies and can walk you through the right setup for your group. We're locals — we know which approach works best for which type of trip, and we'll save you the trial and error.",
  ),
];

const moneyBodyEs = [
  para(
    "El dinero es uno de los aspectos más confusos de un viaje a Punta Cana para los visitantes primerizos. Circulan dos monedas, las reglas de propinas no siempre son obvias, el acceso a cajeros automáticos varía, las tarjetas de crédito funcionan en algunos lugares y en otros no, y la diferencia entre los precios del resort y los precios fuera del resort puede ser enorme. Esta guía recorre todo lo que necesitas saber para gastar con confianza en la República Dominicana sin pagar de más ni sentirte perdido.",
  ),
  para(
    "Si tienes preguntas específicas sobre cómo funcionan los pagos para cualquiera de nuestras excursiones, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] — aceptamos múltiples monedas y métodos de pago y podemos aclarar el enfoque correcto para tu reserva.",
  ),

  h2("Las Dos Monedas: USD y Pesos Dominicanos"),
  para(
    "La moneda oficial es el peso dominicano (DOP), pero los dólares estadounidenses circulan libremente por las zonas turísticas. En Punta Cana, Bávaro y Cap Cana, puedes pagar casi cualquier cosa en cualquiera de las dos monedas. Fuera de las zonas turísticas — en Higüey, Veron, barrios de Santo Domingo o cualquier pueblo pequeño — los pesos son fuertemente preferidos y es posible que no se acepten dólares en absoluto.",
  ),
  para(
    "El tipo de cambio al momento de escribir ronda los 58 a 62 pesos dominicanos por dólar estadounidense, aunque cambia con las condiciones del mercado. Para cálculos mentales, una aproximación útil es que 1.000 pesos son aproximadamente 17 dólares estadounidenses. Muchos restaurantes y operadores turísticos muestran precios en ambas monedas, y los precios en USD suelen redondearse por conveniencia (por ejemplo, $20 en lugar de 1.180 pesos).",
  ),
  h3("¿Qué Moneda Debes Llevar?"),
  para(
    "Si te alojas dentro de la zona del resort durante la mayor parte de tu viaje, el USD es la opción más simple. Los resorts, los taxis arreglados por los hoteles, los restaurantes en Bávaro y los principales operadores de excursiones aceptan dólares sin problemas. Si planeas salir del resort aunque sea ocasionalmente — para visitar pueblos locales, comer en restaurantes familiares, comprar en mercados o tomar transporte público — lleva algunos pesos. Un objetivo útil es aproximadamente 50 por ciento USD y 50 por ciento pesos para un viaje equilibrado.",
  ),

  h2("Dónde Cambiar Dinero"),
  para(
    "Evita el mostrador de cambio de moneda del aeropuerto si es posible. Las tarifas son típicamente las peores que encontrarás. Las mejores tarifas de cambio están en bancos dominicanos oficiales (Banco Popular, BHD, Banreservas) que tienen sucursales en Bávaro y Punta Cana. Los bancos requieren tu pasaporte para cualquier transacción de cambio. Las tarifas son ligeramente peores en las casas de cambio oficiales, pero son más rápidas y requieren menos papeleo.",
  ),
  para(
    "Nunca cambies dinero con cambistas callejeros informales, incluso si la tarifa suena genial. El riesgo de billetes falsificados es real, y no hay recurso legal si algo sale mal. La diferencia de tarifa entre cambistas callejeros y bancos rara vez vale el riesgo.",
  ),
  h3("Cajeros Automáticos en Punta Cana"),
  para(
    "Los cajeros automáticos están ampliamente disponibles en las zonas de resort. Los cajeros de los principales bancos (Banco Popular, Banreservas, BHD) dispensan tanto pesos como dólares estadounidenses, aunque los pesos son más confiables y se ofrecen en todas las máquinas. Las tarifas de retiro varían: tu banco de origen suele cobrar una tarifa de transacción extranjera (a menudo $3 a $5 por retiro más un porcentaje), y el operador del cajero dominicano cobra su propia tarifa (generalmente alrededor de 250 a 350 pesos, o aproximadamente $4 a $6).",
  ),
  para(
    "Consejo práctico: retira cantidades mayores con menor frecuencia. Sacar 8.000 a 10.000 pesos a la vez minimiza las tarifas por retiro en comparación con múltiples retiros más pequeños. La mayoría de los cajeros tienen un límite de transacción única de alrededor de 10.000 pesos, pero a menudo puedes hacer dos transacciones consecutivas si necesitas más efectivo. Siempre usa cajeros automáticos dentro de bancos, vestíbulos de hoteles o áreas comerciales bien iluminadas — nunca cajeros automáticos exteriores aislados tarde en la noche.",
  ),

  h2("Tarjetas de Crédito y Débito"),
  para(
    "Las tarjetas de crédito funcionan en todos los principales resorts, la mayoría de los restaurantes en zonas turísticas, grandes operadores de excursiones, supermercados y tiendas más grandes. Visa y Mastercard se aceptan universalmente; American Express y Discover se aceptan en algunos resorts importantes pero con menos frecuencia en otros lugares. Fuera de las zonas turísticas, las tarjetas se aceptan en supermercados y gasolineras pero no en la mayoría de pequeños restaurantes, puestos de mercado, taxis o comedores. Siempre lleva algo de efectivo para estas situaciones.",
  ),
  para(
    "Importante: avisa a tu banco o emisor de tarjeta antes de viajar que usarás tu tarjeta en la República Dominicana. Los sistemas de detección de fraude frecuentemente marcan y bloquean transacciones del Caribe para los titulares de tarjetas que no los notifican con anticipación, y resolver una tarjeta bloqueada desde el extranjero es frustrante. Una simple notificación en línea o mensaje desde la app antes de tu viaje evita el problema por completo.",
  ),
  h3("Tarifas de Transacción Extranjera"),
  para(
    "La mayoría de las tarjetas de crédito de EE.UU. y Europa cobran una tarifa de transacción extranjera del 1 al 3 por ciento en cada compra en la República Dominicana, incluso si el comerciante te cobra en USD. La excepción son las tarjetas comercializadas específicamente como tarjetas de viaje (Chase Sapphire, Capital One Venture, varias tarjetas de viaje europeas y similares). Si viajas internacionalmente aunque sea ocasionalmente, obtener una de estas tarjetas antes de tu viaje se paga sola rápidamente.",
  ),
  h3("Conversión Dinámica de Moneda"),
  para(
    "Algunos terminales de tarjeta dominicanos ofrecerán cobrarte en tu moneda de origen en lugar de en pesos o USD. Esto se llama \"conversión dinámica de moneda\", y el tipo de cambio que usan es casi siempre peor que el tipo de tu banco. Cuando se te da la opción, siempre elige que te cobren en la moneda local (DOP). Tu banco manejará la conversión a una tarifa mucho mejor de lo que hace el terminal del comerciante.",
  ),

  h2("Cultura de Propinas en la República Dominicana"),
  para(
    "Las propinas son esperadas en toda la industria turística. Las tarifas estándar son claras pero no siempre se comunican a los visitantes. Aquí está el desglose práctico.",
  ),
  h3("En Resorts"),
  para(
    "Los resorts todo-incluido técnicamente incluyen el servicio en el precio del paquete, pero las propinas todavía se esperan y se aprecian. Cantidades recomendadas: 1 a 2 USD por bebida para los bartenders si quieres un buen servicio constante; 2 a 3 USD por día para limpieza (déjalo en la almohada diariamente, no al final); 5 a 10 USD por día para servicio de mayordomo si tu habitación tiene uno; 2 a 5 USD por maleta para botones; 1 a 2 USD por ronda para los meseros de la piscina. Las propinas en el buffet no son necesarias pero se aprecian para los meseros que son particularmente útiles.",
  ),
  h3("En Restaurantes"),
  para(
    "La mayoría de los restaurantes dominicanos añaden automáticamente un cargo por servicio del 10 por ciento (\"propina legal\" o \"servicio\") más un 18 por ciento de ITBIS (impuesto sobre ventas) a la cuenta. El cargo por servicio del 10 por ciento es técnicamente la propina, pero no siempre llega al mesero por completo. La costumbre es dejar un 5 a 10 por ciento adicional en efectivo directamente en la mesa para el mesero, especialmente por buen servicio. Revisa la cuenta cuidadosamente — los restaurantes en zonas turísticas a veces añaden el cargo por servicio más una línea de propina separada, lo cual es propina doble.",
  ),
  h3("Taxis y Transporte"),
  para(
    "Los taxis en la República Dominicana típicamente no esperan propina además de la tarifa medida o negociada, pero redondear al dólar o 50 pesos más cercanos se aprecia. Para conductores de transfer preestablecido del hotel, 5 a 10 USD por conductor es estándar. Los operadores turísticos generalmente tienen un guía y un conductor; dar propina a ambos es costumbre — 10 a 15 USD por guía y 5 a 10 USD por conductor para medio día, doblado para una excursión de día completo.",
  ),
  h3("Tripulaciones de Excursión"),
  para(
    "En excursiones en bote, viajes de snorkel y tours de día, la tripulación trabaja duro y depende de las propinas. El estándar es de 5 a 10 USD por persona para una excursión de día completo, más si la experiencia fue excepcional. Dale propina a la tripulación directamente al final del viaje, no a la oficina ni al agente de reservas. En nuestras [[excursiones|https://puntacana-excursions.com/excursions]] proporcionamos orientación durante el viaje sobre quién está en la tripulación y cómo se distribuyen las propinas.",
  ),

  h2("Estafas Comunes y Cómo Evitarlas"),
  para(
    "La República Dominicana es generalmente segura para los turistas, pero algunas estafas específicas de dinero apuntan a los visitantes. Conocerlas con anticipación es la mayor parte de la protección.",
  ),
  h3("Billetes Falsificados"),
  para(
    "Los pesos falsificados aparecen ocasionalmente, especialmente en cambios dados en mercados ocupados o por taxistas informales. Los pesos dominicanos reales tienen marcas de agua visibles, tiras holográficas en las denominaciones más grandes, y un tacto ligeramente texturizado. Ten cuidado con billetes suaves, lisos o inusualmente nítidos — y nunca aceptes cambio en una denominación mayor que el billete con el que pagaste.",
  ),
  h3("Tarifas de Taxi Infladas"),
  para(
    "Algunos taxistas, particularmente en el aeropuerto o cerca de las entradas principales de resort, cotizarán tarifas a los turistas dos o tres veces la tarifa local. La protección es simple: acuerda el precio antes de subir, por escrito o con el conductor confirmando claramente verbalmente. Pregúntale al conserje de tu hotel sobre tarifas típicas a destinos comunes antes de irte para tener una base. Para una referencia de precio justo, la tarifa de aeropuerto a Bávaro en 2025 oscila entre $30 y $45 USD dependiendo del resort.",
  ),
  h3("Extraños \"Útiles\" Cerca de Cajeros Automáticos"),
  para(
    "Alguien que ofrezca ayudarte a usar un cajero automático, incluso si parece trabajar cerca, es casi siempre un estafador. Rechaza cortésmente y completa la transacción solo. Si algo parece raro con el cajero automático, cancela y usa uno diferente. Los empleados reales del banco nunca se acercan a los clientes en los cajeros automáticos.",
  ),
  h3("\"Ofertas Especiales\" de Excursión en la Playa"),
  para(
    "Los vendedores de playa que venden excursiones en los resorts a menudo cotizan precios significativamente más altos que el precio del operador legítimo y pueden no entregar el viaje como se describe. Reserva excursiones a través de operadores establecidos con reseñas verificables, el conserje de tu hotel, o directamente con compañías como la [[nuestra|https://puntacana-excursions.com/excursions]] en lugar de vendedores de playa informales.",
  ),

  h2("Un Presupuesto Realista para Tu Viaje"),
  para(
    "Más allá del costo todo-incluido de tu hotel, aquí hay estimaciones realistas de gasto diario para los componentes típicos del viaje. Estos no son los costos más baratos posibles — son lo que realmente gastan la mayoría de los viajeros.",
  ),
  li("**Excursiones:** $80 a $150 USD por persona para la mayoría de los viajes grupales de día completo; $200 a $400 USD por persona para experiencias privadas premium"),
  li("**Comidas fuera del resort:** $15 a $30 USD por persona para almuerzo en un restaurante de zona turística; $5 a $12 USD por persona en un comedor local"),
  li("**Bebidas en bares no-resort:** $5 a $8 USD por cóctel; $2 a $4 USD por cerveza local"),
  li("**Taxi para viajes típicos:** $15 a $30 USD para trayectos cortos dentro de Bávaro; $40 a $80 USD para viajes de día más largos a Higüey o Bayahibe"),
  li("**Presupuesto de propinas:** $20 a $40 USD por día para una pareja alojada en un resort todo-incluido con una excursión"),
  li("**Souvenirs y compras:** altamente variable; cigarros, ron y café son de buena calidad y precios razonables; joyería y arte son negociables"),

  h2("Precios del Resort vs Precios Fuera del Resort"),
  para(
    "Una de las mayores sorpresas para los visitantes primerizos es la diferencia de precios entre los restaurantes/tiendas del resort y los establecimientos locales. Un cóctel que cuesta $1 a $4 en un comedor en Veron puede costar $10 a $15 en un bar de resort frente a la playa. Una comida de pescado entero a la parrilla en una caseta de pescado en Bayahibe puede ser de $12 a $18; el mismo plato en un restaurante a la carta de resort fácilmente alcanza $35 a $45. Una botella de agua en la tienda de souvenirs del resort a veces es $4; la misma botella en un colmado afuera son 40 pesos (alrededor de 70 centavos).",
  ),
  para(
    "Esto no es irrazonable por parte del resort — están pagando por infraestructura, servicio todo-incluido y conveniencia — pero vale la pena saberlo si quieres gestionar el gasto. Si sales del resort aunque sea ocasionalmente, planifica hacer algunas compras de souvenirs, snacks, bebidas y pequeños regalos en tiendas locales en lugar de la tienda de souvenirs del resort. Los ahorros en una semana de pequeñas compras fácilmente cubren una excursión adicional.",
  ),

  h2("Horarios Bancarios y Logística Bancaria"),
  para(
    "Los bancos dominicanos generalmente operan de lunes a viernes de aproximadamente 9:00 AM a 4:00 PM, con horarios más cortos los sábados (usualmente 9:00 AM a 1:00 PM) y cerrados los domingos y feriados públicos. Los cajeros automáticos en los bancos son accesibles 24 horas a través de sus vestíbulos seguros, pero necesitarás deslizar una tarjeta para entrar después del horario. Los cajeros automáticos del vestíbulo del hotel funcionan continuamente y tienden a ser la opción más conveniente para los turistas, aunque a veces cobran tarifas ligeramente más altas que los cajeros automáticos del banco.",
  ),
  para(
    "Los feriados públicos cierran completamente todos los bancos. Los grandes a conocer son el 21 de enero (Nuestra Señora de la Altagracia), el 27 de febrero (Día de la Independencia), Semana Santa (jueves y viernes antes de Pascua), 1 de mayo (Día del Trabajo), 16 de agosto (Día de la Restauración), y los días cercanos a Navidad y Año Nuevo. Planea tener efectivo a mano para esas fechas porque las filas en los cajeros automáticos funcionales pueden ser largas y muchas casas de cambio más pequeñas también cierran. Las recepciones de hoteles a veces pueden hacer pequeños cambios de dólar a peso en un apuro pero a tarifas desfavorables, por lo que es mejor planificar con anticipación.",
  ),

  h2("Pagando Excursiones y Tours"),
  para(
    "Las prácticas de reserva de excursiones varían ampliamente. Los operadores establecidos (incluyéndonos) típicamente toman un depósito al momento de la reserva — a menudo 25 al 50 por ciento del total — con el saldo vencido antes de que comience el viaje, a veces en efectivo el día. Los operadores más pequeños pueden querer el pago completo por adelantado. Las excursiones arregladas por el hotel suelen facturarse a tu habitación y se liquidan al hacer check-out, lo cual es conveniente pero raramente el mejor precio.",
  ),
  para(
    "Si estás pagando un saldo en efectivo el día de la excursión, tráelo en la cantidad exacta y la moneda acordada. Los conductores y guías no siempre llevan cambio, e intentar romper un billete de $100 a las 7:00 AM antes de una salida a Saona ha retrasado innecesariamente muchos viajes. Si el operador te cotizó en USD, paga en USD; si cotizó en pesos, paga en pesos. Mezclar monedas para un solo pago introduce confusión de conversión que es más fácil de evitar.",
  ),
  h3("Políticas de Reembolso y Cancelación"),
  para(
    "Lee los términos de cancelación antes de reservar, especialmente para viajes que dependen del clima (excursiones en bote, pesca, snorkel). Los operadores de buena reputación ofrecen reembolsos completos o reprogramación cuando el clima fuerza una cancelación, pero las políticas sobre viajes afectados por el clima pero no cancelados (mar agitado, visibilidad parcial) varían ampliamente. Nuestras [[políticas de reserva|https://puntacana-excursions.com/contact]] son transparentes — te decimos exactamente qué sucede en cada escenario antes de que pagues algo.",
  ),

  h2("Estrategias de Respaldo de Efectivo"),
  para(
    "Incluso con tarjetas y acceso a cajeros automáticos, tener una reserva de efectivo importa. La configuración recomendada para un viaje de una semana: lleva alrededor de $200 a $300 USD en denominaciones mixtas desde casa, más una tarjeta de crédito y una tarjeta de débito de bancos diferentes. Saca pesos de un cajero automático al llegar o en el día dos. Mantén $100 o más en efectivo en la caja fuerte de tu habitación de hotel como reserva de emergencia, separada de lo que llevas día a día.",
  ),
  para(
    "Si tu tarjeta se bloquea o se pierde, tener una tarjeta separada de un banco diferente es el respaldo más útil. Las transferencias bancarias vía Western Union o MoneyGram están disponibles en todo el país y se pueden usar como una inyección de efectivo de último recurso si las tarjetas fallan por completo. La recepción de tu hotel generalmente puede ayudarte a localizar el agente más cercano.",
  ),
  h3("Qué Hacer Si Tu Tarjeta Se Pierde o Es Robada"),
  para(
    "Llama a tu emisor de tarjeta inmediatamente — los números de fraude gratuitos generalmente funcionan desde la República Dominicana, aunque es posible que necesites marcar a través de un prefijo local. La mayoría de los bancos importantes pueden enviar una tarjeta de reemplazo a una dirección internacional de hotel dentro de 2 a 3 días hábiles. Presenta una denuncia policial en la estación local; la necesitarás para reclamos de seguro y a veces para la investigación de fraude de tu banco. Mantén una lista impresa de los números de tu tarjeta y números de servicio al cliente en tu equipaje, separada de tu billetera, antes de salir de casa.",
  ),

  h2("Reflexiones Finales"),
  para(
    "La gestión del dinero en Punta Cana no es complicada una vez que entiendes lo básico: lleva ambas monedas, usa los cajeros automáticos de los principales bancos con moderación para evitar tarifas, notifica a tu banco antes de viajar, da propinas generosas donde sea apropiado, acuerda las tarifas de taxi con anticipación, y paga en moneda local cuando se te dé la opción en los terminales de tarjetas. La República Dominicana es genuinamente un buen valor para los viajeros que prestan atención a estos fundamentos.",
  ),
  para(
    "Si te gustaría obtener consejos sobre opciones de pago para un viaje específico que estás considerando, nuestro equipo en [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] maneja reservas en múltiples monedas y puede guiarte por la configuración correcta para tu grupo. Somos locales — sabemos qué enfoque funciona mejor para qué tipo de viaje, y te ahorraremos el ensayo y error.",
  ),
];

const moneyBodyPt = [
  para(
    "Dinheiro é um dos aspectos mais confusos de uma viagem a Punta Cana para visitantes de primeira viagem. Duas moedas estão em circulação, as regras de gorjeta nem sempre são óbvias, o acesso a caixas eletrônicos varia, cartões de crédito funcionam em alguns lugares e em outros não, e a diferença entre os preços do resort e os preços fora do resort pode ser enorme. Este guia percorre tudo o que você precisa saber para gastar com confiança na República Dominicana sem pagar a mais ou se sentir perdido.",
  ),
  para(
    "Se você tiver perguntas específicas sobre como os pagamentos funcionam para qualquer uma de nossas excursões, [[entre em contato com nossa equipe|https://puntacana-excursions.com/contact]] — aceitamos várias moedas e métodos de pagamento e podemos esclarecer a abordagem correta para sua reserva.",
  ),

  h2("As Duas Moedas: USD e Pesos Dominicanos"),
  para(
    "A moeda oficial é o peso dominicano (DOP), mas os dólares americanos circulam livremente pelas zonas turísticas. Em Punta Cana, Bávaro e Cap Cana, você pode pagar quase qualquer coisa em qualquer uma das moedas. Fora das zonas turísticas — em Higüey, Veron, bairros de Santo Domingo ou qualquer cidade pequena — os pesos são fortemente preferidos e os dólares podem não ser aceitos.",
  ),
  para(
    "A taxa de câmbio no momento da escrita oscila em torno de 58 a 62 pesos dominicanos por dólar americano, embora mude com as condições do mercado. Para cálculos mentais, uma aproximação útil é que 1.000 pesos equivalem a cerca de 17 dólares americanos. Muitos restaurantes e operadores turísticos exibem preços em ambas as moedas, e os preços em USD geralmente são arredondados por conveniência (por exemplo, $20 em vez de 1.180 pesos).",
  ),
  h3("Qual Moeda Você Deve Levar?"),
  para(
    "Se você ficar dentro da zona do resort durante a maior parte de sua viagem, USD é a opção mais simples. Os resorts, táxis arranjados por hotéis, restaurantes em Bávaro e principais operadores de excursões aceitam dólares sem problemas. Se você planeja sair do resort mesmo ocasionalmente — para visitar cidades locais, comer em restaurantes familiares, fazer compras em mercados ou usar transporte público — leve alguns pesos. Uma meta útil é cerca de 50 por cento USD e 50 por cento pesos para uma viagem equilibrada.",
  ),

  h2("Onde Trocar Dinheiro"),
  para(
    "Evite o balcão de câmbio do aeroporto se possível. As taxas são tipicamente as piores que você encontrará. As melhores taxas de câmbio estão nos bancos dominicanos oficiais (Banco Popular, BHD, Banreservas) que têm agências em Bávaro e Punta Cana. Os bancos exigem seu passaporte para qualquer transação de câmbio. As taxas são ligeiramente piores nos escritórios oficiais de câmbio (casas de cambio), mas são mais rápidas e exigem menos papelada.",
  ),
  para(
    "Nunca troque dinheiro com cambistas de rua informais, mesmo que a taxa pareça ótima. O risco de notas falsificadas é real, e não há recurso legal se algo der errado. A diferença de taxa entre cambistas de rua e bancos raramente vale o risco.",
  ),
  h3("Caixas Eletrônicos em Punta Cana"),
  para(
    "Os caixas eletrônicos estão amplamente disponíveis nas zonas de resort. Os caixas eletrônicos dos principais bancos (Banco Popular, Banreservas, BHD) dispensam tanto pesos quanto dólares americanos, embora pesos sejam mais confiáveis e oferecidos em todas as máquinas. As taxas de retirada variam: seu banco de origem geralmente cobra uma taxa de transação estrangeira (frequentemente $3 a $5 por retirada mais uma porcentagem), e o operador do caixa eletrônico dominicano cobra sua própria taxa (geralmente cerca de 250 a 350 pesos, ou aproximadamente $4 a $6).",
  ),
  para(
    "Conselho prático: retire quantias maiores com menos frequência. Sacar 8.000 a 10.000 pesos de uma vez minimiza as taxas por retirada em comparação com várias retiradas menores. A maioria dos caixas eletrônicos tem um limite de transação única de cerca de 10.000 pesos, mas você pode frequentemente fazer duas transações consecutivas se precisar de mais dinheiro. Sempre use caixas eletrônicos dentro de bancos, lobbies de hotéis ou áreas comerciais bem iluminadas — nunca caixas eletrônicos externos isolados tarde da noite.",
  ),

  h2("Cartões de Crédito e Débito"),
  para(
    "Os cartões de crédito funcionam em todos os principais resorts, na maioria dos restaurantes em zonas turísticas, em grandes operadores de excursões, supermercados e lojas maiores. Visa e Mastercard são aceitos universalmente; American Express e Discover são aceitos em alguns resorts importantes, mas com menos frequência em outros lugares. Fora das zonas turísticas, os cartões são aceitos em supermercados e postos de gasolina, mas não na maioria dos pequenos restaurantes, barracas de mercado, táxis ou comedores. Sempre carregue algum dinheiro para essas situações.",
  ),
  para(
    "Importante: avise seu banco ou emissor do cartão antes de viajar que você usará seu cartão na República Dominicana. Os sistemas de detecção de fraude frequentemente sinalizam e bloqueiam transações caribenhas para titulares de cartões que não os notificam com antecedência, e resolver um cartão bloqueado do exterior é frustrante. Uma simples notificação online ou mensagem do aplicativo antes de sua viagem evita o problema completamente.",
  ),
  h3("Taxas de Transação Estrangeira"),
  para(
    "A maioria dos cartões de crédito dos EUA e europeus cobra uma taxa de transação estrangeira de 1 a 3 por cento em cada compra na República Dominicana, mesmo que o comerciante o cobre em USD. A exceção são os cartões comercializados especificamente como cartões de viagem (Chase Sapphire, Capital One Venture, vários cartões de viagem europeus e similares). Se você viaja internacionalmente mesmo ocasionalmente, obter um desses cartões antes da sua viagem se paga rapidamente.",
  ),
  h3("Conversão Dinâmica de Moeda"),
  para(
    "Alguns terminais de cartão dominicanos oferecerão cobrá-lo em sua moeda de origem em vez de pesos ou USD. Isso é chamado de \"conversão dinâmica de moeda\", e a taxa de câmbio que eles usam é quase sempre pior do que a do seu banco. Quando lhe for dada a opção, sempre escolha ser cobrado na moeda local (DOP). Seu banco lidará com a conversão a uma taxa muito melhor do que o terminal do comerciante.",
  ),

  h2("Cultura de Gorjetas na República Dominicana"),
  para(
    "Gorjetas são esperadas em toda a indústria turística. As taxas padrão são claras, mas nem sempre são comunicadas aos visitantes. Aqui está o detalhamento prático.",
  ),
  h3("Em Resorts"),
  para(
    "Os resorts all-inclusive tecnicamente incluem o serviço no preço do pacote, mas as gorjetas ainda são esperadas e apreciadas. Quantias recomendadas: 1 a 2 USD por bebida para bartenders se você quiser um bom serviço consistente; 2 a 3 USD por dia para limpeza (deixe-o no travesseiro diariamente, não no final); 5 a 10 USD por dia para serviço de mordomo se seu quarto tiver um; 2 a 5 USD por mala para carregadores; 1 a 2 USD por rodada para garçons à beira da piscina. Gorjetas no buffet não são necessárias, mas são apreciadas para garçons de mesa que são particularmente prestativos.",
  ),
  h3("Em Restaurantes"),
  para(
    "A maioria dos restaurantes dominicanos adiciona automaticamente uma taxa de serviço de 10 por cento (\"propina legal\" ou \"servicio\") mais 18 por cento de ITBIS (imposto sobre vendas) à conta. A taxa de serviço de 10 por cento é tecnicamente a gorjeta, mas nem sempre chega ao garçom por completo. O costume é deixar um adicional de 5 a 10 por cento em dinheiro diretamente na mesa para o garçom, especialmente por bom serviço. Verifique a conta cuidadosamente — restaurantes em zonas turísticas às vezes adicionam a taxa de serviço mais uma linha de gorjeta separada, o que é dupla gorjeta.",
  ),
  h3("Táxis e Transporte"),
  para(
    "Os táxis na República Dominicana tipicamente não esperam gorjeta além da tarifa medida ou negociada, mas arredondar para o dólar ou 50 pesos mais próximos é apreciado. Para motoristas de transfer pré-arranjados pelo hotel, 5 a 10 USD por motorista é padrão. Os operadores de turismo geralmente têm um guia e um motorista; dar gorjeta a ambos é costumeiro — 10 a 15 USD por guia e 5 a 10 USD por motorista para meio dia, dobrado para uma excursão de dia inteiro.",
  ),
  h3("Tripulações de Excursão"),
  para(
    "Em excursões de barco, viagens de snorkel e passeios diários, a tripulação trabalha duro e depende de gorjetas. O padrão é de 5 a 10 USD por pessoa para uma excursão de dia inteiro, mais se a experiência foi excepcional. Dê gorjeta à tripulação diretamente no final da viagem, não ao escritório ou agente de reservas. Em nossas [[excursões|https://puntacana-excursions.com/excursions]] fornecemos orientação durante a viagem sobre quem está na tripulação e como as gorjetas são distribuídas.",
  ),

  h2("Golpes Comuns e Como Evitá-los"),
  para(
    "A República Dominicana é geralmente segura para turistas, mas alguns golpes específicos de dinheiro visam visitantes. Conhecê-los com antecedência é a maior parte da proteção.",
  ),
  h3("Notas Falsificadas"),
  para(
    "Pesos falsificados aparecem ocasionalmente, especialmente em troco dado em mercados movimentados ou por taxistas informais. Pesos dominicanos reais têm marcas d'água visíveis, tiras holográficas em denominações maiores e um toque ligeiramente texturizado. Tenha cuidado com notas macias, lisas ou incomumente nítidas — e nunca aceite troco em uma denominação maior do que a nota com a qual você pagou.",
  ),
  h3("Tarifas de Táxi Infladas"),
  para(
    "Alguns taxistas, particularmente no aeroporto ou perto das entradas principais dos resorts, cotam tarifas para turistas duas ou três vezes a tarifa local. A proteção é simples: combine o preço antes de entrar, por escrito ou com o motorista confirmando claramente verbalmente. Pergunte ao concierge do seu hotel sobre tarifas típicas para destinos comuns antes de sair, para ter uma base. Para uma referência de preço justo, a tarifa do aeroporto a Bávaro em 2025 varia de $30 a $45 USD dependendo do resort.",
  ),
  h3("Estranhos \"Prestativos\" Perto de Caixas Eletrônicos"),
  para(
    "Alguém oferecendo ajuda para usar um caixa eletrônico, mesmo que pareça trabalhar nas proximidades, é quase sempre um golpista. Recuse educadamente e complete a transação sozinho. Se algo parecer estranho com o caixa eletrônico, cancele e use outro. Funcionários reais do banco nunca abordam clientes nos caixas eletrônicos.",
  ),
  h3("\"Ofertas Especiais\" de Excursão na Praia"),
  para(
    "Vendedores de praia que vendem excursões nos resorts frequentemente cotam preços significativamente mais altos do que o preço do operador legítimo e podem não entregar a viagem como descrita. Reserve excursões através de operadores estabelecidos com avaliações verificáveis, o concierge do seu hotel ou diretamente com empresas como a [[nossa|https://puntacana-excursions.com/excursions]], em vez de vendedores de praia informais.",
  ),

  h2("Um Orçamento Realista para Sua Viagem"),
  para(
    "Além do custo all-inclusive do seu hotel, aqui estão estimativas realistas de gastos diários para componentes típicos de viagem. Esses não são os custos mais baratos possíveis — são o que a maioria dos viajantes realmente gasta.",
  ),
  li("**Excursões:** $80 a $150 USD por pessoa para a maioria das viagens em grupo de dia inteiro; $200 a $400 USD por pessoa para experiências privadas premium"),
  li("**Refeições fora do resort:** $15 a $30 USD por pessoa para almoço em um restaurante de zona turística; $5 a $12 USD por pessoa em um comedor local"),
  li("**Bebidas em bares não-resort:** $5 a $8 USD por coquetel; $2 a $4 USD por cerveja local"),
  li("**Táxi para viagens típicas:** $15 a $30 USD para deslocamentos curtos dentro de Bávaro; $40 a $80 USD para viagens diárias mais longas a Higüey ou Bayahibe"),
  li("**Orçamento de gorjetas:** $20 a $40 USD por dia para um casal hospedado em um resort all-inclusive com uma excursão"),
  li("**Lembranças e compras:** altamente variável; charutos, rum e café são de boa qualidade e preços razoáveis; joalheria e arte são negociáveis"),

  h2("Preços do Resort vs Preços Fora do Resort"),
  para(
    "Uma das maiores surpresas para visitantes de primeira viagem é a diferença de preço entre os restaurantes/lojas do resort e os estabelecimentos locais. Um coquetel que custa $1 a $4 em um comedor em Veron pode custar $10 a $15 em um bar de resort à beira-mar. Uma refeição de peixe inteiro grelhado em uma barraca de peixe em Bayahibe pode ser $12 a $18; o mesmo prato em um restaurante a la carte do resort facilmente chega a $35 a $45. Uma garrafa de água na loja de presentes do resort às vezes é $4; a mesma garrafa em um colmado lá fora é 40 pesos (cerca de 70 centavos).",
  ),
  para(
    "Isso não é irracional da parte do resort — eles estão pagando por infraestrutura, serviço all-inclusive e conveniência — mas vale a pena saber se você quer gerenciar os gastos. Se você sair do resort mesmo ocasionalmente, planeje fazer algumas compras de lembranças, lanches, bebidas e pequenos presentes em lojas locais, em vez da loja de presentes do resort. As economias em uma semana de pequenas compras cobrem facilmente uma excursão extra.",
  ),

  h2("Horários Bancários e Logística Bancária"),
  para(
    "Os bancos dominicanos geralmente operam de segunda a sexta-feira, das 9h00 às 16h00, com horários reduzidos aos sábados (geralmente 9h00 às 13h00) e fechados aos domingos e feriados públicos. Os caixas eletrônicos nos bancos são acessíveis 24 horas através de seus vestíbulos seguros, mas você precisará passar um cartão para entrar após o expediente. Os caixas eletrônicos do lobby do hotel funcionam continuamente e tendem a ser a opção mais conveniente para turistas, embora às vezes cobrem taxas um pouco mais altas do que os caixas eletrônicos dos bancos.",
  ),
  para(
    "Os feriados públicos fecham completamente todos os bancos. Os grandes que você deve conhecer são 21 de janeiro (Nossa Senhora da Altagracia), 27 de fevereiro (Dia da Independência), Semana Santa (quinta e sexta-feira antes da Páscoa), 1º de maio (Dia do Trabalho), 16 de agosto (Dia da Restauração) e os dias próximos ao Natal e Ano Novo. Planeje ter dinheiro em mãos para essas datas porque as filas em caixas eletrônicos funcionais podem ser longas e muitos escritórios de câmbio menores também fecham. As recepções de hotéis às vezes podem fazer pequenas trocas de dólar para peso em um aperto, mas a taxas desfavoráveis, então é melhor planejar com antecedência.",
  ),

  h2("Pagando por Excursões e Tours"),
  para(
    "As práticas de reserva de excursões variam amplamente. Operadores estabelecidos (incluindo nós) geralmente recebem um depósito no momento da reserva — frequentemente 25 a 50 por cento do total — com o saldo devido antes do início da viagem, às vezes em dinheiro no dia. Operadores menores podem querer pagamento integral antecipado. Excursões organizadas pelo hotel geralmente são cobradas no seu quarto e você acerta no check-out, o que é conveniente, mas raramente o melhor preço.",
  ),
  para(
    "Se você está pagando um saldo em dinheiro no dia da excursão, traga-o na quantia exata e na moeda acordada. Motoristas e guias nem sempre têm troco, e tentar quebrar uma nota de $100 às 7:00 da manhã antes de uma partida para Saona já atrasou desnecessariamente muitas viagens. Se o operador cotou em USD, pague em USD; se cotou em pesos, pague em pesos. Misturar moedas para um único pagamento introduz confusão de conversão que é mais fácil de evitar.",
  ),
  h3("Políticas de Reembolso e Cancelamento"),
  para(
    "Leia os termos de cancelamento antes de reservar, especialmente para viagens que dependem do clima (passeios de barco, pesca, snorkel). Operadores respeitáveis oferecem reembolsos completos ou reagendamento quando o clima força um cancelamento, mas as políticas sobre viagens afetadas pelo clima mas não canceladas (mar agitado, visibilidade parcial) variam amplamente. Nossas [[políticas de reserva|https://puntacana-excursions.com/contact]] são transparentes — dizemos exatamente o que acontece em cada cenário antes de você pagar qualquer coisa.",
  ),

  h2("Estratégias de Reserva de Dinheiro"),
  para(
    "Mesmo com cartões e acesso a caixas eletrônicos, ter uma reserva de dinheiro importa. A configuração recomendada para uma viagem de uma semana: leve cerca de $200 a $300 USD em denominações mistas de casa, mais um cartão de crédito e um cartão de débito de bancos diferentes. Saque pesos de um caixa eletrônico na chegada ou no segundo dia. Mantenha $100 ou mais em dinheiro no cofre do seu quarto de hotel como reserva de emergência, separado do que você carrega no dia a dia.",
  ),
  para(
    "Se seu cartão for bloqueado ou perdido, ter um cartão separado de um banco diferente é o backup mais útil. Transferências bancárias via Western Union ou MoneyGram estão disponíveis em todo o país e podem ser usadas como uma injeção de dinheiro de último recurso se os cartões falharem completamente. A recepção do seu hotel geralmente pode ajudá-lo a localizar o agente mais próximo.",
  ),
  h3("O Que Fazer Se Seu Cartão For Perdido ou Roubado"),
  para(
    "Ligue para o emissor do seu cartão imediatamente — os números gratuitos de fraude geralmente funcionam da República Dominicana, embora você possa precisar discar através de um prefixo local. A maioria dos grandes bancos pode enviar um cartão de reposição para um endereço internacional de hotel dentro de 2 a 3 dias úteis. Registre um boletim de ocorrência na delegacia local; você precisará dele para reclamações de seguro e às vezes para a investigação de fraude do seu banco. Mantenha uma lista impressa dos números do seu cartão e números de atendimento ao cliente em sua bagagem, separada da sua carteira, antes de sair de casa.",
  ),

  h2("Reflexões Finais"),
  para(
    "O gerenciamento de dinheiro em Punta Cana não é complicado uma vez que você entende o básico: leve ambas as moedas, use caixas eletrônicos dos principais bancos com moderação para evitar taxas, notifique seu banco antes de viajar, dê gorjetas generosas onde apropriado, combine as tarifas de táxi antecipadamente e pague em moeda local quando lhe for dada a opção nos terminais de cartão. A República Dominicana é genuinamente uma boa relação custo-benefício para viajantes que prestam atenção a esses fundamentos.",
  ),
  para(
    "Se você gostaria de conselhos sobre opções de pagamento para uma viagem específica que está considerando, nossa equipe na [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] lida com reservas em várias moedas e pode orientá-lo pela configuração correta para seu grupo. Somos locais — sabemos qual abordagem funciona melhor para qual tipo de viagem, e iremos lhe poupar de tentativas e erros.",
  ),
];

// ===========================================================================
// ARTICLE 2 — Punta Cana Airport Survival Guide (EN, ES, FR)
// ===========================================================================

const airportBodyEn = [
  para(
    "Punta Cana International Airport (PUJ) is one of the most-trafficked airports in the Caribbean, handling over eight million passengers a year. For first-time visitors it's a strange-looking place — open-air thatched-roof terminals, no jet bridges, mariachi-style greeters at the customs exit, a long walk between gates. It works smoothly if you know what to expect, and it can be confusing if you don't. This guide walks through arrival, departure, transfers, immigration, customs, and the surprises in between.",
  ),
  para(
    "If you have specific questions about transfers from PUJ to your hotel, or you need to coordinate excursion timing with your flight schedule, our team at [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] can help with logistics.",
  ),

  h2("About the Airport Itself"),
  para(
    "Punta Cana International Airport is privately owned (one of the few private international airports in the world) and was built specifically to serve the tourism industry. The architecture is intentional: thatched palm roofs, open-air terminals with natural ventilation, tropical landscaping throughout. It's meant to feel like you've already arrived at a resort. The downside is that on hot or rainy days, the open-air design isn't always comfortable. Bring a light layer for unexpected breezes near the gates, and don't expect heavy air conditioning anywhere outside the duty-free shops.",
  ),
  para(
    "The airport has two main terminals (A and B). Terminal A handles most North American and European charter flights; Terminal B handles most scheduled commercial flights from major carriers. Both terminals are connected and share customs and immigration facilities. You won't usually need to choose between them — your airline tells you which terminal at check-in.",
  ),

  h2("Arrival: From Plane to Resort"),
  para(
    "Here's the typical arrival sequence step by step. Knowing it in advance makes the process much faster.",
  ),
  h3("Step 1: Disembarking"),
  para(
    "Most flights at PUJ park on the tarmac rather than at a jet bridge. You'll walk down stairs from the plane onto the runway and either board a short shuttle bus or walk a short distance to the terminal building. The walk takes a few minutes and is often the first time you'll feel the Caribbean heat — it can be a surprise after the climate-controlled cabin. Move at a comfortable pace; there's no need to rush.",
  ),
  h3("Step 2: Tourist Card and Immigration"),
  para(
    "Since 2018, the Dominican tourist card is included in your airline ticket price for most nationalities — you don't need to buy it separately. At immigration, present your passport (must be valid for at least six months beyond your travel dates) and your departure flight information. The officer will scan your passport, take a quick photo, and stamp you in. The whole process takes 30 seconds to 2 minutes per passenger. The lines, however, can be long on peak arrival days (typically Saturday afternoons and Sunday mornings). Plan for 30 to 60 minutes in the immigration line on a busy day, 10 to 20 minutes on a normal day.",
  ),
  h3("Step 3: Baggage Claim"),
  para(
    "After immigration you'll proceed to baggage claim. The carousels are clearly labeled by flight number, and bags typically appear within 15 to 30 minutes of landing. PUJ is not known for fast baggage delivery, so be patient. While you wait, you'll see porters in branded uniforms offering to help carry your bags. They expect a tip — about $2 to $5 USD per bag is standard. You can decline politely if you prefer to handle your own luggage; they'll move on without pressure.",
  ),
  h3("Step 4: Customs Declaration"),
  para(
    "After collecting bags, you'll pass through customs. Most tourists clear customs without inspection — you walk through, hand in your declaration card (if you filled one out on the plane), and exit. Officers may randomly select bags for X-ray screening or hand inspection, especially if you're traveling with unusual items. Standard customs limits apply: no more than 200 cigarettes or 50 cigars, no more than 2 liters of alcohol, no fresh fruits or meats. Cash exceeding $10,000 USD equivalent must be declared.",
  ),
  h3("Step 5: The Arrivals Hall"),
  para(
    "Exiting customs puts you in the arrivals hall — a large open area with two distinct vibes. On one side is the official tour operator and resort transfer desks (Apple Vacations, Air Transat, BookIt, etc.), where you check in if you booked your transfer through your travel package. On the other side is the rideshare and independent taxi area, where local taxi drivers will approach you offering rides. Both areas are legitimate, but the experiences are different.",
  ),

  h2("Getting from PUJ to Your Hotel"),
  h3("Pre-Arranged Resort Transfers"),
  para(
    "If you booked an all-inclusive package, your transfer is almost always included. After clearing customs, look for the desk of your tour operator (the name will be on your booking confirmation), check in with your name, and they'll direct you to a coach bus or van that takes you and several other guests to your resort. The wait can be 15 minutes to over an hour depending on how full your transfer needs to be before departure. The buses are air-conditioned and comfortable but make multiple resort stops, so your specific resort might be the last one — adding 30 to 60 minutes to your transfer time.",
  ),
  h3("Private Transfers"),
  para(
    "For around $80 to $150 USD round trip, you can book a private transfer directly to your hotel. The vehicle waits for your specific flight (delays are not a problem if the operator has your flight number), goes straight to your resort, and gets you there 30 to 60 minutes faster than the group bus. The cost is per vehicle, not per person, so for a group of three or more it's often only marginally more expensive than the all-inclusive transfer. Private transfers also come with a cold drink and bottled water in the vehicle.",
  ),
  h3("Taxis"),
  para(
    "Official airport taxis are available in the arrivals hall. The rate to Bávaro resorts in 2025 is approximately $30 to $45 USD one way; to Cap Cana about $25 to $35; to Bayahibe about $90 to $120. Confirm the price with the driver before getting in, and pay at the destination, not in advance. The taxis are generally clean, the drivers are licensed, and the experience is fine — though noticeably less comfortable than a private transfer in a SUV or van.",
  ),
  h3("Rideshare and Uber"),
  para(
    "Uber technically operates in Punta Cana but is unreliable at the airport itself — the pickup zones aren't well-marked, and local taxi drivers actively discourage Uber pickups in the airport area. For arrivals, stick to a pre-arranged transfer or official airport taxi. Uber works better for short hops within Bávaro once you're at your resort.",
  ),

  h2("Departure: Getting Through PUJ on the Way Home"),
  para(
    "The departure experience is generally smooth, but there are quirks. Plan to arrive at the airport at least 3 hours before your flight — 4 hours if you're flying on a peak Saturday afternoon. Yes, that's a lot for what should be a 2-hour airport experience, but PUJ moves slowly on busy days and the lines for security can be punishing.",
  ),
  h3("Check-In"),
  para(
    "Most airlines have counters at PUJ open 3 to 4 hours before departure. The lines move at a moderate pace. Self-service kiosks exist for some carriers but are less reliable than the staffed counters, especially if you have any complications (seat changes, weight issues, multiple passengers). Drop your bags, get your boarding pass, and proceed to security.",
  ),
  h3("Security"),
  para(
    "Security at PUJ uses the standard international screening procedures — liquids in 100ml bottles, electronics out for X-ray, no obvious sharps. The lines can be very long on peak days. Some travelers report waits of 45 to 60 minutes during the Saturday afternoon peak. Stay patient and have your boarding pass ready. There's no TSA Pre-Check equivalent for tourists, so plan as if you'll be in standard screening.",
  ),
  h3("Departure Tax"),
  para(
    "The departure tax of $20 USD is now almost always included in your airline ticket. If your airline is one of the rare exceptions, the tax is collected at a separate counter near security. The agents will direct you if needed.",
  ),
  h3("After Security"),
  para(
    "Once through security, the airside terminal has duty-free shops (Dominican rum, cigars, coffee, and chocolate are the standout buys), several restaurants, and basic Wi-Fi. The Wi-Fi requires registration and is slow but functional. Most gates open about 60 to 90 minutes before flights. Watch the boards closely — gate changes happen and aren't always announced loudly.",
  ),

  h2("Common Mistakes and How to Avoid Them"),
  li("**Not booking your transfer in advance.** Showing up without a plan and trying to figure out transportation in the arrivals hall is stressful and expensive. Book before you arrive."),
  li("**Bringing prohibited items.** Don't pack fresh fruit, certain meats, or oversized liquids in carry-on bags. Customs will confiscate them and the inspection slows everyone down."),
  li("**Underestimating the wait at peak times.** Saturday afternoon and Sunday morning are the worst for both arrivals and departures. Plan accordingly."),
  li("**Trying to use Uber from the airport.** Use official taxis or pre-arranged transfers for arrival; save Uber for trips within Bávaro after you've checked in."),
  li("**Not having small bills for tips.** Porters, taxi drivers, and other airport workers expect small tips, and trying to break a $50 bill at the airport is awkward."),
  li("**Forgetting your departure flight time on the immigration form.** The officers want to see your return flight info. Have it ready on your phone."),

  h2("Special Situations"),
  h3("Traveling with Children"),
  para(
    "Children are welcome and accommodated at PUJ. Strollers can usually be checked at the gate. Family lines at immigration aren't formal but officers usually wave families through faster. If your child is on the verge of becoming the loudest member of the immigration line, mention it to the officer — they're generally understanding.",
  ),
  h3("Traveling with Disabilities or Reduced Mobility"),
  para(
    "PUJ has wheelchair assistance available but it must be requested in advance through your airline. The open-air design and longer walks between gates can be challenging for some travelers. Inform your airline at booking and confirm again at check-in. The staff is helpful when you communicate your needs clearly.",
  ),
  h3("Connecting Flights"),
  para(
    "PUJ has limited domestic connection options. Most travelers arrive directly to PUJ and leave from PUJ — there's no internal connection traffic to worry about. If you're connecting to Santo Domingo or another Dominican city, allow at least 3 hours between flights.",
  ),

  h2("Tips for a Smoother Airport Experience"),
  h3("What to Wear"),
  para(
    "PUJ is hot and humid year-round. Wear lightweight, breathable clothing for arrival and departure days. Even in winter (December through February), daytime temperatures at the airport are typically 27 to 30 degrees Celsius. If you're flying to a cooler destination, layer up after security rather than wearing heavy clothes through immigration. Closed-toe shoes are practical for the airport walks but flip-flops are entirely acceptable.",
  ),
  h3("What to Carry"),
  para(
    "Have these items in an easily accessible carry-on: passport, boarding pass (printed or on phone), return flight details, hotel confirmation (immigration sometimes asks for the address), some US dollars in small bills for tips, a credit card, a refillable water bottle (empty through security, fill at fountains airside), sunglasses, and a portable phone charger. Sunscreen and bug spray are useful for the tarmac and outdoor waiting areas.",
  ),
  h3("Wi-Fi and Connectivity"),
  para(
    "Free airport Wi-Fi requires a brief registration with email and basic info. It's slow but works for messaging, basic browsing, and ride coordination. If you have an international data plan or local SIM card, it'll be significantly faster. Many travelers buy a Claro or Altice SIM at the airport tienda for $10 to $20 USD — they work throughout the country and are useful for taxi coordination, restaurant reservations, and emergencies.",
  ),
  h3("Lounges"),
  para(
    "PUJ has several airline lounges and one Priority Pass lounge (the VIP Club Lounge). Access is available with eligible credit cards, lounge memberships, or by paying a day rate (typically $40 to $60 USD). The lounges have better Wi-Fi, food, drinks (alcoholic beverages included), and quieter seating than the main terminal. Worth it if you have a long wait or want a comfortable departure setup. The VIP arrival service, available for an additional fee, includes expedited immigration, baggage retrieval, and a private lounge until your transfer is ready — useful for VIP arrivals but not necessary for most travelers.",
  ),

  h2("Pre-Travel Checklist for PUJ"),
  li("**Passport valid 6+ months** beyond your travel dates"),
  li("**Return or onward flight booked** — immigration occasionally checks"),
  li("**Hotel reservation confirmed and printable**"),
  li("**Tourist card included** in your airline ticket (verify if any doubt)"),
  li("**Transfer arranged** before arrival (resort transfer, private, or taxi plan)"),
  li("**Travel insurance information** accessible"),
  li("**Cash in small bills** for tips and small purchases"),
  li("**Credit card travel notification** filed with your bank"),
  li("**Phone unlocked** if planning to use a local SIM"),
  li("**Medications in original packaging** if traveling with prescriptions"),

  h2("Best and Worst Times to Fly Through PUJ"),
  para(
    "Flight timing matters at PUJ. The airport runs smoothly on most weekdays but struggles during peak weekend turnover, when many resorts have Saturday-to-Saturday or Sunday-to-Sunday booking cycles. If you have flexibility in your booking, here's what works in your favor.",
  ),
  para(
    "**Best arrival times:** Monday through Thursday, any time. Friday afternoons. Saturday and Sunday very early morning (before 9 AM) or late evening (after 8 PM). On these slots immigration takes 10 to 20 minutes, baggage moves quickly, and the arrivals hall is calm.",
  ),
  para(
    "**Worst arrival times:** Saturday between 11 AM and 5 PM, when most weekly charter flights from the US, Canada, and Europe land in clusters. Immigration can take 60 to 90 minutes and the arrivals hall becomes overwhelming. Sunday late mornings are nearly as bad.",
  ),
  para(
    "**Best departure times:** Same logic in reverse. Tuesday or Wednesday departures are smoothest. If you're stuck with a Saturday departure (the most common scenario for all-inclusive packages), arrive at the airport 4 hours before your flight and pack patience. Have water and snacks for the security line.",
  ),

  h2("If Something Goes Wrong"),
  para(
    "Most trips through PUJ are uneventful, but problems do happen. Here's what to do for the common ones.",
  ),
  h3("Missed Flight"),
  para(
    "Go directly to your airline's check-in counter and explain. PUJ-based airline staff are generally helpful and will rebook you on the next available flight, though additional fees may apply depending on your fare type. Travel insurance with trip-delay coverage helps significantly here. Don't leave the airport until you have a confirmed new booking.",
  ),
  h3("Lost Baggage"),
  para(
    "File a missing baggage report at your airline's baggage office in the arrivals hall before leaving the airport. Get a written reference number and a phone number for follow-up. Most lost bags arrive within 24 to 72 hours and the airline delivers them to your resort. Pack one set of essentials (medications, toothbrush, change of clothes, swimsuit) in your carry-on so a delayed bag doesn't ruin your first day.",
  ),
  h3("Health Issues"),
  para(
    "PUJ has on-site medical staff for minor issues. For anything serious, the nearest full hospital is Hospiten Bávaro about 10 minutes away — your hotel or any taxi driver can get you there. Travel insurance is genuinely useful for the rare medical situation, and Dominican private hospitals expect upfront payment in most cases.",
  ),

  h2("Final Thoughts"),
  para(
    "Punta Cana International Airport works well once you understand its quirks: open-air terminals, tarmac disembarking, organized chaos in the arrivals hall, slow peak-day lines, and pleasant duty-free shopping for the wait home. Arrive prepared and you'll move through it efficiently. The airport is your first and last impression of the country — show up with realistic expectations and the experience is fine.",
  ),
  para(
    "If you'd like help coordinating your arrival, your departure, or excursions around your flight times, [[contact our team|https://puntacana-excursions.com/contact]] with your travel dates and we'll make sure your time in the Dominican Republic starts and ends smoothly. We know this airport well — we've helped thousands of travelers through it.",
  ),
];

const airportBodyEs = [
  para(
    "El Aeropuerto Internacional de Punta Cana (PUJ) es uno de los aeropuertos con más tráfico del Caribe, manejando más de ocho millones de pasajeros al año. Para los visitantes primerizos es un lugar de aspecto extraño — terminales al aire libre con techos de paja, sin pasarelas de embarque, recibidores de estilo mariachi en la salida de aduanas, una larga caminata entre puertas. Funciona sin problemas si sabes qué esperar, y puede ser confuso si no lo sabes. Esta guía recorre la llegada, salida, transferencias, inmigración, aduanas, y las sorpresas en medio.",
  ),
  para(
    "Si tienes preguntas específicas sobre transferencias de PUJ a tu hotel, o necesitas coordinar el tiempo de la excursión con tu horario de vuelo, nuestro equipo en [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] puede ayudar con la logística.",
  ),

  h2("Sobre el Aeropuerto Mismo"),
  para(
    "El Aeropuerto Internacional de Punta Cana es de propiedad privada (uno de los pocos aeropuertos internacionales privados del mundo) y fue construido específicamente para servir a la industria turística. La arquitectura es intencional: techos de palma de paja, terminales al aire libre con ventilación natural, paisajismo tropical en todas partes. Está diseñado para hacerte sentir que ya has llegado a un resort. La desventaja es que en días calurosos o lluviosos, el diseño al aire libre no siempre es cómodo. Lleva una capa ligera para brisas inesperadas cerca de las puertas, y no esperes aire acondicionado fuerte en ningún lugar fuera de las tiendas duty-free.",
  ),
  para(
    "El aeropuerto tiene dos terminales principales (A y B). La Terminal A maneja la mayoría de los vuelos chárter de Norteamérica y Europa; la Terminal B maneja la mayoría de los vuelos comerciales programados de las principales aerolíneas. Ambas terminales están conectadas y comparten instalaciones de aduana e inmigración. Por lo general, no necesitarás elegir entre ellas — tu aerolínea te dice qué terminal en el check-in.",
  ),

  h2("Llegada: Del Avión al Resort"),
  para(
    "Aquí está la secuencia típica de llegada paso a paso. Conocerla con anticipación hace que el proceso sea mucho más rápido.",
  ),
  h3("Paso 1: Desembarque"),
  para(
    "La mayoría de los vuelos en PUJ se estacionan en la pista en lugar de en una pasarela. Bajarás las escaleras del avión a la pista y abordarás un breve autobús de enlace o caminarás una corta distancia hasta el edificio de la terminal. La caminata toma unos minutos y a menudo es la primera vez que sentirás el calor del Caribe — puede ser una sorpresa después de la cabina con clima controlado. Muévete a un ritmo cómodo; no hay necesidad de apresurarse.",
  ),
  h3("Paso 2: Tarjeta Turística e Inmigración"),
  para(
    "Desde 2018, la tarjeta turística dominicana está incluida en el precio de tu boleto aéreo para la mayoría de las nacionalidades — no necesitas comprarla por separado. En inmigración, presenta tu pasaporte (debe ser válido por al menos seis meses más allá de tus fechas de viaje) y tu información de vuelo de salida. El oficial escaneará tu pasaporte, tomará una foto rápida y te sellará la entrada. Todo el proceso toma de 30 segundos a 2 minutos por pasajero. Las filas, sin embargo, pueden ser largas en los días pico de llegada (típicamente sábados por la tarde y domingos por la mañana). Planea de 30 a 60 minutos en la fila de inmigración en un día ocupado, 10 a 20 minutos en un día normal.",
  ),
  h3("Paso 3: Reclamo de Equipaje"),
  para(
    "Después de inmigración procederás al reclamo de equipaje. Las cintas están claramente etiquetadas por número de vuelo, y las maletas suelen aparecer dentro de 15 a 30 minutos después del aterrizaje. PUJ no es conocido por la rápida entrega de equipaje, así que sé paciente. Mientras esperas, verás maleteros en uniformes de marca ofreciéndose a ayudar a cargar tus maletas. Esperan una propina — alrededor de $2 a $5 USD por maleta es estándar. Puedes rechazar cortésmente si prefieres manejar tu propio equipaje; se moverán sin presión.",
  ),
  h3("Paso 4: Declaración de Aduana"),
  para(
    "Después de recoger las maletas, pasarás por aduana. La mayoría de los turistas pasan la aduana sin inspección — caminas, entregas tu tarjeta de declaración (si llenaste una en el avión), y sales. Los oficiales pueden seleccionar bolsos al azar para el escaneo por rayos X o inspección manual, especialmente si viajas con artículos inusuales. Se aplican los límites estándar de aduana: no más de 200 cigarrillos o 50 puros, no más de 2 litros de alcohol, no frutas frescas ni carnes. Efectivo que exceda el equivalente a $10,000 USD debe ser declarado.",
  ),
  h3("Paso 5: La Sala de Llegadas"),
  para(
    "Salir de aduana te coloca en la sala de llegadas — una gran área abierta con dos ambientes distintos. En un lado están los mostradores oficiales de operadores turísticos y transferencias de resort (Apple Vacations, Air Transat, BookIt, etc.), donde te registras si reservaste tu transferencia a través de tu paquete de viaje. En el otro lado está el área de rideshare y taxis independientes, donde los taxistas locales se acercarán ofreciendo viajes. Ambas áreas son legítimas, pero las experiencias son diferentes.",
  ),

  h2("Cómo Llegar de PUJ a Tu Hotel"),
  h3("Transferencias de Resort Pre-Arregladas"),
  para(
    "Si reservaste un paquete todo-incluido, tu transferencia casi siempre está incluida. Después de pasar por aduana, busca el mostrador de tu operador turístico (el nombre estará en tu confirmación de reserva), regístrate con tu nombre, y te dirigirán a un autobús o furgoneta que te lleva a ti y a varios otros huéspedes a tu resort. La espera puede ser de 15 minutos a más de una hora dependiendo de qué tan lleno necesite estar tu transferencia antes de partir. Los autobuses tienen aire acondicionado y son cómodos, pero hacen múltiples paradas en resorts, así que tu resort específico podría ser el último — añadiendo 30 a 60 minutos a tu tiempo de transferencia.",
  ),
  h3("Transferencias Privadas"),
  para(
    "Por alrededor de $80 a $150 USD ida y vuelta, puedes reservar una transferencia privada directamente a tu hotel. El vehículo espera tu vuelo específico (los retrasos no son un problema si el operador tiene tu número de vuelo), va directamente a tu resort, y te lleva allí 30 a 60 minutos más rápido que el autobús grupal. El costo es por vehículo, no por persona, así que para un grupo de tres o más a menudo es solo marginalmente más caro que la transferencia todo-incluido. Las transferencias privadas también vienen con una bebida fría y agua embotellada en el vehículo.",
  ),
  h3("Taxis"),
  para(
    "Los taxis oficiales del aeropuerto están disponibles en la sala de llegadas. La tarifa a los resorts de Bávaro en 2025 es aproximadamente $30 a $45 USD una vía; a Cap Cana alrededor de $25 a $35; a Bayahibe alrededor de $90 a $120. Confirma el precio con el conductor antes de subir, y paga en el destino, no por adelantado. Los taxis generalmente están limpios, los conductores tienen licencia, y la experiencia está bien — aunque notablemente menos cómoda que una transferencia privada en un SUV o furgoneta.",
  ),
  h3("Rideshare y Uber"),
  para(
    "Uber técnicamente opera en Punta Cana pero es poco confiable en el aeropuerto mismo — las zonas de recogida no están bien marcadas, y los taxistas locales desalientan activamente las recogidas de Uber en el área del aeropuerto. Para llegadas, quédate con una transferencia pre-arreglada o un taxi oficial del aeropuerto. Uber funciona mejor para trayectos cortos dentro de Bávaro una vez que estés en tu resort.",
  ),

  h2("Salida: Cómo Pasar por PUJ Camino a Casa"),
  para(
    "La experiencia de salida es generalmente fluida, pero hay peculiaridades. Planea llegar al aeropuerto al menos 3 horas antes de tu vuelo — 4 horas si vuelas en un sábado pico por la tarde. Sí, eso es mucho para lo que debería ser una experiencia de aeropuerto de 2 horas, pero PUJ se mueve lentamente en días ocupados y las filas para seguridad pueden ser castigadoras.",
  ),
  h3("Check-In"),
  para(
    "La mayoría de las aerolíneas tienen mostradores en PUJ que abren 3 a 4 horas antes de la salida. Las filas se mueven a un ritmo moderado. Existen kioscos de autoservicio para algunas aerolíneas pero son menos confiables que los mostradores atendidos, especialmente si tienes alguna complicación (cambios de asiento, problemas de peso, múltiples pasajeros). Deja tu equipaje, obtén tu tarjeta de embarque, y procede a seguridad.",
  ),
  h3("Seguridad"),
  para(
    "La seguridad en PUJ usa los procedimientos estándar de detección internacional — líquidos en botellas de 100 ml, electrónica fuera para rayos X, sin objetos punzantes obvios. Las filas pueden ser muy largas en días pico. Algunos viajeros reportan esperas de 45 a 60 minutos durante el pico del sábado por la tarde. Mantén la paciencia y ten tu tarjeta de embarque lista. No hay equivalente de TSA Pre-Check para turistas, así que planifica como si estuvieras en la detección estándar.",
  ),
  h3("Impuesto de Salida"),
  para(
    "El impuesto de salida de $20 USD ahora casi siempre está incluido en tu boleto aéreo. Si tu aerolínea es una de las raras excepciones, el impuesto se cobra en un mostrador separado cerca de seguridad. Los agentes te dirigirán si es necesario.",
  ),
  h3("Después de Seguridad"),
  para(
    "Una vez pasada la seguridad, la terminal del lado del aire tiene tiendas duty-free (el ron dominicano, los puros, el café y el chocolate son las compras destacadas), varios restaurantes y Wi-Fi básico. El Wi-Fi requiere registro y es lento pero funcional. La mayoría de las puertas abren aproximadamente 60 a 90 minutos antes de los vuelos. Observa los tableros de cerca — los cambios de puerta ocurren y no siempre se anuncian en voz alta.",
  ),

  h2("Errores Comunes y Cómo Evitarlos"),
  li("**No reservar tu transferencia con anticipación.** Presentarse sin un plan y tratar de averiguar el transporte en la sala de llegadas es estresante y caro. Reserva antes de llegar."),
  li("**Llevar artículos prohibidos.** No empaques fruta fresca, ciertas carnes o líquidos de gran tamaño en el equipaje de mano. La aduana los confiscará y la inspección retrasa a todos."),
  li("**Subestimar la espera en horas pico.** El sábado por la tarde y el domingo por la mañana son los peores tanto para llegadas como para salidas. Planifica en consecuencia."),
  li("**Tratar de usar Uber desde el aeropuerto.** Usa taxis oficiales o transferencias pre-arregladas para la llegada; guarda Uber para viajes dentro de Bávaro después de haberte registrado."),
  li("**No tener billetes pequeños para propinas.** Maleteros, taxistas y otros trabajadores del aeropuerto esperan pequeñas propinas, e intentar romper un billete de $50 en el aeropuerto es incómodo."),
  li("**Olvidar la hora de tu vuelo de salida en el formulario de inmigración.** Los oficiales quieren ver la información de tu vuelo de regreso. Tenla lista en tu teléfono."),

  h2("Situaciones Especiales"),
  h3("Viajando con Niños"),
  para(
    "Los niños son bienvenidos y acomodados en PUJ. Los coches de bebé generalmente pueden ser facturados en la puerta. Las filas familiares en inmigración no son formales pero los oficiales generalmente hacen pasar a las familias más rápido. Si tu hijo está al borde de convertirse en el miembro más ruidoso de la fila de inmigración, menciónalo al oficial — generalmente son comprensivos.",
  ),
  h3("Viajando con Discapacidades o Movilidad Reducida"),
  para(
    "PUJ tiene asistencia de silla de ruedas disponible pero debe solicitarse con anticipación a través de tu aerolínea. El diseño al aire libre y las caminatas más largas entre puertas pueden ser desafiantes para algunos viajeros. Informa a tu aerolínea en la reserva y confirma de nuevo en el check-in. El personal es útil cuando comunicas tus necesidades claramente.",
  ),
  h3("Vuelos de Conexión"),
  para(
    "PUJ tiene opciones limitadas de conexión doméstica. La mayoría de los viajeros llegan directamente a PUJ y salen de PUJ — no hay tráfico de conexión interna del que preocuparse. Si vas a conectar a Santo Domingo u otra ciudad dominicana, permite al menos 3 horas entre vuelos.",
  ),

  h2("Consejos para una Experiencia Más Fluida en el Aeropuerto"),
  h3("Qué Vestir"),
  para(
    "PUJ es caluroso y húmedo todo el año. Usa ropa ligera y transpirable para los días de llegada y salida. Incluso en invierno (diciembre a febrero), las temperaturas diurnas en el aeropuerto son típicamente 27 a 30 grados Celsius. Si vuelas a un destino más frío, ponte capas después de seguridad en lugar de usar ropa pesada a través de inmigración. Los zapatos cerrados son prácticos para las caminatas del aeropuerto pero las chanclas son completamente aceptables.",
  ),
  h3("Qué Llevar"),
  para(
    "Ten estos artículos en un equipaje de mano fácilmente accesible: pasaporte, tarjeta de embarque (impresa o en el teléfono), detalles del vuelo de regreso, confirmación del hotel (inmigración a veces pide la dirección), algunos dólares estadounidenses en billetes pequeños para propinas, una tarjeta de crédito, una botella de agua reutilizable (vacía pasando seguridad, llénala en las fuentes después), gafas de sol, y un cargador portátil de teléfono. El protector solar y el repelente de insectos son útiles para la pista y áreas de espera al aire libre.",
  ),
  h3("Wi-Fi y Conectividad"),
  para(
    "El Wi-Fi gratuito del aeropuerto requiere un breve registro con correo electrónico e información básica. Es lento pero funciona para mensajería, navegación básica y coordinación de viajes. Si tienes un plan de datos internacional o tarjeta SIM local, será significativamente más rápido. Muchos viajeros compran una SIM Claro o Altice en la tienda del aeropuerto por $10 a $20 USD — funcionan en todo el país y son útiles para coordinación de taxis, reservas de restaurantes y emergencias.",
  ),
  h3("Salones VIP"),
  para(
    "PUJ tiene varios salones de aerolíneas y un salón Priority Pass (el VIP Club Lounge). El acceso está disponible con tarjetas de crédito elegibles, membresías de salones, o pagando una tarifa diaria (típicamente $40 a $60 USD). Los salones tienen mejor Wi-Fi, comida, bebidas (alcohólicas incluidas) y asientos más tranquilos que la terminal principal. Vale la pena si tienes una larga espera o quieres un cómodo arreglo de salida. El servicio de llegada VIP, disponible por una tarifa adicional, incluye inmigración acelerada, recuperación de equipaje y un salón privado hasta que tu transferencia esté lista — útil para llegadas VIP pero no necesario para la mayoría de los viajeros.",
  ),

  h2("Lista de Verificación de Pre-Viaje para PUJ"),
  li("**Pasaporte válido 6+ meses** más allá de tus fechas de viaje"),
  li("**Vuelo de regreso o continuación reservado** — inmigración ocasionalmente verifica"),
  li("**Reservación de hotel confirmada e imprimible**"),
  li("**Tarjeta turística incluida** en tu boleto aéreo (verifica si hay duda)"),
  li("**Transferencia arreglada** antes de la llegada (transfer de resort, privado o plan de taxi)"),
  li("**Información de seguro de viaje** accesible"),
  li("**Efectivo en billetes pequeños** para propinas y pequeñas compras"),
  li("**Notificación de viaje de tarjeta de crédito** presentada con tu banco"),
  li("**Teléfono desbloqueado** si planeas usar una SIM local"),
  li("**Medicamentos en empaque original** si viajas con prescripciones"),

  h2("Mejores y Peores Momentos para Volar por PUJ"),
  para(
    "El momento del vuelo importa en PUJ. El aeropuerto funciona sin problemas la mayoría de los días entre semana, pero lucha durante la rotación pico del fin de semana, cuando muchos resorts tienen ciclos de reserva de sábado a sábado o domingo a domingo. Si tienes flexibilidad en tu reserva, esto es lo que te conviene.",
  ),
  para(
    "**Mejores horarios de llegada:** lunes a jueves, cualquier hora. Viernes por la tarde. Sábado y domingo muy temprano por la mañana (antes de las 9 AM) o muy tarde por la noche (después de las 8 PM). En estos horarios la inmigración toma 10 a 20 minutos, el equipaje se mueve rápido, y la sala de llegadas está tranquila.",
  ),
  para(
    "**Peores horarios de llegada:** Sábado entre 11 AM y 5 PM, cuando la mayoría de los vuelos chárter semanales de EE.UU., Canadá y Europa aterrizan en racimos. La inmigración puede tomar 60 a 90 minutos y la sala de llegadas se vuelve abrumadora. Las tardes del domingo son casi tan malas.",
  ),
  para(
    "**Mejores horarios de salida:** Misma lógica al revés. Las salidas del martes o miércoles son las más fluidas. Si estás atrapado con una salida el sábado (el escenario más común para los paquetes todo-incluido), llega al aeropuerto 4 horas antes de tu vuelo y empaca paciencia. Lleva agua y bocadillos para la fila de seguridad.",
  ),

  h2("Si Algo Sale Mal"),
  para(
    "La mayoría de los viajes a través de PUJ son sin incidentes, pero los problemas suceden. Aquí está qué hacer para los comunes.",
  ),
  h3("Vuelo Perdido"),
  para(
    "Ve directamente al mostrador de check-in de tu aerolínea y explica. El personal de aerolíneas con sede en PUJ generalmente es útil y te reservará en el próximo vuelo disponible, aunque pueden aplicarse cargos adicionales dependiendo de tu tipo de tarifa. El seguro de viaje con cobertura de retraso de viaje ayuda significativamente aquí. No salgas del aeropuerto hasta que tengas una nueva reserva confirmada.",
  ),
  h3("Equipaje Perdido"),
  para(
    "Presenta un reporte de equipaje perdido en la oficina de equipaje de tu aerolínea en la sala de llegadas antes de salir del aeropuerto. Obtén un número de referencia por escrito y un número de teléfono para seguimiento. La mayoría de las maletas perdidas llegan dentro de 24 a 72 horas y la aerolínea las entrega en tu resort. Empaca un set de esenciales (medicamentos, cepillo de dientes, cambio de ropa, traje de baño) en tu equipaje de mano para que una maleta retrasada no arruine tu primer día.",
  ),
  h3("Problemas de Salud"),
  para(
    "PUJ tiene personal médico en el lugar para problemas menores. Para cualquier cosa seria, el hospital completo más cercano es Hospiten Bávaro a unos 10 minutos — tu hotel o cualquier taxista puede llevarte allí. El seguro de viaje es genuinamente útil para la rara situación médica, y los hospitales privados dominicanos esperan pago por adelantado en la mayoría de los casos.",
  ),

  h2("Reflexiones Finales"),
  para(
    "El Aeropuerto Internacional de Punta Cana funciona bien una vez que entiendes sus peculiaridades: terminales al aire libre, desembarque en pista, caos organizado en la sala de llegadas, lentas filas en días pico, y agradables compras duty-free para la espera de regreso a casa. Llega preparado y te moverás a través de él eficientemente. El aeropuerto es tu primera y última impresión del país — preséntate con expectativas realistas y la experiencia está bien.",
  ),
  para(
    "Si te gustaría ayuda coordinando tu llegada, tu salida o excursiones alrededor de tus horarios de vuelo, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] con tus fechas de viaje y nos aseguraremos de que tu tiempo en la República Dominicana comience y termine sin problemas. Conocemos bien este aeropuerto — hemos ayudado a miles de viajeros a través de él.",
  ),
];

const airportBodyFr = [
  para(
    "L'Aéroport International de Punta Cana (PUJ) est l'un des aéroports les plus fréquentés des Caraïbes, traitant plus de huit millions de passagers par an. Pour les visiteurs novices, c'est un endroit d'apparence étrange — terminaux à toit de paille en plein air, pas de passerelles d'embarquement, accueillants de style mariachi à la sortie des douanes, une longue marche entre les portes. Cela fonctionne en douceur si vous savez à quoi vous attendre, et cela peut être déroutant si vous ne le savez pas. Ce guide passe en revue l'arrivée, le départ, les transferts, l'immigration, les douanes, et les surprises entre les deux.",
  ),
  para(
    "Si vous avez des questions spécifiques sur les transferts de PUJ à votre hôtel, ou si vous devez coordonner le timing des excursions avec votre horaire de vol, notre équipe à [[Punta Cana Excursions|https://puntacana-excursions.com/contact]] peut aider avec la logistique.",
  ),

  h2("À Propos de l'Aéroport Lui-Même"),
  para(
    "L'Aéroport International de Punta Cana est de propriété privée (l'un des rares aéroports internationaux privés au monde) et a été construit spécifiquement pour servir l'industrie touristique. L'architecture est intentionnelle : toits de palmier en paille, terminaux en plein air avec ventilation naturelle, paysage tropical partout. Il est conçu pour vous donner l'impression d'être déjà arrivé dans un complexe. L'inconvénient est que les jours chauds ou pluvieux, le design en plein air n'est pas toujours confortable. Apportez une couche légère pour les brises inattendues près des portes, et n'attendez pas de climatisation puissante en dehors des magasins hors taxes.",
  ),
  para(
    "L'aéroport a deux terminaux principaux (A et B). Le Terminal A gère la plupart des vols charters d'Amérique du Nord et d'Europe ; le Terminal B gère la plupart des vols commerciaux réguliers des grandes compagnies. Les deux terminaux sont reliés et partagent les installations de douanes et d'immigration. Vous n'aurez généralement pas besoin de choisir entre eux — votre compagnie aérienne vous dit quel terminal à l'enregistrement.",
  ),

  h2("Arrivée : De l'Avion au Complexe"),
  para(
    "Voici la séquence d'arrivée typique étape par étape. La connaître à l'avance rend le processus beaucoup plus rapide.",
  ),
  h3("Étape 1 : Débarquement"),
  para(
    "La plupart des vols à PUJ se garent sur le tarmac plutôt qu'à une passerelle. Vous descendrez les escaliers de l'avion sur la piste et soit monterez à bord d'un court bus navette, soit marcherez sur une courte distance jusqu'au bâtiment du terminal. La marche prend quelques minutes et est souvent la première fois que vous sentirez la chaleur des Caraïbes — cela peut être une surprise après la cabine climatisée. Avancez à un rythme confortable ; pas besoin de se précipiter.",
  ),
  h3("Étape 2 : Carte Touristique et Immigration"),
  para(
    "Depuis 2018, la carte touristique dominicaine est incluse dans le prix de votre billet d'avion pour la plupart des nationalités — vous n'avez pas besoin de l'acheter séparément. À l'immigration, présentez votre passeport (doit être valide au moins six mois au-delà de vos dates de voyage) et vos informations de vol de départ. L'agent scannera votre passeport, prendra une photo rapide, et vous tamponnera. L'ensemble du processus prend de 30 secondes à 2 minutes par passager. Les files, cependant, peuvent être longues les jours de pointe d'arrivée (généralement les samedis après-midi et les dimanches matins). Prévoyez 30 à 60 minutes dans la file d'immigration un jour chargé, 10 à 20 minutes un jour normal.",
  ),
  h3("Étape 3 : Récupération des Bagages"),
  para(
    "Après l'immigration, vous passerez à la récupération des bagages. Les carrousels sont clairement étiquetés par numéro de vol, et les bagages apparaissent généralement dans les 15 à 30 minutes après l'atterrissage. PUJ n'est pas connu pour la livraison rapide des bagages, alors soyez patient. Pendant que vous attendez, vous verrez des porteurs en uniforme de marque proposant d'aider à porter vos bagages. Ils attendent un pourboire — environ 2 à 5 USD par sac est standard. Vous pouvez refuser poliment si vous préférez gérer vos propres bagages ; ils passeront sans pression.",
  ),
  h3("Étape 4 : Déclaration en Douane"),
  para(
    "Après avoir récupéré les sacs, vous passerez par la douane. La plupart des touristes passent la douane sans inspection — vous marchez, remettez votre carte de déclaration (si vous en avez rempli une dans l'avion), et sortez. Les agents peuvent sélectionner au hasard des sacs pour un contrôle aux rayons X ou une inspection manuelle, surtout si vous voyagez avec des articles inhabituels. Les limites standard de douane s'appliquent : pas plus de 200 cigarettes ou 50 cigares, pas plus de 2 litres d'alcool, pas de fruits frais ni de viandes. L'argent dépassant l'équivalent de 10 000 USD doit être déclaré.",
  ),
  h3("Étape 5 : Le Hall des Arrivées"),
  para(
    "Sortir de la douane vous place dans le hall des arrivées — une grande zone ouverte avec deux ambiances distinctes. D'un côté se trouvent les comptoirs officiels des opérateurs touristiques et des transferts de complexe (Apple Vacations, Air Transat, BookIt, etc.), où vous vous enregistrez si vous avez réservé votre transfert via votre forfait. De l'autre côté se trouve la zone de covoiturage et de taxis indépendants, où les taxis locaux vous approcheront pour offrir des trajets. Les deux zones sont légitimes, mais les expériences sont différentes.",
  ),

  h2("Comment Aller de PUJ à Votre Hôtel"),
  h3("Transferts de Complexe Pré-Arrangés"),
  para(
    "Si vous avez réservé un forfait tout-inclus, votre transfert est presque toujours inclus. Après avoir passé la douane, cherchez le comptoir de votre opérateur touristique (le nom sera sur votre confirmation de réservation), enregistrez-vous avec votre nom, et ils vous dirigeront vers un bus ou une camionnette qui vous emmène vous et plusieurs autres clients à votre complexe. L'attente peut être de 15 minutes à plus d'une heure selon le remplissage nécessaire de votre transfert avant le départ. Les bus sont climatisés et confortables mais font plusieurs arrêts aux complexes, votre complexe spécifique pourrait donc être le dernier — ajoutant 30 à 60 minutes à votre temps de transfert.",
  ),
  h3("Transferts Privés"),
  para(
    "Pour environ 80 à 150 USD aller-retour, vous pouvez réserver un transfert privé directement à votre hôtel. Le véhicule attend votre vol spécifique (les retards ne sont pas un problème si l'opérateur a votre numéro de vol), va directement à votre complexe, et vous y emmène 30 à 60 minutes plus rapidement que le bus de groupe. Le coût est par véhicule, pas par personne, donc pour un groupe de trois personnes ou plus, ce n'est souvent que marginalement plus cher que le transfert tout-inclus. Les transferts privés incluent également une boisson froide et de l'eau en bouteille dans le véhicule.",
  ),
  h3("Taxis"),
  para(
    "Des taxis officiels d'aéroport sont disponibles dans le hall des arrivées. Le tarif vers les complexes de Bávaro en 2025 est d'environ 30 à 45 USD aller simple ; vers Cap Cana environ 25 à 35 USD ; vers Bayahibe environ 90 à 120 USD. Confirmez le prix avec le chauffeur avant de monter, et payez à destination, pas à l'avance. Les taxis sont généralement propres, les chauffeurs sont licenciés, et l'expérience est correcte — bien que notablement moins confortable qu'un transfert privé dans un SUV ou une camionnette.",
  ),
  h3("Covoiturage et Uber"),
  para(
    "Uber opère techniquement à Punta Cana mais n'est pas fiable à l'aéroport lui-même — les zones de prise en charge ne sont pas bien marquées, et les taxis locaux découragent activement les prises en charge Uber dans la zone de l'aéroport. Pour les arrivées, restez avec un transfert pré-arrangé ou un taxi officiel d'aéroport. Uber fonctionne mieux pour les courts trajets dans Bávaro une fois que vous êtes à votre complexe.",
  ),

  h2("Départ : Passer par PUJ sur le Chemin du Retour"),
  para(
    "L'expérience de départ est généralement fluide, mais il y a des particularités. Prévoyez d'arriver à l'aéroport au moins 3 heures avant votre vol — 4 heures si vous volez un samedi après-midi de pointe. Oui, c'est beaucoup pour ce qui devrait être une expérience d'aéroport de 2 heures, mais PUJ se déplace lentement les jours chargés et les files pour la sécurité peuvent être pénibles.",
  ),
  h3("Enregistrement"),
  para(
    "La plupart des compagnies aériennes ont des comptoirs à PUJ qui ouvrent 3 à 4 heures avant le départ. Les files se déplacent à un rythme modéré. Des bornes en libre-service existent pour certaines compagnies mais sont moins fiables que les comptoirs avec personnel, surtout si vous avez des complications (changements de siège, problèmes de poids, plusieurs passagers). Déposez vos bagages, obtenez votre carte d'embarquement, et passez à la sécurité.",
  ),
  h3("Sécurité"),
  para(
    "La sécurité à PUJ utilise les procédures de contrôle internationales standard — liquides dans des bouteilles de 100 ml, électronique hors pour rayons X, pas d'objets pointus évidents. Les files peuvent être très longues les jours de pointe. Certains voyageurs rapportent des attentes de 45 à 60 minutes pendant le pic du samedi après-midi. Restez patient et ayez votre carte d'embarquement prête. Il n'y a pas d'équivalent TSA Pre-Check pour les touristes, alors planifiez comme si vous étiez dans le contrôle standard.",
  ),
  h3("Taxe de Départ"),
  para(
    "La taxe de départ de 20 USD est maintenant presque toujours incluse dans votre billet d'avion. Si votre compagnie aérienne est l'une des rares exceptions, la taxe est perçue à un comptoir séparé près de la sécurité. Les agents vous dirigeront si nécessaire.",
  ),
  h3("Après la Sécurité"),
  para(
    "Une fois passé la sécurité, le terminal côté piste a des magasins hors taxes (le rhum dominicain, les cigares, le café et le chocolat sont les achats remarquables), plusieurs restaurants et un Wi-Fi de base. Le Wi-Fi nécessite une inscription et est lent mais fonctionnel. La plupart des portes ouvrent environ 60 à 90 minutes avant les vols. Surveillez les tableaux de près — les changements de porte se produisent et ne sont pas toujours annoncés à haute voix.",
  ),

  h2("Erreurs Courantes et Comment les Éviter"),
  li("**Ne pas réserver votre transfert à l'avance.** Se présenter sans plan et essayer de comprendre le transport dans le hall des arrivées est stressant et coûteux. Réservez avant d'arriver."),
  li("**Apporter des articles interdits.** N'emballez pas de fruits frais, certaines viandes ou liquides surdimensionnés dans les bagages à main. La douane les confisquera et l'inspection ralentit tout le monde."),
  li("**Sous-estimer l'attente aux heures de pointe.** Le samedi après-midi et le dimanche matin sont les pires à la fois pour les arrivées et les départs. Planifiez en conséquence."),
  li("**Essayer d'utiliser Uber depuis l'aéroport.** Utilisez des taxis officiels ou des transferts pré-arrangés pour l'arrivée ; gardez Uber pour les trajets dans Bávaro après votre enregistrement."),
  li("**Ne pas avoir de petites coupures pour les pourboires.** Les porteurs, chauffeurs de taxi et autres travailleurs de l'aéroport attendent de petits pourboires, et essayer de casser un billet de 50 USD à l'aéroport est gênant."),
  li("**Oublier l'heure de votre vol de départ sur le formulaire d'immigration.** Les agents veulent voir les informations de votre vol de retour. Tenez-les prêtes sur votre téléphone."),

  h2("Situations Spéciales"),
  h3("Voyager avec des Enfants"),
  para(
    "Les enfants sont les bienvenus et accueillis à PUJ. Les poussettes peuvent généralement être enregistrées à la porte. Les files familiales à l'immigration ne sont pas formelles mais les agents font généralement passer les familles plus rapidement. Si votre enfant est sur le point de devenir le membre le plus bruyant de la file d'immigration, mentionnez-le à l'agent — ils sont généralement compréhensifs.",
  ),
  h3("Voyager avec des Handicaps ou une Mobilité Réduite"),
  para(
    "PUJ dispose d'une assistance en fauteuil roulant mais elle doit être demandée à l'avance via votre compagnie aérienne. Le design en plein air et les marches plus longues entre les portes peuvent être difficiles pour certains voyageurs. Informez votre compagnie aérienne lors de la réservation et confirmez à nouveau à l'enregistrement. Le personnel est utile lorsque vous communiquez clairement vos besoins.",
  ),
  h3("Vols de Correspondance"),
  para(
    "PUJ a des options limitées de correspondance domestique. La plupart des voyageurs arrivent directement à PUJ et partent de PUJ — pas de trafic de correspondance interne à craindre. Si vous correspondez à Saint-Domingue ou à une autre ville dominicaine, prévoyez au moins 3 heures entre les vols.",
  ),

  h2("Conseils pour une Expérience Plus Fluide à l'Aéroport"),
  h3("Que Porter"),
  para(
    "PUJ est chaud et humide toute l'année. Portez des vêtements légers et respirants pour les jours d'arrivée et de départ. Même en hiver (décembre à février), les températures diurnes à l'aéroport sont généralement de 27 à 30 degrés Celsius. Si vous volez vers une destination plus fraîche, superposez après la sécurité plutôt que de porter des vêtements lourds à travers l'immigration. Les chaussures fermées sont pratiques pour les marches de l'aéroport mais les tongs sont tout à fait acceptables.",
  ),
  h3("Que Porter sur Soi"),
  para(
    "Ayez ces articles dans un bagage à main facilement accessible : passeport, carte d'embarquement (imprimée ou sur téléphone), détails du vol de retour, confirmation de l'hôtel (l'immigration demande parfois l'adresse), quelques dollars américains en petites coupures pour les pourboires, une carte de crédit, une bouteille d'eau réutilisable (vide à travers la sécurité, remplir aux fontaines côté piste), des lunettes de soleil, et un chargeur de téléphone portable. La crème solaire et le spray anti-insectes sont utiles pour le tarmac et les zones d'attente extérieures.",
  ),
  h3("Wi-Fi et Connectivité"),
  para(
    "Le Wi-Fi gratuit de l'aéroport nécessite une brève inscription avec e-mail et informations de base. Il est lent mais fonctionne pour la messagerie, la navigation basique et la coordination des trajets. Si vous avez un forfait de données international ou une carte SIM locale, il sera nettement plus rapide. De nombreux voyageurs achètent une SIM Claro ou Altice à la boutique de l'aéroport pour 10 à 20 USD — elles fonctionnent dans tout le pays et sont utiles pour la coordination des taxis, les réservations de restaurants et les urgences.",
  ),
  h3("Salons VIP"),
  para(
    "PUJ a plusieurs salons de compagnies aériennes et un salon Priority Pass (le VIP Club Lounge). L'accès est disponible avec des cartes de crédit éligibles, des adhésions de salon, ou en payant un tarif journalier (généralement 40 à 60 USD). Les salons offrent un meilleur Wi-Fi, de la nourriture, des boissons (alcoolisées incluses) et des sièges plus calmes que le terminal principal. Cela vaut la peine si vous avez une longue attente ou voulez un arrangement de départ confortable. Le service d'arrivée VIP, disponible moyennant un supplément, comprend l'immigration accélérée, la récupération des bagages et un salon privé jusqu'à ce que votre transfert soit prêt — utile pour les arrivées VIP mais pas nécessaire pour la plupart des voyageurs.",
  ),

  h2("Liste de Vérification Pré-Voyage pour PUJ"),
  li("**Passeport valide 6+ mois** au-delà de vos dates de voyage"),
  li("**Vol de retour ou de continuation réservé** — l'immigration vérifie occasionnellement"),
  li("**Réservation d'hôtel confirmée et imprimable**"),
  li("**Carte touristique incluse** dans votre billet d'avion (vérifiez en cas de doute)"),
  li("**Transfert arrangé** avant l'arrivée (transfert de complexe, privé ou plan de taxi)"),
  li("**Informations d'assurance voyage** accessibles"),
  li("**Espèces en petites coupures** pour pourboires et petits achats"),
  li("**Notification de voyage de carte de crédit** déposée auprès de votre banque"),
  li("**Téléphone déverrouillé** si vous prévoyez d'utiliser une SIM locale"),
  li("**Médicaments dans leur emballage original** si vous voyagez avec des ordonnances"),

  h2("Meilleurs et Pires Moments pour Voler par PUJ"),
  para(
    "Le timing du vol compte à PUJ. L'aéroport fonctionne bien la plupart des jours de semaine mais lutte pendant la rotation de week-end de pointe, lorsque de nombreux complexes ont des cycles de réservation samedi à samedi ou dimanche à dimanche. Si vous avez de la flexibilité dans votre réservation, voici ce qui joue en votre faveur.",
  ),
  para(
    "**Meilleures heures d'arrivée :** lundi au jeudi, n'importe quelle heure. Vendredis après-midi. Samedi et dimanche très tôt le matin (avant 9 h) ou tard le soir (après 20 h). Sur ces créneaux, l'immigration prend 10 à 20 minutes, les bagages bougent rapidement et le hall des arrivées est calme.",
  ),
  para(
    "**Pires heures d'arrivée :** Samedi entre 11 h et 17 h, lorsque la plupart des vols charters hebdomadaires des États-Unis, du Canada et d'Europe atterrissent en grappes. L'immigration peut prendre 60 à 90 minutes et le hall des arrivées devient écrasant. Les fins de matinée du dimanche sont presque aussi mauvaises.",
  ),
  para(
    "**Meilleures heures de départ :** Même logique à l'envers. Les départs du mardi ou mercredi sont les plus fluides. Si vous êtes coincé avec un départ le samedi (le scénario le plus courant pour les forfaits tout-inclus), arrivez à l'aéroport 4 heures avant votre vol et préparez votre patience. Apportez de l'eau et des collations pour la file de sécurité.",
  ),

  h2("Si Quelque Chose Tourne Mal"),
  para(
    "La plupart des voyages à travers PUJ se déroulent sans incident, mais des problèmes surviennent. Voici quoi faire pour les courants.",
  ),
  h3("Vol Manqué"),
  para(
    "Allez directement au comptoir d'enregistrement de votre compagnie aérienne et expliquez. Le personnel des compagnies basé à PUJ est généralement utile et vous réservera sur le prochain vol disponible, bien que des frais supplémentaires puissent s'appliquer selon votre type de tarif. L'assurance voyage avec couverture de retard de voyage aide considérablement ici. Ne quittez pas l'aéroport tant que vous n'avez pas une nouvelle réservation confirmée.",
  ),
  h3("Bagages Perdus"),
  para(
    "Déposez un rapport de bagages manquants au bureau des bagages de votre compagnie aérienne dans le hall des arrivées avant de quitter l'aéroport. Obtenez un numéro de référence écrit et un numéro de téléphone pour le suivi. La plupart des bagages perdus arrivent dans les 24 à 72 heures et la compagnie aérienne les livre à votre complexe. Emballez un ensemble d'essentiels (médicaments, brosse à dents, vêtements de rechange, maillot de bain) dans votre bagage à main pour qu'un sac retardé ne gâche pas votre premier jour.",
  ),
  h3("Problèmes de Santé"),
  para(
    "PUJ a du personnel médical sur place pour les problèmes mineurs. Pour quoi que ce soit de sérieux, l'hôpital complet le plus proche est Hospiten Bávaro à environ 10 minutes — votre hôtel ou n'importe quel chauffeur de taxi peut vous y emmener. L'assurance voyage est véritablement utile pour la rare situation médicale, et les hôpitaux privés dominicains attendent un paiement initial dans la plupart des cas.",
  ),

  h2("Réflexions Finales"),
  para(
    "L'Aéroport International de Punta Cana fonctionne bien une fois que vous comprenez ses particularités : terminaux en plein air, débarquement sur tarmac, chaos organisé dans le hall des arrivées, files lentes les jours de pointe, et shopping hors taxes agréable pour l'attente du retour. Arrivez préparé et vous le traverserez efficacement. L'aéroport est votre première et dernière impression du pays — présentez-vous avec des attentes réalistes et l'expérience sera correcte.",
  ),
  para(
    "Si vous aimeriez de l'aide pour coordonner votre arrivée, votre départ ou des excursions autour de vos horaires de vol, [[contactez notre équipe|https://puntacana-excursions.com/contact]] avec vos dates de voyage et nous nous assurerons que votre temps en République Dominicaine commence et se termine en douceur. Nous connaissons bien cet aéroport — nous avons aidé des milliers de voyageurs à le traverser.",
  ),
];

// ===========================================================================
// ARTICLE 3 — Staying Safe in Punta Cana (EN, ES, DE)
// ===========================================================================

const safetyBodyEn = [
  para(
    "Punta Cana has a reputation problem. International news coverage occasionally focuses on isolated incidents, and word-of-mouth between travelers can blow ordinary risks out of proportion. The reality on the ground is more nuanced: Punta Cana is generally safe for tourists who use common sense, but the safety landscape is not identical to a North American or European resort destination. This guide walks through what's actually risky, what isn't, and the simple habits that keep your trip uneventful.",
  ),
  para(
    "If you have specific questions about safety on any of our trips or transfers, [[contact our team|https://puntacana-excursions.com/contact]] — we can walk you through how we manage groups, what we cover, and what we expect from our guests.",
  ),

  h2("Actual Risks vs. Perceived Risks"),
  para(
    "The Dominican Republic, like any country, has crime and safety issues. The specific risks for tourists in Punta Cana are mostly mundane: petty theft from unattended belongings, occasional overcharging by informal taxi drivers, sun and water safety errors, mosquito-borne illness during certain seasons, and the predictable consequences of overindulging in alcohol. Violent crime against tourists in the main resort zones is statistically rare. The most dangerous thing most visitors will do all week is drive a quad bike or buggy after a few drinks — and even then, the operators take this seriously.",
  ),
  para(
    "Statistically, you're more likely to have an issue from sunburn, an upset stomach, or a beach injury than from anything resembling violent crime. Plan accordingly: most of your safety thinking should focus on the small daily decisions rather than dramatic scenarios.",
  ),

  h2("Beach and Water Safety"),
  para(
    "The beaches of Punta Cana look benign — turquoise water, white sand, gentle waves — and most days they are. But the Atlantic-side Caribbean has real water hazards that catch visitors off guard.",
  ),
  h3("Rip Currents"),
  para(
    "Rip currents are the single biggest water hazard. They're narrow channels of water flowing rapidly away from shore, and they can pull strong swimmers out into deep water quickly. Resort beaches usually post warning flags: green for safe, yellow for caution, red for stay out, double red for closed. Take the flags seriously. If you find yourself being pulled out by a current, don't fight it — swim parallel to shore until you escape the channel, then swim back in. Most resort lifeguards are well-trained, but they can't watch everyone simultaneously.",
  ),
  h3("Jellyfish, Fire Coral, and Sea Urchins"),
  para(
    "Jellyfish appear seasonally, mostly in summer months, and stings range from mild irritation to painful welts. Fire coral and sea urchins live on the reefs and cause painful injuries to bare-footed waders. Wear water shoes on rocky beaches and around coral. If stung, rinse with seawater (not fresh water) and seek medical attention if symptoms worsen. Most resort first-aid stations handle these incidents routinely.",
  ),
  h3("Sun Exposure"),
  para(
    "The Dominican sun is significantly stronger than what most North American and European visitors experience at home. Many travelers underestimate it on day one and end up with severe sunburn that ruins the rest of the trip. Apply SPF 30 or higher every two hours, more often after swimming. Wear a hat and UV-blocking sunglasses. Drink more water than you think you need. The first signs of sun poisoning are headache and nausea — if either appears, get into shade immediately.",
  ),
  h3("Sargassum Seaweed"),
  para(
    "Sargassum, the brown seaweed that occasionally accumulates on Caribbean beaches, is harmless but unpleasant. Most resorts clear it daily during peak sargassum season (typically April through August). It doesn't make the water unsafe but can attract small jellyfish and make swimming less pleasant. If sargassum is heavy at your specific beach, consider a day-trip excursion to a less-affected beach.",
  ),

  h2("Transportation Safety"),
  h3("Taxis and Pre-Arranged Transfers"),
  para(
    "Official taxis and pre-arranged hotel transfers are safe and reliable. Drivers are licensed, vehicles are maintained, and routes are predictable. The standard precaution is to confirm the fare before getting in and to use cars dispatched by your hotel or a reputable operator rather than flagging cars off the street. Hotel-arranged transportation is the safest choice for unfamiliar destinations.",
  ),
  h3("Motoconchos"),
  para(
    "Motoconchos are motorcycle taxis used by many Dominicans for short trips. For tourists, the recommendation is simple: avoid them. The risk of accidents is significantly higher than four-wheeled transportation, traffic laws are minimally enforced for motorcycles, helmets are rarely offered, and travel insurance often excludes motorcycle injuries. The few dollars saved versus a regular taxi aren't worth the elevated risk.",
  ),
  h3("Driving in the Dominican Republic"),
  para(
    "If you rent a car, expect a different driving culture. Lane discipline is loose, speed limits are interpreted flexibly, motorcycles weave through traffic, and pedestrians appear on highways. Drive defensively, avoid driving at night outside major towns, and never drink and drive — both because it's illegal and because the consequences of an accident with injuries are severe and complicated. The car-and-driver option (a private vehicle with a Dominican driver) is significantly less stressful than self-driving for most trips.",
  ),
  h3("Excursion Vehicles"),
  para(
    "Reputable excursion operators (including ours) use insured vehicles, licensed drivers, and maintained equipment. When booking, verify that the operator carries appropriate insurance and check recent reviews. For [[water-based excursions|https://puntacana-excursions.com/excursions]] our boats meet maritime safety standards, life vests are provided, and the crew is briefed on emergency procedures. Cheaper informal operators may cut corners on these basics.",
  ),

  h2("Health and Water Safety"),
  h3("Drinking Water"),
  para(
    "Tap water in the Dominican Republic is not considered safe for drinking by visitors. All resorts provide bottled water in rooms and at all bars and restaurants. Use bottled water for drinking and brushing teeth. Ice at resort bars and reputable restaurants is made from filtered water and is safe; ice at informal street stands is best avoided. The simple rule: if you're in doubt about a water source, drink bottled.",
  ),
  h3("Food Safety"),
  para(
    "Resort food is generally safe, prepared in controlled kitchens with food-safety standards comparable to international hotels. Off-resort eating at established restaurants is also generally safe. Street food and informal vendors are higher risk, but not always — Dominican comedores serving busy local crowds are typically fine because high turnover means fresh food. Avoid raw seafood from unfamiliar sources, undercooked meats, and fruits or vegetables you can't peel yourself. The most common stomach problem isn't from contamination but from sudden dietary changes — try not to combine massive buffets with unfamiliar foods every day.",
  ),
  h3("Mosquito-Borne Illness"),
  para(
    "Dengue, Zika, and chikungunya occur in the Dominican Republic at low levels. Dengue is the most common; cases tend to spike during and after rainy seasons (May through November). Protection is straightforward: use insect repellent containing DEET or picaridin, wear long sleeves and pants in the evenings, sleep with air conditioning or screens, and stay in resorts that actively manage mosquito populations (most do). Pregnant travelers should consult their doctors about Zika risk specifically before booking.",
  ),
  h3("Medical Care"),
  para(
    "The Dominican Republic has both public and private medical systems. For tourists, private hospitals are the practical choice. Hospiten Bávaro is the main private hospital for the Punta Cana area and provides good emergency and inpatient care. Costs are significantly higher than public hospitals — expect to pay upfront and get reimbursed by your travel insurance later. A typical emergency room visit for minor issues might be $200 to $500 USD; serious injuries or hospitalization can run into the thousands. Travel insurance with adequate medical coverage is genuinely useful, not optional.",
  ),

  h2("Petty Crime and Theft Prevention"),
  para(
    "Petty theft is the most common crime affecting tourists. The strategies for avoiding it are simple but they require consistent execution.",
  ),
  h3("At the Beach"),
  para(
    "Don't leave valuables unattended on the beach while you swim. Petty theft of phones, wallets, jewelry, and cameras from unattended beach belongings happens regularly. Solutions: take only what you need to the beach, use a waterproof phone pouch you can wear in the water, or take turns swimming with a travel companion who watches the group's items. The dollar value of what's lost is rarely huge, but the inconvenience of replacing IDs and cards is significant.",
  ),
  h3("Hotel Room Safes"),
  para(
    "All resort rooms have small in-room safes. Use them. Store passports, extra cash, jewelry, laptops, and anything else you don't need daily. Resort theft from rooms is rare but happens — usually opportunistic, by people who notice an unsecured laptop on the bed during turndown service. The safe takes 30 seconds to use and removes most of the risk.",
  ),
  h3("In Markets and Crowded Areas"),
  para(
    "Pickpocketing in busy market areas, certain bus stations, and crowded events is the same risk that exists in any tourist destination. Carry wallets in front pockets, not back. Use a money belt or hidden travel pouch for passports and large amounts of cash. Be aware of distraction techniques — someone bumping into you while another reaches for your bag is a common pattern. If something feels off in a crowd, step out of it and assess.",
  ),
  h3("Hotel and Excursion Scams"),
  para(
    "Some scams target tourists specifically — these are mostly money-focused rather than safety risks, but worth knowing. Aggressive timeshare sales pitches at the airport or in resorts, unauthorized excursion sellers near beaches, taxis with broken meters, and inflated prices for tourists who don't know the local rates. Decline politely, walk away, and stick with operators recommended by your resort or that you booked in advance.",
  ),

  h2("Nighttime Safety"),
  para(
    "Nighttime in the main resort zones (Bávaro, Punta Cana, Cap Cana) is generally safe and well-lit. The resorts themselves are gated and patrolled. The bar and restaurant strips in El Cortecito and along the main Bávaro tourist area get busy at night with both tourists and locals and feel similar to any tourist district anywhere.",
  ),
  para(
    "The standard cautions apply: don't walk alone late at night in unfamiliar areas, don't accept drinks from strangers, watch your drink in public bars, use taxis (not walking) for trips between resorts at night, and stay with your group. If you're going to drink heavily, do it inside your resort where security is staffed.",
  ),
  para(
    "Outside the resort zones — for example, in less-touristy parts of Higüey or Veron — the same kind of caution you'd apply in any unfamiliar city in the world makes sense. Most visitors don't venture there anyway, but if you do, go with a guide or driver who knows the area.",
  ),

  h2("Special Considerations"),
  h3("Solo Female Travelers"),
  para(
    "Punta Cana is generally fine for solo female travelers, though catcalling and street harassment are more common than in some other destinations. Resort areas are very safe. When walking outside resorts, sunglasses and confident body language help. Avoid being alone late at night and trust your instincts about specific situations. Many solo women travel here without issue every year — common sense and standard travel awareness are sufficient.",
  ),
  h3("LGBTQ+ Travelers"),
  para(
    "Dominican Republic tourist zones, especially the international resort areas, are tolerant of LGBTQ+ visitors. Same-sex couples are common at resorts and don't draw negative attention. Outside tourist zones, attitudes are more conservative, and public displays of affection might attract attention or commentary. Major resorts are safe and welcoming. Smaller local establishments vary; if uncertain, ask your hotel concierge for recommendations.",
  ),
  h3("Travelers with Children"),
  para(
    "Children are welcome throughout Dominican tourism. Resort areas are family-friendly, with kids' clubs, family beaches, and child-appropriate excursions widely available. The main child-specific safety concerns are sun exposure, water supervision, and dietary changes. Don't let young children swim in the ocean without adult supervision regardless of how shallow the water looks — rip currents and sudden depth changes are real risks.",
  ),

  h2("If Something Goes Wrong"),
  h3("Emergency Numbers"),
  para(
    "The general emergency number is 911 and it works throughout the Dominican Republic. Operators speak Spanish and usually English for tourist emergencies. The tourist police (CESTUR, Cuerpo Especializado de Seguridad Turística) specifically handles tourist incidents and has English-speaking officers stationed in major tourist zones. Your resort's front desk can connect you to CESTUR directly.",
  ),
  h3("Embassy Information"),
  para(
    "Keep your country's embassy or consulate contact information accessible. The US, Canada, UK, France, Germany, and several other countries have embassies or consular offices in Santo Domingo. For lost passports, serious legal issues, or medical emergencies that require evacuation, your embassy is the right first call.",
  ),
  h3("Travel Insurance"),
  para(
    "Travel insurance with medical coverage of at least $100,000 USD, evacuation coverage, and trip cancellation protection is genuinely useful for trips to the Dominican Republic. The cost is typically 4 to 8 percent of your total trip cost — not nothing, but inexpensive compared to the financial impact of a serious medical incident. Read the fine print: many cheap policies exclude common things like alcohol-related injuries, motorcycle accidents, and pre-existing conditions.",
  ),

  h2("Alcohol and Recreational Activity Safety"),
  para(
    "All-inclusive resorts can encourage overconsumption simply because drinks are free and constant. The Dominican sun amplifies the effects of alcohol significantly — what feels like two drinks in cooler weather hits like four here. The result is predictable: most tourist injuries (falls, water incidents, vehicle accidents on quad bikes and buggies) happen to people who underestimated how much they'd had to drink.",
  ),
  para(
    "Practical rules that prevent most problems: drink water between alcoholic drinks at roughly one-to-one, never swim or operate any vehicle (including water bikes, jet skis, and quad bikes) after drinking, set a personal cutoff time for the day, and don't accept drinks from people you don't know. Resorts have medical staff available for guests who overdo it, but the cleaner path is just to not overdo it. The trip is long enough that you don't need to fit all your drinking into the first three days.",
  ),
  h3("Excursion-Specific Safety"),
  para(
    "Reputable excursions brief you on safety before the activity starts: how to use life vests, how to stay with the group, what to do if you feel unwell, who to flag down if there's a problem. Listen to these briefings even if you've done similar activities before — local conditions and operator practices vary. On boat trips, locate the life vests and exits before you settle in. On land excursions, note where the first-aid kit is and who in your group has medical training if anyone. These small habits matter on the rare day something goes wrong.",
  ),

  h2("A Practical Safety Checklist"),
  para(
    "Before and during your trip, run through this short list. Most of it is one-time setup; the rest is daily habit.",
  ),
  li("**Travel insurance purchased** with medical and evacuation coverage"),
  li("**Embassy and CESTUR contact info** saved in your phone and printed in your luggage"),
  li("**Hotel safe used daily** for passports, extra cash, and valuables"),
  li("**Bottled water for drinking and brushing teeth** throughout the trip"),
  li("**Sunscreen reapplied every two hours** and after every swim"),
  li("**Insect repellent in the evenings** especially during rainy season"),
  li("**Taxi fares confirmed before getting in** for every ride outside resort transfers"),
  li("**Beach flag color checked** before swimming each day"),
  li("**Alcohol moderated** especially before any water or motorized activity"),
  li("**Group plans communicated** so someone always knows where you are"),

  h2("Final Thoughts"),
  para(
    "Staying safe in Punta Cana isn't complicated. The biggest risks aren't the dramatic ones people worry about — they're the boring everyday things: sunburn, dehydration, water hazards, alcohol overconsumption, and momentary lapses in attention to belongings. Address those and you'll have a great trip. Use the resort safe, drink bottled water, respect the beach flags, agree on taxi fares in advance, carry travel insurance, and apply more sunscreen than you think necessary. That's most of it.",
  ),
  para(
    "If you'd like to talk through safety considerations for a specific trip — particularly water-based excursions, family group trips, or anything involving young children — [[contact us|https://puntacana-excursions.com/contact]]. We've been operating in Punta Cana for years, we know how to manage real-world conditions, and we're happy to walk you through what we cover and what we recommend you prepare for yourself.",
  ),
];

const safetyBodyEs = [
  para(
    "Punta Cana tiene un problema de reputación. La cobertura de noticias internacionales ocasionalmente se enfoca en incidentes aislados, y el boca a boca entre viajeros puede sobredimensionar los riesgos ordinarios. La realidad sobre el terreno es más matizada: Punta Cana es generalmente segura para los turistas que usan el sentido común, pero el panorama de seguridad no es idéntico a un destino de resort norteamericano o europeo. Esta guía recorre lo que es realmente arriesgado, lo que no lo es, y los hábitos simples que mantienen tu viaje sin incidentes.",
  ),
  para(
    "Si tienes preguntas específicas sobre seguridad en alguna de nuestras excursiones o traslados, [[contacta a nuestro equipo|https://puntacana-excursions.com/contact]] — podemos explicarte cómo manejamos los grupos, qué cubrimos, y qué esperamos de nuestros huéspedes.",
  ),

  h2("Riesgos Reales vs Riesgos Percibidos"),
  para(
    "La República Dominicana, como cualquier país, tiene problemas de delincuencia y seguridad. Los riesgos específicos para los turistas en Punta Cana son en su mayoría mundanos: hurto de pertenencias desatendidas, sobrecargos ocasionales por taxistas informales, errores de seguridad solar y acuática, enfermedades transmitidas por mosquitos durante ciertas temporadas, y las consecuencias predecibles de excederse con el alcohol. La delincuencia violenta contra turistas en las principales zonas de resort es estadísticamente rara. Lo más peligroso que la mayoría de los visitantes harán toda la semana es manejar un quad o buggy después de unas copas — e incluso entonces, los operadores se lo toman en serio.",
  ),
  para(
    "Estadísticamente, es más probable que tengas un problema por quemaduras solares, un malestar estomacal o una lesión en la playa que por algo que se parezca a la delincuencia violenta. Planifica en consecuencia: la mayor parte de tu pensamiento sobre seguridad debe enfocarse en las pequeñas decisiones diarias en lugar de en escenarios dramáticos.",
  ),

  h2("Seguridad en la Playa y el Agua"),
  para(
    "Las playas de Punta Cana parecen benignas — agua turquesa, arena blanca, olas suaves — y la mayoría de los días lo son. Pero el Caribe del lado atlántico tiene peligros reales del agua que toman desprevenidos a los visitantes.",
  ),
  h3("Corrientes de Resaca"),
  para(
    "Las corrientes de resaca son el mayor peligro acuático individual. Son canales estrechos de agua que fluyen rápidamente lejos de la costa, y pueden arrastrar a nadadores fuertes a aguas profundas rápidamente. Las playas de los resorts usualmente colocan banderas de advertencia: verde para seguro, amarilla para precaución, roja para no entrar, doble roja para cerrada. Toma las banderas en serio. Si te encuentras siendo arrastrado por una corriente, no luches contra ella — nada paralelo a la costa hasta que escapes del canal, luego nada de regreso. La mayoría de los salvavidas de resort están bien capacitados, pero no pueden vigilar a todos simultáneamente.",
  ),
  h3("Medusas, Coral de Fuego y Erizos de Mar"),
  para(
    "Las medusas aparecen estacionalmente, principalmente en los meses de verano, y las picaduras van desde irritación leve hasta ronchas dolorosas. El coral de fuego y los erizos de mar viven en los arrecifes y causan lesiones dolorosas a los bañistas descalzos. Usa zapatos de agua en playas rocosas y alrededor del coral. Si te pican, enjuaga con agua de mar (no con agua dulce) y busca atención médica si los síntomas empeoran. La mayoría de las estaciones de primeros auxilios de resort manejan estos incidentes rutinariamente.",
  ),
  h3("Exposición al Sol"),
  para(
    "El sol dominicano es significativamente más fuerte que lo que la mayoría de los visitantes norteamericanos y europeos experimentan en casa. Muchos viajeros lo subestiman el primer día y terminan con quemaduras solares severas que arruinan el resto del viaje. Aplica SPF 30 o superior cada dos horas, más frecuentemente después de nadar. Usa un sombrero y gafas de sol con bloqueo UV. Bebe más agua de la que crees necesitar. Los primeros signos de envenenamiento solar son dolor de cabeza y náuseas — si aparecen, busca sombra inmediatamente.",
  ),
  h3("Sargazo"),
  para(
    "El sargazo, el alga marrón que ocasionalmente se acumula en las playas del Caribe, es inofensivo pero desagradable. La mayoría de los resorts lo limpian diariamente durante la temporada alta de sargazo (típicamente abril a agosto). No hace que el agua sea insegura pero puede atraer pequeñas medusas y hacer que nadar sea menos agradable. Si el sargazo es abundante en tu playa específica, considera una excursión de día a una playa menos afectada.",
  ),

  h2("Seguridad en el Transporte"),
  h3("Taxis y Traslados Pre-Arreglados"),
  para(
    "Los taxis oficiales y los traslados pre-arreglados del hotel son seguros y confiables. Los conductores tienen licencia, los vehículos están mantenidos, y las rutas son predecibles. La precaución estándar es confirmar la tarifa antes de subir y usar carros despachados por tu hotel o un operador de buena reputación en lugar de detener carros en la calle. El transporte arreglado por el hotel es la opción más segura para destinos desconocidos.",
  ),
  h3("Motoconchos"),
  para(
    "Los motoconchos son taxis de motocicleta usados por muchos dominicanos para viajes cortos. Para los turistas, la recomendación es simple: evítalos. El riesgo de accidentes es significativamente mayor que el transporte de cuatro ruedas, las leyes de tránsito apenas se aplican a las motocicletas, los cascos raramente se ofrecen, y el seguro de viaje a menudo excluye lesiones de motocicleta. Los pocos dólares ahorrados versus un taxi regular no valen el riesgo elevado.",
  ),
  h3("Conducir en la República Dominicana"),
  para(
    "Si alquilas un carro, espera una cultura de conducción diferente. La disciplina de carril es flexible, los límites de velocidad se interpretan flexiblemente, las motocicletas se entretejen entre el tráfico, y los peatones aparecen en las autopistas. Conduce defensivamente, evita conducir de noche fuera de las ciudades principales, y nunca bebas y conduzcas — tanto porque es ilegal como porque las consecuencias de un accidente con lesiones son severas y complicadas. La opción de carro-y-conductor (un vehículo privado con un conductor dominicano) es significativamente menos estresante que conducir tú mismo para la mayoría de los viajes.",
  ),
  h3("Vehículos de Excursión"),
  para(
    "Los operadores de excursión de buena reputación (incluyéndonos) usan vehículos asegurados, conductores con licencia y equipo mantenido. Al reservar, verifica que el operador tenga seguro apropiado y revisa reseñas recientes. Para [[excursiones acuáticas|https://puntacana-excursions.com/excursions]] nuestros botes cumplen con los estándares de seguridad marítima, se proporcionan chalecos salvavidas, y la tripulación está informada sobre los procedimientos de emergencia. Los operadores informales más baratos pueden recortar gastos en estos elementos básicos.",
  ),

  h2("Salud y Seguridad del Agua"),
  h3("Agua Potable"),
  para(
    "El agua del grifo en la República Dominicana no se considera segura para que la beban los visitantes. Todos los resorts proporcionan agua embotellada en las habitaciones y en todos los bares y restaurantes. Usa agua embotellada para beber y cepillarte los dientes. El hielo en bares de resort y restaurantes de buena reputación está hecho de agua filtrada y es seguro; es mejor evitar el hielo en puestos callejeros informales. La regla simple: si tienes duda sobre una fuente de agua, bebe embotellada.",
  ),
  h3("Seguridad Alimentaria"),
  para(
    "La comida de los resorts es generalmente segura, preparada en cocinas controladas con estándares de seguridad alimentaria comparables a los hoteles internacionales. Comer fuera del resort en restaurantes establecidos también es generalmente seguro. La comida callejera y los vendedores informales son de mayor riesgo, pero no siempre — los comedores dominicanos que sirven a multitudes locales ocupadas suelen estar bien porque la alta rotación significa comida fresca. Evita mariscos crudos de fuentes desconocidas, carnes poco cocidas y frutas o verduras que no puedas pelar tú mismo. El problema estomacal más común no es por contaminación sino por cambios dietéticos repentinos — intenta no combinar buffets enormes con comidas desconocidas todos los días.",
  ),
  h3("Enfermedades Transmitidas por Mosquitos"),
  para(
    "El dengue, Zika y chikungunya ocurren en la República Dominicana en niveles bajos. El dengue es el más común; los casos tienden a aumentar durante y después de las temporadas lluviosas (mayo a noviembre). La protección es sencilla: usa repelente de insectos que contenga DEET o picaridina, usa mangas largas y pantalones en las noches, duerme con aire acondicionado o mosquiteros, y quédate en resorts que activamente manejen las poblaciones de mosquitos (la mayoría lo hacen). Las viajeras embarazadas deben consultar a sus médicos sobre el riesgo de Zika específicamente antes de reservar.",
  ),
  h3("Atención Médica"),
  para(
    "La República Dominicana tiene sistemas médicos tanto públicos como privados. Para los turistas, los hospitales privados son la opción práctica. Hospiten Bávaro es el principal hospital privado para el área de Punta Cana y proporciona buena atención de emergencia y hospitalización. Los costos son significativamente más altos que en los hospitales públicos — espera pagar por adelantado y ser reembolsado por tu seguro de viaje más tarde. Una visita típica a la sala de emergencias por problemas menores podría costar $200 a $500 USD; lesiones serias u hospitalización pueden costar miles. El seguro de viaje con cobertura médica adecuada es genuinamente útil, no opcional.",
  ),

  h2("Pequeños Delitos y Prevención de Robos"),
  para(
    "El hurto menor es el delito más común que afecta a los turistas. Las estrategias para evitarlo son simples pero requieren ejecución constante.",
  ),
  h3("En la Playa"),
  para(
    "No dejes objetos de valor desatendidos en la playa mientras nadas. El hurto de teléfonos, billeteras, joyas y cámaras de pertenencias desatendidas en la playa ocurre regularmente. Soluciones: lleva solo lo que necesitas a la playa, usa una funda impermeable para el teléfono que puedas llevar al agua, o turnense para nadar con un compañero de viaje que vigile los artículos del grupo. El valor en dólares de lo que se pierde rara vez es enorme, pero la inconveniencia de reemplazar identificaciones y tarjetas es significativa.",
  ),
  h3("Cajas Fuertes de Habitaciones de Hotel"),
  para(
    "Todas las habitaciones de resort tienen pequeñas cajas fuertes en la habitación. Úsalas. Guarda pasaportes, dinero extra, joyas, computadoras portátiles, y cualquier otra cosa que no necesites diariamente. El robo de resort de habitaciones es raro pero sucede — generalmente oportunista, por personas que notan una computadora portátil sin asegurar en la cama durante el servicio de cama. La caja fuerte toma 30 segundos para usar y elimina la mayor parte del riesgo.",
  ),
  h3("En Mercados y Áreas Concurridas"),
  para(
    "El carterismo en áreas de mercado concurridas, ciertas estaciones de autobús y eventos abarrotados es el mismo riesgo que existe en cualquier destino turístico. Lleva las billeteras en los bolsillos delanteros, no traseros. Usa un cinturón de dinero o bolsa de viaje oculta para pasaportes y grandes cantidades de efectivo. Sé consciente de las técnicas de distracción — alguien chocando contigo mientras otro alcanza tu bolso es un patrón común. Si algo se siente raro en una multitud, sal de ella y evalúa.",
  ),
  h3("Estafas de Hotel y Excursiones"),
  para(
    "Algunas estafas se dirigen específicamente a los turistas — estas son en su mayoría enfocadas en dinero en lugar de riesgos de seguridad, pero vale la pena saberlas. Discursos agresivos de venta de tiempo compartido en el aeropuerto o en los resorts, vendedores no autorizados de excursiones cerca de las playas, taxis con medidores rotos, y precios inflados para turistas que no conocen las tarifas locales. Rechaza cortésmente, aléjate, y quédate con operadores recomendados por tu resort o que reservaste con anticipación.",
  ),

  h2("Seguridad Nocturna"),
  para(
    "La noche en las principales zonas de resort (Bávaro, Punta Cana, Cap Cana) es generalmente segura y bien iluminada. Los resorts en sí están cerrados y patrullados. Las franjas de bares y restaurantes en El Cortecito y a lo largo del área turística principal de Bávaro se llenan de gente por la noche con turistas y locales y se sienten similares a cualquier distrito turístico en cualquier lugar.",
  ),
  para(
    "Aplican las precauciones estándar: no camines solo tarde en la noche en áreas desconocidas, no aceptes bebidas de extraños, vigila tu bebida en bares públicos, usa taxis (no caminar) para viajes entre resorts por la noche, y quédate con tu grupo. Si vas a beber mucho, hazlo dentro de tu resort donde hay seguridad disponible.",
  ),
  para(
    "Fuera de las zonas de resort — por ejemplo, en partes menos turísticas de Higüey o Veron — el mismo tipo de precaución que aplicarías en cualquier ciudad desconocida del mundo tiene sentido. La mayoría de los visitantes no se aventura allí de todos modos, pero si lo haces, ve con un guía o conductor que conozca el área.",
  ),

  h2("Consideraciones Especiales"),
  h3("Viajeras Solas"),
  para(
    "Punta Cana es generalmente segura para viajeras solas, aunque los piropos y el acoso callejero son más comunes que en algunos otros destinos. Las áreas de resort son muy seguras. Al caminar fuera de los resorts, las gafas de sol y un lenguaje corporal confiado ayudan. Evita estar sola tarde en la noche y confía en tus instintos sobre situaciones específicas. Muchas mujeres solas viajan aquí sin problema cada año — el sentido común y la conciencia estándar de viaje son suficientes.",
  ),
  h3("Viajeros LGBTQ+"),
  para(
    "Las zonas turísticas de la República Dominicana, especialmente las áreas de resorts internacionales, son tolerantes con los visitantes LGBTQ+. Las parejas del mismo sexo son comunes en los resorts y no atraen atención negativa. Fuera de las zonas turísticas, las actitudes son más conservadoras, y las demostraciones públicas de afecto podrían atraer atención o comentarios. Los principales resorts son seguros y acogedores. Los establecimientos locales más pequeños varían; si no estás seguro, pídele recomendaciones al conserje de tu hotel.",
  ),
  h3("Viajeros con Niños"),
  para(
    "Los niños son bienvenidos en todo el turismo dominicano. Las áreas de resort son amigables para la familia, con clubes para niños, playas familiares y excursiones apropiadas para niños ampliamente disponibles. Las principales preocupaciones de seguridad específicas para niños son la exposición al sol, la supervisión en el agua y los cambios dietéticos. No dejes que los niños pequeños naden en el océano sin supervisión adulta, sin importar lo poco profunda que parezca el agua — las corrientes de resaca y los cambios repentinos de profundidad son riesgos reales.",
  ),

  h2("Si Algo Sale Mal"),
  h3("Números de Emergencia"),
  para(
    "El número de emergencia general es 911 y funciona en toda la República Dominicana. Los operadores hablan español y generalmente inglés para emergencias de turistas. La policía turística (CESTUR, Cuerpo Especializado de Seguridad Turística) maneja específicamente los incidentes turísticos y tiene oficiales que hablan inglés estacionados en las principales zonas turísticas. La recepción de tu resort puede conectarte con CESTUR directamente.",
  ),
  h3("Información de Embajada"),
  para(
    "Mantén la información de contacto de la embajada o consulado de tu país accesible. Estados Unidos, Canadá, Reino Unido, Francia, Alemania y varios otros países tienen embajadas u oficinas consulares en Santo Domingo. Para pasaportes perdidos, problemas legales serios, o emergencias médicas que requieran evacuación, tu embajada es la llamada correcta primero.",
  ),
  h3("Seguro de Viaje"),
  para(
    "El seguro de viaje con cobertura médica de al menos $100,000 USD, cobertura de evacuación y protección de cancelación de viaje es genuinamente útil para viajes a la República Dominicana. El costo es típicamente del 4 al 8 por ciento del costo total de tu viaje — no es nada, pero económico comparado con el impacto financiero de un incidente médico serio. Lee la letra pequeña: muchas pólizas baratas excluyen cosas comunes como lesiones relacionadas con el alcohol, accidentes de motocicleta y condiciones preexistentes.",
  ),

  h2("Seguridad con el Alcohol y Actividades Recreativas"),
  para(
    "Los resorts todo-incluido pueden fomentar el consumo excesivo simplemente porque las bebidas son gratis y constantes. El sol dominicano amplifica significativamente los efectos del alcohol — lo que se siente como dos tragos en clima más fresco golpea como cuatro aquí. El resultado es predecible: la mayoría de las lesiones turísticas (caídas, incidentes acuáticos, accidentes vehiculares en quads y buggies) le suceden a personas que subestimaron cuánto habían tomado.",
  ),
  para(
    "Reglas prácticas que previenen la mayoría de los problemas: bebe agua entre bebidas alcohólicas aproximadamente uno a uno, nunca nades ni operes ningún vehículo (incluyendo bicicletas acuáticas, motos acuáticas y quads) después de beber, establece un horario de corte personal para el día, y no aceptes bebidas de personas que no conoces. Los resorts tienen personal médico disponible para huéspedes que se exceden, pero el camino más limpio es simplemente no excederse. El viaje es lo suficientemente largo como para que no necesites encajar toda tu bebida en los primeros tres días.",
  ),
  h3("Seguridad Específica de Excursiones"),
  para(
    "Las excursiones de buena reputación te informan sobre seguridad antes de que comience la actividad: cómo usar los chalecos salvavidas, cómo permanecer con el grupo, qué hacer si te sientes mal, a quién hacerle señas si hay un problema. Escucha estas instrucciones aunque hayas hecho actividades similares antes — las condiciones locales y las prácticas del operador varían. En viajes en bote, ubica los chalecos salvavidas y las salidas antes de instalarte. En excursiones terrestres, anota dónde está el botiquín de primeros auxilios y quién en tu grupo tiene entrenamiento médico si alguien lo tiene. Estos pequeños hábitos importan en el raro día que algo sale mal.",
  ),

  h2("Una Lista de Verificación Práctica de Seguridad"),
  para(
    "Antes y durante tu viaje, revisa esta lista corta. La mayor parte es configuración única; el resto es hábito diario.",
  ),
  li("**Seguro de viaje comprado** con cobertura médica y de evacuación"),
  li("**Información de contacto de la embajada y CESTUR** guardada en tu teléfono e impresa en tu equipaje"),
  li("**Caja fuerte del hotel usada diariamente** para pasaportes, dinero extra y objetos de valor"),
  li("**Agua embotellada para beber y cepillarte los dientes** durante todo el viaje"),
  li("**Protector solar reaplicado cada dos horas** y después de cada nadada"),
  li("**Repelente de insectos en las noches** especialmente durante la temporada lluviosa"),
  li("**Tarifas de taxi confirmadas antes de subir** para cada viaje fuera de los traslados del resort"),
  li("**Color de la bandera de playa verificado** antes de nadar cada día"),
  li("**Alcohol moderado** especialmente antes de cualquier actividad acuática o motorizada"),
  li("**Planes del grupo comunicados** para que alguien siempre sepa dónde estás"),

  h2("Reflexiones Finales"),
  para(
    "Mantenerse seguro en Punta Cana no es complicado. Los mayores riesgos no son los dramáticos que la gente teme — son las cosas aburridas de todos los días: quemaduras solares, deshidratación, peligros del agua, consumo excesivo de alcohol y lapsos momentáneos de atención a las pertenencias. Aborda esos y tendrás un gran viaje. Usa la caja fuerte del resort, bebe agua embotellada, respeta las banderas de la playa, acuerda las tarifas de taxi con anticipación, lleva seguro de viaje, y aplica más protector solar del que crees necesario. Eso es la mayor parte.",
  ),
  para(
    "Si te gustaría hablar sobre consideraciones de seguridad para un viaje específico — particularmente excursiones acuáticas, viajes en grupo familiar, o cualquier cosa que involucre niños pequeños — [[contáctanos|https://puntacana-excursions.com/contact]]. Hemos estado operando en Punta Cana por años, sabemos cómo manejar las condiciones del mundo real, y estamos felices de explicarte qué cubrimos y qué recomendamos que prepares por tu cuenta.",
  ),
];

const safetyBodyDe = [
  para(
    "Punta Cana hat ein Reputationsproblem. Internationale Nachrichtenberichterstattung konzentriert sich gelegentlich auf isolierte Vorfälle, und Mundpropaganda zwischen Reisenden kann gewöhnliche Risiken aufbauschen. Die Realität vor Ort ist nuancierter: Punta Cana ist im Allgemeinen sicher für Touristen, die gesunden Menschenverstand nutzen, aber die Sicherheitslandschaft ist nicht identisch mit einem nordamerikanischen oder europäischen Resort-Ziel. Dieser Leitfaden geht durch, was tatsächlich riskant ist, was nicht, und die einfachen Gewohnheiten, die Ihre Reise ereignislos halten.",
  ),
  para(
    "Wenn Sie spezifische Fragen zur Sicherheit bei einer unserer Reisen oder Transfers haben, [[kontaktieren Sie unser Team|https://puntacana-excursions.com/contact]] — wir können Ihnen erklären, wie wir Gruppen verwalten, was wir abdecken, und was wir von unseren Gästen erwarten.",
  ),

  h2("Tatsächliche Risiken vs. Wahrgenommene Risiken"),
  para(
    "Die Dominikanische Republik hat, wie jedes Land, Kriminalität und Sicherheitsprobleme. Die spezifischen Risiken für Touristen in Punta Cana sind meist alltäglich: Kleindiebstahl von unbeaufsichtigten Sachen, gelegentliche Überberechnungen durch informelle Taxifahrer, Sonnen- und Wassersicherheitsfehler, durch Mücken übertragene Krankheiten in bestimmten Jahreszeiten, und die vorhersehbaren Folgen übermäßigen Alkoholkonsums. Gewaltverbrechen gegen Touristen in den Hauptresortgebieten sind statistisch selten. Das Gefährlichste, was die meisten Besucher die ganze Woche tun werden, ist ein Quad oder Buggy nach ein paar Drinks zu fahren — und selbst dann nehmen die Betreiber das ernst.",
  ),
  para(
    "Statistisch gesehen ist es wahrscheinlicher, dass Sie ein Problem durch Sonnenbrand, einen verärgerten Magen oder eine Strandverletzung haben als durch etwas, das Gewaltkriminalität ähnelt. Planen Sie entsprechend: Der größte Teil Ihres Sicherheitsdenkens sollte sich auf die kleinen täglichen Entscheidungen konzentrieren statt auf dramatische Szenarien.",
  ),

  h2("Strand- und Wassersicherheit"),
  para(
    "Die Strände von Punta Cana sehen harmlos aus — türkisfarbenes Wasser, weißer Sand, sanfte Wellen — und meistens sind sie das auch. Aber die atlantische Seite der Karibik hat echte Wassergefahren, die Besucher überraschen.",
  ),
  h3("Brandungsrückströme"),
  para(
    "Brandungsrückströme sind die größte einzelne Wassergefahr. Sie sind schmale Wasserkanäle, die schnell vom Ufer wegfließen, und können starke Schwimmer schnell ins tiefe Wasser ziehen. Resort-Strände hissen normalerweise Warnflaggen: Grün für sicher, Gelb für Vorsicht, Rot für nicht ins Wasser gehen, doppeltes Rot für geschlossen. Nehmen Sie die Flaggen ernst. Wenn Sie von einer Strömung weggezogen werden, kämpfen Sie nicht dagegen — schwimmen Sie parallel zum Ufer, bis Sie aus dem Kanal entkommen, dann schwimmen Sie zurück. Die meisten Resort-Rettungsschwimmer sind gut ausgebildet, aber sie können nicht alle gleichzeitig beobachten.",
  ),
  h3("Quallen, Feuerkorallen und Seeigel"),
  para(
    "Quallen erscheinen saisonal, hauptsächlich in den Sommermonaten, und Stiche reichen von milder Reizung bis zu schmerzhaften Quaddeln. Feuerkorallen und Seeigel leben in den Riffen und verursachen schmerzhafte Verletzungen bei barfüßigen Watern. Tragen Sie Wasserschuhe an felsigen Stränden und in der Nähe von Korallen. Wenn gestochen, spülen Sie mit Meerwasser (nicht Süßwasser) und suchen Sie medizinische Hilfe, wenn sich die Symptome verschlimmern. Die meisten Resort-Erste-Hilfe-Stationen behandeln diese Vorfälle routinemäßig.",
  ),
  h3("Sonneneinstrahlung"),
  para(
    "Die dominikanische Sonne ist deutlich stärker als das, was die meisten nordamerikanischen und europäischen Besucher zu Hause erleben. Viele Reisende unterschätzen sie am ersten Tag und enden mit schwerem Sonnenbrand, der den Rest der Reise ruiniert. Tragen Sie LSF 30 oder höher alle zwei Stunden auf, öfter nach dem Schwimmen. Tragen Sie einen Hut und UV-blockierende Sonnenbrille. Trinken Sie mehr Wasser als Sie denken zu brauchen. Die ersten Anzeichen einer Sonnenvergiftung sind Kopfschmerzen und Übelkeit — wenn beides auftritt, gehen Sie sofort in den Schatten.",
  ),
  h3("Sargassum-Seetang"),
  para(
    "Sargassum, der braune Seetang, der sich gelegentlich an karibischen Stränden ansammelt, ist harmlos aber unangenehm. Die meisten Resorts räumen ihn täglich während der Hauptsaison (typischerweise April bis August). Er macht das Wasser nicht unsicher, kann aber kleine Quallen anziehen und das Schwimmen weniger angenehm machen. Wenn Sargassum an Ihrem spezifischen Strand stark ist, ziehen Sie einen Tagesausflug zu einem weniger betroffenen Strand in Betracht.",
  ),

  h2("Transportsicherheit"),
  h3("Taxis und Vorbestellte Transfers"),
  para(
    "Offizielle Taxis und vorbestellte Hoteltransfers sind sicher und zuverlässig. Die Fahrer sind lizenziert, die Fahrzeuge werden gewartet, und die Routen sind vorhersehbar. Die Standardvorsichtsmaßnahme ist, den Fahrpreis vor dem Einsteigen zu bestätigen und Autos zu verwenden, die von Ihrem Hotel oder einem seriösen Betreiber entsandt werden, anstatt Autos von der Straße zu winken. Vom Hotel arrangierter Transport ist die sicherste Wahl für unbekannte Ziele.",
  ),
  h3("Motoconchos"),
  para(
    "Motoconchos sind Motorradtaxis, die von vielen Dominikanern für kurze Fahrten verwendet werden. Für Touristen ist die Empfehlung einfach: meiden Sie sie. Das Unfallrisiko ist deutlich höher als bei vierrädrigem Transport, Verkehrsgesetze werden für Motorräder kaum durchgesetzt, Helme werden selten angeboten, und Reiseversicherungen schließen oft Motorradverletzungen aus. Die wenigen Dollar, die im Vergleich zu einem regulären Taxi gespart werden, sind das erhöhte Risiko nicht wert.",
  ),
  h3("Autofahren in der Dominikanischen Republik"),
  para(
    "Wenn Sie ein Auto mieten, erwarten Sie eine andere Fahrkultur. Spurdisziplin ist locker, Geschwindigkeitsbegrenzungen werden flexibel interpretiert, Motorräder schlängeln sich durch den Verkehr, und Fußgänger erscheinen auf Autobahnen. Fahren Sie defensiv, vermeiden Sie es, nachts außerhalb großer Städte zu fahren, und trinken Sie nie und fahren Sie — sowohl weil es illegal ist als auch weil die Folgen eines Unfalls mit Verletzungen schwerwiegend und kompliziert sind. Die Auto-und-Fahrer-Option (ein privates Fahrzeug mit einem dominikanischen Fahrer) ist für die meisten Fahrten deutlich weniger stressig als selbst zu fahren.",
  ),
  h3("Ausflugsfahrzeuge"),
  para(
    "Seriöse Ausflugsbetreiber (einschließlich uns) verwenden versicherte Fahrzeuge, lizenzierte Fahrer und gewartete Ausrüstung. Verifizieren Sie bei der Buchung, dass der Betreiber eine angemessene Versicherung hat, und prüfen Sie aktuelle Bewertungen. Für [[wasserbasierte Ausflüge|https://puntacana-excursions.com/excursions]] erfüllen unsere Boote die Schiffssicherheitsstandards, Schwimmwesten werden bereitgestellt, und die Besatzung ist über Notfallverfahren informiert. Billigere informelle Betreiber können bei diesen Grundlagen sparen.",
  ),

  h2("Gesundheit und Wassersicherheit"),
  h3("Trinkwasser"),
  para(
    "Leitungswasser in der Dominikanischen Republik gilt für Besucher nicht als sicher zum Trinken. Alle Resorts bieten Flaschenwasser in Zimmern und an allen Bars und Restaurants. Verwenden Sie Flaschenwasser zum Trinken und Zähneputzen. Eis an Resort-Bars und seriösen Restaurants wird aus gefiltertem Wasser hergestellt und ist sicher; Eis an informellen Straßenständen sollte am besten vermieden werden. Die einfache Regel: Wenn Sie an einer Wasserquelle zweifeln, trinken Sie Flaschenwasser.",
  ),
  h3("Lebensmittelsicherheit"),
  para(
    "Resort-Essen ist im Allgemeinen sicher, zubereitet in kontrollierten Küchen mit Lebensmittelsicherheitsstandards, die mit internationalen Hotels vergleichbar sind. Auch Essen außerhalb des Resorts in etablierten Restaurants ist im Allgemeinen sicher. Straßenessen und informelle Verkäufer sind ein höheres Risiko, aber nicht immer — dominikanische Comedores, die belebten lokalen Menschenmengen dienen, sind typischerweise in Ordnung, weil hoher Umsatz frische Lebensmittel bedeutet. Vermeiden Sie rohe Meeresfrüchte aus unbekannten Quellen, ungenügend gekochtes Fleisch und Früchte oder Gemüse, die Sie nicht selbst schälen können. Das häufigste Magenproblem ist nicht durch Kontamination, sondern durch plötzliche Ernährungsumstellungen — versuchen Sie nicht, massive Buffets mit ungewohntem Essen jeden Tag zu kombinieren.",
  ),
  h3("Durch Mücken Übertragene Krankheiten"),
  para(
    "Dengue, Zika und Chikungunya treten in der Dominikanischen Republik auf niedrigem Niveau auf. Dengue ist am häufigsten; Fälle tendieren dazu, während und nach Regenzeiten (Mai bis November) zu steigen. Der Schutz ist einfach: Verwenden Sie Insektenschutzmittel mit DEET oder Picaridin, tragen Sie abends lange Ärmel und Hosen, schlafen Sie mit Klimaanlage oder Gittern, und bleiben Sie in Resorts, die aktiv die Mückenpopulation verwalten (die meisten tun das). Schwangere Reisende sollten ihre Ärzte vor der Buchung speziell zum Zika-Risiko konsultieren.",
  ),
  h3("Medizinische Versorgung"),
  para(
    "Die Dominikanische Republik hat sowohl öffentliche als auch private Gesundheitssysteme. Für Touristen sind private Krankenhäuser die praktische Wahl. Hospiten Bávaro ist das wichtigste private Krankenhaus für das Gebiet Punta Cana und bietet gute Notfall- und stationäre Versorgung. Die Kosten sind deutlich höher als in öffentlichen Krankenhäusern — erwarten Sie, im Voraus zu zahlen und später von Ihrer Reiseversicherung erstattet zu werden. Ein typischer Notaufnahmebesuch für kleinere Probleme kann 200 bis 500 USD kosten; ernsthafte Verletzungen oder Krankenhausaufenthalt können in die Tausende gehen. Reiseversicherung mit angemessener medizinischer Abdeckung ist wirklich nützlich, nicht optional.",
  ),

  h2("Kleinkriminalität und Diebstahlprävention"),
  para(
    "Kleindiebstahl ist das häufigste Verbrechen, das Touristen betrifft. Die Strategien zur Vermeidung sind einfach, aber sie erfordern konsequente Ausführung.",
  ),
  h3("Am Strand"),
  para(
    "Lassen Sie Wertsachen nicht unbeaufsichtigt am Strand, während Sie schwimmen. Kleindiebstahl von Telefonen, Geldbörsen, Schmuck und Kameras aus unbeaufsichtigten Strandsachen passiert regelmäßig. Lösungen: Nehmen Sie nur mit, was Sie an den Strand brauchen, verwenden Sie eine wasserdichte Telefonhülle, die Sie ins Wasser tragen können, oder wechseln Sie sich beim Schwimmen mit einem Reisebegleiter ab, der die Sachen der Gruppe bewacht. Der Dollarwert dessen, was verloren geht, ist selten enorm, aber die Unannehmlichkeit, Ausweise und Karten zu ersetzen, ist erheblich.",
  ),
  h3("Hotelzimmer-Tresore"),
  para(
    "Alle Resort-Zimmer haben kleine Zimmertresore. Verwenden Sie sie. Bewahren Sie Pässe, zusätzliches Bargeld, Schmuck, Laptops und alles andere auf, was Sie nicht täglich brauchen. Resort-Diebstahl aus Zimmern ist selten, aber kommt vor — meist opportunistisch, von Personen, die einen ungesicherten Laptop auf dem Bett während des Aufdeckservices bemerken. Der Tresor dauert 30 Sekunden zum Verwenden und entfernt den größten Teil des Risikos.",
  ),
  h3("In Märkten und Überfüllten Bereichen"),
  para(
    "Taschendiebstahl in geschäftigen Marktgebieten, bestimmten Busbahnhöfen und überfüllten Veranstaltungen ist das gleiche Risiko, das in jedem Touristenziel besteht. Tragen Sie Geldbörsen in den vorderen Taschen, nicht hinten. Verwenden Sie einen Geldgürtel oder eine versteckte Reisetasche für Pässe und große Bargeldbeträge. Seien Sie sich Ablenkungstechniken bewusst — jemand, der gegen Sie stößt, während ein anderer nach Ihrer Tasche greift, ist ein häufiges Muster. Wenn sich in einer Menge etwas falsch anfühlt, treten Sie heraus und bewerten Sie.",
  ),
  h3("Hotel- und Ausflugsbetrügereien"),
  para(
    "Einige Betrügereien zielen speziell auf Touristen ab — diese sind meist auf Geld fokussiert anstatt auf Sicherheitsrisiken, aber es lohnt sich, sie zu kennen. Aggressive Timesharing-Verkaufsgespräche am Flughafen oder in Resorts, nicht autorisierte Ausflugsverkäufer in Strandnähe, Taxis mit defekten Taxametern, und überhöhte Preise für Touristen, die die lokalen Tarife nicht kennen. Lehnen Sie höflich ab, gehen Sie weg, und halten Sie sich an Betreiber, die von Ihrem Resort empfohlen werden oder die Sie im Voraus gebucht haben.",
  ),

  h2("Nachtsicherheit"),
  para(
    "Die Nacht in den Hauptresortgebieten (Bávaro, Punta Cana, Cap Cana) ist im Allgemeinen sicher und gut beleuchtet. Die Resorts selbst sind umzäunt und werden patrouilliert. Die Bar- und Restaurantstreifen in El Cortecito und entlang des Bávaro-Hauptouristengebiets werden nachts mit Touristen und Einheimischen voll und fühlen sich ähnlich wie jeder Touristenbezirk überall an.",
  ),
  para(
    "Die Standardvorsichten gelten: Gehen Sie nicht alleine spät nachts in unbekannten Gebieten, nehmen Sie keine Getränke von Fremden an, beobachten Sie Ihr Getränk in öffentlichen Bars, verwenden Sie Taxis (nicht zu Fuß) für Fahrten zwischen Resorts nachts, und bleiben Sie bei Ihrer Gruppe. Wenn Sie viel trinken werden, tun Sie es in Ihrem Resort, wo Sicherheit besetzt ist.",
  ),
  para(
    "Außerhalb der Resortgebiete — zum Beispiel in weniger touristischen Teilen von Higüey oder Veron — ist die gleiche Art von Vorsicht, die Sie in jeder unbekannten Stadt der Welt anwenden würden, sinnvoll. Die meisten Besucher wagen sich sowieso nicht dorthin, aber wenn Sie es tun, gehen Sie mit einem Führer oder Fahrer, der das Gebiet kennt.",
  ),

  h2("Besondere Überlegungen"),
  h3("Alleinreisende Frauen"),
  para(
    "Punta Cana ist im Allgemeinen in Ordnung für alleinreisende Frauen, obwohl Nachpfiffe und Straßenbelästigung häufiger sind als in einigen anderen Zielen. Resort-Bereiche sind sehr sicher. Beim Gehen außerhalb der Resorts helfen Sonnenbrille und selbstbewusste Körpersprache. Vermeiden Sie es, spät nachts alleine zu sein, und vertrauen Sie Ihren Instinkten bei spezifischen Situationen. Viele alleinreisende Frauen reisen jedes Jahr ohne Probleme hierher — gesunder Menschenverstand und standardmäßige Reisebewusstheit sind ausreichend.",
  ),
  h3("LGBTQ+-Reisende"),
  para(
    "Touristenzonen der Dominikanischen Republik, besonders die internationalen Resortgebiete, sind tolerant gegenüber LGBTQ+-Besuchern. Gleichgeschlechtliche Paare sind in Resorts häufig und ziehen keine negative Aufmerksamkeit auf sich. Außerhalb der Touristenzonen sind die Einstellungen konservativer, und öffentliche Zuneigungsbekundungen könnten Aufmerksamkeit oder Kommentare anziehen. Große Resorts sind sicher und einladend. Kleinere lokale Einrichtungen variieren; wenn Sie unsicher sind, fragen Sie den Concierge Ihres Hotels nach Empfehlungen.",
  ),
  h3("Reisende mit Kindern"),
  para(
    "Kinder sind im gesamten dominikanischen Tourismus willkommen. Resort-Bereiche sind familienfreundlich, mit Kinderclubs, Familienstränden und kinderfreundlichen Ausflügen weit verbreitet. Die wichtigsten kinderspezifischen Sicherheitsbedenken sind Sonneneinstrahlung, Wasseraufsicht und Ernährungsumstellungen. Lassen Sie kleine Kinder nicht ohne Erwachsenenaufsicht im Meer schwimmen, unabhängig davon, wie flach das Wasser aussieht — Brandungsrückströme und plötzliche Tiefenänderungen sind reale Risiken.",
  ),

  h2("Wenn Etwas Schiefgeht"),
  h3("Notrufnummern"),
  para(
    "Die allgemeine Notrufnummer ist 911 und funktioniert in der gesamten Dominikanischen Republik. Operatoren sprechen Spanisch und meist Englisch für Touristen-Notfälle. Die Touristenpolizei (CESTUR, Cuerpo Especializado de Seguridad Turística) bearbeitet speziell Touristen-Vorfälle und hat englischsprachige Beamte in den wichtigsten Touristenzonen stationiert. Die Rezeption Ihres Resorts kann Sie direkt mit CESTUR verbinden.",
  ),
  h3("Botschaftsinformationen"),
  para(
    "Halten Sie die Kontaktinformationen der Botschaft oder des Konsulats Ihres Landes zugänglich. Die USA, Kanada, Großbritannien, Frankreich, Deutschland und mehrere andere Länder haben Botschaften oder konsularische Büros in Santo Domingo. Für verlorene Pässe, ernsthafte rechtliche Probleme oder medizinische Notfälle, die eine Evakuierung erfordern, ist Ihre Botschaft der richtige erste Anruf.",
  ),
  h3("Reiseversicherung"),
  para(
    "Reiseversicherung mit medizinischer Abdeckung von mindestens 100.000 USD, Evakuierungsabdeckung und Reiserücktrittsschutz ist für Reisen in die Dominikanische Republik wirklich nützlich. Die Kosten betragen typischerweise 4 bis 8 Prozent Ihrer Gesamtreisekosten — nicht nichts, aber günstig im Vergleich zu den finanziellen Auswirkungen eines ernsthaften medizinischen Vorfalls. Lesen Sie das Kleingedruckte: Viele billige Policen schließen häufige Dinge wie alkoholbedingte Verletzungen, Motorradunfälle und Vorerkrankungen aus.",
  ),

  h2("Alkohol- und Freizeitaktivitätssicherheit"),
  para(
    "All-Inclusive-Resorts können übermäßigen Konsum einfach fördern, weil Getränke kostenlos und ständig verfügbar sind. Die dominikanische Sonne verstärkt die Wirkungen von Alkohol deutlich — was sich bei kühlerem Wetter wie zwei Drinks anfühlt, trifft hier wie vier. Das Ergebnis ist vorhersehbar: Die meisten Touristenverletzungen (Stürze, Wasservorfälle, Fahrzeugunfälle auf Quads und Buggies) passieren Menschen, die unterschätzten, wie viel sie getrunken hatten.",
  ),
  para(
    "Praktische Regeln, die die meisten Probleme verhindern: Trinken Sie Wasser zwischen alkoholischen Getränken etwa eins zu eins, schwimmen Sie nie und bedienen Sie kein Fahrzeug (einschließlich Wasserfahrräder, Jet Skis und Quads) nach dem Trinken, setzen Sie sich eine persönliche Schlusszeit für den Tag, und nehmen Sie keine Getränke von Personen an, die Sie nicht kennen. Resorts haben medizinisches Personal für Gäste verfügbar, die es übertreiben, aber der saubere Weg ist es einfach, es nicht zu übertreiben. Die Reise ist lang genug, dass Sie nicht das gesamte Trinken in die ersten drei Tage einfügen müssen.",
  ),
  h3("Ausflugsspezifische Sicherheit"),
  para(
    "Seriöse Ausflüge erklären Ihnen die Sicherheit vor Beginn der Aktivität: wie man Schwimmwesten verwendet, wie man bei der Gruppe bleibt, was zu tun ist, wenn man sich unwohl fühlt, wem man signalisieren soll, wenn es ein Problem gibt. Hören Sie diese Briefings auch, wenn Sie ähnliche Aktivitäten zuvor gemacht haben — lokale Bedingungen und Betreiberpraktiken variieren. Auf Bootsfahrten orten Sie die Schwimmwesten und Ausgänge, bevor Sie sich niederlassen. Auf Landausflügen notieren Sie, wo das Erste-Hilfe-Set ist und wer in Ihrer Gruppe eine medizinische Ausbildung hat, wenn jemand. Diese kleinen Gewohnheiten sind an dem seltenen Tag wichtig, an dem etwas schiefgeht.",
  ),

  h2("Eine Praktische Sicherheitscheckliste"),
  para(
    "Vor und während Ihrer Reise gehen Sie diese kurze Liste durch. Das meiste ist einmalige Einrichtung; der Rest ist tägliche Gewohnheit.",
  ),
  li("**Reiseversicherung gekauft** mit medizinischer und Evakuierungsabdeckung"),
  li("**Botschafts- und CESTUR-Kontaktinformationen** in Ihrem Telefon gespeichert und in Ihrem Gepäck gedruckt"),
  li("**Hoteltresor täglich benutzt** für Pässe, zusätzliches Bargeld und Wertsachen"),
  li("**Flaschenwasser zum Trinken und Zähneputzen** während der gesamten Reise"),
  li("**Sonnencreme alle zwei Stunden erneut aufgetragen** und nach jedem Schwimmen"),
  li("**Insektenschutzmittel am Abend** besonders während der Regenzeit"),
  li("**Taxitarife vor dem Einsteigen bestätigt** für jede Fahrt außerhalb der Resort-Transfers"),
  li("**Strandflaggenfarbe überprüft** vor dem Schwimmen jeden Tag"),
  li("**Alkohol moderiert** besonders vor jeder Wasser- oder motorisierten Aktivität"),
  li("**Gruppenpläne kommuniziert**, damit immer jemand weiß, wo Sie sind"),

  h2("Abschließende Gedanken"),
  para(
    "Sicher in Punta Cana zu bleiben, ist nicht kompliziert. Die größten Risiken sind nicht die dramatischen, um die sich Leute Sorgen machen — es sind die langweiligen alltäglichen Dinge: Sonnenbrand, Dehydration, Wassergefahren, übermäßiger Alkoholkonsum und momentane Aufmerksamkeitslücken bei Sachen. Beheben Sie diese und Sie werden eine großartige Reise haben. Verwenden Sie den Resort-Tresor, trinken Sie Flaschenwasser, respektieren Sie die Strandflaggen, vereinbaren Sie Taxitarife im Voraus, tragen Sie Reiseversicherung mit sich, und tragen Sie mehr Sonnencreme auf als Sie für nötig halten. Das ist das meiste davon.",
  ),
  para(
    "Wenn Sie Sicherheitsüberlegungen für eine spezifische Reise besprechen möchten — besonders Wasserausflüge, Familiengruppenreisen oder alles, was kleine Kinder betrifft — [[kontaktieren Sie uns|https://puntacana-excursions.com/contact]]. Wir sind seit Jahren in Punta Cana tätig, wir wissen, wie man reale Bedingungen handhabt, und wir erklären Ihnen gerne, was wir abdecken und was wir Ihnen empfehlen, sich selbst vorzubereiten.",
  ),
];

// ===========================================================================
// Documents
// ===========================================================================

const articles = [
  // Set 1 — Money in Punta Cana
  {
    _id: "blog-article-money-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "money-in-punta-cana",
    slug: { _type: "slug", current: "money-in-punta-cana-guide" },
    title: "Money in Punta Cana: USD vs Pesos, Tipping, and Cards",
    excerpt:
      "Complete guide to handling money in Punta Cana — currencies, ATMs, tipping rules, scams to avoid, and how to budget for your trip.",
    publishedAt: "2025-11-08",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: moneyBodyEn,
    seo: {
      metaTitle: "Money in Punta Cana: USD, Pesos, Tipping & Cards",
      metaDescription:
        "Practical guide to handling money in Punta Cana — currencies, ATMs, tipping rules, scams to avoid, and realistic trip budgets.",
      keywords: [
        "money in Punta Cana",
        "Dominican pesos",
        "tipping in Dominican Republic",
        "Punta Cana ATM",
        "Punta Cana currency",
        "travel money tips",
      ],
      ogTitle: "Money in Punta Cana: USD, Pesos, Tipping & Cards",
      ogDescription:
        "Currencies, ATMs, tipping, scams, and budgeting — a complete practical guide to handling money on your Punta Cana trip without overpaying.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Money in Punta Cana: USD vs Pesos, Tipping, and Cards",
        description:
          "Complete guide to handling money in Punta Cana — currencies, ATMs, tipping rules, scams to avoid, and how to budget for your trip.",
        url: "https://puntacana-excursions.com/blog/money-in-punta-cana-guide",
        datePublished: "2025-11-08",
        language: "en",
        keywords: [
          "money in Punta Cana",
          "Dominican pesos",
          "tipping in Dominican Republic",
          "Punta Cana ATM",
          "Punta Cana currency",
          "travel money tips",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-money-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "money-in-punta-cana",
    slug: { _type: "slug", current: "dinero-punta-cana-guia" },
    title: "Dinero en Punta Cana: USD vs Pesos, Propinas y Tarjetas",
    excerpt:
      "Guía completa para manejar dinero en Punta Cana — monedas, cajeros, propinas, estafas a evitar y cómo presupuestar tu viaje.",
    publishedAt: "2025-11-08",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: moneyBodyEs,
    seo: {
      metaTitle: "Dinero en Punta Cana: USD, Pesos, Propinas y Tarjetas",
      metaDescription:
        "Guía práctica para manejar dinero en Punta Cana — monedas, cajeros, propinas, estafas a evitar y cómo presupuestar tu viaje.",
      keywords: [
        "dinero Punta Cana",
        "pesos dominicanos",
        "propinas República Dominicana",
        "cajero Punta Cana",
        "moneda Punta Cana",
      ],
      ogTitle: "Dinero en Punta Cana: USD, Pesos, Propinas y Tarjetas",
      ogDescription:
        "Monedas, cajeros, propinas, estafas y presupuesto — guía práctica completa para gastar con confianza en Punta Cana sin pagar de más.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Dinero en Punta Cana: USD vs Pesos, Propinas y Tarjetas",
        description:
          "Guía completa para manejar dinero en Punta Cana — monedas, cajeros, propinas, estafas a evitar y cómo presupuestar tu viaje.",
        url: "https://puntacana-excursions.com/blog/dinero-punta-cana-guia",
        datePublished: "2025-11-08",
        language: "es",
        keywords: [
          "dinero Punta Cana",
          "pesos dominicanos",
          "propinas República Dominicana",
          "cajero Punta Cana",
          "moneda Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-money-pt",
    _type: "blogArticle",
    language: "pt",
    translationGroup: "money-in-punta-cana",
    slug: { _type: "slug", current: "dinheiro-punta-cana-guia" },
    title: "Dinheiro em Punta Cana: USD vs Pesos, Gorjetas e Cartões",
    excerpt:
      "Guia completo para gerenciar dinheiro em Punta Cana — moedas, caixas eletrônicos, gorjetas, golpes a evitar e como orçar sua viagem.",
    publishedAt: "2025-11-08",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: moneyBodyPt,
    seo: {
      metaTitle: "Dinheiro em Punta Cana: USD, Pesos e Gorjetas",
      metaDescription:
        "Guia prático para gerenciar dinheiro em Punta Cana — moedas, caixas eletrônicos, gorjetas, golpes a evitar e como orçar sua viagem.",
      keywords: [
        "dinheiro Punta Cana",
        "pesos dominicanos",
        "gorjetas República Dominicana",
        "caixa eletrônico Punta Cana",
        "moeda Punta Cana",
      ],
      ogTitle: "Dinheiro em Punta Cana: USD, Pesos e Gorjetas",
      ogDescription:
        "Moedas, caixas eletrônicos, gorjetas, golpes e orçamento — guia prático para gastar com confiança em Punta Cana sem pagar a mais.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Dinheiro em Punta Cana: USD vs Pesos, Gorjetas e Cartões",
        description:
          "Guia completo para gerenciar dinheiro em Punta Cana — moedas, caixas eletrônicos, gorjetas, golpes a evitar e como orçar sua viagem.",
        url: "https://puntacana-excursions.com/blog/dinheiro-punta-cana-guia",
        datePublished: "2025-11-08",
        language: "pt",
        keywords: [
          "dinheiro Punta Cana",
          "pesos dominicanos",
          "gorjetas República Dominicana",
          "caixa eletrônico Punta Cana",
          "moeda Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },

  // Set 2 — Airport Survival Guide
  {
    _id: "blog-article-airport-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "punta-cana-airport-guide",
    slug: { _type: "slug", current: "punta-cana-airport-survival-guide" },
    title: "Punta Cana Airport Survival Guide: Arrival, Departure, and What to Expect",
    excerpt:
      "Everything you need to know about Punta Cana Airport (PUJ) — arrival process, immigration, transfers to hotels, departure tips, and how to avoid the long lines.",
    publishedAt: "2025-12-03",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: airportBodyEn,
    seo: {
      metaTitle: "Punta Cana Airport (PUJ) Survival Guide 2025",
      metaDescription:
        "Everything you need to know about Punta Cana Airport — arrival, immigration, hotel transfers, departure tips, and how to avoid long lines.",
      keywords: [
        "Punta Cana airport",
        "PUJ airport",
        "Punta Cana arrival",
        "airport transfer Punta Cana",
        "PUJ immigration",
        "Punta Cana departure",
      ],
      ogTitle: "Punta Cana Airport (PUJ) Survival Guide 2025",
      ogDescription:
        "Arrival, immigration, transfers, customs, and departure tips for Punta Cana Airport — what to expect and how to move through it efficiently.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline:
          "Punta Cana Airport Survival Guide: Arrival, Departure, and What to Expect",
        description:
          "Everything you need to know about Punta Cana Airport (PUJ) — arrival process, immigration, transfers to hotels, departure tips, and how to avoid the long lines.",
        url: "https://puntacana-excursions.com/blog/punta-cana-airport-survival-guide",
        datePublished: "2025-12-03",
        language: "en",
        keywords: [
          "Punta Cana airport",
          "PUJ airport",
          "Punta Cana arrival",
          "airport transfer Punta Cana",
          "PUJ immigration",
          "Punta Cana departure",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-airport-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "punta-cana-airport-guide",
    slug: { _type: "slug", current: "aeropuerto-punta-cana-guia-supervivencia" },
    title: "Guía de Supervivencia del Aeropuerto de Punta Cana",
    excerpt:
      "Todo lo que necesitas saber sobre el Aeropuerto de Punta Cana (PUJ) — proceso de llegada, inmigración, traslados a hoteles, consejos de salida y cómo evitar las largas filas.",
    publishedAt: "2025-12-03",
    readingTime: 16,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: airportBodyEs,
    seo: {
      metaTitle: "Guía del Aeropuerto de Punta Cana (PUJ) 2025",
      metaDescription:
        "Todo lo que necesitas saber sobre el Aeropuerto de Punta Cana — llegada, inmigración, traslados, consejos de salida y cómo evitar filas.",
      keywords: [
        "aeropuerto Punta Cana",
        "PUJ",
        "llegada Punta Cana",
        "transfer aeropuerto Punta Cana",
        "inmigración PUJ",
        "salida Punta Cana",
      ],
      ogTitle: "Guía del Aeropuerto de Punta Cana (PUJ) 2025",
      ogDescription:
        "Llegada, inmigración, traslados, aduanas y consejos de salida en el Aeropuerto de Punta Cana — qué esperar y cómo moverte eficientemente.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Guía de Supervivencia del Aeropuerto de Punta Cana",
        description:
          "Todo lo que necesitas saber sobre el Aeropuerto de Punta Cana (PUJ) — proceso de llegada, inmigración, traslados a hoteles, consejos de salida y cómo evitar las largas filas.",
        url: "https://puntacana-excursions.com/blog/aeropuerto-punta-cana-guia-supervivencia",
        datePublished: "2025-12-03",
        language: "es",
        keywords: [
          "aeropuerto Punta Cana",
          "PUJ",
          "llegada Punta Cana",
          "transfer aeropuerto Punta Cana",
          "inmigración PUJ",
          "salida Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-airport-fr",
    _type: "blogArticle",
    language: "fr",
    translationGroup: "punta-cana-airport-guide",
    slug: { _type: "slug", current: "aeroport-punta-cana-guide-survie" },
    title: "Guide de Survie de l'Aéroport de Punta Cana",
    excerpt:
      "Tout ce que vous devez savoir sur l'Aéroport de Punta Cana (PUJ) — processus d'arrivée, immigration, transferts vers les hôtels, conseils de départ et comment éviter les longues files.",
    publishedAt: "2025-12-03",
    readingTime: 16,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: airportBodyFr,
    seo: {
      metaTitle: "Guide de Survie de l'Aéroport de Punta Cana 2025",
      metaDescription:
        "Tout sur l'Aéroport de Punta Cana — arrivée, immigration, transferts, conseils de départ et comment éviter les longues files d'attente.",
      keywords: [
        "aéroport Punta Cana",
        "PUJ",
        "arrivée Punta Cana",
        "transfert aéroport Punta Cana",
        "immigration PUJ",
        "départ Punta Cana",
      ],
      ogTitle: "Guide de Survie de l'Aéroport de Punta Cana 2025",
      ogDescription:
        "Arrivée, immigration, transferts, douanes et conseils de départ à l'aéroport de Punta Cana — à quoi s'attendre et comment le traverser efficacement.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Guide de Survie de l'Aéroport de Punta Cana",
        description:
          "Tout ce que vous devez savoir sur l'Aéroport de Punta Cana (PUJ) — processus d'arrivée, immigration, transferts vers les hôtels, conseils de départ et comment éviter les longues files.",
        url: "https://puntacana-excursions.com/blog/aeroport-punta-cana-guide-survie",
        datePublished: "2025-12-03",
        language: "fr",
        keywords: [
          "aéroport Punta Cana",
          "PUJ",
          "arrivée Punta Cana",
          "transfert aéroport Punta Cana",
          "immigration PUJ",
          "départ Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },

  // Set 3 — Staying Safe in Punta Cana
  {
    _id: "blog-article-safety-en",
    _type: "blogArticle",
    language: "en",
    translationGroup: "staying-safe-punta-cana",
    slug: { _type: "slug", current: "staying-safe-punta-cana-guide" },
    title: "Staying Safe in Punta Cana: A Realistic Guide",
    excerpt:
      "Real risks vs perceived risks in Punta Cana — beach safety, transportation, health, petty crime prevention, and the simple habits that keep your trip uneventful.",
    publishedAt: "2026-01-14",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: safetyBodyEn,
    seo: {
      metaTitle: "Staying Safe in Punta Cana: A Realistic Guide",
      metaDescription:
        "Real vs perceived risks in Punta Cana — beach safety, transportation, health, theft prevention, and habits that keep your trip uneventful.",
      keywords: [
        "Punta Cana safety",
        "is Punta Cana safe",
        "Dominican Republic safety",
        "Punta Cana beach safety",
        "Punta Cana travel safety",
        "tourist safety Dominican Republic",
      ],
      ogTitle: "Staying Safe in Punta Cana: A Realistic Guide",
      ogDescription:
        "Beach, transportation, health, and petty crime — a practical, honest look at staying safe in Punta Cana without the exaggerated fears.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Staying Safe in Punta Cana: A Realistic Guide",
        description:
          "Real risks vs perceived risks in Punta Cana — beach safety, transportation, health, petty crime prevention, and the simple habits that keep your trip uneventful.",
        url: "https://puntacana-excursions.com/blog/staying-safe-punta-cana-guide",
        datePublished: "2026-01-14",
        language: "en",
        keywords: [
          "Punta Cana safety",
          "is Punta Cana safe",
          "Dominican Republic safety",
          "Punta Cana beach safety",
          "Punta Cana travel safety",
          "tourist safety Dominican Republic",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-safety-es",
    _type: "blogArticle",
    language: "es",
    translationGroup: "staying-safe-punta-cana",
    slug: { _type: "slug", current: "seguridad-punta-cana-guia-realista" },
    title: "Seguridad en Punta Cana: Una Guía Realista",
    excerpt:
      "Riesgos reales vs percibidos en Punta Cana — seguridad en la playa, transporte, salud, prevención de pequeños delitos y los hábitos simples que mantienen tu viaje sin incidentes.",
    publishedAt: "2026-01-14",
    readingTime: 15,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: safetyBodyEs,
    seo: {
      metaTitle: "Seguridad en Punta Cana: Una Guía Realista",
      metaDescription:
        "Riesgos reales vs percibidos en Punta Cana — playa, transporte, salud, prevención de robos y hábitos que mantienen tu viaje sin incidentes.",
      keywords: [
        "seguridad Punta Cana",
        "Punta Cana es seguro",
        "seguridad República Dominicana",
        "seguridad playa Punta Cana",
        "seguridad turistas Punta Cana",
      ],
      ogTitle: "Seguridad en Punta Cana: Una Guía Realista",
      ogDescription:
        "Playa, transporte, salud y delitos menores — una mirada práctica y honesta a la seguridad en Punta Cana sin temores exagerados.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Seguridad en Punta Cana: Una Guía Realista",
        description:
          "Riesgos reales vs percibidos en Punta Cana — seguridad en la playa, transporte, salud, prevención de pequeños delitos y los hábitos simples que mantienen tu viaje sin incidentes.",
        url: "https://puntacana-excursions.com/blog/seguridad-punta-cana-guia-realista",
        datePublished: "2026-01-14",
        language: "es",
        keywords: [
          "seguridad Punta Cana",
          "Punta Cana es seguro",
          "seguridad República Dominicana",
          "seguridad playa Punta Cana",
          "seguridad turistas Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
  },
  {
    _id: "blog-article-safety-de",
    _type: "blogArticle",
    language: "de",
    translationGroup: "staying-safe-punta-cana",
    slug: { _type: "slug", current: "sicherheit-punta-cana-realistischer-leitfaden" },
    title: "Sicherheit in Punta Cana: Ein Realistischer Leitfaden",
    excerpt:
      "Tatsächliche vs wahrgenommene Risiken in Punta Cana — Strandsicherheit, Transport, Gesundheit, Diebstahlprävention und einfache Gewohnheiten, die Ihre Reise ereignislos halten.",
    publishedAt: "2026-01-14",
    readingTime: 13,
    category: { _type: "reference", _ref: "blog-category-travel-tips" },
    body: safetyBodyDe,
    seo: {
      metaTitle: "Sicherheit in Punta Cana: Ein Realistischer Leitfaden",
      metaDescription:
        "Tatsächliche vs wahrgenommene Risiken in Punta Cana — Strand, Transport, Gesundheit, Diebstahlprävention und Gewohnheiten für eine sichere Reise.",
      keywords: [
        "Sicherheit Punta Cana",
        "ist Punta Cana sicher",
        "Sicherheit Dominikanische Republik",
        "Strandsicherheit Punta Cana",
        "Reisesicherheit Punta Cana",
      ],
      ogTitle: "Sicherheit in Punta Cana: Ein Realistischer Leitfaden",
      ogDescription:
        "Strand, Transport, Gesundheit und Kleinkriminalität — ein praktischer, ehrlicher Blick auf die Sicherheit in Punta Cana ohne übertriebene Ängste.",
      twitterCard: "summary_large_image",
      structuredData: articleJsonLd({
        headline: "Sicherheit in Punta Cana: Ein Realistischer Leitfaden",
        description:
          "Tatsächliche vs wahrgenommene Risiken in Punta Cana — Strandsicherheit, Transport, Gesundheit, Diebstahlprävention und einfache Gewohnheiten, die Ihre Reise ereignislos halten.",
        url: "https://puntacana-excursions.com/blog/sicherheit-punta-cana-realistischer-leitfaden",
        datePublished: "2026-01-14",
        language: "de",
        keywords: [
          "Sicherheit Punta Cana",
          "ist Punta Cana sicher",
          "Sicherheit Dominikanische Republik",
          "Strandsicherheit Punta Cana",
          "Reisesicherheit Punta Cana",
        ],
      }),
      noIndex: false,
      noFollow: false,
    },
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
