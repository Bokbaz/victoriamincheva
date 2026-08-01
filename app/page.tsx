import Image from "next/image";
import Link from "next/link";
import {
  BookOpenText,
  Check,
  CreditCard,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CheckoutNotice } from "@/components/checkout-notice";
import { GuidePurchaseButton } from "@/components/guide-purchase-button";
import { ProductCatalogue } from "@/components/product-catalogue";
import { Reveal } from "@/components/reveal";
import { StickyGuideBar } from "@/components/sticky-guide-bar";
import { getSiteUrl, guide, siteConfig } from "@/lib/site";

import styles from "./home.module.css";

const benefits = [
  "My complete routine, in the order I do it",
  "Product placement and application notes",
  "The little fixes that keep everything polished",
  "An easy routine you can repeat at your own pace",
];

const guideChapters = [
  {
    number: "01",
    title: "Prep & base",
    copy: "Build the smooth canvas that makes every next step sit better.",
  },
  {
    number: "02",
    title: "Sculpt & define",
    copy: "Place dimension intentionally, without making the finish feel heavy.",
  },
  {
    number: "03",
    title: "Eyes & finish",
    copy: "Bring the look together and lock in the details that make it pop.",
  },
];

const faqItems = [
  {
    question: "How do I receive the guide?",
    answer:
      "After Stripe confirms your payment, you will land on a private download page. Your PDF link is generated securely and expires after a short time, but you can refresh the success page to generate a new one.",
  },
  {
    question: "Is it beginner-friendly?",
    answer:
      "Yes. The routine is laid out in a practical order so you can work through it at your own pace, even if full glam is new to you.",
  },
  {
    question: "Can I read it on my phone?",
    answer:
      "Yes. The PDF opens on phones, tablets, and computers. You can save it to your device after downloading it.",
  },
  {
    question: "What if my download does not work?",
    answer:
      "Return to the payment success page and tap the download button again. If you still need help, message Victoria on Instagram at @victoriyam_.",
  },
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
      "Victoria Mincheva's step-by-step guide to the full glam look she wears most days.",
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
                and small details that make the whole look come together.
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
                Secure checkout through Stripe. Download immediately after payment.
              </p>
            </Reveal>

            <Reveal className={styles.trustRow} delay={140}>
              <div>
                <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>Secure checkout</span>
              </div>
              <div>
                <Download aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>Instant PDF</span>
              </div>
              <div>
                <CreditCard aria-hidden="true" size={20} strokeWidth={1.6} />
                <span>Pay once</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.insideSection}>
          <div className={styles.sectionInner}>
            <Reveal className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Inside the guide</p>
              <h2>Not more makeup. A better order of operations.</h2>
              <p>
                Keep it beside your mirror and follow a routine that has already been
                worked out for you.
              </p>
            </Reveal>

            <div className={styles.chapterList}>
              {guideChapters.map((chapter, index) => (
                <Reveal className={styles.chapter} delay={index * 70} key={chapter.number}>
                  <span>{chapter.number}</span>
                  <div>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.copy}</p>
                  </div>
                  <BookOpenText aria-hidden="true" size={22} strokeWidth={1.4} />
                </Reveal>
              ))}
            </div>

            <Reveal className={styles.guideQuote}>
              <Sparkles aria-hidden="true" size={23} strokeWidth={1.5} />
              <p>
                “The routine I reach for when I want everything to look polished,
                balanced, and completely put together.”
              </p>
              <span>Victoria</span>
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

        <section className={styles.faqSection}>
          <div className={styles.faqInner}>
            <Reveal className={styles.faqHeading}>
              <p className={styles.eyebrow}>Before you ask</p>
              <h2>The useful details</h2>
            </Reveal>
            <div className={styles.faqList}>
              {faqItems.map((item, index) => (
                <Reveal delay={index * 45} key={item.question}>
                  <details className={styles.faqItem}>
                    <summary>{item.question}</summary>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closingSection}>
          <Reveal className={styles.closingInner}>
            <p className={styles.closingMark}>V</p>
            <div>
              <p className={styles.eyebrow}>From my makeup bag to yours</p>
              <h2>Beauty should feel exciting, not confusing.</h2>
              <p>
                Thank you for being here and supporting what I truly love. I hope the
                guide makes your next full glam feel a little easier.
              </p>
              <span className={styles.signature}>Victoria</span>
            </div>
          </Reveal>
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
