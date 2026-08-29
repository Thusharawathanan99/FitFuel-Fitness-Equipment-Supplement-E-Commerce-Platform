import { ORDER_STAGES } from '../../services';
import Icon from '../common/Icon';

export default function OrderSteps({ stage = 0, compact = false }) {
  const labels = compact ? ['Cart', 'Delivery', 'Payment', 'Done'] : ORDER_STAGES;
  return (
    <ol className="ff-steps" style={{ listStyle: 'none', margin: 0, padding: '8px 0 26px' }}>
      {labels.map((label, i) => (
        <li key={label} style={{ display: 'contents' }}>
          <span className={`ff-step${i === stage ? ' is-on' : ''}${i < stage ? ' is-done' : ''}`}>
            <i aria-hidden="true">
              {i < stage ? <Icon name="check" size={14} stroke="#fff" strokeWidth={3} /> : i + 1}
            </i>
            {label}
          </span>
          {i < labels.length - 1 && <span className="ff-step-line" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
