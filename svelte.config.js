import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const { BASE_PATH } = process.env;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  // dev: true,
  kit: {
    paths: {
      base: BASE_PATH
    },
    alias: {
      $i18n: 'src/i18n',
    },
    adapter: adapter()
  }
};

export default config;
