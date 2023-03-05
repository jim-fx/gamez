// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'de'

export type Locales =
	| 'de'
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	rating: {
		/**
		 * g​e​h​t​ ​b​e​s​s​e​r
		 */
		'1': string
		/**
		 * n​i​c​h​t​ ​s​c​h​l​e​c​h​t
		 */
		'2': string
		/**
		 * o​k​a​y
		 */
		'3': string
		/**
		 * g​u​t
		 */
		'4': string
		/**
		 * p​e​r​f​e​k​t​!
		 */
		'5': string
	}
	/**
	 * S​c​h​r​i​t​t​e
	 */
	steps: string
	/**
	 * N​o​c​h​m​a​l​ ​v​e​r​s​u​c​h​e​n
	 */
	try_again: string
	/**
	 * N​ä​c​h​s​t​e​s​ ​L​e​v​e​l
	 */
	next_level: string
	time: {
		/**
		 * {​d​a​y​s​}​ ​{​{​T​a​g​|​T​a​g​e​}​}
		 * @param {string | number | boolean} days
		 */
		days: RequiredParams<'days'>
		/**
		 * {​h​o​u​r​s​}​ ​{​{​S​t​u​n​d​e​|​S​t​u​n​d​e​n​}​}
		 * @param {string | number | boolean} hours
		 */
		hours: RequiredParams<'hours'>
		/**
		 * {​m​i​n​u​t​e​s​}​ ​{​{​M​i​n​u​t​e​|​M​i​n​u​t​e​n​}​}
		 * @param {string | number | boolean} minutes
		 */
		minutes: RequiredParams<'minutes'>
		/**
		 * {​s​e​c​o​n​d​s​}​ ​{​{​S​e​k​u​n​d​e​|​S​e​k​u​n​d​e​n​}​}
		 * @param {string | number | boolean} seconds
		 */
		seconds: RequiredParams<'seconds'>
	}
}

export type TranslationFunctions = {
	rating: {
		/**
		 * geht besser
		 */
		'1': () => LocalizedString
		/**
		 * nicht schlecht
		 */
		'2': () => LocalizedString
		/**
		 * okay
		 */
		'3': () => LocalizedString
		/**
		 * gut
		 */
		'4': () => LocalizedString
		/**
		 * perfekt!
		 */
		'5': () => LocalizedString
	}
	/**
	 * Schritte
	 */
	steps: () => LocalizedString
	/**
	 * Nochmal versuchen
	 */
	try_again: () => LocalizedString
	/**
	 * Nächstes Level
	 */
	next_level: () => LocalizedString
	time: {
		/**
		 * {days} {{Tag|Tage}}
		 */
		days: (arg: { days: string | number | boolean }) => LocalizedString
		/**
		 * {hours} {{Stunde|Stunden}}
		 */
		hours: (arg: { hours: string | number | boolean }) => LocalizedString
		/**
		 * {minutes} {{Minute|Minuten}}
		 */
		minutes: (arg: { minutes: string | number | boolean }) => LocalizedString
		/**
		 * {seconds} {{Sekunde|Sekunden}}
		 */
		seconds: (arg: { seconds: string | number | boolean }) => LocalizedString
	}
}

export type Formatters = {}
