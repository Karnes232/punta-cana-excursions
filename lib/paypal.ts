const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
const LIVE_BASE = "https://api-m.paypal.com";

export function paypalBaseUrl(): string {
  return process.env.PAYPAL_ENV === "live" ? LIVE_BASE : SANDBOX_BASE;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

export interface PayPalOrderCapture {
  ok: boolean;
  status: string;
  amount: string;
  currency: string;
  payerEmail?: string;
  payerName?: string;
}

export async function createPayPalOrder(opts: {
  amount: string;
  currency: string;
  description: string;
  customId?: string;
}): Promise<{ id: string }> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: opts.currency, value: opts.amount },
          description: opts.description,
          custom_id: opts.customId,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal create order failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { id: string };
  return { id: json.id };
}

export async function capturePayPalOrder(orderID: string): Promise<PayPalOrderCapture> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      status: `HTTP_${res.status}`,
      amount: "0",
      currency: "USD",
    };
  }

  const json = (await res.json()) as {
    status: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          amount?: { value: string; currency_code: string };
          status?: string;
        }>;
      };
    }>;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
  };

  const capture = json.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    ok: json.status === "COMPLETED" && capture?.status === "COMPLETED",
    status: json.status,
    amount: capture?.amount?.value ?? "0",
    currency: capture?.amount?.currency_code ?? "USD",
    payerEmail: json.payer?.email_address,
    payerName: [json.payer?.name?.given_name, json.payer?.name?.surname]
      .filter(Boolean)
      .join(" ") || undefined,
  };
}

export async function getPayPalOrder(orderID: string): Promise<{
  ok: boolean;
  status: string;
  amount: string;
  currency: string;
}> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return { ok: false, status: `HTTP_${res.status}`, amount: "0", currency: "USD" };
  }
  const json = (await res.json()) as {
    status: string;
    purchase_units?: Array<{
      amount?: { value: string; currency_code: string };
      payments?: {
        captures?: Array<{ amount?: { value: string; currency_code: string }; status?: string }>;
      };
    }>;
  };
  const unit = json.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  return {
    ok:
      json.status === "COMPLETED" &&
      (capture?.status === "COMPLETED" || capture?.status === undefined),
    status: json.status,
    amount: capture?.amount?.value ?? unit?.amount?.value ?? "0",
    currency:
      capture?.amount?.currency_code ?? unit?.amount?.currency_code ?? "USD",
  };
}
