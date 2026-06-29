# Supabase Pre-order Setup

Roamboard uses a simple Supabase insert-only waitlist form. It does not take payments, collect shipping addresses, create accounts, or connect to Shopify.

## Codebase notes

- Frontend framework: plain static HTML, CSS and JavaScript.
- Main product page: `index.html`.
- Forms/components: markup lives directly in `index.html`, styling in `styles.css`, checkout and Supabase behaviour in `checkout.js`.
- Environment variables: because this is a static site, `ROAMBOARD_SUPABASE_URL` and `ROAMBOARD_SUPABASE_ANON_KEY` are used to generate an ignored `supabase-config.js` file.
- Backend/API routes: none. The browser inserts directly into Supabase using the anon public key and Row Level Security.

## 1. Create the Supabase project

1. Create a project at Supabase.
2. Open the SQL editor.
3. Paste and run the contents of `supabase-preorders-schema.sql`.

The schema enables RLS and only grants public anonymous users `INSERT` access for committed preorders and funnel events. Do not add public `SELECT`, `UPDATE` or `DELETE` policies, otherwise customer emails could be exposed.

## 2. Configure environment variables

Copy `.env.example` into your local environment manager or hosting provider:

```sh
ROAMBOARD_SUPABASE_URL=https://your-project-ref.supabase.co
ROAMBOARD_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

Use the anon public key only. Never use or expose the Supabase service role key in frontend code.

## 3. Generate local static config

For local static testing, generate the ignored browser config file:

```sh
ROAMBOARD_SUPABASE_URL="https://your-project-ref.supabase.co" \
ROAMBOARD_SUPABASE_ANON_KEY="your-supabase-anon-public-key" \
pnpm preorders:config
```

This writes `supabase-config.js`. You can also copy `supabase-config.example.js` to `supabase-config.js` and fill in local values manually.

For this repo's current GitHub Pages setup, the site is served directly from `main`, so `supabase-config.js` is committed with the browser-safe publishable key. This is okay only because RLS prevents public reads, updates and deletes. Never commit `.env` files or any Supabase secret/service-role key.

## 4. Test locally

Serve the folder with any static server, then open `index.html`:

```sh
pnpm preorders:config
python3 -m http.server 4173
```

Submit the form with a test email. On the first valid submit, Supabase should receive a `preorder_funnel_events` row with `stage = 'buy_details_submitted'`. On the pre-order submit, Supabase should receive a second `preorder_funnel_events` row with `stage = 'preorder_committed'` and a committed row in `preorders`. Try the same email twice to confirm the duplicate message appears.

## 5. Deploy

Add `ROAMBOARD_SUPABASE_URL` and `ROAMBOARD_SUPABASE_ANON_KEY` to your hosting provider. Make sure deployment runs:

```sh
pnpm install
pnpm preorders:config
```

Then deploy the static files, including the generated `supabase-config.js`. For GitHub Pages branch deployments, commit `supabase-config.js` because there is no build step to generate it on the server.

## Admin export

Use the Supabase dashboard to view and export preorders:

1. Open Table Editor.
2. Select `public.preorders` for committed leads or `public.preorder_funnel_events` for the two-stage funnel.
3. Use the export/download CSV action from the dashboard.

Keep real `.env` files and all Supabase secret/service-role keys out of git.
