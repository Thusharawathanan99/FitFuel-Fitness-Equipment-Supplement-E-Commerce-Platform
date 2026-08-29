import { useState } from 'react';
import Icon from '../common/Icon';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CouponInput() {
  const cart = useCart();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (cart.coupon) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: 'var(--ff-success-100)', color: 'var(--ff-success-700)',
        padding: '12px 14px', borderRadius: 'var(--ff-r-sm)', fontWeight: 600, fontSize: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check" size={16} strokeWidth={2.6} /> {cart.coupon.code} applied
        </span>
        <button type="button" className="ff-btn-ghost" style={{ color: 'var(--ff-success-700)' }}
          onClick={() => { cart.removeCoupon(); toast.info('Coupon removed'); }}>Remove</button>
      </div>
    );
  }

  const apply = (e) => {
    e.preventDefault();
    const result = cart.applyCoupon(code, cart.totals.subtotal);
    if (result.ok) { toast.success(result.message); setError(''); setCode(''); }
    else { setError(result.message); toast.error(result.message); }
  };

  return (
    <form onSubmit={apply} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className={`ff-input${error ? ' is-invalid' : ''}`} value={code} placeholder="Promo code"
          onChange={(e) => { setCode(e.target.value); setError(''); }}
          aria-label="Promo code" aria-invalid={!!error}
        />
        <button type="submit" className="ff-btn ff-btn-outline" disabled={!code.trim()}>Apply</button>
      </div>
      {error ? <span className="ff-field-error">{error}</span>
             : <span style={{ fontSize: 12, color: 'var(--ff-gray-500)' }}>Try FIT10, SAVE20 or WELCOME15</span>}
    </form>
  );
}
