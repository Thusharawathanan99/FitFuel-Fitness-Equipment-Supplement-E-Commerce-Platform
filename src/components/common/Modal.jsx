import { useEffect, useRef } from 'react';
import Icon from './Icon';

export default function Modal({ open, title, onClose, children, footer, width = 560 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(24,29,39,.55)', zIndex: 200,
        display: 'grid', placeItems: 'center', padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        style={{ background: '#fff', borderRadius: 'var(--ff-r)', boxShadow: 'var(--ff-shadow-lg)',
          width: '100%', maxWidth: width, maxHeight: '86vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '20px 24px', borderBottom: '1px solid var(--ff-gray-200)' }}>
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          <button className="ff-btn-ghost" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto' }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end',
            padding: '16px 24px', borderTop: '1px solid var(--ff-gray-200)' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
