/* FitFuel Prototype Builder
   Builds Product / Cart / Checkout / Confirmation screens on the
   "FitFuel — Fitness Equipment" page and wires every prototype connection. */

const HEX = h => {
  const n = parseInt(h.slice(1), 16);
  return { type: 'SOLID', color: { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 } };
};

async function main() {
  const page = figma.root.children.find(p => p.name === 'FitFuel — Fitness Equipment');
  if (!page) { figma.closePlugin('Page "FitFuel — Fitness Equipment" not found.'); return; }
  await figma.setCurrentPageAsync(page);

  const home = page.children.find(n => n.name === 'FitFuel — Home Page');
  const eqPage = page.children.find(n => n.name === 'FitFuel — Fitness Equipment page');
  if (!home) { figma.closePlugin('Frame "FitFuel — Home Page" not found.'); return; }

  await Promise.all([
    figma.loadFontAsync({ family: 'MuseoModerno', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'MuseoModerno', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Albert Sans', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Albert Sans', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Albert Sans', style: 'Bold' })
  ]);

  /* ---------- helpers ---------- */
  const T = (t, f, s, z, l, c) => {
    const n = figma.createText();
    n.fontName = { family: f, style: s }; n.characters = t;
    n.fontSize = z; n.lineHeight = { unit: 'PIXELS', value: l }; n.fills = [HEX(c)];
    return n;
  };
  const R = (w, h, c, r) => {
    const n = figma.createRectangle(); n.resize(w, h);
    n.fills = c ? [HEX(c)] : []; if (r) n.cornerRadius = r; return n;
  };
  const AL = (dir, props) => {
    const f = figma.createFrame();
    f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.fills = []; if (props) { for (const k in props) f[k] = props[k]; } return f;
  };
  const add = (p, n, x, y) => { p.appendChild(n); n.x = x; n.y = y; return n; };
  const SH = [{ type: 'DROP_SHADOW', color: { r: 10 / 255, g: 13 / 255, b: 18 / 255, a: 0.05 },
                offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdrSrc = home.children.find(n => n.name === 'Header');
  const screen = (name, x) => {
    const f = AL('VERTICAL', { name: name, itemSpacing: 0 });
    f.fills = [HEX('#FFFFFF')];
    page.appendChild(f); f.x = x; f.y = 0;
    f.layoutSizingHorizontal = 'FIXED'; f.resize(1463, 600); f.layoutSizingVertical = 'HUG';
    if (hdrSrc) { const h = hdrSrc.clone(); f.appendChild(h); h.layoutSizingHorizontal = 'FILL'; }
    return f;
  };
  const btn = (label, bg, fg) => {
    const b = AL('HORIZONTAL', { name: label, cornerRadius: 8, paddingTop: 15, paddingBottom: 15,
      paddingLeft: 24, paddingRight: 24, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
    b.fills = [HEX(bg)]; b.effects = SH;
    b.appendChild(T(label, 'Albert Sans', 'SemiBold', 15, 20, fg)); return b;
  };
  const panel = pad => {
    const p = AL('VERTICAL', { name: 'panel', cornerRadius: 12, paddingTop: pad, paddingBottom: pad,
      paddingLeft: pad, paddingRight: pad, itemSpacing: 14 });
    p.fills = [HEX('#FFFFFF')]; p.strokes = [HEX('#E9EAEB')]; p.strokeWeight = 1; p.effects = SH; return p;
  };
  const row = (parent, k, v, vc, bold) => {
    const r = AL('HORIZONTAL', { name: k, primaryAxisAlignItems: 'SPACE_BETWEEN', itemSpacing: 16 });
    parent.appendChild(r); r.layoutSizingHorizontal = 'FILL';
    r.appendChild(T(k, 'Albert Sans', bold ? 'Bold' : 'Regular', bold ? 17 : 15, bold ? 24 : 22, '#181D27'));
    r.appendChild(T(v, 'Albert Sans', 'SemiBold', bold ? 17 : 15, bold ? 24 : 22, vc || '#181D27'));
    return r;
  };
  const dumb = k => {
    const f = figma.createFrame(); f.name = 'art'; f.resize(76 * k, 52 * k); f.fills = []; f.clipsContent = false;
    [[22,22,32,8,'#5A5A5A',3],[16,13,7,26,'#2A2A2A',2],[53,13,7,26,'#2A2A2A',2],[7,9,9,34,'#1C1C1C',3],
     [60,9,9,34,'#1C1C1C',3],[9,22,5,8,'#29ABE2',1],[62,22,5,8,'#29ABE2',1]]
      .forEach(s => add(f, R(s[2]*k, s[3]*k, s[4], s[5]*k), s[0]*k, s[1]*k));
    return f;
  };
  const steps = (parent, active) => {
    const s = AL('HORIZONTAL', { name: 'Steps', itemSpacing: 14, counterAxisAlignItems: 'CENTER' });
    parent.appendChild(s); s.layoutSizingHorizontal = 'FILL';
    ['Cart', 'Delivery', 'Payment', 'Done'].forEach((l, i) => {
      const st = AL('HORIZONTAL', { name: l, itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
      s.appendChild(st);
      const on = i === active, done = i < active;
      const dot = figma.createFrame(); dot.name = 'n'; dot.resize(28, 28); dot.cornerRadius = 14; dot.clipsContent = false;
      dot.fills = [HEX(on ? '#333333' : done ? '#29ABE2' : '#FFFFFF')];
      if (!on && !done) { dot.strokes = [HEX('#D5D7DA')]; dot.strokeWeight = 1; }
      const dn = T(done ? '✓' : String(i + 1), 'Albert Sans', 'Bold', 13, 17, (on || done) ? '#FFFFFF' : '#737373');
      add(dot, dn, 0, 6); dn.resize(28, dn.height); dn.textAlignHorizontal = 'CENTER';
      st.appendChild(dot);
      st.appendChild(T(l, 'Albert Sans', on ? 'Bold' : 'Regular', 14, 20, on ? '#181D27' : '#737373'));
      if (i < 3) { const ln = R(1, 1, '#E9EAEB'); s.appendChild(ln); ln.layoutSizingHorizontal = 'FILL'; ln.resize(ln.width, 1); }
    });
  };
  const body = (frame, padTop, padBottom, gap) => {
    const b = AL('VERTICAL', { name: 'Body', paddingTop: padTop, paddingBottom: padBottom,
      paddingLeft: 91, paddingRight: 92, itemSpacing: gap });
    frame.appendChild(b); b.layoutSizingHorizontal = 'FILL'; b.layoutSizingVertical = 'HUG'; return b;
  };

  /* ---------- 03 · Product detail ---------- */
  const prod = screen('03 · Product detail', 4880);
  const pw = body(prod, 26, 70, 30);
  const crumb = AL('HORIZONTAL', { name: 'Breadcrumb', itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
  pw.appendChild(crumb);
  const cHome = T('Home', 'Albert Sans', 'Regular', 13, 18, '#535862'); cHome.name = 'crumb-home'; crumb.appendChild(cHome);
  crumb.appendChild(T('/', 'Albert Sans', 'Regular', 13, 18, '#A3A3A3'));
  const cEq = T('Fitness Equipment', 'Albert Sans', 'Regular', 13, 18, '#535862'); cEq.name = 'crumb-equipment'; crumb.appendChild(cEq);
  crumb.appendChild(T('/', 'Albert Sans', 'Regular', 13, 18, '#A3A3A3'));
  crumb.appendChild(T('Rubber Hex Dumbbell 20kg Pair', 'Albert Sans', 'SemiBold', 13, 18, '#126588'));

  const two = AL('HORIZONTAL', { name: 'Detail', itemSpacing: 56, counterAxisAlignItems: 'MIN' });
  pw.appendChild(two); two.layoutSizingHorizontal = 'FILL'; two.layoutSizingVertical = 'HUG';
  const gal = figma.createFrame(); gal.name = 'Gallery';
  gal.fills = [HEX('#FAFAFA')]; gal.strokes = [HEX('#E9EAEB')]; gal.strokeWeight = 1;
  gal.cornerRadius = 12; gal.clipsContent = true; gal.resize(620, 480);
  two.appendChild(gal); gal.layoutSizingHorizontal = 'FILL'; gal.layoutSizingVertical = 'FIXED'; gal.resize(gal.width, 480);
  add(gal, dumb(3.4), (620 - 76 * 3.4) / 2, (480 - 52 * 3.4) / 2);
  const flag = AL('HORIZONTAL', { name: 'Flag', cornerRadius: 16, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6 });
  flag.fills = [HEX('#29ABE2')];
  flag.appendChild(T('14% off', 'Albert Sans', 'SemiBold', 12, 16, '#FFFFFF')); add(gal, flag, 20, 20);

  const info = AL('VERTICAL', { name: 'Buy box', itemSpacing: 18 });
  two.appendChild(info); info.layoutSizingHorizontal = 'FILL'; info.layoutSizingVertical = 'HUG';
  const meta = AL('HORIZONTAL', { name: 'meta', itemSpacing: 12, counterAxisAlignItems: 'CENTER' });
  info.appendChild(meta);
  meta.appendChild(T('IRONCORE', 'Albert Sans', 'SemiBold', 11, 16, '#29ABE2'));
  meta.appendChild(T('·', 'Albert Sans', 'Regular', 11, 16, '#A3A3A3'));
  meta.appendChild(T('SKU EQ1', 'Albert Sans', 'SemiBold', 11, 16, '#737373'));
  info.appendChild(T('Rubber Hex Dumbbell\n20kg Pair', 'MuseoModerno', 'SemiBold', 40, 48, '#181D27'));
  const rate = AL('HORIZONTAL', { name: 'Rating', itemSpacing: 6, counterAxisAlignItems: 'CENTER' });
  info.appendChild(rate);
  for (let i = 0; i < 5; i++) {
    const st = figma.createStar(); st.pointCount = 5; st.innerRadius = 0.4;
    st.resize(18, 18); st.fills = [HEX('#FDB022')]; st.strokes = []; rate.appendChild(st);
  }
  rate.appendChild(T('4.9', 'Albert Sans', 'SemiBold', 14, 20, '#181D27'));
  rate.appendChild(T('1,200 reviews', 'Albert Sans', 'Regular', 14, 20, '#535862'));
  const prow = AL('HORIZONTAL', { name: 'Price', itemSpacing: 12, counterAxisAlignItems: 'BASELINE', paddingBottom: 18 });
  prow.strokes = [HEX('#E9EAEB')]; prow.strokeWeight = 1;
  prow.strokeTopWeight = 0; prow.strokeBottomWeight = 1; prow.strokeLeftWeight = 0; prow.strokeRightWeight = 0;
  info.appendChild(prow); prow.layoutSizingHorizontal = 'FILL';
  prow.appendChild(T('Rs 18,900', 'MuseoModerno', 'SemiBold', 42, 50, '#29ABE2'));
  const wasT = T('Rs 22,000', 'MuseoModerno', 'Medium', 20, 28, '#737373'); wasT.textDecoration = 'STRIKETHROUGH'; prow.appendChild(wasT);
  const sv = AL('HORIZONTAL', { name: 'save', cornerRadius: 16, paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3 });
  sv.fills = [HEX('#027A48')];
  sv.appendChild(T('You save Rs 3,100', 'Albert Sans', 'Regular', 12, 18, '#D1FADF')); prow.appendChild(sv);
  const dsc = T('Rubber-encased hex heads that will not roll or chip your floor, on a knurled chrome handle sized for a real grip.',
    'Albert Sans', 'Regular', 17, 28, '#404040');
  info.appendChild(dsc); dsc.layoutSizingHorizontal = 'FILL'; dsc.textAutoResize = 'HEIGHT';
  const spec = panel(20); spec.fills = [HEX('#FAFAFA')]; info.appendChild(spec); spec.layoutSizingHorizontal = 'FILL';
  spec.appendChild(T('Specifications', 'Albert Sans', 'Bold', 16, 22, '#181D27'));
  [['Weight', '20 kg × 2'], ['Handle', '32 mm knurled chrome'], ['Head', 'Rubber-encased hex'], ['Warranty', '5 years']]
    .forEach(kv => row(spec, kv[0], kv[1]));
  const acts = AL('HORIZONTAL', { name: 'Actions', itemSpacing: 12, counterAxisAlignItems: 'CENTER' });
  info.appendChild(acts); acts.layoutSizingHorizontal = 'FILL';
  const qty = AL('HORIZONTAL', { name: 'Qty', cornerRadius: 8, paddingLeft: 16, paddingRight: 16,
    paddingTop: 15, paddingBottom: 15, itemSpacing: 22, counterAxisAlignItems: 'CENTER' });
  qty.fills = [HEX('#FFFFFF')]; qty.strokes = [HEX('#D5D7DA')]; qty.strokeWeight = 1;
  acts.appendChild(qty);
  qty.appendChild(T('−', 'Albert Sans', 'SemiBold', 18, 22, '#414651'));
  qty.appendChild(T('1', 'Albert Sans', 'Bold', 17, 22, '#181D27'));
  qty.appendChild(T('+', 'Albert Sans', 'SemiBold', 18, 22, '#414651'));
  const addBtn = btn('Add to cart', '#333333', '#FFFFFF'); acts.appendChild(addBtn); addBtn.layoutSizingHorizontal = 'FILL';
  const buyBtn = btn('Buy it now', '#29ABE2', '#FFFFFF'); info.appendChild(buyBtn); buyBtn.layoutSizingHorizontal = 'FILL';

  /* ---------- 04 · Cart ---------- */
  const cartS = screen('04 · Cart', 6480);
  const cw = body(cartS, 36, 80, 26);
  cw.appendChild(T('Your cart', 'MuseoModerno', 'SemiBold', 44, 54, '#181D27'));
  steps(cw, 0);
  const cbody = AL('HORIZONTAL', { name: 'Cart body', itemSpacing: 32, counterAxisAlignItems: 'MIN' });
  cw.appendChild(cbody); cbody.layoutSizingHorizontal = 'FILL'; cbody.layoutSizingVertical = 'HUG';
  const lines = panel(26); cbody.appendChild(lines); lines.layoutSizingHorizontal = 'FILL';
  const banner = AL('HORIZONTAL', { name: 'Free delivery', cornerRadius: 8, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 });
  banner.fills = [HEX('#D1FADF')];
  lines.appendChild(banner); banner.layoutSizingHorizontal = 'FILL';
  banner.appendChild(T('✓  You qualify for free island-wide delivery', 'Albert Sans', 'SemiBold', 14, 20, '#027A48'));
  [['Rubber Hex Dumbbell 20kg Pair', 'IRONCORE', '2', 'Rs 37,800', 'Rs 44,000'],
   ['Cast Iron Kettlebell 16kg', 'IRONCORE', '1', 'Rs 12,400', 'Rs 14,500']].forEach(p => {
    const ln = AL('HORIZONTAL', { name: p[0], itemSpacing: 20, counterAxisAlignItems: 'CENTER', paddingTop: 20, paddingBottom: 20 });
    ln.strokes = [HEX('#E9EAEB')]; ln.strokeWeight = 1;
    ln.strokeTopWeight = 0; ln.strokeBottomWeight = 1; ln.strokeLeftWeight = 0; ln.strokeRightWeight = 0;
    lines.appendChild(ln); ln.layoutSizingHorizontal = 'FILL';
    const th = figma.createFrame(); th.name = 'art'; th.resize(96, 96);
    th.fills = [HEX('#FAFAFA')]; th.strokes = [HEX('#E9EAEB')]; th.strokeWeight = 1; th.cornerRadius = 12; th.clipsContent = true;
    add(th, dumb(1), 10, 22); ln.appendChild(th);
    const col = AL('VERTICAL', { name: 'info', itemSpacing: 6 });
    ln.appendChild(col); col.layoutSizingHorizontal = 'FILL'; col.layoutSizingVertical = 'HUG';
    col.appendChild(T(p[1], 'Albert Sans', 'SemiBold', 11, 16, '#737373'));
    col.appendChild(T(p[0], 'MuseoModerno', 'SemiBold', 18, 24, '#181D27'));
    const qr = AL('HORIZONTAL', { name: 'qty', itemSpacing: 14, counterAxisAlignItems: 'CENTER' }); col.appendChild(qr);
    const qb = AL('HORIZONTAL', { name: 'stepper', cornerRadius: 8, paddingLeft: 14, paddingRight: 14,
      paddingTop: 8, paddingBottom: 8, itemSpacing: 20, counterAxisAlignItems: 'CENTER' });
    qb.fills = [HEX('#FFFFFF')]; qb.strokes = [HEX('#D5D7DA')]; qb.strokeWeight = 1;
    qr.appendChild(qb);
    qb.appendChild(T('−', 'Albert Sans', 'SemiBold', 16, 20, '#414651'));
    qb.appendChild(T(p[2], 'Albert Sans', 'Bold', 15, 20, '#181D27'));
    qb.appendChild(T('+', 'Albert Sans', 'SemiBold', 16, 20, '#414651'));
    qr.appendChild(T('Remove', 'Albert Sans', 'SemiBold', 13, 18, '#B42318'));
    const pc = AL('VERTICAL', { name: 'price', itemSpacing: 4, counterAxisAlignItems: 'MAX' }); ln.appendChild(pc);
    pc.appendChild(T(p[3], 'Albert Sans', 'Bold', 20, 26, '#181D27'));
    const w2 = T(p[4], 'Albert Sans', 'Regular', 13, 18, '#737373'); w2.textDecoration = 'STRIKETHROUGH'; pc.appendChild(w2);
  });
  const sum = panel(26); cbody.appendChild(sum);
  sum.layoutSizingHorizontal = 'FIXED'; sum.resize(380, 300); sum.layoutSizingVertical = 'HUG';
  sum.appendChild(T('Order summary', 'MuseoModerno', 'SemiBold', 22, 30, '#181D27'));
  row(sum, 'Subtotal', 'Rs 50,200');
  row(sum, 'You save', '− Rs 8,300', '#027A48');
  row(sum, 'Delivery', 'Free', '#027A48');
  const totWrap = AL('VERTICAL', { name: 'Total', paddingTop: 18, itemSpacing: 0 });
  totWrap.strokes = [HEX('#E9EAEB')]; totWrap.strokeWeight = 1;
  totWrap.strokeTopWeight = 1; totWrap.strokeBottomWeight = 0; totWrap.strokeLeftWeight = 0; totWrap.strokeRightWeight = 0;
  sum.appendChild(totWrap); totWrap.layoutSizingHorizontal = 'FILL';
  row(totWrap, 'Total', 'Rs 50,200', '#181D27', true);
  const coBtn = btn('Checkout', '#333333', '#FFFFFF'); sum.appendChild(coBtn); coBtn.layoutSizingHorizontal = 'FILL';

  /* ---------- 05 · Checkout ---------- */
  const co = screen('05 · Checkout', 8080);
  const kw = body(co, 36, 80, 26);
  kw.appendChild(T('Checkout', 'MuseoModerno', 'SemiBold', 44, 54, '#181D27'));
  steps(kw, 2);
  const kbody = AL('HORIZONTAL', { name: 'Checkout body', itemSpacing: 32, counterAxisAlignItems: 'MIN' });
  kw.appendChild(kbody); kbody.layoutSizingHorizontal = 'FILL'; kbody.layoutSizingVertical = 'HUG';
  const forms = AL('VERTICAL', { name: 'Forms', itemSpacing: 16 });
  kbody.appendChild(forms); forms.layoutSizingHorizontal = 'FILL'; forms.layoutSizingVertical = 'HUG';
  const field = (parent, label, placeholder) => {
    const f = AL('VERTICAL', { name: label, itemSpacing: 7 });
    parent.appendChild(f); f.layoutSizingHorizontal = 'FILL';
    f.appendChild(T(label, 'Albert Sans', 'SemiBold', 13, 18, '#535862'));
    const i = AL('HORIZONTAL', { name: 'input', cornerRadius: 8, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 });
    i.fills = [HEX('#FFFFFF')]; i.strokes = [HEX('#D5D7DA')]; i.strokeWeight = 1; i.effects = SH;
    f.appendChild(i); i.layoutSizingHorizontal = 'FILL';
    i.appendChild(T(placeholder, 'Albert Sans', 'Regular', 15, 20, '#737373'));
    return f;
  };
  const pair = parent => {
    const r = AL('HORIZONTAL', { name: 'row', itemSpacing: 14 });
    parent.appendChild(r); r.layoutSizingHorizontal = 'FILL'; return r;
  };
  const sec1 = panel(26); forms.appendChild(sec1); sec1.layoutSizingHorizontal = 'FILL';
  sec1.appendChild(T('Contact', 'MuseoModerno', 'SemiBold', 20, 28, '#181D27'));
  const r1 = pair(sec1); field(r1, 'Full name', 'Your name'); field(r1, 'Email', 'you@example.com');
  field(sec1, 'Mobile', '07X XXX XXXX');
  const sec2 = panel(26); forms.appendChild(sec2); sec2.layoutSizingHorizontal = 'FILL';
  sec2.appendChild(T('Delivery address', 'MuseoModerno', 'SemiBold', 20, 28, '#181D27'));
  field(sec2, 'Address', 'House / building, street');
  const r2 = pair(sec2); field(r2, 'City', 'City'); field(r2, 'Postal code', '00000');
  const sec3 = panel(26); forms.appendChild(sec3); sec3.layoutSizingHorizontal = 'FILL';
  sec3.appendChild(T('Payment', 'MuseoModerno', 'SemiBold', 20, 28, '#181D27'));
  const pays = AL('HORIZONTAL', { name: 'Methods', itemSpacing: 10 });
  sec3.appendChild(pays); pays.layoutSizingHorizontal = 'FILL';
  ['Card', 'Cash on delivery', 'Bank transfer'].forEach((m, i) => {
    const b = btn(m, i ? '#FFFFFF' : '#333333', i ? '#414651' : '#FFFFFF');
    if (i) { b.strokes = [HEX('#D5D7DA')]; b.strokeWeight = 1; }
    pays.appendChild(b); b.layoutSizingHorizontal = 'FILL';
  });
  field(sec3, 'Card number', '0000 0000 0000 0000');
  const r3 = pair(sec3); field(r3, 'Expiry', 'MM / YY'); field(r3, 'CVV', '123');

  const ksum = panel(26); kbody.appendChild(ksum);
  ksum.layoutSizingHorizontal = 'FIXED'; ksum.resize(380, 300); ksum.layoutSizingVertical = 'HUG';
  ksum.appendChild(T('Your order', 'MuseoModerno', 'SemiBold', 20, 28, '#181D27'));
  row(ksum, 'Hex Dumbbell 20kg × 2', 'Rs 37,800');
  row(ksum, 'Kettlebell 16kg × 1', 'Rs 12,400');
  row(ksum, 'Delivery', 'Free', '#027A48');
  const kTot = AL('VERTICAL', { name: 'Total', paddingTop: 18, itemSpacing: 0 });
  kTot.strokes = [HEX('#E9EAEB')]; kTot.strokeWeight = 1;
  kTot.strokeTopWeight = 1; kTot.strokeBottomWeight = 0; kTot.strokeLeftWeight = 0; kTot.strokeRightWeight = 0;
  ksum.appendChild(kTot); kTot.layoutSizingHorizontal = 'FILL';
  row(kTot, 'Total', 'Rs 50,200', '#181D27', true);
  const placeBtn = btn('Place order', '#29ABE2', '#FFFFFF'); ksum.appendChild(placeBtn); placeBtn.layoutSizingHorizontal = 'FILL';

  /* ---------- 06 · Order confirmed ---------- */
  const done = screen('06 · Order confirmed', 9680);
  const dw = body(done, 90, 120, 22);
  dw.counterAxisAlignItems = 'CENTER';
  const tick = figma.createFrame(); tick.name = 'tick'; tick.resize(76, 76);
  tick.cornerRadius = 38; tick.fills = [HEX('#D1FADF')]; tick.clipsContent = false;
  const tk = T('✓', 'Albert Sans', 'Bold', 36, 46, '#027A48'); add(tick, tk, 0, 16); tk.resize(76, tk.height); tk.textAlignHorizontal = 'CENTER';
  dw.appendChild(tick);
  const dTitle = T('Order confirmed', 'MuseoModerno', 'SemiBold', 44, 54, '#181D27'); dw.appendChild(dTitle);
  const dSub = T('Thanks — we have sent the receipt to your email.', 'Albert Sans', 'Regular', 18, 28, '#535862');
  dw.appendChild(dSub);
  const dRef = T('Order #FF-24817  ·  Total Rs 50,200  ·  Arriving in 2–4 working days', 'Albert Sans', 'SemiBold', 16, 24, '#181D27');
  dw.appendChild(dRef);
  const dActs = AL('HORIZONTAL', { name: 'Actions', itemSpacing: 12 }); dw.appendChild(dActs);
  const backBtn = btn('Back to home', '#29ABE2', '#FFFFFF'); dActs.appendChild(backBtn);
  const shopBtn = btn('Keep shopping', '#FFFFFF', '#414651');
  shopBtn.strokes = [HEX('#D5D7DA')]; shopBtn.strokeWeight = 1; dActs.appendChild(shopBtn);

  /* ---------- prototype wiring ---------- */
  const link = async (node, dest) => {
    if (!node || !dest) return 0;
    await node.setReactionsAsync([{
      trigger: { type: 'ON_CLICK' },
      actions: [{ type: 'NODE', destinationId: dest.id, navigation: 'NAVIGATE',
                  transition: null, preserveScrollPosition: false }]
    }]);
    return 1;
  };
  const findAll = (scope, name) => scope.findAll(n => n.name === name);
  let wired = 0;
  const wireAll = async (scope, name, dest) => {
    const hits = findAll(scope, name);
    for (const h of hits) wired += await link(h, dest);
  };

  const eqDest = eqPage || prod;
  // every screen's header: logo -> home, cart icon -> cart
  for (const scr of [home, eqPage, prod, cartS, co, done]) {
    if (!scr) continue;
    await wireAll(scr, 'Logo', home);
    await wireAll(scr, 'cart', cartS);
    await wireAll(scr, 'Equipment', eqDest);
  }
  // home -> equipment listing
  await wireAll(home, 'Browse all equipment', eqDest);
  ['Dumbbells', 'Kettlebells', 'Barbells & Plates', 'Racks & Rigs', 'Benches', 'Cardio']
    .forEach(() => {});
  for (const t of ['Dumbbells', 'Kettlebells', 'Barbells & Plates', 'Racks & Rigs', 'Benches', 'Cardio'])
    await wireAll(home, t, eqDest);
  // product cards -> product detail
  for (const n of ['Rubber Hex Dumbbell 20kg Pair', 'Forge Power Rack PR-500', 'Adjustable FID Weight Bench',
                   'Cast Iron Kettlebell 16kg', 'Avvatar Isorich Health Supplement Protein',
                   'ON Gold Standard 100% Whey 2kg', 'Micronised Creatine Monohydrate 500g',
                   'Insane Labz Psychotic Pre-Workout 300g'])
    await wireAll(home, n, prod);
  await wireAll(home, 'Buy Now', cartS);
  if (eqPage) {
    await wireAll(eqPage, 'Shop all equipment', prod);
    await wireAll(eqPage, 'Ask a trainer', prod);
  }
  // product -> cart
  await link(addBtn, cartS);
  await link(buyBtn, cartS);
  await link(cHome, home);
  await link(cEq, eqDest);
  // cart -> checkout -> done -> home
  await link(coBtn, co);
  await link(placeBtn, done);
  await link(backBtn, home);
  await link(shopBtn, eqDest);

  page.flowStartingPoints = [{ nodeId: home.id, name: 'FitFuel — start here' }];
  figma.currentPage.selection = [home];
  figma.viewport.scrollAndZoomIntoView([home, eqPage, prod, cartS, co, done].filter(Boolean));

  figma.closePlugin('FitFuel prototype ready — ' + wired + ' extra links wired. Press ▶ to run it.');
}

main().catch(e => figma.closePlugin('Error: ' + e.message));
