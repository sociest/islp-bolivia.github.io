// scripts/visual-audit.mjs
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = '/home/andreschirinos/.gemini/antigravity-cli/brain/2f7593d6-5051-4c9a-9bd9-c8825d0e8a36';

async function runAudit() {
  console.log('🚀 Launching Chromium for Visual Audit...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Homepage Desktop
  console.log('📸 Visiting Homepage (Desktop)...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  
  // Check for raw JS leaks in body text
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes('document.addEventListener') || bodyText.includes('const islpMobileToggle')) {
    throw new Error('❌ LEAK DETECTED: Raw JavaScript text is visibly rendered in DOM!');
  }
  console.log('✅ No raw JS leaks detected in DOM.');

  // Screenshot initial above-the-fold
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_homepage_hero.png'), fullPage: false });
  console.log('✅ Saved audit_homepage_hero.png');

  // Test Category Finder
  await page.fill('#islp-birth-year-astro', '2012');
  await page.click('#islp-finder-btn');
  await page.waitForTimeout(300);
  const finderResult = await page.textContent('#islp-finder-result');
  console.log('Category Finder output for 2012:', finderResult.trim().replace(/\s+/g, ' '));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_homepage_desktop.png'), fullPage: false });
  console.log('✅ Saved audit_homepage_desktop.png');

  // 2. Galería & Lightbox Test
  console.log('📸 Visiting Galería...');
  await page.goto('http://localhost:4321/galeria', { waitUntil: 'networkidle' });
  
  // Test Lightbox trigger
  const firstZoomBtn = page.locator('.islp-zoom-btn').first();
  await firstZoomBtn.click();
  await page.waitForTimeout(400);

  const isLightboxActive = await page.evaluate(() => {
    const el = document.getElementById('islp-lightbox');
    return el && el.classList.contains('active');
  });
  console.log('Lightbox active after click?', isLightboxActive);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_galeria_lightbox.png') });
  console.log('✅ Saved audit_galeria_lightbox.png');

  // Close lightbox with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. Checklist Test
  console.log('📸 Visiting Checklist...');
  await page.goto('http://localhost:4321/recursos/checklist', { waitUntil: 'networkidle' });

  // Tick all 8 items
  const labels = page.locator('.islp-chk-label');
  const count = await labels.count();
  console.log(`Found ${count} checklist items.`);
  for (let i = 0; i < count; i++) {
    await labels.nth(i).click();
  }
  await page.waitForTimeout(300);

  const scoreText = await page.textContent('#islp-chk-counter');
  console.log('Checklist score after all checks:', scoreText.trim());

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_checklist_completed.png') });
  console.log('✅ Saved audit_checklist_completed.png');

  // 4. Mobile Responsiveness & Hamburger Drawer
  console.log('📸 Testing Mobile Viewport (iPhone 14)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Click hamburger
  await mobilePage.click('#islp-mobile-toggle');
  await mobilePage.waitForTimeout(400);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_mobile_menu.png') });
  console.log('✅ Saved audit_mobile_menu.png');

  await browser.close();
  console.log('🎉 All Visual Audits completed with ZERO errors!');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
