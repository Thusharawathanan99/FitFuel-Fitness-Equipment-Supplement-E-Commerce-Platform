import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Icon from '../../components/common/Icon';
import ProductGrid from '../../components/product/ProductGrid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useProducts from '../../hooks/useProducts';
import { storage } from '../../utils/storage';

const BANDS = [
  { max: 18.5, label: 'Underweight', tone: 'ff-badge-warn', colour: '#FDB022',
    advice: 'A calorie surplus with a mass gainer and consistent resistance training is the fastest way to add healthy weight.',
    category: 'protein' },
  { max: 25, label: 'Healthy weight', tone: 'ff-badge-good', colour: '#12B76A',
    advice: 'You are in the healthy range. Whey protein and creatine will help you hold on to lean mass as you train.',
    category: 'creatine' },
  { max: 30, label: 'Overweight', tone: 'ff-badge-warn', colour: '#FDB022',
    advice: 'Pair a modest calorie deficit with cardio equipment and a high-protein diet to protect muscle while you lean out.',
    category: 'cardio' },
  { max: Infinity, label: 'Obese', tone: 'ff-badge-bad', colour: '#B42318',
    advice: 'Start with low-impact cardio and full-body strength work. Talk to a doctor before beginning an intensive programme.',
    category: 'cardio' }
];

const bandFor = (bmi) => BANDS.find((b) => bmi < b.max);

