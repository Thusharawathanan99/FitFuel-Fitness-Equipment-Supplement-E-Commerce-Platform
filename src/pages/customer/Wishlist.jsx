import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import ProductGrid from '../../components/product/ProductGrid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const wishlist = useWishlist();
  const cart = useCart();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productService.getProducts()
      .then((all) => { if (alive) setProducts(all.filter((p) => wishlist.ids.includes(p.id))); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [wishlist.ids]);

  const addAll = () => {
    const inStock = products.filter((p) => p.stock > 0);
    inStock.forEach((p) => cart.add(p));
    toast.success(`${inStock.length} item${inStock.length === 1 ? '' : 's'} added to cart`);
  };

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 32 }}>Your wishlist</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {wishlist.count} saved product{wishlist.count === 1 ? '' : 's'}
          </p>
        </div>
        {products.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="ff-btn ff-btn-primary" onClick={addAll}>Add all to cart</button>
            <button type="button" className="ff-btn ff-btn-outline"
              onClick={() => { wishlist.clear(); toast.info('Wishlist cleared'); }}>
              Clear wishlist
            </button>
          </div>
        )}
      </div>

      {!loading && !products.length ? (
        <EmptyState
          icon="heart" title="Your wishlist is empty"
          message="Tap the heart on any product to keep it here for later."
          action={<Link className="ff-btn ff-btn-primary" to="/shop">Browse products</Link>}
        />
      ) : (
        <ProductGrid products={products} loading={loading} columns={4} />
      )}
    </div>
  );
}
