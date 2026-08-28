#!/bin/bash
# svg library
svg_dumbbell='<svg width="176" height="106" viewBox="0 0 200 120"><rect x="58" y="52" width="84" height="16" rx="3" fill="#2A2823"/><rect x="42" y="34" width="16" height="52" rx="3" fill="#121210"/><rect x="142" y="34" width="16" height="52" rx="3" fill="#121210"/><rect x="22" y="24" width="20" height="72" rx="4" fill="#2A2823"/><rect x="158" y="24" width="20" height="72" rx="4" fill="#2A2823"/><rect x="26" y="52" width="12" height="16" rx="2" fill="#CBF43C"/><rect x="162" y="52" width="12" height="16" rx="2" fill="#CBF43C"/></svg>'
svg_kettlebell='<svg width="146" height="146" viewBox="0 0 160 160"><path d="M54 70C50 28 110 28 106 70" fill="none" stroke="#2A2823" stroke-width="13" stroke-linecap="round"/><path d="M80 62c34 0 52 22 52 48s-24 42-52 42-52-16-52-42 18-48 52-48z" fill="#121210"/><rect x="60" y="112" width="40" height="9" rx="4.5" fill="#CBF43C"/></svg>'
svg_plate='<svg width="146" height="146" viewBox="0 0 160 160"><circle cx="80" cy="80" r="58" fill="#121210"/><circle cx="80" cy="80" r="20" fill="#EDE8DB"/><circle cx="80" cy="44" r="7" fill="#EDE8DB"/><circle cx="80" cy="116" r="7" fill="#EDE8DB"/><circle cx="44" cy="80" r="7" fill="#EDE8DB"/><circle cx="116" cy="80" r="7" fill="#EDE8DB"/><circle cx="80" cy="80" r="58" fill="none" stroke="#CBF43C" stroke-width="5"/></svg>'
svg_bench='<svg width="176" height="122" viewBox="0 0 200 140"><rect x="40" y="52" width="112" height="14" rx="6" fill="#121210"/><rect x="48" y="66" width="10" height="48" rx="3" fill="#2A2823"/><rect x="134" y="66" width="10" height="48" rx="3" fill="#2A2823"/><rect x="32" y="110" width="38" height="9" rx="4" fill="#2A2823"/><rect x="122" y="110" width="38" height="9" rx="4" fill="#2A2823"/><rect x="40" y="44" width="112" height="9" rx="4" fill="#CBF43C"/></svg>'
svg_rack='<svg width="146" height="146" viewBox="0 0 160 160"><rect x="34" y="24" width="12" height="106" rx="3" fill="#2A2823"/><rect x="114" y="24" width="12" height="106" rx="3" fill="#2A2823"/><rect x="34" y="44" width="92" height="10" rx="3" fill="#CBF43C"/><rect x="34" y="74" width="92" height="8" rx="3" fill="#121210"/><rect x="18" y="128" width="46" height="10" rx="4" fill="#121210"/><rect x="96" y="128" width="46" height="10" rx="4" fill="#121210"/></svg>'
svg_barbell='<svg width="176" height="106" viewBox="0 0 200 120"><rect x="30" y="56" width="140" height="8" rx="4" fill="#2A2823"/><rect x="40" y="40" width="9" height="40" rx="3" fill="#121210"/><rect x="52" y="32" width="11" height="56" rx="3" fill="#121210"/><rect x="137" y="32" width="11" height="56" rx="3" fill="#121210"/><rect x="151" y="40" width="9" height="40" rx="3" fill="#121210"/><rect x="78" y="52" width="44" height="16" rx="3" fill="#CBF43C"/></svg>'
svg_tree='<svg width="146" height="146" viewBox="0 0 160 160"><rect x="74" y="24" width="12" height="106" rx="3" fill="#2A2823"/><rect x="46" y="44" width="68" height="9" rx="4" fill="#121210"/><rect x="46" y="68" width="68" height="9" rx="4" fill="#121210"/><rect x="46" y="92" width="68" height="9" rx="4" fill="#CBF43C"/><rect x="40" y="128" width="80" height="10" rx="4" fill="#121210"/></svg>'
svg_belt='<svg width="176" height="106" viewBox="0 0 200 120"><rect x="24" y="44" width="152" height="32" rx="6" fill="#2A2823"/><rect x="88" y="34" width="30" height="52" rx="4" fill="#121210"/><rect x="96" y="46" width="14" height="28" rx="2" fill="#CBF43C"/><circle cx="46" cy="60" r="4" fill="#121210"/><circle cx="62" cy="60" r="4" fill="#121210"/><circle cx="140" cy="60" r="4" fill="#121210"/></svg>'
svg_tub='<svg width="132" height="132" viewBox="0 0 160 160"><rect x="42" y="46" width="76" height="92" rx="7" fill="#2A2823"/><rect x="36" y="26" width="88" height="22" rx="5" fill="#121210"/><rect x="42" y="74" width="76" height="40" fill="#CBF43C"/><rect x="52" y="86" width="42" height="6" rx="3" fill="#121210"/><rect x="52" y="98" width="26" height="6" rx="3" fill="#121210"/></svg>'
svg_shaker='<svg width="132" height="132" viewBox="0 0 160 160"><rect x="52" y="30" width="56" height="18" rx="4" fill="#121210"/><path d="M50 50h60v72a14 14 0 0 1-14 14H64a14 14 0 0 1-14-14z" fill="#2A2823"/><rect x="50" y="92" width="60" height="30" fill="#E8642E"/><path d="M60 106h14M84 100l8 12" stroke="#F7F4ED" stroke-width="4" stroke-linecap="round"/></svg>'
svg_jar='<svg width="132" height="132" viewBox="0 0 160 160"><rect x="56" y="34" width="48" height="16" rx="4" fill="#121210"/><rect x="48" y="50" width="64" height="80" rx="8" fill="#2A2823"/><rect x="48" y="78" width="64" height="28" fill="#CBF43C"/><rect x="58" y="88" width="30" height="6" rx="3" fill="#121210"/></svg>'
svg_bottle='<svg width="132" height="132" viewBox="0 0 160 160"><rect x="62" y="28" width="36" height="18" rx="4" fill="#121210"/><rect x="52" y="46" width="56" height="86" rx="9" fill="#2A2823"/><rect x="52" y="74" width="56" height="32" fill="#E8642E"/><circle cx="80" cy="90" r="8" fill="#F7F4ED"/></svg>'
svg_bar='<svg width="132" height="132" viewBox="0 0 160 160"><rect x="26" y="60" width="108" height="40" rx="8" fill="#2A2823"/><rect x="26" y="60" width="108" height="16" rx="8" fill="#E8642E"/><rect x="44" y="84" width="40" height="6" rx="3" fill="#CBF43C"/></svg>'
svg_band='<svg width="146" height="146" viewBox="0 0 160 160"><path d="M44 58C14 88 44 128 84 116c40-12 68-48 38-72" fill="none" stroke="#E8642E" stroke-width="13" stroke-linecap="round"/><rect x="30" y="42" width="28" height="16" rx="8" fill="#121210"/><rect x="108" y="30" width="28" height="16" rx="8" fill="#121210"/></svg>'
svg_mat='<svg width="146" height="146" viewBox="0 0 160 160"><rect x="26" y="52" width="108" height="58" rx="29" fill="#2A2823"/><circle cx="55" cy="81" r="21" fill="#CBF43C"/><circle cx="55" cy="81" r="8" fill="#121210"/></svg>'
svg_rope='<svg width="146" height="146" viewBox="0 0 160 160"><path d="M28 118c22-6 18-40 40-44s22 30 44 24" fill="none" stroke="#2A2823" stroke-width="14" stroke-linecap="round"/><rect x="18" y="108" width="22" height="20" rx="5" fill="#121210"/><rect x="118" y="88" width="22" height="20" rx="5" fill="#CBF43C"/></svg>'

