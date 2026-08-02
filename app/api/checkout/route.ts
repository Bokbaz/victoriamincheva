import { NextResponse } from "next/server";

import { getSiteUrl, guide } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      throw new Error("STRIPE_PRICE_ID is not configured.");
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_creation: "always",
      allow_promotion_codes: true,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled#guide`,
      metadata: {
        product_slug: guide.slug,
        product_name: guide.name,
      },
      payment_intent_data: {
        metadata: {
          product_slug: guide.slug,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json(
      { url: session.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Checkout session creation failed", error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Checkout could not be started."
            : "Checkout could not be started. Please try again in a moment.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
