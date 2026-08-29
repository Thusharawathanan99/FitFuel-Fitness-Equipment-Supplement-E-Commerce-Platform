import { ok } from './http';
import { storage } from '../utils/storage';

/**
 * Reviews are seeded deterministically from the product id so every visit shows the
 * same history, then customer-written reviews are layered on from localStorage.
 */
const KEY = 'reviews';

const AUTHORS = ['Nuwan P.', 'Ishara F.', 'Dilan R.', 'Hasini W.', 'Kavith S.', 'Menaka J.', 'Rashmi A.', 'Tharindu B.'];
const TITLES = ['Exactly what I needed', 'Worth every rupee', 'Solid build quality', 'Great value', 'Does the job', 'Better than expected'];
const BODIES = [
  'Delivery was quick and the packaging was intact. Two months in and it still looks new.',
  'I compared three brands before settling on this one and I have no regrets — the finish is genuinely good.',
  'Mixes clean, no clumps, and the taste is not overly sweet. I will be reordering.',
  'Sturdy and well finished. Assembly took about twenty minutes with the printed guide.',
  'Good for the price. Knocked off a star only because the instructions were a little thin.',
  'Been using it daily since March. No wobble, no rust, no complaints.'
];

/* A tiny string hash so the same product always yields the same seeded reviews. */
const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
};

const seedFor = (product) => {
  const base = hash(product.id);
  const n = Math.min(4, 2 + (base % 3));
  return Array.from({ length: n }, (_, i) => {
    const k = base + i * 17;
    const stars = Math.max(3, Math.min(5, Math.round(product.rating) - (i % 2 === 0 ? 0 : 1)));
    return {
      id: `seed-${product.id}-${i}`,
      productId: product.id,
      author: AUTHORS[k % AUTHORS.length],
      rating: stars,
      title: TITLES[k % TITLES.length],
      body: BODIES[k % BODIES.length],
      date: new Date(2026, (k % 8), 1 + (k % 27)).toISOString(),
      verified: k % 3 !== 0
    };
  });
};

const readCustom = () => storage.get(KEY, []);

export const reviewService = {
  getReviews(product) {
    const custom = readCustom().filter((r) => r.productId === product.id);
    return ok([...custom, ...seedFor(product)]);
  },

  addReview(review) {
    const all = readCustom();
    const record = { ...review, id: `r${Date.now().toString(36)}`, date: new Date().toISOString(), verified: true };
    all.unshift(record);
    storage.set(KEY, all);
    return ok(record);
  },

  /** Blends the catalogue rating with anything customers have written since. */
  summarise(product, reviews) {
    if (!reviews.length) return { average: product.rating, total: product.reviewCount, breakdown: [0, 0, 0, 0, 0] };
    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { breakdown[5 - r.rating] += 1; });
    const written = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const average = Math.round(((product.rating * 4 + written) / 5) * 10) / 10;
    return { average, total: product.reviewCount + reviews.filter((r) => !r.id.startsWith('seed-')).length, breakdown };
  }
};
