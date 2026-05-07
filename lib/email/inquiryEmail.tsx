import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const BRAND = {
  ocean: "#005F86",
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
  fontSize: "20px",
  fontWeight: "700",
  margin: "0 0 8px",
};
const subtle = {
  color: BRAND.slate,
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
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
const messageStyle = {
  color: BRAND.navy,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 14px",
  whiteSpace: "pre-wrap" as const,
};
const hr = { borderColor: "#E5E7EB", margin: "20px 0" };

export interface InquiryEmailData {
  excursionTitle: string;
  locale: "en" | "es";
  name: string;
  email: string;
  phone?: string;
  hotel?: string;
  message?: string;
}

export function OperatorInquiryEmail(data: InquiryEmailData) {
  return (
    <Html>
      <Head />
      <Preview>
        New inquiry — {data.excursionTitle} — {data.name}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={h1}>New excursion inquiry</Heading>
            <Text style={subtle}>
              {data.name} sent a question about &ldquo;{data.excursionTitle}
              &rdquo;
              {data.locale === "es" ? " (es)" : " (en)"}.
            </Text>

            <Hr style={hr} />

            <Text style={labelStyle}>Excursion</Text>
            <Text style={valueStyle}>{data.excursionTitle}</Text>

            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{data.name}</Text>

            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{data.email}</Text>

            {data.phone ? (
              <>
                <Text style={labelStyle}>Phone</Text>
                <Text style={valueStyle}>{data.phone}</Text>
              </>
            ) : null}

            {data.hotel ? (
              <>
                <Text style={labelStyle}>Hotel</Text>
                <Text style={valueStyle}>{data.hotel}</Text>
              </>
            ) : null}

            {data.message ? (
              <>
                <Hr style={hr} />
                <Text style={labelStyle}>Message</Text>
                <Text style={messageStyle}>{data.message}</Text>
              </>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
