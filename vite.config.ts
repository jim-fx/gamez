import { sveltekit } from '@sveltejs/kit/vite';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetIcons(), presetUno()],
    }),
    sveltekit(),
  ]
});
