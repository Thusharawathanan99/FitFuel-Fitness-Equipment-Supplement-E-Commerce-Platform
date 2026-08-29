const OPTIONS = [
  { value: 'popular', label: 'Best selling' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'discount', label: 'Biggest discount' }
];

export default function SortDropdown({ value, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 14, color: 'var(--ff-gray-600)' }}>Sort:</span>
      <select
        className="ff-input" style={{ height: 44, width: 'auto', fontWeight: 600, fontSize: 14 }}
        value={value} onChange={(e) => onChange(e.target.value)} aria-label="Sort products"
      >
        {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
