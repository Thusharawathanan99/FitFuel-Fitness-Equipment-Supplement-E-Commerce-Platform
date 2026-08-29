import { Link } from 'react-router-dom';
import ProductArt from './ProductArt';
import Rating from '../common/Rating';
import WishlistButton from './WishlistButton';
import Icon from '../common/Icon';
import { rs, discountPct } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductCard({ product, flag }) {
  const cart = useCart();
  const toast = useToast();
  const off = discountPct(product);
  const soldOut = product.stock === 0;

  const addToCart = () => {
    cart.add(product);
    toast.success('Added to cart successfully');
  };

  return (
    <article className="ff-card">
      {flag && <span className="ff-card-flag">{flag}</span>}
      <WishlistButton product={product} />
      <Link to={`/product/${product.id}`} className="ff-card-art" aria-label={product.name}>
        <ProductArt product={product} />
      </Link>
      <div className="ff-card-body">
        <span className="ff-card-veg" aria-hidden="true"><i /></span>
        <Link to={`/product/${product.id}`} className="ff-card-title">{product.name}</Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Rating value={product.rating} count={product.reviewCount} />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span className="ff-card-price ff-tnum">{rs(product.discountPrice)}</span>
            {off > 0 && <span className="ff-card-was ff-tnum">{rs(product.price)}</span>}
            {off > 0 && <span className="ff-badge ff-badge-off">{off}% off</span>}
          </div>
          <div className="ff-card-acts">
            <button type="button" className="ff-btn ff-btn-buy" onClick={addToCart} disabled={soldOut}>
              {soldOut ? 'Out of stock' : 'Buy Now'}
            </button>
            <button
              type="button" className="ff-card-mini" onClick={addToCart} disabled={soldOut}
              aria-label={`Add ${product.name} to cart`}
            >
              <Icon name="cart" size={20} stroke="var(--ff-gray-700)" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
