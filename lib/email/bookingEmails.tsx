import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const BRAND = {
  ocean: "#005F86",
  teal: "#0EA5B7",
  sunset: "#F4A11A",
  sand: "#F7F7F5",
  navy: "#1F2937",
  slate: "#475569",
};

const main = {
  backgroundColor: BRAND.sand,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};
const container = {
  margin: "0 auto",
  padding: "24px 0 32px",
  width: "100%",
  maxWidth: "560px",
};
const card = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};
const h1 = {
  color: BRAND.ocean,
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 8px",
};
const subtle = {
  color: BRAND.slate,
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};
const body = {
  color: BRAND.navy,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 12px",
};
const labelStyle = {
  color: BRAND.slate,
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  fontWeight: "600",
  margin: "0 0 4px",
};
const valueStyle = {
  color: BRAND.navy,
  fontSize: "15px",
  fontWeight: "500",
  margin: "0 0 14px",
};
const totalStyle = {
  color: BRAND.ocean,
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};
const hr = { borderColor: "#E5E7EB", margin: "20px 0" };

export interface BookingEmailData {
  excursionTitle: string;
  date: string;
  timeSlot?: string;
  adults: number;
  children: number;
  depositPaid: string;
  currency: string;
  remainingBalance?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    hotel: string;
  };
  paypalOrderId: string;
  locale: "en" | "es";
  logoUrl?: string;
  companyName?: string;
}

const logoWrapper = {
  textAlign: "center" as const,
  padding: "0 0 20px",
};

const logoImg = {
  display: "inline-block" as const,
  maxHeight: "96px",
  maxWidth: "280px",
  height: "auto",
  width: "auto",
};

