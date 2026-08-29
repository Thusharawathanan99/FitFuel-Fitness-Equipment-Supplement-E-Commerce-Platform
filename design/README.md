# FitFuel — design canvas

Rebuild of the **FITFUEL** Figma file (`MYAtwlTgmNco4YE6eOwshE`, node `1:18507` — "Home Page",
1463 × 10102), with **Fitness Equipment** added into the same design system.

Read from Figma via the Figma MCP connection: published variables, the header component's
code, and the Product Card component's exact spec.

## Artboards

| File | Artboard | Size |
|---|---|---|
| `Main.dc.html` | Home Page — Figma rebuild + equipment | 1463 × 10600 |
| `Equipment.dc.html` | Fitness Equipment category page (new) | 1463 × 3900 |
| `System.dc.html` | Design tokens | 1280 × 2150 |

## Tokens — read from the Figma file, not invented

| Token | Value |
|---|---|
| Brand/500 · 600 · 700 | `#29ABE2` · `#198ABA` · `#126588` |
| Brand/400 · 100 · 50 | `#5ABEE9` · `#D5E6FB` · `#F9F5FF` |
| background / Accent | `#333333` / `#212121` |
| Gray 900→50 | `#181D27` `#404040` `#535862` `#737373` `#A3A3A3` `#D5D7DA` `#E9EAEB` `#F5F5F5` `#FAFAFA` |
| Success 500 · 700 · 100 | `#12B76A` · `#027A48` · `#D1FADF` |
| Warning/400 | `#FDB022` (rating stars) |
| Display face | **MuseoModerno** 500 / 600 |
| Text face | **Albert Sans** 400 / 500 / 600 |
| Corner/Medium | `12px` (buttons 8, product card 28, badge 16) |
| Shadow/xs | `0 1px 2px rgba(10,13,18,0.05)` |
| Display max width | `1280px` |

## Home page sections (Figma order preserved)

Header → hero carousel → protein partners → Best Deals slider → **equipment categories** →
features (dark) → promo grid → **Top Fitness Equipment slider** → banner → brand strip →
Recommended slider → Instant Assistance → metrics → FAQ → footer.

## Where Fitness Equipment was added

1. `Equipment` item in the header navigation bar
2. `Shop Fitness Equipment` — six category tiles
3. `Top Fitness Equipment` — product slider using the same card component
4. Equipment mixed into `Recommended For You`
5. `Equipment.dc.html` — full category page (filters, grid, freight / assembly / warranty / instalments strip)

## Known gap

Product photography and brand logos in the Figma file are linked assets on `figma.com`,
which this environment cannot download (egress policy). Every product image here is drawn
as **inline SVG** in the right shape, colour and proportion. Swap in the real photos when
you build the site.

## Rebuilding

`compose.sh` wraps a `_b_*.html` body fragment with `_helmet.html`; `gencard.sh` emits the
Product Card component. Then re-seed with the `seed-canvas.mjs` helper and republish
`fitfuel-ecommerce-design.html`.

```bash
./compose.sh Equipment.dc.html 1463 3900 _b_equip.html
```

## Getting this into Figma

`design/export/` holds standalone HTML — no canvas runtime, just the page:

| File | Page |
|---|---|
| `export/fitfuel-home.html` | Home page (1463 wide) |
| `export/fitfuel-equipment.html` | Fitness Equipment page |
| `export/fitfuel-tokens.html` | Design tokens |

**Route A — Figma MCP (editable layers, best).** Reconnect the Figma MCP server and push
the design in; it writes real frames, auto-layout and text nodes.

**Route B — html.to.design browser extension (editable layers).** Install the plugin +
extension, open one of the files above in the browser, run the extension, import into Figma.

**Route C — PNG / PDF (flat image).** Open the published canvas, Export → PNG or PDF, then
place the image in Figma as a reference layer. Not editable.

Fonts to install in Figma either way: **MuseoModerno** and **Albert Sans** (both on Google Fonts).

### Layer names on import

Every section carries an `id`, so an importer names the Figma layers properly instead of
producing a stack of unnamed divs:

`Header` · `Hero` · `Protein Partners` · `Best Deals` · `Shop Fitness Equipment` ·
`Features` · `Promo Posters` · `Top Fitness Equipment` · `Banner` · `Brand Strip` ·
`Recommended For You` · `Instant Assistance` · `Metrics` · `FAQ` · `Footer` ·
`Page Hero` · `Product Grid + Filters` · `Delivery / Assembly / Warranty`
