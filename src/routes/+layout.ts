export const prerender = true;
import { setLocale } from '$i18n/i18n-svelte';
import type { Locales } from '$i18n/i18n-types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad<{ locale: Locales }> = async ({ url, data: { locale = "de" } }) => {
  const { pathname } = url
  // load dictionary into memory
  await loadLocaleAsync(locale)

  // if you need to output a localized string in a `load` function,
  // you always need to call `setLocale` right before you access the `LL` store
  setLocale(locale)
  // get the translation functions value from the store

  // pass locale to the "rendering context"
  return {
    locale,
    pathname
  }
}
