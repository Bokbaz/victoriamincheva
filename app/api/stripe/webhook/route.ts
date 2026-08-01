import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { fulfillCheckout } from "@/lib/fulfillment";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook verification is not configured." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillCheckout(event.data.object);
    }

    if (event.type === "charge.refunded") {
      const paymentIntent = event.data.object.payment_intent;
      const paymentIntentId =
        typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;

      if (paymentIntentId) {
        const { error } = await getSupabaseAdmin()
          .from("orders")
          .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", paymentIntentId);

        if (error) throw error;
      }
    }

    if (event.type === "charge.dispute.created") {
      const paymentIntent = event.data.object.payment_intent;
      const paymentIntentId =
        typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;

      if (paymentIntentId) {
        const { error } = await getSupabaseAdmin()
          .from("orders")
          .update({ payment_status: "disputed", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", paymentIntentId);

        if (error) throw error;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Stripe webhook processing failed for ${event.id}`, error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
