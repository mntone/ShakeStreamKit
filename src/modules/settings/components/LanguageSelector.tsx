import { useDispatch } from 'react-redux'

import { useEnvironment } from '@/core/components/EnvironmentProvider'
import { Select, SelectItem } from '@/core/components/Select'
import { LANGUAGES } from '@/core/utils/language'

import { useAppSelector } from 'app/hooks'

import { setLanguage } from '../slicers'

const LanguageSelector = () => {
	const userLanguage = useEnvironment()?.lang ?? 'en'
	const lang = useAppSelector(state => state.config.language) ?? userLanguage

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
