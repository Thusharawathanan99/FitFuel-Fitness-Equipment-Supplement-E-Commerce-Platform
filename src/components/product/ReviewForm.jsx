import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ReviewForm({ onSubmit }) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated)
    return (
      <div className="ff-panel" style={{ padding: 22, textAlign: 'center' }}>
        <p className="ff-muted" style={{ marginBottom: 14 }}>Sign in to write a review for this product.</p>
        <Link className="ff-btn ff-btn-primary" to="/login">Sign in</Link>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (title.trim().length < 4) next.title = 'Give your review a short headline.';
    if (body.trim().length < 15) next.body = 'Tell other shoppers a little more (15 characters minimum).';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    await onSubmit({ author: user.name, rating, title: title.trim(), body: body.trim() });
    setSaving(false);
    setTitle(''); setBody(''); setRating(5);
    toast.success('Thanks — your review is live');
  };

  return (
    <form className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={submit} noValidate>
      <h3 style={{ fontSize: 20 }}>Write a review</h3>

      <div className="ff-field">
        <span>Your rating</span>
        <div style={{ display: 'flex', gap: 6 }} role="radiogroup" aria-label="Your rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => setRating(n)}
              style={{ background: 'none', border: 0, padding: 2, cursor: 'pointer', lineHeight: 0 }}
            >
              <Icon name="star" size={26} fill={n <= rating ? '#FDB022' : '#E9EAEB'} stroke="none" />
            </button>
          ))}
        </div>
      </div>

      <label className="ff-field">
        <span>Headline</span>
        <input
          className={`ff-input${errors.title ? ' is-invalid' : ''}`} value={title}
          onChange={(e) => setTitle(e.target.value)} placeholder="Sums up your experience"
          aria-invalid={!!errors.title}
        />
        {errors.title && <em className="ff-field-error">{errors.title}</em>}
      </label>

      <label className="ff-field">
        <span>Your review</span>
        <textarea
          className={`ff-input${errors.body ? ' is-invalid' : ''}`} rows={4} value={body}
          onChange={(e) => setBody(e.target.value)} style={{ height: 'auto', padding: 12, resize: 'vertical' }}
          placeholder="What did you like or dislike? How did you use it?" aria-invalid={!!errors.body}
        />
        {errors.body && <em className="ff-field-error">{errors.body}</em>}
      </label>

      <button className="ff-btn ff-btn-primary" type="submit" disabled={saving}>
        {saving ? 'Posting…' : 'Post review'}
      </button>
    </form>
  );
}
