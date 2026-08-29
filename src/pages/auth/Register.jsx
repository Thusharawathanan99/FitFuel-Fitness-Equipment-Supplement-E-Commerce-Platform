import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const strengthOf = (pw) => {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s;
};
const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const COLOURS = ['#B42318', '#B42318', '#FDB022', '#12B76A', '#027A48'];

export default function Register() {
  useDocumentTitle('Create an account');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const strength = useMemo(() => strengthOf(form.password), [form.password]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((x) => ({ ...x, [key]: undefined, form: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirm !== form.password) next.confirm = 'Both passwords must match.';
    if (!accepted) next.accepted = 'Please accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const user = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success(`Welcome to FitFuel, ${user.name.split(' ')[0]}`);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join FitFuel"
      title="Create your account"
      subtitle="It takes under a minute and your first order gets 15% off with WELCOME15."
      footer={<>Already a member? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link></>}
    >
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {errors.form && (
          <p role="alert" style={{ background: '#FEF3F2', color: 'var(--ff-error-700)', fontSize: 14,
            padding: '11px 14px', borderRadius: 'var(--ff-r-sm)' }}>{errors.form}</p>
        )}

        <label className="ff-field">
          <span>Full name</span>
          <input className={`ff-input${errors.name ? ' is-invalid' : ''}`} value={form.name} onChange={set('name')}
            autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} />
          {errors.name && <em className="ff-field-error">{errors.name}</em>}
        </label>

        <label className="ff-field">
          <span>Email</span>
          <input className={`ff-input${errors.email ? ' is-invalid' : ''}`} type="email" value={form.email}
            onChange={set('email')} autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
          {errors.email && <em className="ff-field-error">{errors.email}</em>}
        </label>

        <label className="ff-field">
          <span>Password</span>
          <input className={`ff-input${errors.password ? ' is-invalid' : ''}`} type="password" value={form.password}
            onChange={set('password')} autoComplete="new-password" placeholder="At least 8 characters"
            aria-invalid={!!errors.password} />
          {form.password && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <span style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--ff-gray-100)' }}>
                <span style={{ display: 'block', height: '100%', borderRadius: 3,
                  width: `${(strength / 4) * 100}%`, background: COLOURS[strength] }} />
              </span>
              <span style={{ fontSize: 12, color: COLOURS[strength] }}>{LABELS[strength]}</span>
            </span>
          )}
          {errors.password && <em className="ff-field-error">{errors.password}</em>}
        </label>

        <label className="ff-field">
          <span>Confirm password</span>
          <input className={`ff-input${errors.confirm ? ' is-invalid' : ''}`} type="password" value={form.confirm}
            onChange={set('confirm')} autoComplete="new-password" placeholder="Repeat your password"
            aria-invalid={!!errors.confirm} />
          {errors.confirm && <em className="ff-field-error">{errors.confirm}</em>}
        </label>

        <label className="ff-check" style={{ fontSize: 13 }}>
          <span>
            <input type="checkbox" checked={accepted}
              onChange={(e) => { setAccepted(e.target.checked); setErrors((x) => ({ ...x, accepted: undefined })); }} />
            <span className="ff-box" aria-hidden="true" />
            <span>I agree to the FitFuel terms of service and privacy policy.</span>
          </span>
        </label>
        {errors.accepted && <em className="ff-field-error" style={{ marginTop: -10 }}>{errors.accepted}</em>}

        <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
