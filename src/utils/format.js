export const rs = (n) => `Rs ${Number(n || 0).toLocaleString('en-IN')}`;
export const discountPct = (product) =>
  product.price > product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;
export const compactCount = (n) => (n > 999 ? `${(n / 1000).toFixed(1)}K+` : String(n));
export const orderRef = () => `FF-${Math.floor(20000 + Math.random() * 9000)}`;
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
