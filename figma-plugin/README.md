# FitFuel Prototype Builder — Figma plugin

Run this once inside the FitFuel Figma file. It builds the four missing screens and
wires every prototype connection, so pressing ▶ walks the whole shopping flow.

It needs no account upgrade and no MCP quota — it runs locally in your Figma.

## What it does

**Builds four screens** on the `FitFuel — Fitness Equipment` page, each with a copy of
the real header so navigation stays consistent:

| Screen | Contents |
|---|---|
| `03 · Product detail` | Gallery, price with saving, spec table, quantity stepper, Add to cart / Buy it now |
| `04 · Cart` | Free-delivery banner, two line items with steppers, order summary, Checkout |
| `05 · Checkout` | Contact, delivery address, payment method, card fields, order summary, Place order |
| `06 · Order confirmed` | Success tick, order reference, total, Back to home / Keep shopping |

**Wires the prototype** — `ON_CLICK → NAVIGATE` on:

```
Home ──"Browse all equipment"──▶ Equipment page
Home ──category tiles──────────▶ Equipment page
Home ──product cards───────────▶ Product detail
Home ──"Buy Now"───────────────▶ Cart
Equipment ──"Shop all equipment"▶ Product detail
Product ──"Add to cart"────────▶ Cart
Product ──"Buy it now"─────────▶ Cart
Cart ──"Checkout"──────────────▶ Checkout
Checkout ──"Place order"───────▶ Order confirmed
Confirmed ──"Back to home"─────▶ Home
every header ──logo────────────▶ Home
every header ──cart icon───────▶ Cart
```

It also sets the **flow starting point** to the home page, so ▶ always opens there.

## How to run it

1. Download both files (`manifest.json` and `code.js`) into one folder
2. Open the FitFuel file in the **Figma desktop app** (plugin development needs desktop)
3. Menu → **Plugins → Development → Import plugin from manifest…**
4. Pick the `manifest.json` from that folder
5. Menu → **Plugins → Development → FitFuel Prototype Builder**

It finishes in a couple of seconds and tells you how many links it wired.
Then press **▶** (top right) to run the prototype.

## Safe to re-run

Running it twice creates a second set of screens. To start over, delete the frames named
`03 · …` through `06 · …` and run it again.

## What a Figma prototype can and cannot do

Clickable navigation between screens, hover states and overlays — yes, and that is what
this sets up. Live cart arithmetic, working filters, real search and form validation are
outside what Figma prototypes do; the working version of those is in `app/index.html`.
