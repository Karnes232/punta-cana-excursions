import { NextResponse } from "next/server";
import { Resend } from "resend";
import { OperatorContactEmail } from "@/lib/email/contactEmail";

interface ContactPayload {
  locale: "en" | "es";
  name: string;
  email: string;
  phone?: string;
  hotel?: string;
  excursion?: string;
  message: string;
}

function isValid(payload: unknown): payload is ContactPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Partial<ContactPayload>;
  return (
    (p.locale === "en" || p.locale === "es") &&
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    typeof p.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) &&
    typeof p.message === "string" &&
    p.message.trim().length > 0
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const operatorEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!resendKey || !fromEmail || !operatorEmail) {
    console.error("[contact] missing Resend config");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(resendKey);

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: operatorEmail,
      subject: `Contact form — ${payload.name}`,
      react: OperatorContactEmail(payload),
      replyTo: payload.email,
    });

    if (result.error) {
      console.error("[contact] resend error", result.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send error", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 502 },
    );
  }
}
