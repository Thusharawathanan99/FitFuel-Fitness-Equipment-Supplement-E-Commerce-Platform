import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { authService } from '../../services';
import { useToast } from '../../context/ToastContext';

export default function ForgotPassword() {
  useDocumentTitle('Reset your password');
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setBusy(true);
    try {
      await authService.requestReset(email);
      setSent(true);
      toast.success('Reset link sent');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email on your account and we will send you a reset link."
      footer={<>Remembered it? <Link to="/login" style={{ fontWeight: 600 }}>Back to sign in</Link></>}
    >
      {sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--ff-success-100)',
            color: 'var(--ff-success-700)', padding: 16, borderRadius: 'var(--ff-r-sm)', fontSize: 14 }}>
            <Icon name="check" size={18} stroke="var(--ff-success-700)" strokeWidth={2.6} />
            <span>
              If an account exists for <b>{email}</b> a reset link is on its way.
              This demonstration has no email service, so use the button below to set a new password directly.
            </span>
          </p>
          <button className="ff-btn ff-btn-primary ff-btn-block" type="button"
            onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}>
            Continue to reset password
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="ff-field">
            <span>Email</span>
            <input className={`ff-input${error ? ' is-invalid' : ''}`} type="email" value={email}
              autoComplete="email" onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com" aria-invalid={!!error} />
            {error && <em className="ff-field-error">{error}</em>}
          </label>
          <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
