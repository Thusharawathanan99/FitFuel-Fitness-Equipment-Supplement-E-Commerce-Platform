# FitFuel — working storefront

A functioning single-page store built on the FITFUEL Figma design system
(Brand/500 `#29ABE2`, MuseoModerno + Albert Sans, 12px radius, 28px product cards).

| File | Use |
|---|---|
| `index.html` | **Deployable page.** Open it directly or drop it on any static host. |
| `fitfuel.html` | Same page as an Artifact body (no `<!doctype>` / `<html>` / `<body>` wrapper). |

No build step, no dependencies. Fonts come from Google Fonts; everything else ships in the file.

## What works

**Navigation** — hash routing across 16 routes. Every link goes somewhere real, the
back button works, and any URL can be shared or bookmarked:

```
#/                      home
#/equipment             equipment listing
#/supplements           supplement listing
#/deals                 everything discounted
#/product/eq2           product detail
#/cart  #/checkout  #/done
#/login  #/brands  #/support  #/stores
#/search?q=whey         search results
```

**Filtering and sorting** — category and brand checkboxes, a max-price slider and five
sort orders. All of it lives in the URL, so `#/equipment?c=dumbbells,racks&s=low&max=50000`
reproduces the exact view. Active filters show as removable chips; an empty result set
gets its own state rather than a blank grid.

**Cart** — add from a card or a product page, change quantity, remove a line. Totals,
savings and the free-delivery threshold (Rs 15,000) recalculate live. Persists in
`localStorage`, so it survives a reload. The header badge tracks it.

**Checkout** — real per-field validation (email shape, 10-digit mobile, postal code,
card number, MM/YY, CVV) with inline errors, payment-method switching that hides the
card fields for cash on delivery, and an order confirmation carrying a generated
reference and the real total.

**Also** — hero carousel with autoplay plus prev/next/dots, FAQ accordion, wishlist
toggle, live search, toast notifications, keyboard focus states, `prefers-reduced-motion`
support, and layouts down to 390px.

## Verified

Rendered headless in Chromium: all 16 routes return content and the console is clean
(zero errors), including unknown product ids, unknown routes and an empty search.

## Product imagery

Product art is inline SVG. The photographs in the Figma file are linked assets on
`figma.com`, which this environment cannot reach — swap in real photos by replacing the
entries in the `ART` map near the top of the script.
