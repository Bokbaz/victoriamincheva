import { NextResponse } from "next/server";

import { fulfillCheckout } from "@/lib/fulfillment";
import { guide } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "A valid purchase session is required." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" ||
      session.metadata?.product_slug !== guide.slug
    ) {
      return NextResponse.json(
        { error: "Payment has not been confirmed for this guide." },
        { status: 403 },
      );
    }

    const fulfillment = await fulfillCheckout(session);

    if (!fulfillment.fulfilled) {
      return NextResponse.json(
        { error: "This order is not eligible for download." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "guides";
    const guidePath =
      process.env.SUPABASE_GUIDE_PATH ?? "victoria-full-glam-guide.pdf";
    const configuredTtl = Number(process.env.SUPABASE_DOWNLOAD_TTL_SECONDS ?? 600);
    const ttl = Number.isFinite(configuredTtl)
      ? Math.min(Math.max(configuredTtl, 60), 3600)
      : 600;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(guidePath, ttl, {
        download: "Victoria-Mincheva-Full-Glam-Guide.pdf",
      });

    if (error || !data.signedUrl) {
      throw new Error(error?.message ?? "Supabase did not return a signed URL.");
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ downloaded_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("stripe_session_id", session.id);

    if (updateError) {
      console.error("Could not record guide download", updateError);
    }

    const response = NextResponse.redirect(data.signedUrl, 303);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Guide download authorization failed", error);
    return NextResponse.json(
      { error: "We could not prepare your download. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
