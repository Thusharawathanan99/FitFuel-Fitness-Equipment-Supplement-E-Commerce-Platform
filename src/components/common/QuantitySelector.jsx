import Icon from './Icon';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, label = 'Quantity' }) {
  return (
    <div className="ff-qty">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Icon name="minus" size={16} strokeWidth={2.2} />
      </button>
      <span aria-live="polite" aria-label={`${label}: ${value}`}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Icon name="plus" size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}
