import { productImage } from '../../utils/images';

/**
 * Product visuals. Each key draws the product in the Figma card style.
 * When real photography arrives, map it in utils/images.js and it wins automatically.
 */
const tub = (cap, body, label, text) => (
  <svg viewBox="0 0 120 152" role="img" aria-label={text}>
    <rect x="30" y="0" width="60" height="20" rx="6" fill={cap} />
    <rect x="12" y="16" width="96" height="132" rx="18" fill={body} />
    <rect x="12" y="64" width="96" height="40" fill={label} />
    <text x="60" y="90" textAnchor="middle" fontFamily="Albert Sans, Arial" fontSize="15" fontWeight="700" fill="#fff">{text}</text>
  </svg>
);

const ART = {
  tub: () => tub('#2B2B2B', '#5A5A5A', '#3A3A3A', 'ISORICH'),
  whey: () => tub('#C8102E', '#F2F2F2', '#C8102E', 'WHEY'),
  creatine: () => tub('#1C1C1C', '#2A2A2A', '#29ABE2', 'CREATINE'),
  preworkout: () => tub('#111111', '#1F1F1F', '#FDB022', 'PRE-WO'),
  gainer: () => tub('#7A2E12', '#4A4A4A', '#C8102E', 'MASS'),
  bottle: () => (
    <svg viewBox="0 0 120 152" role="img" aria-label="Supplement bottle">
      <rect x="44" y="0" width="32" height="18" rx="5" fill="#111" />
      <rect x="26" y="14" width="68" height="130" rx="14" fill="#2A2A2A" />
      <rect x="26" y="62" width="68" height="38" fill="#E8642E" />
      <circle cx="60" cy="81" r="11" fill="#fff" />
    </svg>
  ),
  bar: () => (
    <svg viewBox="0 0 160 100" role="img" aria-label="Protein bar">
      <rect x="8" y="30" width="144" height="46" rx="10" fill="#2A2A2A" />
      <rect x="8" y="30" width="144" height="16" rx="8" fill="#E8642E" />
      <rect x="30" y="56" width="54" height="8" rx="4" fill="#29ABE2" />
    </svg>
  ),
  shaker: () => (
    <svg viewBox="0 0 120 152" role="img" aria-label="Shaker bottle">
      <rect x="38" y="0" width="44" height="16" rx="5" fill="#111" />
      <path d="M30 12h60v112a16 16 0 0 1-16 16H46a16 16 0 0 1-16-16z" fill="#3A3A3A" />
      <rect x="30" y="62" width="60" height="30" fill="#29ABE2" />
    </svg>
  ),
  dumbbell: () => (
    <svg viewBox="0 0 230 150" role="img" aria-label="Dumbbell">
      <rect x="66" y="64" width="98" height="22" rx="6" fill="#5A5A5A" />
      <rect x="48" y="40" width="20" height="70" rx="5" fill="#2A2A2A" />
      <rect x="162" y="40" width="20" height="70" rx="5" fill="#2A2A2A" />
      <rect x="22" y="28" width="26" height="94" rx="8" fill="#1C1C1C" />
      <rect x="182" y="28" width="26" height="94" rx="8" fill="#1C1C1C" />
      <rect x="27" y="66" width="16" height="18" rx="3" fill="#29ABE2" />
      <rect x="187" y="66" width="16" height="18" rx="3" fill="#29ABE2" />
    </svg>
  ),
  kettlebell: () => (
    <svg viewBox="0 0 200 220" role="img" aria-label="Kettlebell">
      <path d="M68 88C62 34 138 34 132 88" fill="none" stroke="#3A3A3A" strokeWidth="18" strokeLinecap="round" />
      <path d="M100 78c44 0 68 30 68 64s-30 56-68 56-68-22-68-56 24-64 68-64z" fill="#1C1C1C" />
      <rect x="72" y="150" width="56" height="13" rx="6" fill="#29ABE2" />
    </svg>
  ),
  barbell: () => (
    <svg viewBox="0 0 240 140" role="img" aria-label="Barbell">
      <rect x="34" y="62" width="172" height="11" rx="5" fill="#8A8A8A" />
      <rect x="46" y="42" width="12" height="52" rx="4" fill="#1C1C1C" />
      <rect x="62" y="30" width="15" height="76" rx="5" fill="#1C1C1C" />
      <rect x="163" y="30" width="15" height="76" rx="5" fill="#1C1C1C" />
      <rect x="182" y="42" width="12" height="52" rx="4" fill="#1C1C1C" />
      <rect x="94" y="58" width="52" height="19" rx="4" fill="#29ABE2" />
    </svg>
  ),
  plate: () => (
    <svg viewBox="0 0 200 200" role="img" aria-label="Bumper plate">
      <circle cx="100" cy="100" r="76" fill="#1C1C1C" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="#29ABE2" strokeWidth="7" />
      <circle cx="100" cy="100" r="26" fill="#F2F2F2" />
      <circle cx="100" cy="52" r="9" fill="#F2F2F2" /><circle cx="100" cy="148" r="9" fill="#F2F2F2" />
      <circle cx="52" cy="100" r="9" fill="#F2F2F2" /><circle cx="148" cy="100" r="9" fill="#F2F2F2" />
    </svg>
  ),
  rack: () => (
    <svg viewBox="0 0 200 230" role="img" aria-label="Power rack">
      <rect x="34" y="18" width="17" height="180" rx="4" fill="#2A2A2A" />
      <rect x="149" y="18" width="17" height="180" rx="4" fill="#2A2A2A" />
      <rect x="34" y="18" width="132" height="15" rx="4" fill="#1C1C1C" />
      <rect x="34" y="52" width="132" height="12" rx="4" fill="#29ABE2" />
      <rect x="34" y="110" width="132" height="9" rx="4" fill="#4A4A4A" />
      <rect x="14" y="192" width="62" height="15" rx="6" fill="#1C1C1C" />
      <rect x="124" y="192" width="62" height="15" rx="6" fill="#1C1C1C" />
    </svg>
  ),
  bench: () => (
    <svg viewBox="0 0 240 160" role="img" aria-label="Weight bench">
      <rect x="46" y="52" width="140" height="18" rx="8" fill="#1C1C1C" />
      <rect x="46" y="42" width="140" height="12" rx="6" fill="#29ABE2" />
      <rect x="58" y="70" width="13" height="60" rx="4" fill="#3A3A3A" />
      <rect x="162" y="70" width="13" height="60" rx="4" fill="#3A3A3A" />
      <rect x="36" y="126" width="50" height="12" rx="6" fill="#2A2A2A" />
      <rect x="148" y="126" width="50" height="12" rx="6" fill="#2A2A2A" />
    </svg>
  ),
  treadmill: () => (
    <svg viewBox="0 0 240 170" role="img" aria-label="Cardio machine">
      <rect x="26" y="118" width="150" height="18" rx="6" fill="#1C1C1C" transform="rotate(-7 101 127)" />
      <rect x="158" y="40" width="14" height="86" rx="5" fill="#3A3A3A" />
      <rect x="132" y="20" width="66" height="28" rx="6" fill="#29ABE2" />
      <circle cx="36" cy="142" r="10" fill="#3A3A3A" /><circle cx="172" cy="142" r="10" fill="#3A3A3A" />
    </svg>
  ),
  mat: () => (
    <svg viewBox="0 0 220 160" role="img" aria-label="Training mat">
      <rect x="30" y="46" width="150" height="72" rx="36" fill="#2A2A2A" />
      <circle cx="70" cy="82" r="28" fill="#29ABE2" /><circle cx="70" cy="82" r="11" fill="#1C1C1C" />
    </svg>
  ),
  belt: () => (
    <svg viewBox="0 0 200 120" role="img" aria-label="Lifting belt">
      <rect x="24" y="44" width="152" height="34" rx="8" fill="#2A2A2A" />
      <rect x="88" y="34" width="30" height="54" rx="5" fill="#1C1C1C" />
      <rect x="96" y="46" width="14" height="30" rx="3" fill="#29ABE2" />
      <circle cx="46" cy="61" r="4" fill="#1C1C1C" /><circle cx="62" cy="61" r="4" fill="#1C1C1C" />
    </svg>
  ),
  tree: () => (
    <svg viewBox="0 0 200 220" role="img" aria-label="Plate tree">
      <rect x="88" y="20" width="16" height="160" rx="4" fill="#2A2A2A" />
      <rect x="52" y="44" width="88" height="12" rx="6" fill="#1C1C1C" />
      <rect x="52" y="80" width="88" height="12" rx="6" fill="#1C1C1C" />
      <rect x="52" y="116" width="88" height="12" rx="6" fill="#29ABE2" />
      <rect x="46" y="176" width="100" height="14" rx="6" fill="#1C1C1C" />
    </svg>
  ),
  band: () => (
    <svg viewBox="0 0 200 160" role="img" aria-label="Resistance bands">
      <path d="M44 58C14 88 44 128 84 116c40-12 68-48 38-72" fill="none" stroke="#29ABE2" strokeWidth="14" strokeLinecap="round" />
      <rect x="30" y="42" width="28" height="16" rx="8" fill="#1C1C1C" />
      <rect x="112" y="30" width="28" height="16" rx="8" fill="#1C1C1C" />
    </svg>
  ),
  rope: () => (
    <svg viewBox="0 0 200 160" role="img" aria-label="Rope">
      <path d="M28 128c30-8 24-52 54-58s30 40 60 32" fill="none" stroke="#2A2A2A" strokeWidth="16" strokeLinecap="round" />
      <rect x="14" y="116" width="26" height="24" rx="6" fill="#1C1C1C" />
      <rect x="152" y="88" width="26" height="24" rx="6" fill="#29ABE2" />
    </svg>
  )
};

export default function ProductArt({ product, artKey, className = '', style }) {
  const key = artKey || product?.art || 'tub';
  const photo = product ? productImage(product) : null;
  if (photo) {
    return <img src={photo} alt={product.name} className={className} style={style} loading="lazy" />;
  }
  const render = ART[key] || ART.tub;
  return <div className={className} style={{ display: 'grid', placeItems: 'center', width: '100%', ...style }}>{render()}</div>;
}
