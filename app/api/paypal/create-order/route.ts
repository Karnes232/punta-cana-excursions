import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { createPayPalOrder } from "@/lib/paypal";

interface ExcursionPricing {
  title: { en?: string };
  depositAmount: number;
  daysAvailable: string[];
  bookingNoticeHours: number;
}

const PRICING_QUERY = `*[_type == "excursion" && _id == $id][0]{
  title,
  depositAmount,
  daysAvailable,
  bookingNoticeHours
}`;

const DAY_KEY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      excursionId?: string;
      adults?: number;
      children?: number;
      date?: string;
      timeSlot?: string;
    };

    const { excursionId, adults, children, date, timeSlot } = body;

    if (!excursionId || typeof excursionId !== "string") {
      return NextResponse.json({ error: "Missing excursionId" }, { status: 400 });
    }
    if (typeof adults !== "number" || adults < 1) {
      return NextResponse.json({ error: "Invalid adults count" }, { status: 400 });
    }
    if (typeof children !== "number" || children < 0) {
      return NextResponse.json({ error: "Invalid children count" }, { status: 400 });
    }
    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const excursion = await client.fetch<ExcursionPricing | null>(PRICING_QUERY, {
      id: excursionId,
    });
    if (!excursion) {
      return NextResponse.json({ error: "Excursion not found" }, { status: 404 });
    }

    const selectedDate = new Date(`${date}T12:00:00Z`);
    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const allowedDayIndexes = new Set(
      excursion.daysAvailable.map((k) => DAY_KEY_TO_INDEX[k.toLowerCase()]),
    );
    if (!allowedDayIndexes.has(selectedDate.getUTCDay())) {
      return NextResponse.json(
        { error: "Selected date is not available for this excursion" },
        { status: 400 },
      );
    }

    const minBookingTime = Date.now() + excursion.bookingNoticeHours * 60 * 60 * 1000;
    if (selectedDate.getTime() < minBookingTime) {
      return NextResponse.json(
        { error: "Selected date is within the booking notice window" },
        { status: 400 },
      );
    }

    const totalGuests = adults + children;
    const totalDeposit = excursion.depositAmount * totalGuests;
    const amountStr = totalDeposit.toFixed(2);

    const titleEn = excursion.title?.en ?? "Excursion";
    const description = `Deposit — ${titleEn} — ${date}${
      timeSlot ? ` @ ${timeSlot}` : ""
    } — ${totalGuests} guests`;

    const order = await createPayPalOrder({
      amount: amountStr,
      currency: "USD",
      description: description.slice(0, 127),
      customId: `${excursionId}|${adults}|${children}|${date}`,
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("[create-order] error", err);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 },
    );
  }
}