# card <svgkey> <brand> <name> <price> <oldprice|-> <rating> <count> <badge|-> <badgecolor: volt|ink|ember|->
card() {
  local sv; eval "sv=\$svg_$1"
  local badge=""
  if [ "$8" != "-" ]; then
    case "$9" in
      volt)  badge='<span class="lbl" style="position: absolute; top: 14px; left: 14px; background: #CBF43C; color: #121210; padding: 5px 9px; border-radius: 2px;">'"$8"'</span>' ;;
      ember) badge='<span class="lbl" style="position: absolute; top: 14px; left: 14px; background: #E8642E; color: #F7F4ED; padding: 5px 9px; border-radius: 2px;">'"$8"'</span>' ;;
      *)     badge='<span class="lbl" style="position: absolute; top: 14px; left: 14px; background: #121210; color: #CBF43C; padding: 5px 9px; border-radius: 2px;">'"$8"'</span>' ;;
    esac
  fi
  local old=""
  [ "$5" != "-" ] && old='<span style="font-size: 14px; color: #6F6B5E; text-decoration: line-through;">Rs '"$5"'</span>'
  cat <<CARD
        <div style="background: #FFFFFF; border: 1px solid #DAD4C4; border-radius: 3px; display: flex; flex-direction: column;">
          <div style="height: 236px; background: #EDE8DB; border-bottom: 1px solid #DAD4C4; position: relative; display: flex; align-items: center; justify-content: center;">
            ${badge}
            <span style="position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border-radius: 50%; background: #F7F4ED; display: flex; align-items: center; justify-content: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6F6B5E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2z"/></svg></span>
            ${sv}
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
            <span class="lbl" style="color: #6F6B5E;">${2}</span>
            <h4 style="font-size: 17px; line-height: 1.2;">${3}</h4>
            <div style="display: flex; align-items: center; gap: 7px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#E8642E"><path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.4l7-.9z"/></svg>
              <span style="font-size: 13px; font-weight: 600;">${6}</span>
              <span style="font-size: 13px; color: #6F6B5E;">(${7})</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 9px; margin-top: 2px;">
              <span style="font-size: 21px; font-weight: 700;">Rs ${4}</span>
              ${old}
            </div>
            <div style="margin-top: 8px; height: 46px; background: #121210; color: #F7F4ED; border-radius: 3px; display: flex; align-items: center; justify-content: center; gap: 9px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBF43C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
              <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">Add to cart</span>
            </div>
          </div>
        </div>
CARD
}
