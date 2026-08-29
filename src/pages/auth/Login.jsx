import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  useDocumentTitle('Sign in');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Passwords are at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const useDemo = (role) => {
    setEmail(role === 'admin' ? 'admin@fitfuel.lk' : 'demo@fitfuel.lk');
    setPassword(role === 'admin' ? 'admin1234' : 'demo1234');
    setErrors({});
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to FitFuel"
      subtitle="Track orders, keep your wishlist and spend your loyalty points."
      footer={<>New here? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {errors.form && (
          <p role="alert" style={{ background: '#FEF3F2', color: 'var(--ff-error-700)', fontSize: 14,
            padding: '11px 14px', borderRadius: 'var(--ff-r-sm)' }}>{errors.form}</p>
        )}

        <label className="ff-field">
          <span>Email</span>
          <input className={`ff-input${errors.email ? ' is-invalid' : ''}`} type="email" value={email}
            autoComplete="email" onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            placeholder="you@example.com" aria-invalid={!!errors.email} />
          {errors.email && <em className="ff-field-error">{errors.email}</em>}
        </label>

        <label className="ff-field">
          <span>Password</span>
          <input className={`ff-input${errors.password ? ' is-invalid' : ''}`} type="password" value={password}
            autoComplete="current-password" onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
            placeholder="••••••••" aria-invalid={!!errors.password} />
          {errors.password && <em className="ff-field-error">{errors.password}</em>}
        </label>

        <div style={{ textAlign: 'right', fontSize: 13, marginTop: -6 }}>
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--ff-gray-200)', paddingTop: 16 }}>
        <p className="ff-muted" style={{ fontSize: 12, marginBottom: 10 }}>
          Demonstration accounts — this storefront has no server, so any account you create lives in this browser only.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="ff-btn ff-btn-outline ff-btn-sm" onClick={() => useDemo('customer')}>
            Use customer demo
          </button>
          <button type="button" className="ff-btn ff-btn-outline ff-btn-sm" onClick={() => useDemo('admin')}>
            Use admin demo
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
