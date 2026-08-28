# FitFuel — design canvas

Design source for **FitFuel**, a fitness equipment & supplement e-commerce platform.
Eleven artboards on one pan/zoom canvas, published as a Design artifact.

## Files

| File | Artboard | Size |
|---|---|---|
| `Main.dc.html` | Home | 1440 × 5000 |
| `Shop.dc.html` | Equipment listing (filters + 3-up grid) | 1440 × 2960 |
| `Product.dc.html` | Supplement product detail | 1440 × 3600 |
| `EquipmentProduct.dc.html` | Equipment product detail (specs, freight, warranty) | 1440 × 3300 |
| `Cart.dc.html` | Cart | 1440 × 1990 |
| `Checkout.dc.html` | Checkout | 1440 × 2500 |
| `Auth.dc.html` | Log in / register | 1440 × 900 |
| `Account.dc.html` | My account | 1440 × 2100 |
| `Admin.dc.html` | Admin dashboard | 1440 × 1240 |
| `MobileHome.dc.html` | Mobile home | 390 × 1900 |
| `MobileProduct.dc.html` | Mobile product | 390 × 1560 |
| `System.dc.html` | Design system | 1280 × 2560 |

`canvas.json` lays the artboards out across four pages: Storefront, Buy flow &
account, Admin & mobile, Design system.

## Design tokens

| Token | Value | Use |
|---|---|---|
| Ink | `#121210` | Dark surfaces, primary text |
| Ink soft | `#2A2823` | Dividers on dark |
| Volt | `#CBF43C` | Primary accent (equipment) |
| Ember | `#E8642E` | Supplements, offers, ratings |
| Paper | `#F7F4ED` | Page background |
| Paper 2 | `#EDE8DB` | Media wells |
| Line | `#DAD4C4` | Hairlines |
| Muted | `#6F6B5E` | Secondary text |
| Good / Warning / Critical / Neutral | `#4C8B2B` / `#E8642E` / `#B3311A` / `#A6A093` | Status — always with an icon and a word |

Type: **Anton** for headings (uppercase only), **Instrument Sans** for body and UI.
Radius 3px on surfaces, 2px on badges. No drop shadows. All sibling groups use
flex/grid with `gap`.

## Rebuilding

`compose.sh` assembles a page from a `_b_*.html` body fragment plus the shared
`_helmet.html`, `_header.html` and `_footer.html`; `gencard.sh` emits product cards
from the SVG illustration library.

```bash
./compose.sh Shop.dc.html 1440 2960 _b_shop.html
```

Then re-seed the canvas with the Design `seed-canvas.mjs` helper, passing every
`.dc.html` plus `canvas.json`, and republish `fitfuel-ecommerce-design.html`.

## Placeholders

Bracketed values (`[CUSTOMER NAME]`, `[STORE ADDRESS]`, `[PHONE]`, `[SUPPORT EMAIL]`,
`[YOUR EMAIL]`) are deliberate — fill them with real details. Prices are sample values
in LKR.
