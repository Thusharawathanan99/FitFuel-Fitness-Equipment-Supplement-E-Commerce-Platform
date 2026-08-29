import { Link } from 'react-router-dom';
import ProductArt from './ProductArt';

export default function CategoryCard({ category, count }) {
  return (
    <Link className="ff-tile" to={`/category/${category.slug}`}>
      <span style={{ height: 56, display: 'grid', placeItems: 'center', width: '100%' }}>
        <ProductArt artKey={category.art} />
      </span>
      <b>{category.name}</b>
      <span>{count} products</span>
    </Link>
  );
}
