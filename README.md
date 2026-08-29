# FitFuel — Fitness Equipment & Supplement E-Commerce Platform

A React front end for FitFuel, built to the existing Figma design
(`MYAtwlTgmNco4YE6eOwshE`). The layout, colours, typography, spacing, cards,
buttons, navigation, icons, radii and shadows all come from that file — this
repository implements the design, it does not reinterpret it.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
```

Any host serving `dist/` needs an SPA fallback (every unknown path rewritten to
`index.html`), because the app uses `BrowserRouter` for clean URLs.

## Demonstration accounts

| Role     | Email              | Password    |
| -------- | ------------------ | ----------- |
| Customer | `demo@fitfuel.lk`  | `demo1234`  |
| Admin    | `admin@fitfuel.lk` | `admin1234` |

Accounts, orders, cart, wishlist, comparison and admin edits all live in
`localStorage`, so they persist across reloads and reset when site data is
cleared. The "Reset catalogue" button on the admin products page restores the
seed data.

## Front end only

There is no server in this repository. Everything a back end would normally do
is simulated behind a service layer:

```
components / pages  →  src/services/*  →  src/data/*  +  localStorage
```

Every service function returns a Promise with a short artificial latency, so the
pages already handle loading, empty and error states. Swapping in a REST API
later means rewriting the bodies in `src/services/` and nothing else — no page
or component talks to the data directly.

Simulated, not real: authentication (no JWT), payment (no card is charged or
transmitted), email, image uploads and order fulfilment.

## Features

**Customer** — registration and sign-in, password reset, search, category
browsing with filters and sorting, product detail with specifications and
reviews, product comparison (up to four), wishlist, cart, coupons, checkout with
validation, order confirmation, order tracking through six stages, profile with
loyalty points and tiers, a BMI and calorie calculator, and personalised
recommendations scored from orders, cart, wishlist and BMI.

**Admin** — dashboard, product management with create/edit/delete, category
overview, inventory with inline stock edits, order management with status
advancement, customer records, and sales analytics.

Coupons: `FIT10` (10% over Rs 5,000), `SAVE20` (20% over Rs 25,000),
`WELCOME15` (15%, no minimum), `FREESHIP` (free delivery over Rs 3,000).

## Layout

```
src/
  assets/          static files
  components/      admin, auth, cart, checkout, common, layout, order, product
  context/         Auth, Cart, Wishlist, Compare, Toast
  data/            products (44), categories (13), coupons
  hooks/           useProducts, useDocumentTitle
  pages/           customer, auth, admin
  routes/          AppRoutes, ProtectedRoute
  services/        product, auth, order, review, http
  styles/          tokens, global, components
  utils/           format, storage, images
```

`src/styles/tokens.css` holds the design tokens read from the Figma file —
`#29ABE2` brand blue, `#333333` panels, MuseoModerno for display type and Albert
Sans for body text — and overrides the matching Bootstrap variables so Bootstrap
components inherit the design rather than fighting it.

Product artwork is drawn as SVG in `components/product/ProductArt.jsx`. When real
photography is available, map product ids to image paths in `utils/images.js`
and every card, gallery and cart row picks them up automatically.

## Other directories

- `design/` — the design canvas source and standalone HTML exports.
- `app/` — the earlier single-file hash-routed prototype.
- `figma-plugin/` — a local Figma plugin that builds the prototype screens and
  wires the click-through inside Figma.
