import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Download, MessageCircle } from "lucide-react";

import { fulfillCheckout } from "@/lib/fulfillment";
import { guide, siteConfig } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

import styles from "./success.module.css";

export const metadata: Metadata = {
  title: "Your guide is ready",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let purchaseConfirmed = false;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const result = await fulfillCheckout(session);
      purchaseConfirmed = result.fulfilled;
    } catch (error) {
      console.error("Success page payment verification failed", error);
    }
  }

  return (
    <main className={styles.page} id="main-content">
      <Link className={styles.wordmark} href="/">
        Victoria Mincheva
      </Link>

      <section className={styles.panel}>
        {purchaseConfirmed && sessionId ? (
          <>
            <div className={styles.statusIcon}>
              <Check aria-hidden="true" size={24} strokeWidth={2} />
            </div>
            <p className={styles.eyebrow}>Payment confirmed</p>
            <h1>Your full glam starts here.</h1>
            <p className={styles.lead}>
              Thank you for your purchase. Your private PDF download is ready.
            </p>

            <div className={styles.guideRow}>
              <Image
                alt="Victoria's Full Glam Guide cover"
                className={styles.guideImage}
                height={140}
                src={guide.image}
                width={110}
              />
              <div>
                <strong>{guide.name}</strong>
                <span>PDF digital guide</span>
                <span>{guide.price}</span>
              </div>
            </div>

            <a
              className={styles.downloadButton}
              href={`/api/download?session_id=${encodeURIComponent(sessionId)}`}
            >
              <Download aria-hidden="true" size={18} />
              Download your PDF
            </a>
            <p className={styles.helpText}>
              The download link is short-lived for security. If it expires, refresh this
              page and tap the button again.
            </p>
          </>
        ) : (
          <>
            <p className={styles.eyebrow}>We are checking your payment</p>
            <h1>Your guide is almost ready.</h1>
            <p className={styles.lead}>
              We could not confirm this purchase yet. If Stripe has charged you, wait a
              moment and refresh this page.
            </p>
            <a
              className={styles.supportLink}
              href={siteConfig.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              Message @victoriyam_ for help
            </a>
          </>
        )}

        <Link className={styles.homeLink} href="/">
          Return to Victoria&apos;s beauty shelf
        </Link>
      </section>
    </main>
  );
}
