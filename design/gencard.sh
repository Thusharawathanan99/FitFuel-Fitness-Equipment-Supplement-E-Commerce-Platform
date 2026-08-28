#!/bin/bash
# Product illustrations (drawn stand-ins for the Figma photo assets)
sv_isorich='<svg width="196" height="240" viewBox="0 0 196 240"><rect x="62" y="8" width="72" height="30" rx="7" fill="#2B2B2B"/><rect x="46" y="32" width="104" height="196" rx="20" fill="#5A5A5A"/><rect x="46" y="32" width="104" height="60" rx="20" fill="#6E6E6E"/><path d="M46 120h104v58H46z" fill="#3A3A3A"/><text x="98" y="152" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="21" font-weight="700">ISORICH</text><rect x="64" y="186" width="68" height="22" rx="4" fill="#C86A2E"/><text x="98" y="201" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="9">CHOCOLATE</text></svg>'
sv_whey='<svg width="196" height="240" viewBox="0 0 196 240"><rect x="62" y="8" width="72" height="30" rx="7" fill="#C8102E"/><rect x="46" y="32" width="104" height="196" rx="20" fill="#F2F2F2"/><rect x="46" y="32" width="104" height="34" fill="#C8102E"/><text x="98" y="128" text-anchor="middle" fill="#C8102E" font-family="Arial" font-size="24" font-weight="700">WHEY</text><text x="98" y="152" text-anchor="middle" fill="#212121" font-family="Arial" font-size="13" font-weight="700">GOLD STANDARD</text><rect x="60" y="176" width="76" height="24" rx="4" fill="#212121"/><text x="98" y="193" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="11">2 kg</text></svg>'
sv_creatine='<svg width="196" height="240" viewBox="0 0 196 240"><rect x="68" y="14" width="60" height="26" rx="6" fill="#1C1C1C"/><rect x="52" y="36" width="92" height="188" rx="18" fill="#2A2A2A"/><rect x="52" y="112" width="92" height="62" fill="#29ABE2"/><text x="98" y="150" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="17" font-weight="700">CREATINE</text><text x="98" y="196" text-anchor="middle" fill="#9A9A9A" font-family="Arial" font-size="11">500 g</text></svg>'
sv_preworkout='<svg width="196" height="240" viewBox="0 0 196 240"><rect x="66" y="10" width="64" height="28" rx="6" fill="#111111"/><path d="M50 36h96v170a18 18 0 0 1-18 18H68a18 18 0 0 1-18-18z" fill="#1F1F1F"/><rect x="50" y="112" width="96" height="56" fill="#FDB022"/><text x="98" y="148" text-anchor="middle" fill="#111111" font-family="Arial" font-size="17" font-weight="700">PRE-WO</text><path d="M84 186l14 22 14-22" stroke="#FDB022" stroke-width="4" fill="none" stroke-linecap="round"/></svg>'
sv_dumbbell='<svg width="230" height="150" viewBox="0 0 230 150"><rect x="66" y="64" width="98" height="22" rx="6" fill="#5A5A5A"/><rect x="48" y="40" width="20" height="70" rx="5" fill="#2A2A2A"/><rect x="162" y="40" width="20" height="70" rx="5" fill="#2A2A2A"/><rect x="22" y="28" width="26" height="94" rx="8" fill="#1C1C1C"/><rect x="182" y="28" width="26" height="94" rx="8" fill="#1C1C1C"/><rect x="27" y="66" width="16" height="18" rx="3" fill="#29ABE2"/><rect x="187" y="66" width="16" height="18" rx="3" fill="#29ABE2"/></svg>'
sv_kettlebell='<svg width="200" height="220" viewBox="0 0 200 220"><path d="M68 88C62 34 138 34 132 88" fill="none" stroke="#3A3A3A" stroke-width="18" stroke-linecap="round"/><path d="M100 78c44 0 68 30 68 64s-30 56-68 56-68-22-68-56 24-64 68-64z" fill="#1C1C1C"/><rect x="72" y="150" width="56" height="13" rx="6.5" fill="#29ABE2"/><text x="100" y="128" text-anchor="middle" fill="#8A8A8A" font-family="Arial" font-size="18" font-weight="700">16kg</text></svg>'
sv_barbell='<svg width="240" height="140" viewBox="0 0 240 140"><rect x="34" y="62" width="172" height="11" rx="5.5" fill="#8A8A8A"/><rect x="46" y="42" width="12" height="52" rx="4" fill="#1C1C1C"/><rect x="62" y="30" width="15" height="76" rx="5" fill="#1C1C1C"/><rect x="163" y="30" width="15" height="76" rx="5" fill="#1C1C1C"/><rect x="182" y="42" width="12" height="52" rx="4" fill="#1C1C1C"/><rect x="94" y="58" width="52" height="19" rx="4" fill="#29ABE2"/></svg>'
sv_rack='<svg width="200" height="230" viewBox="0 0 200 230"><rect x="42" y="18" width="17" height="180" rx="4" fill="#2A2A2A"/><rect x="141" y="18" width="17" height="180" rx="4" fill="#2A2A2A"/><rect x="42" y="18" width="116" height="15" rx="4" fill="#1C1C1C"/><rect x="42" y="56" width="116" height="12" rx="4" fill="#29ABE2"/><rect x="42" y="112" width="116" height="9" rx="4" fill="#4A4A4A"/><rect x="22" y="192" width="62" height="15" rx="6" fill="#1C1C1C"/><rect x="116" y="192" width="62" height="15" rx="6" fill="#1C1C1C"/><circle cx="50.5" cy="86" r="3.2" fill="#8A8A8A"/><circle cx="50.5" cy="100" r="3.2" fill="#8A8A8A"/><circle cx="149.5" cy="86" r="3.2" fill="#8A8A8A"/><circle cx="149.5" cy="100" r="3.2" fill="#8A8A8A"/></svg>'
sv_bench='<svg width="240" height="160" viewBox="0 0 240 160"><rect x="46" y="52" width="140" height="18" rx="8" fill="#1C1C1C"/><rect x="46" y="42" width="140" height="12" rx="6" fill="#29ABE2"/><rect x="58" y="70" width="13" height="60" rx="4" fill="#3A3A3A"/><rect x="162" y="70" width="13" height="60" rx="4" fill="#3A3A3A"/><rect x="36" y="126" width="50" height="12" rx="6" fill="#2A2A2A"/><rect x="148" y="126" width="50" height="12" rx="6" fill="#2A2A2A"/></svg>'
sv_plate='<svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="76" fill="#1C1C1C"/><circle cx="100" cy="100" r="76" fill="none" stroke="#29ABE2" stroke-width="7"/><circle cx="100" cy="100" r="26" fill="#F2F2F2"/><circle cx="100" cy="52" r="9" fill="#F2F2F2"/><circle cx="100" cy="148" r="9" fill="#F2F2F2"/><circle cx="52" cy="100" r="9" fill="#F2F2F2"/><circle cx="148" cy="100" r="9" fill="#F2F2F2"/><text x="100" y="107" text-anchor="middle" fill="#1C1C1C" font-family="Arial" font-size="16" font-weight="700">20</text></svg>'
sv_treadmill='<svg width="240" height="170" viewBox="0 0 240 170"><rect x="26" y="118" width="150" height="18" rx="6" fill="#1C1C1C" transform="rotate(-7 101 127)"/><rect x="158" y="40" width="14" height="86" rx="5" fill="#3A3A3A"/><rect x="132" y="20" width="66" height="28" rx="6" fill="#29ABE2"/><circle cx="36" cy="142" r="10" fill="#3A3A3A"/><circle cx="172" cy="142" r="10" fill="#3A3A3A"/></svg>'
sv_mat='<svg width="220" height="160" viewBox="0 0 220 160"><rect x="30" y="46" width="150" height="72" rx="36" fill="#2A2A2A"/><circle cx="70" cy="82" r="28" fill="#29ABE2"/><circle cx="70" cy="82" r="11" fill="#1C1C1C"/></svg>'

