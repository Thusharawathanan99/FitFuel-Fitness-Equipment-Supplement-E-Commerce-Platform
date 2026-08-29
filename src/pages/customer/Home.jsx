import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import CategoryCard from '../../components/product/CategoryCard';
import ProductArt from '../../components/product/ProductArt';
import Icon from '../../components/common/Icon';
import { productService } from '../../services';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const SLIDES = [
  { title: <>In health<br />and wellness</>, sub: 'Advancing global wellbeing through trusted innovation.',
    word: 'GNC', cta: 'Shop supplements', to: '/category/protein' },
  { title: <>Build the gym.<br />Then fuel it.</>, sub: 'Commercial-grade equipment, delivered and assembled island-wide.',
    word: 'IRON', cta: 'Shop equipment', to: '/category/dumbbells' },
  { title: <>Train hard.<br />Live strong.</>, sub: 'Batch-verified stock, 38 brands, one checkout.',
    word: 'FUEL', cta: 'See best deals', to: '/shop' }
];

const FEATURES = [
  ['Personalized Nutrition Plans', 'Bulking, cutting or maintaining — our expert-curated blends keep your body in sync with the goal.'],
  ['Fast, Effective Results', 'Scientifically formulated supplements that support recovery, strength and energy.'],
  ['24/7 Expert Support', 'Certified nutrition experts are on chat around the clock to help you choose.'],
  ['Real-Time Consultation', 'Talk to fitness consultants, not bots. Real advice from people who lift.'],
  ['Seamless Integration', 'From pre-workout to post-gym recovery, it fits the routine you already have.'],
  ['We Lift With You', 'Community, knowledge centre and a team that answers — the partner, not just the shop.']
];

const SERVICES = [
  ['truck', 'Freight delivery', 'Heavy equipment ships on a pallet service with a two-person unload, island-wide.'],
  ['layers', 'Assembly service', 'Book installation at checkout. Racks and machines built and torque-checked on site.'],
  ['shield', 'Lifetime frame warranty', 'Frames covered for life, hardware and finish for five years. No receipt hunt.'],
  ['card', '0% instalments', 'Split any equipment over Rs 50,000 into three monthly payments at no extra cost.']
];

const FAQ = [
  ['Do you deliver gym equipment island-wide?', 'Yes. Heavy equipment ships on a pallet service with a two-person unload, anywhere in the country, in 7–10 working days. Ground floor is standard; upstairs delivery is bookable at checkout.'],
  ['Are the supplements genuine?', 'Every supplement listing shows its batch number, manufacture date and expiry before you add it to the cart. We buy direct from the brand or their appointed distributor.'],
  ['Can I return something?', 'Sealed supplements can be returned within 14 days. Equipment can be returned within 14 days unassembled, or exchanged under warranty at any point in the covered period.'],
  ['How does the 0% instalment work?', 'Any equipment order over Rs 50,000 can be split into three monthly payments at checkout. No interest and no processing fee.'],
  ['Do you offer assembly?', 'Yes, for Rs 12,000 on racks and machines. Book it at checkout and our team builds and torque-checks it on site.']
];

const BRAND_NAMES = ['GNC', 'INSANE LABZ', 'LABRADA', 'MUSCLEBLAZE', 'MYFITNESS', 'MUSCLETECH', 'Nutrex', 'ON'];

