import { detectLocale, i18n } from '$i18n/i18n-util'
import { loadAllLocales } from '$i18n/i18n-util.sync'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'

loadAllLocales()
const L = i18n()

export const handle: Handle = async ({ event, resolve }) => {

  // redirect to base locale if no locale slug was found
  const locale = getPreferredLocale(event)
  const LL = L[locale]

  // bind locale and translation functions to current request
  event.locals.locale = locale
  event.locals.LL = LL

  // replace html lang attribute with correct language
  return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) })
}

const getPreferredLocale = ({ request }: RequestEvent) => {
  // detect the preferred language the user has configured in his browser
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)

  return detectLocale(acceptLanguageDetector)
}
