import Product from '../models/Product.js';
import { generateRecommendations } from '../services/recommendationService.js';
import { PRODUCTS_SEED } from '../data/initialData.js';

export const getAiRecommendations = async (req, res) => {
  try {
    const { bmi, goal, activityLevel, pastProductIds } = req.body;

    let allProducts = [];
    try {
      allProducts = await Product.find();
    } catch {
      // Fallback
    }

    if (!allProducts || !allProducts.length) {
      allProducts = [...PRODUCTS_SEED];
    }

    const parsedPastIds = Array.isArray(pastProductIds) ? pastProductIds : [];
    const results = generateRecommendations(allProducts, {
      bmi: parseFloat(bmi) || 22.5,
      goal: goal || 'muscle_gain',
      activityLevel: activityLevel || 'moderate',
      pastProductIds: parsedPastIds
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