export default function Bmi() {
  useDocumentTitle('BMI calculator');
  const saved = storage.get('bmi', {});
  const [height, setHeight] = useState(saved.height || '');
  const [weight, setWeight] = useState(saved.weight || '');
  const [age, setAge] = useState(saved.age || '');
  const [sex, setSex] = useState(saved.sex || 'male');
  const [activity, setActivity] = useState(saved.activity || '1.55');
  const [result, setResult] = useState(() => {
    if (!saved.bmi) return null;
    const h = Number(saved.height) || 175;
    const metres = h / 100;
    const ideal = [Math.round(18.5 * metres * metres), Math.round(24.9 * metres * metres)];
    return { bmi: saved.bmi, ideal };
  });
  const [errors, setErrors] = useState({});

  const band = result ? bandFor(result.bmi) : null;

  const { products, loading } = useProducts(
    { category: band ? [band.category] : [], sort: 'rating' },
    [band?.category]
  );

  const calorieTargets = useMemo(() => {
    if (!result?.bmr) return null;
    const tdee = Math.round(result.bmr * Number(activity));
    return { maintain: tdee, cut: tdee - 500, bulk: tdee + 400 };
  }, [result, activity]);

  const calculate = (e) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    const a = Number(age);
    const next = {};
    if (!(h >= 100 && h <= 250)) next.height = 'Enter a height between 100 and 250 cm.';
    if (!(w >= 25 && w <= 300)) next.weight = 'Enter a weight between 25 and 300 kg.';
    if (age && !(a >= 12 && a <= 100)) next.age = 'Enter an age between 12 and 100.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const metres = h / 100;
    const bmi = Math.round((w / (metres * metres)) * 10) / 10;
    /* Mifflin–St Jeor, the estimate most fitness apps use. */
    const bmr = a
      ? Math.round(10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161))
      : null;
    const ideal = [Math.round(18.5 * metres * metres), Math.round(24.9 * metres * metres)];

    setResult({ bmi, bmr, ideal });
    storage.set('bmi', { height, weight, age, sex, activity, bmi });
  };

  const marker = result ? Math.min(100, Math.max(0, ((result.bmi - 14) / 26) * 100)) : 0;

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'BMI calculator' }]} />

      <div className="ff-sec-head">
        <span className="ff-eyebrow">Free tool</span>
        <h1 style={{ fontSize: 34 }}>BMI &amp; calorie calculator</h1>
        <p>Work out where you are today, then let us suggest the products that suit your goal.</p>
      </div>

      <div className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 420px) minmax(0, 1fr)' }}>
        <form className="ff-panel" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}
          onSubmit={calculate} noValidate>
          <h2 style={{ fontSize: 20 }}>Your measurements</h2>

          <label className="ff-field">
            <span>Height (cm)</span>
            <input className={`ff-input${errors.height ? ' is-invalid' : ''}`} inputMode="decimal"
              value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" aria-invalid={!!errors.height} />
            {errors.height && <em className="ff-field-error">{errors.height}</em>}
          </label>

          <label className="ff-field">
            <span>Weight (kg)</span>
            <input className={`ff-input${errors.weight ? ' is-invalid' : ''}`} inputMode="decimal"
              value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="72" aria-invalid={!!errors.weight} />
            {errors.weight && <em className="ff-field-error">{errors.weight}</em>}
          </label>

          <div className="ff-grid ff-g2">
            <label className="ff-field">
              <span>Age <span className="ff-muted">(optional)</span></span>
              <input className={`ff-input${errors.age ? ' is-invalid' : ''}`} inputMode="numeric"
                value={age} onChange={(e) => setAge(e.target.value)} placeholder="27" aria-invalid={!!errors.age} />
              {errors.age && <em className="ff-field-error">{errors.age}</em>}
            </label>
            <label className="ff-field">
              <span>Sex</span>
              <select className="ff-input" value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>

          <label className="ff-field">
            <span>Activity level</span>
            <select className="ff-input" value={activity} onChange={(e) => setActivity(e.target.value)}>
              <option value="1.2">Sedentary — desk job, no training</option>
              <option value="1.375">Light — train 1–3 days a week</option>
              <option value="1.55">Moderate — train 3–5 days a week</option>
              <option value="1.725">Heavy — train 6–7 days a week</option>
              <option value="1.9">Athlete — twice a day</option>
            </select>
          </label>

          <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit">Calculate my BMI</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {!result ? (
            <div className="ff-panel" style={{ padding: 40, textAlign: 'center' }}>
              <Icon name="chart" size={34} stroke="var(--ff-gray-400)" className="" />
              <h2 style={{ fontSize: 20, margin: '14px 0 8px' }}>Your result will appear here</h2>
              <p className="ff-muted">Fill in your height and weight to get a BMI reading and a product plan.</p>
            </div>
          ) : (
            <>
              <div className="ff-panel" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                  <span className="ff-display" style={{ fontSize: 54, fontWeight: 600, color: band.colour }}>
                    {result.bmi}
                  </span>
                  <div>
                    <span className={`ff-badge ${band.tone}`}>{band.label}</span>
                    {result.ideal?.length ? (
                      <p className="ff-muted" style={{ fontSize: 13, marginTop: 8 }}>
                        Healthy weight for your height: {result.ideal[0]}–{result.ideal[1]} kg
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div style={{ height: 10, borderRadius: 5, position: 'relative',
                    background: 'linear-gradient(90deg, #FDB022 0 17%, #12B76A 17% 42%, #FDB022 42% 62%, #B42318 62% 100%)' }}>
                    <span style={{ position: 'absolute', top: -5, left: `${marker}%`, transform: 'translateX(-50%)',
                      width: 20, height: 20, borderRadius: '50%', background: '#fff',
                      border: `3px solid ${band.colour}`, boxShadow: 'var(--ff-shadow)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11,
                    color: 'var(--ff-gray-500)', marginTop: 8 }}>
                    <span>14</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                  </div>
                </div>

                <p style={{ color: 'var(--ff-gray-700)' }}>{band.advice}</p>

                {calorieTargets && (
                  <div className="ff-grid ff-g3" style={{ gap: 14 }}>
                    {[
                      ['Maintain', calorieTargets.maintain],
                      ['Lose fat', calorieTargets.cut],
                      ['Build muscle', calorieTargets.bulk]
                    ].map(([label, value]) => (
                      <div key={label} style={{ padding: 16, background: 'var(--ff-gray-50)',
                        borderRadius: 'var(--ff-r-sm)', textAlign: 'center' }}>
                        <span className="ff-muted" style={{ fontSize: 12 }}>{label}</span>
                        <b className="ff-display ff-tnum" style={{ display: 'block', fontSize: 24, marginTop: 4 }}>
                          {value.toLocaleString('en-IN')}
                        </b>
                        <span className="ff-muted" style={{ fontSize: 11 }}>kcal / day</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="ff-muted" style={{ fontSize: 12 }}>
                  BMI is a rough screening tool, not a diagnosis — it does not distinguish muscle from fat.
                  Speak to a doctor or dietitian before making big changes.
                </p>
              </div>

              <section>
                <div className="ff-head-row">
                  <h2 style={{ fontSize: 24 }}>Picked for your goal</h2>
                  <Link className="ff-btn ff-btn-outline ff-btn-sm" to={`/category/${band.category}`}>View category</Link>
                </div>
                <ProductGrid products={products.slice(0, 3)} loading={loading} columns={3} />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