export default function Home() {
  useDocumentTitle();
  const [slide, setSlide] = useState(0);
  const [deals, setDeals] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    Promise.all([
      productService.getProducts({ group: 'supplement', sort: 'discount' }),
      productService.getProducts({ group: 'equipment', sort: 'popular' }),
      productService.getFeatured()
    ]).then(([s, e, f]) => {
      setDeals(s.slice(0, 4));
      setEquipment(e.slice(0, 4));
      setRecommended(f);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  const hero = SLIDES[slide];
  const equipmentCats = CATEGORIES.filter((c) => c.group === 'equipment').slice(0, 6);
  const countIn = (slug) => PRODUCTS.filter((p) => p.category === slug).length;

  return (
    <>
      {/* Hero carousel */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 520,
        display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg,#F4F7F9,#E8EDF1)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: -60, top: -80, width: '78%', height: 760,
          borderBottomLeftRadius: 460, background: 'linear-gradient(135deg,#9FDBF4,#5ABEE9 42%,#BFE7F7)' }} />
        <button className="ff-btn" aria-label="Previous slide"
          style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 3,
            width: 38, height: 38, padding: 0, borderRadius: '50%', background: 'var(--ff-brand-700)', color: '#fff' }}
          onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}>
          <Icon name="chevronLeft" size={18} stroke="#fff" strokeWidth={2} />
        </button>
        <button className="ff-btn" aria-label="Next slide"
          style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 3,
            width: 38, height: 38, padding: 0, borderRadius: '50%', background: 'var(--ff-brand-700)', color: '#fff' }}
          onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}>
          <Icon name="chevronRight" size={18} stroke="#fff" strokeWidth={2} />
        </button>

        <div className="ff-wrap" style={{ position: 'relative', display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.05fr)', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '56px 0' }}>
            <span className="ff-brand-name" style={{ fontSize: 28 }}>FitFuel</span>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontWeight: 500, letterSpacing: '-0.02em',
              fontSize: 'clamp(38px,4.4vw,64px)', lineHeight: 1.06, color: '#111' }}>{hero.title}</h1>
            <p style={{ fontSize: 18, color: '#212121', maxWidth: '46ch' }}>{hero.sub}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Link className="ff-btn ff-btn-primary ff-btn-lg" to={hero.to}>{hero.cta}</Link>
              <Link className="ff-btn ff-btn-outline ff-btn-lg" to="/shop">Browse everything</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8,
            position: 'relative', minHeight: 380 }}>
            <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 'clamp(52px,7vw,104px)', lineHeight: 1,
              color: '#E1251B', letterSpacing: '.04em' }}>{hero.word}</span>
            <ProductArt artKey="whey" /><ProductArt artKey="tub" /><ProductArt artKey="creatine" />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {SLIDES.map((s, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} aria-current={i === slide}
              onClick={() => setSlide(i)}
              style={{ width: i === slide ? 26 : 10, height: 10, borderRadius: 5, border: 0, cursor: 'pointer',
                background: i === slide ? 'var(--ff-brand-500)' : '#C5C5C5', transition: 'all .2s' }} />
          ))}
        </div>
      </section>

      {/* Brand partners */}
      <section className="ff-sec"><div className="ff-wrap">
        <div className="ff-sec-head"><h2>Our Protein Partners</h2></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'space-between',
          alignItems: 'center', opacity: .85 }}>
          {BRAND_NAMES.map((b) => (
            <Link key={b} to={`/search?q=${encodeURIComponent(b)}`}
              style={{ fontWeight: 700, fontSize: 19, color: 'var(--ff-gray-600)' }}>{b}</Link>
          ))}
        </div>
      </div></section>

      {/* Best deals */}
      <section className="ff-sec" style={{ paddingTop: 0 }}><div className="ff-wrap">
        <div className="ff-sec-head">
          <h2>Best Deals</h2>
          <p>The supplements our customers reorder most, at the sharpest price we can hold this month.</p>
        </div>
        <ProductGrid products={deals} loading={loading} />
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link className="ff-btn ff-btn-outline" to="/shop">See all deals</Link>
        </div>
      </div></section>

      {/* Equipment categories */}
      <section className="ff-sec ff-sec-grey"><div className="ff-wrap">
        <div className="ff-head-row">
          <div>
            <span className="ff-eyebrow">New at FitFuel</span>
            <h2 style={{ fontSize: 36, marginTop: 10 }}>Shop Fitness Equipment</h2>
            <p className="ff-muted" style={{ fontSize: 18, marginTop: 8 }}>
              Build the gym, then fuel it — same cart, same guarantee.
            </p>
          </div>
          <Link className="ff-btn ff-btn-primary" to="/category/dumbbells">
            Browse all equipment <Icon name="arrowRight" size={18} stroke="#fff" strokeWidth={2} />
          </Link>
        </div>
        <div className="ff-grid ff-g6">
          {equipmentCats.map((c) => <CategoryCard key={c.slug} category={c} count={countIn(c.slug)} />)}
        </div>
      </div></section>

      {/* Features */}
      <section className="ff-sec ff-sec-dark"><div className="ff-wrap">
        <div className="ff-sec-head">
          <span style={{ fontSize: 14, color: '#fff' }}>Features</span>
          <h2 style={{ color: 'var(--ff-brand-500)', fontSize: 'clamp(30px,4vw,48px)', lineHeight: 1.2 }}>
            Powerful, Proven and Always There for You
          </h2>
          <p>Everything we stock is batch-verified, warranty-backed and shipped from our own warehouse.</p>
        </div>
        <div className="ff-grid ff-g3" style={{ gap: '44px 40px' }}>
          {FEATURES.map(([title, body]) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 14, textAlign: 'center' }}>
              <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ff-brand-100)',
                display: 'grid', placeItems: 'center' }}>
                <Icon name="check" size={22} stroke="var(--ff-brand-700)" strokeWidth={1.8} />
              </span>
              <h3 style={{ fontSize: 20, color: '#fff' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#D4D4D4', lineHeight: 1.45 }}>{body}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Top equipment */}
      <section className="ff-sec"><div className="ff-wrap">
        <div className="ff-sec-head">
          <h2>Top Fitness Equipment</h2>
          <p>Commercial-grade gear, warranty-backed and delivered island-wide.</p>
        </div>
        <ProductGrid products={equipment} loading={loading} />
      </div></section>

      {/* Service strip */}
      <section className="ff-sec ff-sec-grey"><div className="ff-wrap">
        <div className="ff-grid ff-g4">
          {SERVICES.map(([icon, title, body]) => (
            <div key={title} className="ff-panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--ff-brand-100)',
                display: 'grid', placeItems: 'center' }}>
                <Icon name={icon} size={22} stroke="var(--ff-brand-700)" />
              </span>
              <h3 style={{ fontSize: 19 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--ff-gray-600)', lineHeight: 1.5 }}>{body}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Recommended */}
      <section className="ff-sec"><div className="ff-wrap">
        <div className="ff-sec-head">
          <h2>Recommended For You</h2>
          <p>Based on what lifters like you buy together — supplements and equipment in one basket.</p>
        </div>
        <ProductGrid products={recommended} loading={loading} />
      </div></section>

      {/* FAQ */}
      <section className="ff-sec"><div className="ff-wrap" style={{ maxWidth: 900 }}>
        <div className="ff-sec-head">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know about ordering, delivery and returns.</p>
        </div>
        {FAQ.map(([q, a], i) => (
          <div key={q} style={{ borderBottom: '1px solid var(--ff-gray-200)' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 24, padding: '24px 0', textAlign: 'left', background: 'none', border: 0, cursor: 'pointer' }}
            >
              <h3 style={{ fontSize: 21 }}>{q}</h3>
              <span style={{ flexShrink: 0 }}>
                <Icon name={openFaq === i ? 'minus' : 'plus'} size={22} stroke="var(--ff-brand-700)" strokeWidth={1.8} />
              </span>
            </button>
            {openFaq === i && (
              <p style={{ color: 'var(--ff-gray-600)', fontSize: 14, lineHeight: 1.6, paddingBottom: 22 }}>{a}</p>
            )}
          </div>
        ))}
      </div></section>
    </>
  );
}
