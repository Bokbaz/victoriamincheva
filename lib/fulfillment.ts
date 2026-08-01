import "server-only";

import type Stripe from "stripe";

import { guide } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function fulfillCheckout(session: Stripe.Checkout.Session) {
  if (
    session.payment_status !== "paid" ||
    session.metadata?.product_slug !== guide.slug
  ) {
    return { fulfilled: false as const, reason: "unpaid" as const };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const supabase = getSupabaseAdmin();
  const { data: existingOrder, error: lookupError } = await supabase
    .from("orders")
    .select("payment_status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Could not check the order: ${lookupError.message}`);
  }

  if (
    existingOrder?.payment_status === "refunded" ||
    existingOrder?.payment_status === "disputed"
  ) {
    return { fulfilled: false as const, reason: existingOrder.payment_status };
  }

  const { error } = await supabase.from("orders").upsert(
    {
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_id: customerId,
      customer_email: session.customer_details?.email ?? session.customer_email,
      product_slug: guide.slug,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      fulfilled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  if (error) {
    throw new Error(`Could not record the paid order: ${error.message}`);
  }

  return { fulfilled: true as const, reason: null };
}
