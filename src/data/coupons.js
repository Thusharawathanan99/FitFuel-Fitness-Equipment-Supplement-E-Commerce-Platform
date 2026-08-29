/** Mock coupons. `type` is 'percent' or 'flat'; `min` is the minimum subtotal in LKR. */
export const COUPONS = [
  { code: 'FIT10',     type: 'percent', value: 10, min: 5000,  label: '10% off orders over Rs 5,000' },
  { code: 'SAVE20',    type: 'percent', value: 20, min: 25000, label: '20% off orders over Rs 25,000' },
  { code: 'WELCOME15', type: 'percent', value: 15, min: 0,     label: '15% off your first order' },
  { code: 'FREESHIP',  type: 'flat',    value: 990, min: 3000, label: 'Free delivery on orders over Rs 3,000' }
];

export const findCoupon = (code) =>
  COUPONS.find((c) => c.code.toUpperCase() === String(code || '').trim().toUpperCase());