star_full='<svg width="20" height="20" viewBox="0 0 24 24" fill="#FDB022"><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z"/></svg>'
star_half='<svg width="20" height="20" viewBox="0 0 24 24"><defs><linearGradient id="hf"><stop offset="50%" stop-color="#FDB022"/><stop offset="50%" stop-color="#5A5A5A"/></linearGradient></defs><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z" fill="url(#hf)"/></svg>'
muscle='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11.5c1.8-3 4-4.2 6.5-4.2 2.2 0 3.4 1.1 4.6 2.6 1 1.3 2.3 1.9 3.9 1.9 1.4 0 2.2.9 2.2 2.1 0 2.4-2.3 4.6-5.6 4.6-2 0-3.3-.6-4.9-1.6-1.3-.8-2.4-1.1-3.6-1.1-1.7 0-3.1-1.4-3.1-2.9 0-.5.0-1 .0-1.4z"/></svg>'

# card <svgkey> <title> <price> <oldprice> <offpct> <ratingcount> <halfstar:y|n>
card() {
  local sv; eval "sv=\$sv_$1"
  local stars=""
  local i
  for i in 1 2 3 4; do stars="$stars$star_full"; done
  if [ "$7" = "y" ]; then stars="$stars$star_half"; else stars="$stars$star_full"; fi
  cat <<CARD
        <div style="position: relative; background: #FFFFFF; border: 1px solid #333333; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column;">
          <div style="width: 100%; aspect-ratio: 1 / 1; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">${sv}</div>
          <div style="position: relative; margin-top: -44px; height: 258px; background: #333333; clip-path: polygon(0 17%, 100% 7%, 100% 100%, 0 100%); padding: 60px 18px 18px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="position: absolute; top: 30px; right: 18px; width: 17px; height: 17px; border: 1.25px solid #12B76A; display: flex; align-items: center; justify-content: center;">
              <span style="width: 8.75px; height: 8.75px; border-radius: 50%; background: #12B76A;"></span>
            </div>
            <p class="mm" style="font-weight: 500; font-size: 22px; line-height: 28px; letter-spacing: -0.48px; color: #FFFFFF; padding-right: 26px;">${2}</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div style="display: flex; gap: 5px;">${stars}</div>
                  <span style="font-weight: 500; font-size: 12px; line-height: 18px; color: #D4D4D4;">( ${6} )</span>
                </div>
                <div style="display: flex; gap: 8px; row-gap: 6px; align-items: center; flex-wrap: wrap;">
                  <span class="mm" style="font-weight: 600; font-size: 24px; line-height: 30px; color: #29ABE2; white-space: nowrap;">Rs ${3}</span>
                  <span class="mm" style="font-weight: 500; font-size: 16px; line-height: 24px; color: #737373; text-decoration: line-through; white-space: nowrap;">Rs ${4}</span>
                  <span style="background: #027A48; border-radius: 16px; padding: 2px 8px; font-weight: 500; font-size: 12px; line-height: 18px; color: #D1FADF; white-space: nowrap; flex-shrink: 0;">${5} off</span>
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: stretch;">
                <div style="flex: 1 0 0; min-width: 0; height: 48px; background: #198ABA; border: 1px solid #198ABA; border-radius: 9.5px; box-shadow: 0px 1px 2px rgba(10,13,18,0.05); display: flex; gap: 12px; align-items: center; justify-content: center; padding: 12px 16px;">
                  ${muscle}
                  <span style="font-weight: 600; font-size: 14px; line-height: 16px; color: #FFFFFF; white-space: nowrap;">Buy Now</span>
                  <span style="display: flex; transform: scaleX(-1);">${muscle}</span>
                </div>
                <div style="background: #FAFAFA; border: 1px solid #FAFAFA; border-radius: 12px; box-shadow: 0px 1px 2px rgba(10,13,18,0.05); display: flex; align-items: center; justify-content: center; padding: 14px;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#414651" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2.5h1.83l1.92 9.33a1.67 1.67 0 0 0 1.67 1.34h6.42a1.67 1.67 0 0 0 1.66-1.29L17.5 6.67H5.17"/><circle cx="8.33" cy="16.67" r="1.08"/><circle cx="15" cy="16.67" r="1.08"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div style="position: absolute; top: 23px; right: 20px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 50px; box-shadow: 0px 1px 2px rgba(10,13,18,0.05); padding: 14px; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#414651" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"><path d="M17.08 7.08c0 4.17-7.08 8.75-7.08 8.75S2.92 11.25 2.92 7.08a3.75 3.75 0 0 1 7.08-1.67 3.75 3.75 0 0 1 7.08 1.67z"/></svg>
          </div>
          <div style="position: absolute; right: 20px; top: 302px; width: 17px; height: 17px; border: 1.25px solid #12B76A; display: flex; align-items: center; justify-content: center;">
            <span style="width: 8.75px; height: 8.75px; border-radius: 50%; background: #12B76A;"></span>
          </div>
        </div>
CARD
}
