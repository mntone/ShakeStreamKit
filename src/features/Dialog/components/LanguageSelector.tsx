import { createSelector } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { LANGUAGES, getPreferredLocale } from 'utils/language'

import { Select, SelectItem } from 'components/Select'

import { setLanguage } from 'app/configSlice'
import { useAppSelector } from 'app/hooks'
import type { RootState } from 'app/store'

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
