const TONES = {
  Delivered: 'ff-badge-good', Confirmed: 'ff-badge-info', Packed: 'ff-badge-info',
  Shipped: 'ff-badge-info', 'Out for Delivery': 'ff-badge-warn', 'Order Placed': 'ff-badge-neutral',
  Cancelled: 'ff-badge-bad', 'In stock': 'ff-badge-good', 'Low stock': 'ff-badge-warn',
  'Out of stock': 'ff-badge-bad', Active: 'ff-badge-good', Paid: 'ff-badge-good'
};

export default function StatusBadge({ status }) {
  return <span className={`ff-badge ${TONES[status] || 'ff-badge-neutral'}`}>{status}</span>;
}
