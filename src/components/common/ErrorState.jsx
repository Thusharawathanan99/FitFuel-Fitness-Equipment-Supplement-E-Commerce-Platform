import Icon from './Icon';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="ff-empty" role="alert">
      <span style={{ display: 'grid', placeItems: 'center', width: 56, height: 56, borderRadius: '50%',
        background: 'var(--ff-error-100)', margin: '0 auto 16px' }}>
        <Icon name="alert" size={26} stroke="var(--ff-error-700)" />
      </span>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h3>
      {message && <p style={{ marginBottom: onRetry ? 20 : 0 }}>{message}</p>}
      {onRetry && <button className="ff-btn ff-btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  );
}
