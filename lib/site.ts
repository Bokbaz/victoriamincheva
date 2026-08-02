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

function normalizeSiteUrl(value: string) {
  const trimmedValue = value.trim().replace(/\/+$/, "");

  if (!trimmedValue) {
    return undefined;
  }

  const url = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return undefined;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function getSiteUrl() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  const configuredUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "");

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}
