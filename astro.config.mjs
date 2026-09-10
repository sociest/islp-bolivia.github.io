import { defineConfig } from 'astro/config';

// Detect deployment environment from GitHub Actions
const repo = process.env.GITHUB_REPOSITORY || '';
const [owner, repoName] = repo.split('/');

let site = 'https://islp-bolivia.github.io';
let base = '/';

if (owner && repoName) {
  if (owner === 'islp-bolivia' && repoName === 'islp-bolivia.github.io') {
    // Official production organization site: serves at root domain
    site = 'https://islp-bolivia.github.io';
    base = '/';
  } else {
    // Fork/testing repo (e.g. sociest/islp-bolivia.github.io)
    // GitHub Pages serves under /<repoName>/
    base = `/${repoName}/`;
    site = owner === 'sociest' ? 'https://static.sociest.org' : `https://${owner}.github.io`;
  }
}

// Allow explicit manual overrides if specified
if (process.env.ASTRO_BASE) {
  base = process.env.ASTRO_BASE;
}
if (process.env.ASTRO_SITE) {
  site = process.env.ASTRO_SITE;
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  outDir: './_site',
  build: {
    format: 'directory'
  }
});
