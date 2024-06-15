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

const availableLanguages = LANGUAGES.map(langInfo => langInfo.code)

export const detectLanguage = () => {
	const language = match(navigator.languages, availableLanguages, 'en')
	return language
}

export const loadLocale = async (locale: string) => {
	const res = await fetch(`locales/${locale}.json`)
	const json = await res.json()
	return json
}
