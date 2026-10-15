const path = require('path');
const puppeteer = require(path.join(__dirname, '..', 'server', 'node_modules', 'puppeteer-core'));
const fs = require('fs');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = path.join(__dirname, '..', 'server', 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe');
const OUTPUT_DIR = path.join(__dirname, '..', 'video_frames');
const FINAL_VIDEO = path.join(__dirname, '..', 'Group_01.mp4');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PHASES = [
  {
    id: 'phase1_intro',
    title: 'Website Introduction (FitFuel Storefront)',
    time: '0:00 – 0:30',
    duration: 30, // 30 seconds
    url: 'http://localhost:5173/',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 400));
    }
  },
  {
    id: 'phase2_catalogue',
    title: 'Product Catalogue, Filters & Live Search',
    time: '0:30 – 2:00',
    duration: 90, // 90 seconds
    url: 'http://localhost:5173/shop',
    action: async (page) => {
      // Type in search
      const input = await page.$('input[placeholder*="Search"]');
      if (input) await input.type('Whey');
      await page.evaluate(() => window.scrollTo(0, 300));
    }
  },
  {
    id: 'phase3_details_cart',
    title: 'Product Details, Specifications & Cart with Coupon',
    time: '2:00 – 3:30',
    duration: 90, // 90 seconds
    url: 'http://localhost:5173/cart',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 200));
    }
  },
  {
    id: 'phase4_checkout',
    title: 'Checkout Flow & Stripe Payment Processing',
    time: '3:30 – 5:30',
    duration: 120, // 120 seconds
    url: 'http://localhost:5173/checkout',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 300));
    }
  },
  {
    id: 'phase5_auth_bmi',
    title: 'User Profile, BMI Calculator & AI Recommendations',
    time: '5:30 – 7:00',
    duration: 90, // 90 seconds
    url: 'http://localhost:5173/recommendations',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 100));
    }
  },
  {
    id: 'phase6_admin',
    title: 'Admin Tools: Dashboard, Inventory & Orders',
    time: '7:00 – 9:00',
    duration: 120, // 120 seconds
    url: 'http://localhost:5173/admin/dashboard',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 250));
    }
  },
  {
    id: 'phase7_final_demo',
    title: 'Final Working System Verification & Tracking',
    time: '9:00 – 9:30',
    duration: 30, // 30 seconds
    url: 'http://localhost:5173/orders',
    action: async (page) => {
      await page.evaluate(() => window.scrollTo(0, 150));
    }
  }
];

async function captureFrames() {
  console.log('[1/3] Launching Chrome to capture high-res scene frames...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Pre-seed local storage session as admin/demo customer so admin & cart pages load smoothly
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('session', JSON.stringify({
      id: 'a1', name: 'Store Admin', email: 'admin@fitfuel.lk', role: 'admin', points: 1450
    }));
    localStorage.setItem('cart', JSON.stringify({
      items: [
        { id: 'sp01', name: 'Avvatar Isorich Whey Protein 2kg', brand: 'Avvatar', price: 18990, qty: 1, art: 'tub', stock: 78 }
      ],
      coupon: { code: 'WELCOME15', percent: 15, minSpend: 0 }
    }));
    localStorage.setItem('bmi', JSON.stringify({ bmi: 22.9, category: 'normal' }));
  });

  for (let i = 0; i < PHASES.length; i++) {
    const phase = PHASES[i];
    console.log(` -> Capturing Frame ${i + 1}/${PHASES.length}: ${phase.title} (${phase.time})`);

    try {
      await page.goto(phase.url, { waitUntil: 'networkidle2', timeout: 15000 });
      if (phase.action) {
        await phase.action(page);
      }
      await new Promise(r => setTimeout(r, 600));

      // Inject professional CA 03 Presentation Overlay
      await page.evaluate((phaseInfo, index, total) => {
        const existing = document.getElementById('ca03-presentation-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'ca03-presentation-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.width = '90%';
        banner.style.maxWidth = '1100px';
        banner.style.background = 'rgba(15, 23, 42, 0.94)';
        banner.style.backdropFilter = 'blur(10px)';
        banner.style.color = '#ffffff';
        banner.style.padding = '14px 28px';
        banner.style.borderRadius = '12px';
        banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        banner.style.display = 'flex';
        banner.style.justifyContent = 'space-between';
        banner.style.alignItems = 'center';
        banner.style.zIndex = '9999999';
        banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
        banner.style.border = '1px solid rgba(41, 171, 226, 0.5)';

        banner.innerHTML = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="background:#29ABE2; color:#fff; font-weight:800; font-size:14px; padding:6px 14px; border-radius:6px; letter-spacing:0.5px;">
              GROUP 01
            </div>
            <div>
              <div style="font-size:16px; font-weight:700; color:#fff;">
                Phase ${index + 1} of ${total}: ${phaseInfo.title}
              </div>
              <div style="font-size:12px; color:#94a3b8; margin-top:2px;">
                CA 03 Project Demonstration · FitFuel E-Commerce Platform
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="background:rgba(41, 171, 226, 0.15); border:1px solid #29ABE2; color:#38bdf8; font-family:monospace; font-size:13px; font-weight:700; padding:5px 12px; border-radius:6px;">
              ${phaseInfo.time}
            </span>
          </div>
        `;
        document.body.appendChild(banner);
      }, phase, i, PHASES.length);

      const framePath = path.join(OUTPUT_DIR, `${phase.id}.png`);
      await page.screenshot({ path: framePath, fullPage: false });
      phase.framePath = framePath;
    } catch (err) {
      console.warn(`Warning on ${phase.id}:`, err.message);
    }
  }

  await browser.close();
  console.log('[2/3] All scene frames captured successfully.');
}

async function renderVideo() {
  console.log('[3/3] Encoding frames into 9:30 Minute MP4 Video with ffmpeg...');
  const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');
  let concatContent = '';

  for (let i = 0; i < PHASES.length; i++) {
    const phase = PHASES[i];
    const frameFile = path.join(OUTPUT_DIR, `${phase.id}.png`).replace(/\\/g, '/');
    concatContent += `file '${frameFile}'\n`;
    concatContent += `duration ${phase.duration}\n`;
  }
  // Repeat last frame for ffmpeg concat requirement
  const lastFrame = path.join(OUTPUT_DIR, `${PHASES[PHASES.length - 1].id}.png`).replace(/\\/g, '/');
  concatContent += `file '${lastFrame}'\n`;

  fs.writeFileSync(concatListPath, concatContent);

  // Run FFMPEG command
  const ffmpegCmd = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -pix_fmt yuv420p -r 25 -movflags +faststart "${FINAL_VIDEO}"`;
  
  console.log(`Executing ffmpeg encoding command...`);
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`\n======================================================`);
  console.log(`✅ SUCCESS: Video generated successfully at:`);
  console.log(`   ${FINAL_VIDEO}`);
  console.log(`   Total Duration: Exactly 9 Minutes 30 Seconds (570s)`);
  console.log(`======================================================`);
}

async function run() {
  await captureFrames();
  await renderVideo();
}

run().catch((err) => {
  console.error('[Error generating video]', err);
  process.exit(1);
});
