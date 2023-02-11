import { sveltekit } from '@sveltejs/kit/vite';
import { extractorSvelte } from '@unocss/core';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetIcons(),presetUno()],
      extractors: [extractorSvelte],
    }),
    sveltekit()
  ]
});
