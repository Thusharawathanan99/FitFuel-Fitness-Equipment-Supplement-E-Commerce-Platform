import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { authService } from '../../services';
import { useToast } from '../../context/ToastContext';

export default function ResetPassword() {
  useDocumentTitle('Set a new password');
  const [params] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState(params.get('email') || '');
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!token) next.form = 'Reset token is missing or invalid. Please request a new password reset link.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (confirm !== password) next.confirm = 'Both passwords must match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await authService.resetPassword(email, password, token);
      toast.success('Password updated — you can sign in now');
      navigate('/login', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Choose something you have not used on FitFuel before."
      footer={<Link to="/login" style={{ fontWeight: 600 }}>Back to sign in</Link>}
    >
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {errors.form && (
          <p role="alert" style={{ background: '#FEF3F2', color: 'var(--ff-error-700)', fontSize: 14,
            padding: '11px 14px', borderRadius: 'var(--ff-r-sm)' }}>{errors.form}</p>
        )}

        <label className="ff-field">
          <span>Email</span>
          <input className={`ff-input${errors.email ? ' is-invalid' : ''}`} type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }} autoComplete="email"
            aria-invalid={!!errors.email} />
          {errors.email && <em className="ff-field-error">{errors.email}</em>}
        </label>

        <label className="ff-field">
          <span>New password</span>
          <input className={`ff-input${errors.password ? ' is-invalid' : ''}`} type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({}); }} autoComplete="new-password"
            placeholder="At least 8 characters" aria-invalid={!!errors.password} />
          {errors.password && <em className="ff-field-error">{errors.password}</em>}
        </label>

        <label className="ff-field">
          <span>Confirm new password</span>
          <input className={`ff-input${errors.confirm ? ' is-invalid' : ''}`} type="password" value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors({}); }} autoComplete="new-password"
            aria-invalid={!!errors.confirm} />
          {errors.confirm && <em className="ff-field-error">{errors.confirm}</em>}
        </label>

        <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={busy}>
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
}