// =============================================================================
// Customer-facing confirmation
// =============================================================================
export function CustomerBookingEmail(data: BookingEmailData) {
  const isEs = data.locale === "es";
  const t = isEs
    ? {
        preview: `Tu reserva está confirmada — ${data.excursionTitle}`,
        title: "¡Tu reserva está confirmada!",
        intro: `Gracias, ${data.customer.name}. Recibimos tu depósito y tu lugar está reservado.`,
        bookingDetails: "Detalles de la reserva",
        excursion: "Excursión",
        date: "Fecha",
        time: "Hora",
        guests: "Huéspedes",
        adults: "adultos",
        children: "niños",
        pickup: "Hotel de recogida",
        deposit: "Depósito pagado",
        balance: "Saldo restante (a pagar el día de la excursión)",
        ref: "Referencia de PayPal",
        whatsNext: "Qué sigue",
        nextLine:
          "Te contactaremos por WhatsApp con la hora exacta de recogida 24 horas antes. Si no recibes nuestro mensaje, contáctanos al teléfono de la confirmación.",
        thanks: "¡Gracias por reservar con nosotros!",
        signature: "El equipo de Punta Cana Excursions",
      }
    : {
        preview: `Your booking is confirmed — ${data.excursionTitle}`,
        title: "Your booking is confirmed!",
        intro: `Thanks, ${data.customer.name}. We received your deposit and your spot is reserved.`,
        bookingDetails: "Booking details",
        excursion: "Excursion",
        date: "Date",
        time: "Time",
        guests: "Guests",
        adults: "adults",
        children: "children",
        pickup: "Pickup hotel",
        deposit: "Deposit paid",
        balance: "Remaining balance (due on excursion day)",
        ref: "PayPal reference",
        whatsNext: "What's next",
        nextLine:
          "We'll WhatsApp you with the exact pickup time 24 hours before your excursion. If you don't hear from us, please reach out using the number on this confirmation.",
        thanks: "Thanks for booking with us!",
        signature: "The Punta Cana Excursions team",
      };

  const guestSummary = `${data.adults} ${t.adults}${
    data.children > 0 ? ` · ${data.children} ${t.children}` : ""
  }`;

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            {data.logoUrl ? (
              <Section style={logoWrapper}>
                <Img
                  src={data.logoUrl}
                  alt={data.companyName ?? "Logo"}
                  style={logoImg}
                />
              </Section>
            ) : null}
            <Heading style={h1}>{t.title}</Heading>
            <Text style={subtle}>{t.intro}</Text>

            <Hr style={hr} />

            <Heading style={{ ...h1, fontSize: "16px" }}>{t.bookingDetails}</Heading>

            <Text style={labelStyle}>{t.excursion}</Text>
            <Text style={valueStyle}>{data.excursionTitle}</Text>

            <Text style={labelStyle}>{t.date}</Text>
            <Text style={valueStyle}>{data.date}</Text>

            {data.timeSlot ? (
              <>
                <Text style={labelStyle}>{t.time}</Text>
                <Text style={valueStyle}>{data.timeSlot}</Text>
              </>
            ) : null}

            <Text style={labelStyle}>{t.guests}</Text>
            <Text style={valueStyle}>{guestSummary}</Text>

            <Text style={labelStyle}>{t.pickup}</Text>
            <Text style={valueStyle}>{data.customer.hotel}</Text>

            <Hr style={hr} />

            <Text style={labelStyle}>{t.deposit}</Text>
            <Text style={totalStyle}>
              {data.currency} ${data.depositPaid}
            </Text>

            {data.remainingBalance ? (
              <>
                <Text style={{ ...labelStyle, marginTop: "16px" }}>{t.balance}</Text>
                <Text style={valueStyle}>
                  {data.currency} ${data.remainingBalance}
                </Text>
              </>
            ) : null}

            <Text style={{ ...subtle, marginTop: "8px" }}>
              {t.ref}: {data.paypalOrderId}
            </Text>

            <Hr style={hr} />

            <Heading style={{ ...h1, fontSize: "16px" }}>{t.whatsNext}</Heading>
            <Text style={body}>{t.nextLine}</Text>

            <Text style={{ ...body, marginTop: "20px" }}>{t.thanks}</Text>
            <Text style={subtle}>{t.signature}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// =============================================================================
// Operator-facing notification
// =============================================================================
export function OperatorBookingEmail(data: BookingEmailData) {
  const guestSummary = `${data.adults} adults${
    data.children > 0 ? ` + ${data.children} children` : ""
  }`;

  return (
    <Html>
      <Head />
      <Preview>
        New booking — {data.excursionTitle} — {data.date}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={h1}>New booking received</Heading>
            <Text style={subtle}>
              Deposit captured via PayPal. Customer has been emailed a confirmation.
            </Text>

            <Hr style={hr} />

            <Text style={labelStyle}>Excursion</Text>
            <Text style={valueStyle}>{data.excursionTitle}</Text>

            <Text style={labelStyle}>Date</Text>
            <Text style={valueStyle}>{data.date}</Text>

            {data.timeSlot ? (
              <>
                <Text style={labelStyle}>Time slot</Text>
                <Text style={valueStyle}>{data.timeSlot}</Text>
              </>
            ) : null}

            <Text style={labelStyle}>Guests</Text>
            <Text style={valueStyle}>{guestSummary}</Text>

            <Text style={labelStyle}>Deposit paid</Text>
            <Text style={totalStyle}>
              {data.currency} ${data.depositPaid}
            </Text>

            {data.remainingBalance ? (
              <>
                <Text style={{ ...labelStyle, marginTop: "16px" }}>
                  Balance due on day-of
                </Text>
                <Text style={valueStyle}>
                  {data.currency} ${data.remainingBalance}
                </Text>
              </>
            ) : null}

            <Hr style={hr} />

            <Heading style={{ ...h1, fontSize: "16px" }}>Customer</Heading>

            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{data.customer.name}</Text>

            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{data.customer.email}</Text>

            <Text style={labelStyle}>Phone</Text>
            <Text style={valueStyle}>{data.customer.phone}</Text>

            <Text style={labelStyle}>Hotel</Text>
            <Text style={valueStyle}>{data.customer.hotel}</Text>

            <Hr style={hr} />

            <Text style={subtle}>PayPal order ID: {data.paypalOrderId}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
