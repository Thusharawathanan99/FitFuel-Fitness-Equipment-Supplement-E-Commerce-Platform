import { useEffect, useState } from 'react';
import { productService } from '../services';

/** Runs a product query through the service layer and tracks loading/error state. */
export default function useProducts(query, deps = []) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    productService
      .getProducts(query)
      .then((data) => { if (alive) setProducts(data); })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { products, loading, error };
}
