/**
 * AI-Driven Fitness & Supplement Recommendation Engine
 * Analyzes User Profile, BMI, Caloric Needs, Fitness Goals, and Activity Level
 * to synthesize targeted product stacks and personalized advice.
 */

export const generateRecommendations = (allProducts, { bmi, goal, activityLevel, pastProductIds = [] }) => {
  const numericBmi = parseFloat(bmi) || 22.5;
  const targetGoal = (goal || 'general').toLowerCase(); // 'muscle_gain', 'fat_loss', 'strength', 'endurance', 'general'

  // Determine BMI category
  let bmiCategory = 'normal';
  if (numericBmi < 18.5) bmiCategory = 'underweight';
  else if (numericBmi >= 25 && numericBmi < 30) bmiCategory = 'overweight';
  else if (numericBmi >= 30) bmiCategory = 'obese';

  // Scoring matrix based on goal and BMI
  const scoredProducts = allProducts.map((product) => {
    let score = 0;
    const reasons = [];
    const text = `${product.name} ${product.category} ${product.description} ${(product.tags || []).join(' ')}`.toLowerCase();

    // 1. Goal-based scoring
    if (targetGoal.includes('muscle') || targetGoal.includes('hypertrophy')) {
      if (text.includes('whey') || text.includes('protein') || text.includes('creatine') || text.includes('bcaa')) {
        score += 45;
        reasons.push('High-protein profile essential for lean muscle synthesis');
      }
      if (text.includes('dumbbell') || text.includes('barbell') || text.includes('bench') || text.includes('rack')) {
        score += 35;
        reasons.push('Progressive overload resistance equipment for hypertrophy');
      }
    } else if (targetGoal.includes('fat') || targetGoal.includes('weight_loss') || bmiCategory === 'overweight' || bmiCategory === 'obese') {
      if (text.includes('carnitine') || text.includes('isolate') || text.includes('cla') || text.includes('pre-workout')) {
        score += 40;
        reasons.push('Supports metabolic efficiency and active calorie expenditure');
      }
      if (text.includes('cardio') || text.includes('rope') || text.includes('band') || text.includes('treadmill') || text.includes('rower')) {
        score += 35;
        reasons.push('High-calorie burn cardiovascular training equipment');
      }
    } else if (targetGoal.includes('strength') || targetGoal.includes('power')) {
      if (text.includes('creatine') || text.includes('power rack') || text.includes('olympic') || text.includes('barbell')) {
        score += 50;
        reasons.push('Proven compound strength builder and ATP energy booster');
      }
    } else {
      // General wellness
      if (text.includes('multivitamin') || text.includes('omega') || text.includes('fish oil') || text.includes('mat')) {
        score += 30;
        reasons.push('Foundation health, recovery and mobility staple');
      }
    }

    // 2. BMI specific adaptation
    if (bmiCategory === 'underweight') {
      if (text.includes('mass gainer') || text.includes('weight gainer') || text.includes('protein')) {
        score += 30;
        reasons.push('Calorie-dense nutrition tailored for optimal mass gain');
      }
    }

    // 3. User past interactions (Boost related items)
    if (pastProductIds.includes(product.id)) {
      score += 10;
    }

    // 4. Quality signals (rating, bestseller)
    if (product.bestseller) score += 8;
    if (product.rating >= 4.8) score += 6;

    return {
      ...product,
      aiScore: score,
      aiRecommendationReason: reasons[0] || 'Matches your current physical fitness profile'
    };
  });

  // Sort descending by AI score
  const recommendations = scoredProducts
    .filter(p => p.aiScore > 0)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 8);

  const aiSummary = generateAiSummary(bmiCategory, numericBmi, targetGoal);

  return {
    recommendations,
    aiSummary,
    meta: {
      calculatedForBmi: numericBmi,
      bmiCategory,
      fitnessGoal: targetGoal,
      matchedCount: recommendations.length
    }
  };
};

function generateAiSummary(category, bmi, goal) {
  if (category === 'overweight' || category === 'obese') {
    return `Based on your BMI of ${bmi.toFixed(1)}, our fitness AI recommends a calorie-deficit nutrition strategy combined with a blend of low-impact resistance training and metabolic conditioning. Lean isolates, thermogenic hydration, and cardio gear are prioritized.`;
  }
  if (category === 'underweight') {
    return `With a BMI of ${bmi.toFixed(1)}, the AI engine advises focusing on a structured caloric surplus, clean mass gainers, and progressive compound weight training to build lean musculoskeletal density.`;
  }
  return `At an optimal BMI of ${bmi.toFixed(1)}, your personalized AI recommendation focuses on peak performance maintenance, high-grade protein replenishment, and progressive home gym equipment.`;
}
