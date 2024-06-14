import { useDispatch } from 'react-redux'

import { createSelector } from '@reduxjs/toolkit'

import { Select, SelectItem } from '@/core/components/Select'
import { LANGUAGES, getPreferredLocale } from '@/core/utils/language'

import { useAppSelector } from 'app/hooks'
import type { RootState } from 'app/store'

import { setLanguage } from '../slicers'

const selectPreferredLocale = createSelector(
	(state: RootState) => state.config.language,
	getPreferredLocale,
)

const LanguageSelector = () => {
	const lang = useAppSelector(selectPreferredLocale)

	const dispatch = useDispatch()
	const handleSelectLanguage = (lang: string) => {
		dispatch(setLanguage(lang))
	}

	return (
		<div className='LanguageSelector'>
			<Select
				value={lang}
				placeholder='Select Language'
				onValueChange={handleSelectLanguage}
			>
				{LANGUAGES.map(lang => (
					<SelectItem
						key={lang.code}
						value={lang.code}
						lang={lang.code}
					>
						{lang.name}
					</SelectItem>
				))}
			</Select>
		</div>
	)
}

export default LanguageSelector
