# Victoria Mincheva storefront

A mobile-first beauty storefront for Victoria Mincheva. The site leads with a $4.99 Full Glam Guide, sends buyers through Stripe Checkout, records fulfillment in Supabase, and delivers the PDF through a short-lived signed URL from a private Supabase Storage bucket. It also includes a categorized catalogue containing every supplied Amazon affiliate destination.

Repository: [github.com/Bokbaz/victoriamincheva](https://github.com/Bokbaz/victoriamincheva)

## What is included

- A responsive, guide-first landing page designed primarily for mobile visitors
- Stripe-hosted Checkout for the one-time $4.99 USD payment
- Payment verification on both the success page and a signed Stripe webhook
- A private Supabase PDF bucket and short-lived download links
- An idempotent Supabase order ledger
- Download revocation after Stripe refunds or disputes
- 18 unique product entries containing all 19 supplied affiliate links
- Face, Eyes, Brows, and Lips catalogue filters
- Locally optimized 800 × 800 WebP product images on white backgrounds
- Instagram and TikTok links for Victoria
- Privacy, purchase terms, refund information, and Amazon disclosure
- SEO metadata, Open Graph metadata, Product structured data, robots.txt, and sitemap.xml
- Reduced-motion behavior, keyboard focus states, mobile safe areas, and WCAG 2.2 AA-oriented styling
- Playwright and axe browser checks for mobile and desktop

## Architecture

```text
Visitor
  |
  | taps Get instant access
  v
Next.js POST /api/checkout
  |
  | creates one-time Checkout Session
  v
Stripe Checkout
  |                         |
  | browser redirect        | signed webhook
  v                         v
/success              /api/stripe/webhook
  |                         |
  +------ verifies payment -+
              |
              v
       Supabase orders table
              |
              | paid session requests download
              v
       /api/download verifies Stripe
              |
              v
  Short-lived signed Supabase Storage URL
              |
              v
          Private PDF
```

Stripe remains the source of truth for payment. Supabase stores the fulfillment record and private file. The success page verifies payment to avoid making a present customer wait for a delayed webhook, while the webhook guarantees fulfillment when the browser never returns. This follows [Stripe's recommended Checkout fulfillment model](https://docs.stripe.com/checkout/fulfillment).

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Stripe Node SDK
- Supabase JavaScript SDK
- Vercel deployment
- Playwright and axe-core for browser validation

The exact dependency versions are pinned in `package.json` and `package-lock.json`.

## Prerequisites

Install or create the following before setup:

1. Node.js 20.9 or newer and npm
2. A [Supabase](https://supabase.com/dashboard) project
3. A [Stripe](https://dashboard.stripe.com/) account
4. The [Stripe CLI](https://docs.stripe.com/stripe-cli) for local webhook testing
5. A GitHub account with access to `Bokbaz/victoriamincheva`
6. A [Vercel](https://vercel.com/) account connected to that GitHub account

## 1. Install locally

```bash
git clone https://github.com/Bokbaz/victoriamincheva.git
cd victoriamincheva
npm install
cp .env.example .env.local
```

The paid PDF is intentionally ignored by Git. Confirm this before the first commit:

```bash
git check-ignore -v Resources/Victoria_FullGlam_Guide.pdf
```

The command should print the matching `.gitignore` rule. Never move the paid PDF into `public/`; everything in `public/` is available without payment.

## 2. Configure Supabase

### 2.1 Create the project

1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select **New project**.
3. Choose the organization, project name, region, and a strong database password.
4. Wait until project provisioning finishes.

### 2.2 Get the server credentials

1. Open **Project Settings → API Keys**.
2. Copy the **Project URL** into `SUPABASE_URL`.
3. Create or copy a server-side **Secret key**, normally beginning with `sb_secret_`, into `SUPABASE_SECRET_KEY`.

The code also accepts the legacy `service_role` key through `SUPABASE_SERVICE_ROLE_KEY`, but the current Supabase secret key is preferred. Both are server-only credentials. Never prefix them with `NEXT_PUBLIC_`, commit them, paste them into browser code, or expose them in screenshots.

Your `.env.local` should now contain:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_ME
SUPABASE_STORAGE_BUCKET=guides
SUPABASE_GUIDE_PATH=victoria-full-glam-guide.pdf
SUPABASE_DOWNLOAD_TTL_SECONDS=600
```

### 2.3 Create the order table and private bucket

Dashboard method:

1. Open **SQL Editor → New query**.
2. Open `supabase/migrations/202608020001_create_orders.sql` in this repository.
3. Copy the complete file into the SQL editor.
4. Select **Run**.
5. Open **Table Editor** and confirm the `orders` table exists.
6. Open **Storage** and confirm the `guides` bucket exists and is **Private**.

The migration enables Row Level Security, grants no browser roles access to the order table, and creates no public read policy for the guide. Private buckets require authorization or a signed URL, as described in the [Supabase private bucket documentation](https://supabase.com/docs/guides/storage/buckets/fundamentals).

Supabase CLI alternative:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### 2.4 Upload the guide

Make sure `Resources/Victoria_FullGlam_Guide.pdf` exists locally, then run:

```bash
npm run upload:guide
```

Expected output:

```text
Uploaded .../Victoria_FullGlam_Guide.pdf to private bucket guides/victoria-full-glam-guide.pdf.
```

The upload is idempotent and replaces the object at the configured path. You can therefore use the same command to publish a corrected guide later.

To upload a PDF stored at a different local path:

```bash
npm run upload:guide -- /absolute/path/to/the-guide.pdf
```

After upload, open **Storage → guides** and verify:

- The file name exactly matches `SUPABASE_GUIDE_PATH`.
- The MIME type is `application/pdf`.
- The bucket is private.
- Opening a guessed public object URL does not return the file.

The download endpoint uses Supabase's `createSignedUrl` with the download option. See the [official signed URL reference](https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl).

## 3. Configure Stripe in test mode

Do all testing with Stripe test-mode credentials first.

### 3.1 Create the guide product and price

1. Open the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Turn on **Test mode**.
3. Open **Product catalog → Add product**.
4. Set the name to `Victoria Mincheva Full Glam Guide`.
5. Optionally use the guide thumbnail from `public/images/victoria-guide.webp`.
6. Choose **One time** pricing.
7. Set the price to exactly **4.99 USD**.
8. Save the product.
9. Open the new Price and copy its ID, beginning with `price_`.
10. Put that value in `STRIPE_PRICE_ID`.

The site displays $4.99 independently, so the Stripe Price must also be exactly $4.99 USD. Confirm the amount in the Checkout screen before going live.

### 3.2 Get the test secret key

1. Open **Developers → API keys** in Stripe.
2. Reveal and copy the test secret key beginning with `sk_test_`.
3. Put it in `STRIPE_SECRET_KEY`.

Never expose the secret key to the browser or create a `NEXT_PUBLIC_STRIPE_SECRET_KEY` variable.

### 3.3 Test webhooks locally

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

The Stripe CLI prints a temporary signing secret beginning with `whsec_`. Copy it into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then restart `npm run dev` so Next.js loads the updated value.

Your completed local Stripe variables should look like:

```dotenv
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
STRIPE_PRICE_ID=price_REPLACE_ME
```

Webhook verification uses the unmodified request body, the `Stripe-Signature` header, and Stripe's `constructEvent` method. This is the flow in the [official Stripe signature guide](https://docs.stripe.com/webhooks/signature?lang=node).

### 3.4 Complete a local test purchase

1. Open `http://localhost:3000`.
2. Tap **Get instant access**.
3. Confirm Stripe shows `Victoria Mincheva Full Glam Guide` for `$4.99`.
4. Use Stripe's standard successful test card `4242 4242 4242 4242`.
5. Use any future expiry date, any three-digit CVC, and a valid-format billing address.
6. Complete payment.
7. Confirm `/success` shows **Download your PDF**.
8. Download the file and open it.
9. Open Supabase **Table Editor → orders** and confirm one row exists.
10. Refresh the success page and download again. The order should update, not duplicate.

Use Stripe's current [test card documentation](https://docs.stripe.com/testing) for decline, authentication, and asynchronous-payment scenarios.

## 4. Local environment file

A complete `.env.local` looks like this:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
STRIPE_PRICE_ID=price_REPLACE_ME

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_ME
SUPABASE_STORAGE_BUCKET=guides
SUPABASE_GUIDE_PATH=victoria-full-glam-guide.pdf
SUPABASE_DOWNLOAD_TTL_SECONDS=600
```

Variable reference:

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | No | Canonical production URL and Stripe return URL |
| `STRIPE_SECRET_KEY` | Yes | Yes | Creates and verifies Stripe Checkout Sessions |
| `STRIPE_WEBHOOK_SECRET` | Yes | Yes | Verifies Stripe webhook signatures |
| `STRIPE_PRICE_ID` | Yes | No | Stripe Price for the $4.99 one-time guide |
| `SUPABASE_URL` | Yes | No | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Yes | Yes | Server-only database and Storage access |
| `SUPABASE_STORAGE_BUCKET` | No | No | Defaults to `guides` |
| `SUPABASE_GUIDE_PATH` | No | No | Defaults to `victoria-full-glam-guide.pdf` |
| `SUPABASE_DOWNLOAD_TTL_SECONDS` | No | No | Signed URL lifetime, clamped between 60 and 3600 seconds |

## 5. Run and validate locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Before every deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```

Browser tests require Chromium once per machine:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite checks:

- Mobile and desktop rendering
- All 19 supplied affiliate links
- Catalogue category filtering
- Horizontal overflow
- Automated axe accessibility rules

Automated testing supplements, but does not replace, a real iPhone and Android check before launch.

## 6. Publish to GitHub

This workspace is configured with:

```text
origin  https://github.com/Bokbaz/victoriamincheva.git
```

Review the exact commit contents first:

```bash
git status --short
git diff --stat
git check-ignore Resources/Victoria_FullGlam_Guide.pdf
```

Then publish:

```bash
git add .
git commit -m "Build Victoria Mincheva beauty storefront"
git push -u origin main
```

On GitHub, verify:

1. The source files and product images are present.
2. `Resources/Victoria_FullGlam_Guide.pdf` is absent.
3. `.env.local` is absent.
4. No Stripe or Supabase secret appears in the repository search.
5. The default branch is `main`.

Recommended repository settings:

- Enable secret scanning and push protection if available.
- Require pull requests before merging once more collaborators are added.
- Protect `main` after the initial production setup.
- Add the Playwright command to CI if browser checks should block merges.

## 7. Deploy through Vercel

Vercel's Git integration creates previews for branches and production deployments from the production branch. See [Vercel's Git deployment documentation](https://vercel.com/docs/git).

### 7.1 Import the repository

1. Sign in to [Vercel](https://vercel.com/).
2. Select **Add New → Project**.
3. Import `Bokbaz/victoriamincheva` from GitHub.
4. Keep **Framework Preset: Next.js**.
5. Keep **Root Directory** as the repository root.
6. Do not override the build command, output directory, or install command.

### 7.2 Add environment variables before deploying

Open the project's **Settings → Environment Variables** and add every variable below.

Production values:

| Name | Production value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Final `https://` production domain, no trailing slash |
| `STRIPE_SECRET_KEY` | Stripe live secret key after go-live, test key before go-live |
| `STRIPE_WEBHOOK_SECRET` | Secret from the production Stripe webhook endpoint |
| `STRIPE_PRICE_ID` | Matching live or test `$4.99 USD` Price ID |
| `SUPABASE_URL` | Production Supabase project URL |
| `SUPABASE_SECRET_KEY` | Production Supabase secret key |
| `SUPABASE_STORAGE_BUCKET` | `guides` |
| `SUPABASE_GUIDE_PATH` | `victoria-full-glam-guide.pdf` |
| `SUPABASE_DOWNLOAD_TTL_SECONDS` | `600` |

Apply secrets only to environments that need them. Use test-mode Stripe values in Preview and live-mode values only in Production. Never mix a test secret key with a live Price ID.

Enable **Automatically expose System Environment Variables** in Vercel's environment-variable settings. The site uses `VERCEL_BRANCH_URL` for stable preview return URLs and `VERCEL_PROJECT_PRODUCTION_URL` as a safe production fallback. Vercel documents Local, Preview, and Production variable separation in its [environment guide](https://vercel.com/docs/deployments/environments).

### 7.3 Deploy

1. Select **Deploy**.
2. Wait for the build to finish.
3. Open the generated Vercel URL.
4. Test the homepage, product filters, legal page, cancel return, and a test checkout.

Every future push to a non-production branch produces a Preview Deployment. Every push or merge to `main` produces a Production Deployment unless you change the project's production-branch setting.

### 7.4 Connect a custom domain

1. Open **Project Settings → Domains**.
2. Add the domain or subdomain.
3. Follow Vercel's DNS instructions exactly.
4. Wait for SSL provisioning.
5. Change `NEXT_PUBLIC_SITE_URL` to the final canonical `https://` domain.
6. Redeploy Production so metadata, sitemap URLs, and Stripe return URLs use the custom domain.

## 8. Create the production Stripe webhook

Do this only after the final Vercel domain is working.

1. In Stripe, switch to the mode used by the deployed keys.
2. Open **Developers → Webhooks** or **Workbench → Webhooks**.
3. Select **Add endpoint**.
4. Set the endpoint URL to:

```text
https://YOUR_FINAL_DOMAIN/api/stripe/webhook
```

5. Subscribe to these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `charge.refunded`
   - `charge.dispute.created`
6. Create the endpoint.
7. Reveal its signing secret beginning with `whsec_`.
8. Replace `STRIPE_WEBHOOK_SECRET` in Vercel Production with that exact value.
9. Redeploy Production.
10. Send a test event from Stripe and confirm the endpoint returns HTTP 200.

Each webhook endpoint has its own signing secret. The Stripe CLI secret is not the production Dashboard endpoint secret.

## 9. Switch Stripe from test to live

1. Complete Stripe account activation and required business information.
2. Turn off **Test mode**.
3. Create the live `Victoria Mincheva Full Glam Guide` product.
4. Create a live one-time price of exactly **$4.99 USD**.
5. Copy the live `price_` ID.
6. Copy the live `sk_live_` secret key.
7. Create the live webhook endpoint described above.
8. Replace all three Production Stripe variables in Vercel.
9. Redeploy Production.
10. Make one real low-value purchase and immediately confirm the Stripe payment, Supabase order, and PDF download.
11. Refund that test purchase in Stripe and confirm the Supabase order changes to `refunded` and the download is no longer authorized.

Configure Stripe's customer receipt emails, support details, statement descriptor, branding, and any appropriate tax settings in the Dashboard before launch. Tax treatment for digital products depends on business and customer location, so confirm the required configuration with a qualified adviser rather than assuming a default.

## 10. Amazon affiliate catalogue

The supplied short URLs are preserved verbatim in `lib/products.ts`. Two short URLs currently resolve to the same Revolution Smokey Icon Palette, so they are presented as a primary and alternate listing on one product. This prevents a duplicate catalogue card while retaining every supplied destination.

The page includes Amazon's required disclosure:

> As an Amazon Associate I earn from qualifying purchases.

The current wording is supported by the [Amazon.co.uk Associates Operating Agreement](https://affiliate-program.amazon.co.uk/help/operating/agreement).

Product images were sourced from the corresponding listing assets, normalized to 800 × 800 WebP files, and stored in `public/products/` so Amazon's hotlink protection cannot leave blank catalogue tiles. The Catrice Sculpt & Charm short link currently resolves to an Amazon search page rather than a stable product detail page, so that one image uses Catrice's official product asset as a fallback.

Before launch, confirm that the image-storage approach is permitted for the specific Amazon Associates account and marketplace. If the account has Product Advertising API access, the long-term compliant option is to refresh Amazon Product Advertising Content through that API according to its caching and display rules.

The site deliberately does not display Amazon prices or availability because both can change independently. The disclosure reminds visitors that Amazon controls the final listing details.

### Add or edit a catalogue product

1. Create a square WebP listing image under `public/products/`.
2. Open `lib/products.ts`.
3. Add or update one product object.
4. Use one of the existing categories: `Face`, `Eyes`, `Brows`, or `Lips`.
5. Keep the provided affiliate short URL unchanged.
6. Confirm the link opens the expected listing in a private browser window.
7. Run `npm run test:e2e`.

Example:

```ts
{
  id: "unique-stable-id",
  brand: "Brand name",
  name: "Product name and shade",
  category: "Face",
  image: "/products/product-file.webp",
  affiliateUrl: "https://amzn.to/EXACT_LINK",
}
```

## 11. Order and download behavior

`public.orders` stores:

- Stripe Checkout Session ID
- Stripe Payment Intent ID
- Stripe Customer ID when available
- Checkout email
- Product slug
- Paid amount and currency
- Payment status
- Fulfilled and downloaded timestamps

The webhook upsert is idempotent because `stripe_session_id` is unique. Repeated Stripe delivery attempts do not create duplicate orders.

Useful Supabase query:

```sql
select
  created_at,
  customer_email,
  amount_total,
  currency,
  payment_status,
  fulfilled_at,
  downloaded_at
from public.orders
order by created_at desc;
```

Amounts are stored in the smallest currency unit. For USD, `499` means `$4.99`.

The download route:

1. Accepts a Stripe Checkout Session ID.
2. Retrieves the Session from Stripe server-side.
3. Requires a paid Session for the guide's exact product slug.
4. Rejects orders marked refunded or disputed.
5. Generates a private Supabase signed URL.
6. Redirects the buyer to a forced PDF download.
7. Records `downloaded_at`.

Treat the success-page URL as private purchase information because its Session ID authorizes download after server verification. Do not paste it publicly.

## 12. Update the guide later

1. Keep the replacement PDF outside `public/`.
2. Replace `Resources/Victoria_FullGlam_Guide.pdf` locally or pass another file path.
3. Run `npm run upload:guide`.
4. Download it through a paid test Session and verify the new file.
5. Do not commit the PDF.

Because the Storage path remains unchanged, no code deployment is required for PDF-only corrections.

## 13. Key source locations

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page content and guide funnel |
| `app/home.module.css` | Main responsive visual design |
| `components/product-catalogue.tsx` | Catalogue filtering and product cards |
| `lib/products.ts` | Product metadata and exact affiliate URLs |
| `app/api/checkout/route.ts` | Creates Stripe Checkout Sessions |
| `app/api/stripe/webhook/route.ts` | Verifies webhooks and handles fulfillment/refunds |
| `app/api/download/route.ts` | Verifies payment and mints private downloads |
| `lib/fulfillment.ts` | Idempotent Supabase order fulfillment |
| `app/success/page.tsx` | Post-payment download experience |
| `app/legal/page.tsx` | Privacy, terms, refunds, and affiliate disclosure |
| `supabase/migrations/202608020001_create_orders.sql` | Database and private bucket setup |
| `scripts/upload-guide.mjs` | Private PDF upload helper |
| `tests/storefront.spec.ts` | Responsive, link, overflow, and accessibility checks |

## 14. Troubleshooting

### Checkout says it cannot be started

- Confirm `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` exist in the active environment.
- Confirm both values belong to the same Stripe mode.
- Confirm the Price is active.
- Restart the local server after editing `.env.local`.
- Redeploy Vercel after changing hosted environment variables.

### Stripe returns to the wrong domain

- Correct `NEXT_PUBLIC_SITE_URL` and remove any trailing slash.
- Enable Vercel system environment variables for Preview URLs.
- Redeploy after the correction.

### Webhook returns HTTP 400

- Use the signing secret for that exact endpoint.
- Do not use the Stripe CLI `whsec_` value in Production.
- Confirm Stripe is posting to `/api/stripe/webhook`.
- Check the Vercel Function log for `Invalid webhook signature`.

### Payment succeeds but no order appears

- Confirm the migration ran successfully.
- Confirm the Supabase secret key belongs to the same project as `SUPABASE_URL`.
- Check Vercel Function logs for the webhook or success route.
- Confirm the Checkout Session metadata contains `product_slug`.
- Resend the event from Stripe after correcting the configuration.

### Download says it cannot prepare the file

- Confirm the `guides` bucket is private and exists.
- Confirm the exact object path matches `SUPABASE_GUIDE_PATH`.
- Run `npm run upload:guide` again.
- Confirm the file is a valid PDF below the bucket's 20 MB limit.
- Confirm the order was not refunded or disputed.

### Product image is wrong or stale

- Open the exact short affiliate link and identify the current listing.
- Replace the corresponding file under `public/products/`.
- Keep the output square with a white background.
- Verify Amazon Associates content-use requirements before publishing.

### Vercel build fails

Run the same checks locally:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Use the Node version specified in `package.json`. Do not add a custom Vercel output directory for this Next.js project.

## 15. Final launch checklist

- [ ] The custom domain resolves over HTTPS.
- [ ] `NEXT_PUBLIC_SITE_URL` is the final production domain.
- [ ] Vercel Production uses Stripe live keys and a live `$4.99 USD` Price.
- [ ] The live Stripe webhook returns HTTP 200.
- [ ] Supabase `orders` has RLS enabled and no browser access policy.
- [ ] The `guides` bucket is private.
- [ ] The final PDF is uploaded at the configured path.
- [ ] The PDF and `.env.local` are absent from GitHub.
- [ ] All affiliate links open the intended marketplace listings.
- [ ] The Amazon disclosure is visible below the catalogue and in Legal.
- [ ] Stripe receipt, support, refund, branding, and tax settings are reviewed.
- [ ] The legal text is reviewed for Victoria's business location and customers.
- [ ] A real test payment, download, refund, and revoked download are verified.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` pass.
- [ ] The site is checked on one real iPhone and one real Android device.
