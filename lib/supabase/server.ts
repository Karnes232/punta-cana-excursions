import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client.
 *
 * Built from the service-role key, so it BYPASSES Row Level Security. Every
 * table in this project has RLS enabled with no public policies — only this
 * client can read/write. NEVER import this module into a Client Component.
 *
 * Created lazily so a missing env var doesn't crash module-load at build time;
 * call sites should treat a null return as "DB not configured" and continue.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error("[supabase] missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Row inserted into `bookings` after a PayPal deposit is captured + verified. */
export interface BookingInsert {
  paypal_order_id: string;
  excursion_id: string;
  excursion_title: string;
  locale: "en" | "es";
  customer_name: string;
  email: string;
  phone: string;
  hotel: string;
  tour_date: string;
  time_slot?: string | null;
  adults: number;
  children: number;
  deposit_paid: number;
  currency: string;
  total_price: number;
  remaining_balance: number;
}

/** Row inserted into `form_submissions` for contact + inquiry messages. */
export interface FormSubmissionInsert {
  type: "contact" | "inquiry";
  locale: "en" | "es";
  name: string;
  email: string;
  phone?: string | null;
  hotel?: string | null;
  excursion?: string | null;
  message?: string | null;
}

/**
 * Best-effort booking upsert. Idempotent on `paypal_order_id` so retries of the
 * same order never create duplicate ledger rows. Never throws — logs and
 * returns on failure so the payment/email flow is never blocked.
 */
export async function recordBooking(booking: BookingInsert): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from("bookings")
      .upsert(booking, { onConflict: "paypal_order_id" });
    if (error) console.error("[supabase] recordBooking error", error);
  } catch (err) {
    console.error("[supabase] recordBooking threw", err);
  }
}

/**
 * Best-effort form-submission insert (contact or inquiry). Never throws — logs
 * and returns on failure so the email flow is never blocked.
 */
export async function recordFormSubmission(submission: FormSubmissionInsert): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  try {
    const { error } = await supabase.from("form_submissions").insert(submission);
    if (error) console.error("[supabase] recordFormSubmission error", error);
  } catch (err) {
    console.error("[supabase] recordFormSubmission threw", err);
  }
}
