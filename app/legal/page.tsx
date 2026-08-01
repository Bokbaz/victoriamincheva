import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Privacy, terms and disclosures",
  description:
    "Privacy information, purchase terms, refund policy, and affiliate disclosure for Victoria Mincheva's website.",
};

export default function LegalPage() {
  return (
    <>
      <header className={styles.header}>
        <Link href="/">Victoria Mincheva</Link>
      </header>
      <main className={styles.main} id="main-content">
        <div className={styles.intro}>
          <p>Last updated 2 August 2026</p>
          <h1>Privacy, terms & disclosures</h1>
          <p>
            Plain-language information about purchases, downloads, affiliate links,
            and the limited data this website processes.
          </p>
        </div>

        <nav aria-label="Legal sections" className={styles.sectionNav}>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Purchase terms</a>
          <a href="#refunds">Refunds</a>
          <a href="#affiliate">Affiliate disclosure</a>
        </nav>

        <article className={styles.article}>
          <section id="privacy">
            <p className={styles.eyebrow}>01</p>
            <h2>Privacy</h2>
            <p>
              This website does not currently create user accounts or run advertising
              trackers. When you buy the Full Glam Guide, Stripe processes your payment
              details. Victoria does not receive or store your full card number.
            </p>
            <p>
              The order record stored in Supabase may include your checkout email,
              payment status, purchase amount, Stripe transaction references, and the
              time the guide was downloaded. This information is used to fulfill your
              order, provide purchase support, prevent abuse, and maintain necessary
              financial records.
            </p>
            <p>
              Vercel, Stripe, Supabase, Amazon, Instagram, and TikTok may process basic
              device, request, or account information under their own privacy terms when
              you use their services or follow an external link.
            </p>
            <p>
              To ask about an order or your stored purchase information, contact Victoria
              through Instagram at{" "}
              <a href={siteConfig.instagram} rel="noopener noreferrer" target="_blank">
                @victoriyam_
              </a>
              . Never send payment-card details in a direct message.
            </p>
          </section>

          <section id="terms">
            <p className={styles.eyebrow}>02</p>
            <h2>Purchase terms</h2>
            <p>
              The Full Glam Guide is a personal-use digital PDF. Your purchase gives you
              a non-transferable right to download and use one copy for yourself. You may
              not resell, repost, distribute, reproduce, or share the guide or its private
              download link.
            </p>
            <p>
              The guide provides Victoria&apos;s personal beauty routine and experience. It
              is educational content, not medical or dermatological advice. Product
              suitability varies, so review ingredients and patch-test where appropriate.
            </p>
            <p>
              Prices are shown before checkout. Stripe presents the final payment details
              for your review before you pay. Access is delivered after Stripe confirms a
              successful payment.
            </p>
          </section>

          <section id="refunds">
            <p className={styles.eyebrow}>03</p>
            <h2>Digital-download refunds</h2>
            <p>
              Because the guide is delivered immediately as a digital download, purchases
              are normally final once access has been provided. This does not limit any
              consumer rights that cannot legally be excluded.
            </p>
            <p>
              If you were charged twice, received the wrong item, or cannot access the
              file after following the download instructions, message Victoria on
              Instagram with the email used at checkout. Do not include card details.
            </p>
          </section>

          <section id="affiliate">
            <p className={styles.eyebrow}>04</p>
            <h2>Affiliate disclosure</h2>
            <p>As an Amazon Associate I earn from qualifying purchases.</p>
            <p>
              Affiliate links take you to Amazon. Victoria may receive a commission if you
              make a qualifying purchase, at no additional cost to you. Amazon controls
              listing information, availability, shipping, returns, and final prices.
              Product inclusion reflects Victoria&apos;s recommendation and is not an Amazon
              endorsement of Victoria or this website.
            </p>
          </section>
        </article>

        <Link className={styles.backLink} href="/">
          Return to the storefront
        </Link>
      </main>
    </>
  );
}
