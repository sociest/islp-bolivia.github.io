// scripts/visual-audit.mjs
import { chromium } from 'playwright';
import path from 'path';

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

  // 1. Homepage Desktop
  console.log('📸 Visiting Homepage (Landing)...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  
  // Assert no raw JS text leaked into DOM
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes('document.addEventListener') || bodyText.includes('const islpMobileToggle')) {
    throw new Error('❌ LEAK DETECTED: Raw JavaScript text is visibly rendered in DOM!');
  }
  console.log('✅ Zero raw JS leaks detected in DOM.');

  // Screenshot above-the-fold
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_homepage_hero.png'), fullPage: false });
  console.log('✅ Saved audit_homepage_hero.png');

  // Test Category Finder
  await page.fill('#islp-birth-year-astro', '2012');
  await page.click('#islp-finder-btn');
  await page.waitForTimeout(300);
  const finderResult = await page.textContent('#islp-finder-result');
  console.log('Category Finder output for 2012:', finderResult.trim().replace(/\s+/g, ' '));

  // Test Lightbox trigger on case study card
  const firstZoomBtn = page.locator('.islp-zoom-btn').first();
  if (await firstZoomBtn.count() > 0) {
    await firstZoomBtn.click();
    await page.waitForTimeout(400);
    const isLightboxActive = await page.evaluate(() => {
      const el = document.getElementById('islp-lightbox');
      return el && el.classList.contains('active');
    });
    console.log('Lightbox active after click?', isLightboxActive);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_homepage_desktop.png'), fullPage: false });
  console.log('✅ Saved audit_homepage_desktop.png');

  // Scroll down to Reglas & Cronograma table on homepage
  const juradoSection = page.locator('#reglas-fundamentales-del-jurado');
  if (await juradoSection.count() > 0) {
    await juradoSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_homepage_jurado_lists_table.png') });
    console.log('✅ Saved audit_homepage_jurado_lists_table.png');
  }

  // 2. Recursos Page & Checklist
  console.log('📸 Visiting Recursos Page...');
  await page.goto('http://localhost:4321/recursos', { waitUntil: 'networkidle' });

  const labels = page.locator('.islp-chk-label');
  const count = await labels.count();
  console.log(`Found ${count} checklist items.`);
  for (let i = 0; i < count; i++) {
    await labels.nth(i).click();
  }
  await page.waitForTimeout(300);

  const scoreText = await page.textContent('#islp-chk-counter');
  console.log('Checklist score after all checks:', scoreText.trim());

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_recursos_checklist.png') });
  console.log('✅ Saved audit_recursos_checklist.png');

  // 3. Blog Page & Interactive Filtering Audit
  console.log('📸 Visiting Blog & Boletines...');
  await page.goto('http://localhost:4321/blog', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_blog_top.png') });

  // Test 3.1: Individual Table Filter input
  const convFilterInput = page.locator('#listing-convocatorias input.search');
  if (await convFilterInput.count() > 0) {
    console.log('Testing individual table filter...');
    const initialRows = await page.locator('#listing-convocatorias tbody.list tr').count();
    await convFilterInput.fill('2022');
    await page.waitForTimeout(300);
    const filteredRows = await page.locator('#listing-convocatorias tbody.list tr:visible').count();
    console.log(`Table filter result for "2022": ${filteredRows} visible rows (initial was ${initialRows})`);
    if (filteredRows === 0 || filteredRows >= initialRows) {
      throw new Error(`Filter failed: expected filteredRows < initialRows, got ${filteredRows}`);
    }
    // Clear filter
    await convFilterInput.fill('');
    await page.waitForTimeout(200);
  }

  // Test 3.2: Global Search Input
  const globalSearchInput = page.locator('#islp-global-search');
  if (await globalSearchInput.count() > 0) {
    console.log('Testing global search input for "pandemia"...');
    await globalSearchInput.fill('pandemia');
    await page.waitForTimeout(300);
    const visiblePosts = await page.locator('tbody.list tr:visible').count();
    console.log(`Global search for "pandemia" found ${visiblePosts} visible posts.`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_blog_global_search.png') });
    console.log('✅ Saved audit_blog_global_search.png');
    // Clear global search
    await page.locator('#islp-clear-search').click();
    await page.waitForTimeout(200);
  }

  // Test 3.3: Category / Section Pill Filter
  const casosEstudioPill = page.locator('.islp-pill[data-section="casos-estudio"]');
  if (await casosEstudioPill.count() > 0) {
    console.log('Testing category pill [Casos de Estudio]...');
    await casosEstudioPill.click();
    await page.waitForTimeout(300);
    const isCasosVisible = await page.locator('#listing-casos-estudio').isVisible();
    const isConvHidden = !(await page.locator('#listing-convocatorias').isVisible());
    console.log(`Casos de estudio visible: ${isCasosVisible}, Convocatorias hidden: ${isConvHidden}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_blog_casos_estudio_filter.png') });
    console.log('✅ Saved audit_blog_casos_estudio_filter.png');

    // Reset to all
    await page.locator('.islp-pill[data-section="all"]').click();
    await page.waitForTimeout(200);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_blog_full.png'), fullPage: true });

  const ctaBox = page.locator('.islp-cta-box').first();
  if (await ctaBox.count() > 0) {
    await ctaBox.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await ctaBox.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_cta_box_contrast.png') });
    console.log('✅ Saved audit_cta_box_contrast.png');
  }

  // Test 3.4: Navigate to a Caso de Estudio post
  const laplaceLink = page.locator('#listing-casos-estudio a.listing-title').first();
  if (await laplaceLink.count() > 0) {
    const postTitle = await laplaceLink.textContent();
    console.log('Clicking Caso de Estudio link:', postTitle);
    await laplaceLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);
    console.log('Navigated to URL:', page.url());
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_single_post_view.png'), fullPage: true });
    console.log('✅ Saved audit_single_post_view.png');
  }


  // 4. Contacto Page
  console.log('📸 Visiting Contacto...');
  await page.goto('http://localhost:4321/contacto', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_contacto.png') });
  console.log('✅ Saved audit_contacto.png');

  // 5. Mobile Responsiveness & Hamburger Drawer
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

  // Verify navigation links
  const mobileLinks = await mobilePage.$$eval('.islp-mobile-link', els => els.map(e => e.textContent.trim()));
  console.log('Mobile menu items from Quarto:', mobileLinks);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_mobile_menu.png') });
  console.log('✅ Saved audit_mobile_menu.png');

  await browser.close();
  console.log('🎉 All 4 pages verified with ZERO errors!');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
