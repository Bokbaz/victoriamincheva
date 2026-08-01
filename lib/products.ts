export const productCategories = ["All", "Face", "Eyes", "Brows", "Lips"] as const;

export type ProductCategory = (typeof productCategories)[number];

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: Exclude<ProductCategory, "All">;
  image: string;
  affiliateUrl: string;
  alternateAffiliateUrl?: string;
};

export const products: Product[] = [
  {
    id: "profusion-classics-palette",
    brand: "Profusion Cosmetics",
    name: "Mini Artistry Palette, Classics",
    category: "Eyes",
    image: "/products/profusion-classics.webp",
    affiliateUrl: "https://amzn.to/4wyKrlQ",
  },
  {
    id: "catrice-plumping-lip-liner",
    brand: "Catrice",
    name: "Plumping Lip Liner, 040",
    category: "Lips",
    image: "/products/catrice-lip-liner.webp",
    affiliateUrl: "https://amzn.to/4wGTku0",
  },
  {
    id: "essence-liquid-ink-eyeliner",
    brand: "Essence",
    name: "Liquid Ink Eyeliner",
    category: "Eyes",
    image: "/products/essence-eyeliner.webp",
    affiliateUrl: "https://amzn.to/4g5tkT0",
  },
  {
    id: "revolution-smokey-icon-palette",
    brand: "Revolution Beauty",
    name: "Smokey Icon Palette",
    category: "Eyes",
    image: "/products/revolution-smokey.webp",
    affiliateUrl: "https://amzn.to/4yTqoQO",
    alternateAffiliateUrl: "https://amzn.to/44Xj7lk",
  },
  {
    id: "essence-eyebrow-designer",
    brand: "Essence",
    name: "Eyebrow Designer, Dark Chocolate Brown",
    category: "Brows",
    image: "/products/essence-brow-pencil.webp",
    affiliateUrl: "https://amzn.to/3ROFkiv",
  },
  {
    id: "essence-fix-it-like-a-pro",
    brand: "Essence",
    name: "Fix It Like a Pro Brow Gel",
    category: "Brows",
    image: "/products/essence-brow-gel.webp",
    affiliateUrl: "https://amzn.to/4fHjSUp",
  },
  {
    id: "fenty-diamond-bomb",
    brand: "Fenty Beauty",
    name: "Diamond Bomb, How Many Carats?!",
    category: "Face",
    image: "/products/fenty-diamond-bomb.webp",
    affiliateUrl: "https://amzn.to/3RNhjYZ",
  },
  {
    id: "maybelline-lasting-fix",
    brand: "Maybelline",
    name: "Lasting Fix Setting Spray, Pack of 6",
    category: "Face",
    image: "/products/maybelline-setting-spray.webp",
    affiliateUrl: "https://amzn.to/4yRDLB3",
  },
  {
    id: "revolution-loose-baking-powder",
    brand: "Revolution Beauty",
    name: "Loose Baking Powder, Translucent",
    category: "Face",
    image: "/products/revolution-powder.webp",
    affiliateUrl: "https://amzn.to/3RERydx",
  },
  {
    id: "golden-rose-contour-kit",
    brand: "Golden Rose",
    name: "Trio Powder Contour Kit",
    category: "Face",
    image: "/products/golden-rose-contour.webp",
    affiliateUrl: "https://amzn.to/3Ts73Gh",
  },
  {
    id: "catrice-sculpt-charm",
    brand: "Catrice",
    name: "Sculpt & Charm Contour Stick, 010 Ash",
    category: "Face",
    image: "/products/catrice-contour.webp",
    affiliateUrl: "https://amzn.to/4yJNfy6",
  },
  {
    id: "catrice-liquid-camouflage",
    brand: "Catrice",
    name: "Liquid Camouflage Concealer, 020 Light Beige",
    category: "Face",
    image: "/products/catrice-concealer.webp",
    affiliateUrl: "https://amzn.to/4hHLX0q",
  },
  {
    id: "nyx-buttermelt-glaze",
    brand: "NYX Professional Makeup",
    name: "Buttermelt Glaze Skin Tint, Whipped Butta",
    category: "Face",
    image: "/products/nyx-skin-tint.webp",
    affiliateUrl: "https://amzn.to/4fMW2GO",
  },
  {
    id: "essence-bouncy-plump",
    brand: "Essence",
    name: "Bouncy Plump Smoothing Primer",
    category: "Face",
    image: "/products/essence-primer.webp",
    affiliateUrl: "https://amzn.to/4fxat30",
  },
  {
    id: "maybelline-sky-high",
    brand: "Maybelline",
    name: "Sky High Mascara, Black",
    category: "Eyes",
    image: "/products/maybelline-mascara.webp",
    affiliateUrl: "https://amzn.to/3S7NGlm",
  },
  {
    id: "essence-shine-lipgloss",
    brand: "Essence",
    name: "Shine Shine Shine Lip Gloss",
    category: "Lips",
    image: "/products/essence-lip-gloss.webp",
    affiliateUrl: "https://amzn.to/45AqmzO",
  },
  {
    id: "catrice-more-than-glow",
    brand: "Catrice",
    name: "More Than Glow Highlighter, 020",
    category: "Face",
    image: "/products/catrice-highlighter.webp",
    affiliateUrl: "https://amzn.to/3U8xG35",
  },
  {
    id: "kiss-my-lash-blessed",
    brand: "Kiss",
    name: "My Lash But Better, Blessed, Pack of 3",
    category: "Eyes",
    image: "/products/kiss-lashes.webp",
    affiliateUrl: "https://amzn.to/4xdgoAf",
  },
];
