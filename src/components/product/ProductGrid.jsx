import ProductCard from './ProductCard';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';

export default function ProductGrid({ products, loading, columns = 4, emptyTitle, emptyMessage, emptyAction }) {
  if (loading) return <LoadingState count={columns} />;
  if (!products?.length)
    return (
      <EmptyState
        icon="search"
        title={emptyTitle || 'No products match those filters'}
        message={emptyMessage || 'Try removing a filter or raising the price ceiling.'}
        action={emptyAction}
      />
    );
  return (
    <div className={`ff-grid ff-g${columns}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} flag={p.bestseller ? 'Best seller' : undefined} />
      ))}
    </div>
  );
}
