export const siteConfig = {
  name: "Victoria Mincheva",
  title: "Victoria Mincheva | Beauty guides and favourites",
  description:
    "Victoria Mincheva's full glam PDF and video guide, plus a curated shelf of the beauty products she uses and recommends.",
  instagram: "https://www.instagram.com/victoriyam_/",
  tiktok: "https://www.tiktok.com/@victoriyaam",
};

export const guide = {
  slug: "victoria-full-glam-guide",
  name: "Full Glam Guide",
  price: "$4.99",
  priceCents: 499,
  currency: "usd",
  image: "/images/victoria-guide.webp",
};

export function getSiteUrl() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}
