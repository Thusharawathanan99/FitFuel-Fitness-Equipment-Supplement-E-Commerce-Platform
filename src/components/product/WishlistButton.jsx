import Icon from '../common/Icon';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export default function WishlistButton({ product, className = 'ff-card-heart' }) {
  const wishlist = useWishlist();
  const toast = useToast();
  const on = wishlist.has(product.id);

  return (
    <button
      type="button"
      className={`${className}${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = wishlist.toggle(product.id);
        toast.success(added ? 'Saved to wishlist' : 'Removed from wishlist');
      }}
    >
      <Icon name="heart" size={20} stroke="var(--ff-gray-700)" />
    </button>
  );
}
