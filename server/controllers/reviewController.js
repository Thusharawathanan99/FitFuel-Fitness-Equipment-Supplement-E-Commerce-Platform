import Review from '../models/Review.js';
import Product from '../models/Product.js';

let memReviews = [
  {
    id: 'rev-01',
    productId: 'eq01',
    author: 'Nuwan P.',
    userId: 'u1',
    rating: 5,
    title: 'Solid build quality',
    body: 'Delivery was quick and the packaging was intact. Two months in and it still looks new.',
    verified: true,
    date: new Date('2026-06-15')
  },
  {
    id: 'rev-02',
    productId: 'sp01',
    author: 'Ishara F.',
    userId: 'u1',
    rating: 5,
    title: 'Worth every rupee',
    body: 'Mixes clean, no clumps, and the taste is not overly sweet. I will be reordering.',
    verified: true,
    date: new Date('2026-07-20')
  }
];

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    try {
      const reviews = await Review.find({ productId }).sort({ date: -1 });
      if (reviews.length) return res.json({ success: true, count: reviews.length, data: reviews });
    } catch {
      // Fallback
    }

    const filtered = memReviews.filter(r => r.productId === productId);
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, body, author } = req.body;

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      author: author || req.user?.name || 'Verified Athlete',
      userId: req.user?._id || req.user?.id || 'guest',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      title,
      body,
      verified: true,
      date: new Date()
    };

    let saved;
    try {
      saved = await Review.create(newReview);

      // Recalculate average rating & review count for product
      const allProductReviews = await Review.find({ productId });
      if (allProductReviews.length) {
        const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = Math.round((totalRating / allProductReviews.length) * 10) / 10;
        await Product.findOneAndUpdate(
          { id: productId },
          { rating: avg, reviewCount: allProductReviews.length }
        );
      }
      return res.status(201).json({ success: true, data: saved });
    } catch {
      memReviews.unshift(newReview);
      return res.status(201).json({ success: true, data: newReview });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
