// scripts/test-anchors.mjs
import { chromium } from 'playwright';

async function testAnchors() {
  console.log('🧪 Starting Anchor Jump Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];

  // Helper to assert element is visible and below the 70px header
  async function assertElementVisibleBelowHeader(selector, description) {
    const el = page.locator(selector).first();
    const count = await el.count();
    if (count === 0) {
      errors.push(`Target not found in DOM: ${selector} (${description})`);
      console.error(`❌ NOT FOUND: ${selector} (${description})`);
      return;
    }

    const box = await el.boundingBox();
    if (!box) {
      errors.push(`Element has no bounding box: ${selector} (${description})`);
      console.error(`❌ NO BOUNDS: ${selector} (${description})`);
      return;
    }

    // Header is sticky 70px at top. The element top should ideally be >= 65px so it's not occluded.
    console.log(`📍 ${description}: target ${selector} is at viewport Y=${Math.round(box.y)} (Header height ~70px)`);
    if (box.y < 50 && box.y + box.height < 70) {
      errors.push(`Element occluded by header: ${selector} (${description}), Y=${box.y}`);
      console.error(`⚠️ OCCLUDED: ${selector} (${description}) at Y=${box.y}`);
    } else {
      console.log(`✅ ${description} OK`);
    }
  }

  // 1. Landing page anchors
  console.log('\n--- Testing Homepage Anchors ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Test Category Finder jumps
  console.log('\nTesting Category Finder dynamic anchor generation:');
  const years = [
    { year: '2016', expectedHash: '#laplace', expectedId: '#laplace' },
    { year: '2013', expectedHash: '#bernoulli', expectedId: '#bernoulli' },
    { year: '2009', expectedHash: '#poisson', expectedId: '#poisson' },
    { year: '2002', expectedHash: '#gauss', expectedId: '#gauss' }
  ];

  for (const item of years) {
    await page.fill('#islp-birth-year-astro', item.year);
    await page.click('#islp-finder-btn');
    await page.waitForTimeout(200);

    const btn = page.locator('#islp-finder-result a');
    const href = await btn.getAttribute('href');
    console.log(`Year ${item.year} generated href="${href}"`);
    if (href !== item.expectedHash) {
      errors.push(`Wrong hash for ${item.year}: expected ${item.expectedHash}, got ${href}`);
    }

    await btn.click();
    await page.waitForTimeout(400);
    await assertElementVisibleBelowHeader(item.expectedId, `Category jump for ${item.year}`);
  }

  // Test Homepage Direct Hash Navigation
  const homeHashes = [
    { hash: '#categorias', id: '#categorias' },
    { hash: '#pasos', id: '#pasos' },
    { hash: '#galeria', id: '#galeria' },
    { hash: '#premios', id: '#premios' },
    { hash: '#reglas', id: '#reglas' },
    { hash: '#cronograma', id: '#cronograma' },
    { hash: '#faq', id: '#faq' },
    { hash: '#coordinacion', id: '#coordinacion' }
  ];

  for (const h of homeHashes) {
    await page.goto(`http://localhost:4321/${h.hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await assertElementVisibleBelowHeader(h.id, `Direct hash ${h.hash}`);
  }

  // 2. Cross-page Anchor Jumps: Home -> Recursos
  console.log('\n--- Testing Cross-page Anchors (Home -> Recursos) ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Hero button: ¡Inscribe a tu Equipo Ahora! -> /recursos#checklist
  const checklistBtn = page.locator('a[href*="/recursos#checklist"]').first();
  if (await checklistBtn.count() > 0) {
    await checklistBtn.click();
    await page.waitForTimeout(600);
    console.log(`Current URL: ${page.url()}`);
    await assertElementVisibleBelowHeader('#checklist', 'Cross-jump to #checklist');
  } else {
    errors.push('Hero button with href="/recursos#checklist" not found');
  }

  // Cross-jump: Return home, click Explorar Plantillas -> /recursos#plantillas
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  const plantillasBtn = page.locator('a[href*="/recursos#plantillas"]').first();
  if (await plantillasBtn.count() > 0) {
    await plantillasBtn.click();
    await page.waitForTimeout(600);
    console.log(`Current URL: ${page.url()}`);
    await assertElementVisibleBelowHeader('#plantillas', 'Cross-jump to #plantillas');
  } else {
    errors.push('Hero button with href="/recursos#plantillas" not found');
  }

  // Direct load: /recursos#datos
  await page.goto('http://localhost:4321/recursos#datos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await assertElementVisibleBelowHeader('#datos', 'Direct hash /recursos#datos');

  // 3. Blog Hash Navigation & Tab Filter Activation
  console.log('\n--- Testing Blog Hash Navigation ---');
  const blogSections = ['convocatorias', 'normativas', 'boletines', 'historico', 'casos-estudio'];

  for (const sec of blogSections) {
    await page.goto(`http://localhost:4321/blog#${sec}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // Check if the corresponding pill is active
    const activePill = page.locator(`.islp-pill[data-section="${sec}"]`);
    const isActive = await activePill.evaluate(el => el.classList.contains('active'));
    console.log(`Blog hash #${sec} -> pill active: ${isActive}`);
    if (!isActive) {
      errors.push(`Pill for #${sec} was not marked active`);
    }

    // Check if section is visible
    const listing = page.locator(`#listing-${sec}`);
    const isVisible = await listing.isVisible();
    console.log(`Listing #listing-${sec} visible: ${isVisible}`);
    if (!isVisible) {
      errors.push(`Listing for #${sec} is hidden!`);
    }
  }

  // 4. Post back-link to /#galeria
  console.log('\n--- Testing Post Link to #galeria ---');
  await page.goto('http://localhost:4321/posts/2022-06-15-caso-estudio-laplace-gotas-que-cuentan', { waitUntil: 'networkidle' });
  const galeriaLink = page.locator('a[href*="#galeria"]').first();
  if (await galeriaLink.count() > 0) {
    const targetHref = await galeriaLink.getAttribute('href');
    console.log(`Post link to galeria href: ${targetHref}`);
    await galeriaLink.click();
    await page.waitForTimeout(400);
    console.log(`Navigated to: ${page.url()}`);
    await assertElementVisibleBelowHeader('#galeria', 'Post return to #galeria');
  }

  await browser.close();

  console.log('\n=======================================');
  if (errors.length > 0) {
    console.error(`❌ Verification failed with ${errors.length} errors:`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL ANCHOR JUMPS AND HASHES RESOLVED SUCCESSFULLY WITH ZERO ERRORS!');
  }
}

testAnchors().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
