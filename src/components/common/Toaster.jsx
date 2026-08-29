import { useToast } from '../../context/ToastContext';
import Icon from './Icon';

const TONE = {
  success: { bg: 'var(--ff-dark)', icon: 'check', color: '#12B76A' },
  error: { bg: 'var(--ff-error-700)', icon: 'alert', color: '#fff' },
  info: { bg: 'var(--ff-brand-700)', icon: 'sparkle', color: '#fff' }
};

export default function Toaster() {
  const { toasts } = useToast();
  return (
    <div
      style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 300,
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', pointerEvents: 'none' }}
      role="status" aria-live="polite"
    >
      {toasts.map((t) => {
        const tone = TONE[t.tone] || TONE.success;
        return (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: tone.bg,
            color: '#fff', padding: '13px 20px', borderRadius: 'var(--ff-r)',
            boxShadow: 'var(--ff-shadow-lg)', fontWeight: 600, fontSize: 14 }}>
            <Icon name={tone.icon} size={17} stroke={tone.color} strokeWidth={2.4} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
