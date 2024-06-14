import { match } from '@formatjs/intl-localematcher'

interface LanguageInfo {
	code: string
	name: string
}

export const LANGUAGES: readonly LanguageInfo[] = [
	{ code: 'de', name: 'Deutsch' },
	{ code: 'en', name: 'English' },
	{ code: 'es', name: 'Español (España)' },
	{ code: 'es-419', name: 'Español (Latinoamérica)' },
	{ code: 'fr', name: 'Français (France)' },
	{ code: 'fr-CA', name: 'Français (Canada)' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'ja', name: '日本語' },
	{ code: 'ko', name: '한국어' },
	{ code: 'nl', name: 'Nederlands' },
	{ code: 'zh-CN', name: '简体中文' },
	{ code: 'zh-TW', name: '繁體中文' },
]

export const getPreferredLocale = (requestedLanguage: string | undefined) => {
	const requestedLanguages = requestedLanguage
		? [requestedLanguage]
		: navigator.languages

	const targetLanguages = LANGUAGES.map(langInfo => langInfo.code)
	const preferredLanguage = match(requestedLanguages, targetLanguages, 'en')
	return preferredLanguage
}

export const loadLocale = async (locale: string) => {
	const res = await fetch(`locales/${locale}.json`)
	const json = await res.json()
	return json
}
