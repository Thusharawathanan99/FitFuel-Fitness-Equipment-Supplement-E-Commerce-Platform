import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { findCoupon } from '../data/coupons';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const FREE_DELIVERY_OVER = 15000;
const DELIVERY_FEE = 990;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => storage.get('cart', []));
  const [coupon, setCoupon] = useState(() => storage.get('coupon', null));

  useEffect(() => { storage.set('cart', items); }, [items]);
  useEffect(() => { storage.set('coupon', coupon); }, [coupon]);

  const add = useCallback((product, qty = 1) => {
    setItems((list) => {
      const found = list.find((l) => l.id === product.id);
      if (found) return list.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
      return [...list, {
        id: product.id, name: product.name, price: product.discountPrice,
        listPrice: product.price, art: product.art, brand: product.brand, qty
      }];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((list) =>
      qty <= 0 ? list.filter((l) => l.id !== id) : list.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((id) => setItems((list) => list.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => { setItems([]); setCoupon(null); }, []);

  const applyCoupon = useCallback((code, subtotal) => {
    const found = findCoupon(code);
    if (!found) return { ok: false, message: 'Invalid or expired coupon' };
    if (subtotal < found.min)
      return { ok: false, message: `This coupon needs a subtotal of at least Rs ${found.min.toLocaleString('en-IN')}` };
    setCoupon(found);
    return { ok: true, message: 'Coupon applied successfully' };
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);
    const listTotal = items.reduce((s, l) => s + (l.listPrice || l.price) * l.qty, 0);
    const productSaving = listTotal - subtotal;
    let couponDiscount = 0;
    if (coupon && subtotal >= coupon.min)
      couponDiscount = coupon.type === 'percent'
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);
    const baseDelivery = subtotal >= FREE_DELIVERY_OVER || subtotal === 0 ? 0 : DELIVERY_FEE;
    const delivery = coupon?.code === 'FREESHIP' ? 0 : baseDelivery;
    const couponOff = coupon?.code === 'FREESHIP' ? 0 : couponDiscount;
    const total = Math.max(0, subtotal - couponOff + delivery);
    return {
      subtotal, productSaving, couponDiscount: couponOff, delivery, total,
      freeDeliveryGap: Math.max(0, FREE_DELIVERY_OVER - subtotal),
      pointsEarned: Math.floor(total / 100)
    };
  }, [items, coupon]);

  const value = useMemo(
    () => ({
      items, coupon, totals,
      count: items.reduce((s, l) => s + l.qty, 0),
      add, setQty, remove, clear, applyCoupon, removeCoupon,
      has: (id) => items.some((l) => l.id === id)
    }),
    [items, coupon, totals, add, setQty, remove, clear, applyCoupon, removeCoupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
