import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://islp-bolivia.github.io',
  base: '/',
  outDir: './_site',
  build: {
    format: 'directory'
  }
});
