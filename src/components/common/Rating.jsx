import { compactCount } from '../../utils/format';

export default function Rating({ value = 0, count, size = 16, showCount = true, tone = 'dark' }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'flex', gap: 4 }} role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = value >= i ? 1 : value > i - 1 ? value - (i - 1) : 0;
          const gid = `star-${i}-${String(value).replace('.', '')}-${tone}`;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id={gid}>
                  <stop offset={`${fill * 100}%`} stopColor="#FDB022" />
                  <stop offset={`${fill * 100}%`} stopColor={tone === 'dark' ? '#5A5A5A' : '#D5D7DA'} />
                </linearGradient>
              </defs>
              <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z" fill={`url(#${gid})`} />
            </svg>
          );
        })}
      </span>
      {showCount && count != null && (
        <span style={{ fontSize: 12, color: tone === 'dark' ? '#D4D4D4' : 'var(--ff-gray-600)' }}>
          ( {compactCount(count)} )
        </span>
      )}
    </span>
  );
}
