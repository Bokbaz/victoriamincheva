import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CreditCard,
  Download,
  ShieldCheck,
} from "lucide-react";

import { CheckoutNotice } from "@/components/checkout-notice";
import { GuidePurchaseButton } from "@/components/guide-purchase-button";
import { ProductCatalogue } from "@/components/product-catalogue";
import { Reveal } from "@/components/reveal";
import { StickyGuideBar } from "@/components/sticky-guide-bar";
import { getSiteUrl, guide, siteConfig } from "@/lib/site";

import styles from "./home.module.css";

const benefits = [
  "A step-by-step PDF and follow-along video guide",
  "My complete routine, in the order I do it",
  "Product placement and application notes",
  "The little fixes that keep everything polished",
];

type HomeProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { checkout } = await searchParams;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: guide.name,
    image: `${getSiteUrl()}${guide.image}`,
    description:
      "Victoria Mincheva's step-by-step PDF and video guide to the full glam look she wears most days.",
    brand: { "@type": "Person", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <CheckoutNotice initiallyVisible={checkout === "cancelled"} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link aria-label="Victoria Mincheva home" className={styles.wordmark} href="/">
            Victoria Mincheva
          </Link>
          <nav aria-label="Social profiles" className={styles.socialNav}>
            <a href={siteConfig.instagram} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
            <a href={siteConfig.tiktok} rel="noopener noreferrer" target="_blank">
              TikTok
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} id="guide">
          <div aria-hidden="true" className={styles.heroOrb} />
          <div className={styles.heroInner}>
            <Reveal className={styles.heroIntro}>
              <p className={styles.eyebrow}>Victoria&apos;s everyday full glam</p>
              <h1>The full glam I actually wear.</h1>
              <p className={styles.heroLead}>
                My exact routine, without the gatekeeping. Learn the order, placement,
                and small details that make the whole look come together with the PDF
                and included follow-along video guide.
              </p>
            </Reveal>

            <Reveal className={styles.guideFeature} delay={90}>
              <div className={styles.guideVisual}>
                <div className={styles.guideShadow} aria-hidden="true" />
                <div className={styles.guideCover}>
                  <Image
                    alt="Victoria wearing the full glam look taught in the guide"
                    fill
                    priority
                    sizes="(max-width: 639px) 42vw, 330px"
                    src={guide.image}
                  />
                  <span className={styles.guideCoverTop}>Victoria Mincheva</span>
                  <span className={styles.guideCoverTitle}>Full Glam Guide</span>
                </div>
              </div>

              <div className={styles.guideCopy}>
                <p className={styles.featuredLabel}>The signature guide</p>
                <h2>Full Glam Guide</h2>
                <p className={styles.price}>{guide.price}</p>
                <p className={styles.oneTime}>One-time payment</p>
                <ul>
                  {benefits.map((benefit) => (
                    <li key={benefit}>
                      <Check aria-hidden="true" size={16} strokeWidth={2} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <GuidePurchaseButton
                className={styles.primaryPurchase}
                id="guide-primary-cta"
              />
              <p className={styles.purchaseReassurance}>
                Secure checkout through Stripe. Get the PDF and video guide immediately
                after payment.
              </p>
            </Reveal>

            <Reveal className={styles.trustRow} delay={140}>
              <div>
                <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>Secure checkout</span>
              </div>
              <div>
                <Download aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>PDF + video guide</span>
              </div>
              <div>
                <CreditCard aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>Pay once</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="products-title" className={styles.productsSection} id="products">
          <div className={styles.sectionInner}>
            <Reveal className={styles.productsHeading}>
              <div>
                <p className={styles.eyebrow}>Curated, used, loved</p>
                <h2 id="products-title">My beauty shelf</h2>
              </div>
              <p>
                The products I use and genuinely recommend, organized so you can find
                what you need without the endless scroll.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ProductCatalogue />
            </Reveal>
            <p className={styles.affiliateDisclosure}>
              As an Amazon Associate I earn from qualifying purchases. Product prices
              and availability are set by Amazon and may change after you leave this site.
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer} id="footer">
        <div className={styles.footerInner}>
          <Link className={styles.footerWordmark} href="/">
            Victoria Mincheva
          </Link>
          <div className={styles.footerLinks}>
            <a href={siteConfig.instagram} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
            <a href={siteConfig.tiktok} rel="noopener noreferrer" target="_blank">
              TikTok
            </a>
            <Link href="/legal#privacy">Privacy</Link>
            <Link href="/legal#terms">Terms</Link>
            <Link href="/legal#refunds">Refunds</Link>
          </div>
          <p>© {new Date().getFullYear()} Victoria Mincheva</p>
        </div>
      </footer>

      <StickyGuideBar />
    </>
  );
}
