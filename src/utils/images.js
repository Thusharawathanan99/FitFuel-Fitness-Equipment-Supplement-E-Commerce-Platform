/**
 * Centralised image configuration.
 *
 * Product visuals are currently drawn as SVG (components/product/ProductArt) because the
 * Figma photography lives on figma.com as linked assets. To move to real photography,
 * put files in src/assets/products/ and map them here — nothing else needs to change.
 *
 *   export const PRODUCT_IMAGES = { eq01: new URL('../assets/products/eq01.jpg', import.meta.url).href };
 */
export const PRODUCT_IMAGES = {};

export const productImage = (product) => PRODUCT_IMAGES[product?.id] || null;
