import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'

import { useAppSelector } from 'app/hooks'

import LanguageSelector from '../components/LanguageSelector'
import DialogMessages from '../messages'
import { setAutoHide, setNotifyOnQuotaMet, setNotifyOnWaveFinished } from '../slicers'

const SettingsPage = () => {
	const autoHide = useAppSelector(state => state.config.autoHide)
	const notifyOnQuotaMet = useAppSelector(state => state.config.notifyOnQuotaMet)
	const notifyOnWaveFinished = useAppSelector(state => state.config.notifyOnWaveFinished)

	const dispatch = useDispatch()
	const handleAutoHide = (autoHide: boolean) => {
		dispatch(setAutoHide(autoHide))
	}
	const handleNotifyOnQuotaMet = (notifyOnQuotaMet: boolean) => {
		dispatch(setNotifyOnQuotaMet(notifyOnQuotaMet))
	}
	const handleNotifyOnWaveFinished = (notifyOnWaveFinished: boolean) => {
		dispatch(setNotifyOnWaveFinished(notifyOnWaveFinished))
	}

	return (
		<>
			<h2 className='Form-title'>
				<FormattedMessage {...DialogMessages.settings} />
			</h2>

			<section className='Form-group'>
				<h3>
					<FormattedMessage {...DialogMessages.settingsOverlay} />
				</h3>
				<CheckBox
					id='autoHide'
					checked={autoHide !== false}
					onCheckedChange={handleAutoHide}
				>
					<FormattedMessage {...DialogMessages.settingsAutoHide} />
				</CheckBox>
			</section>

			<section className='Form-group'>
				<h4>
					<FormattedMessage {...DialogMessages.settingsShowOverlayOn} />
				</h4>
				<CheckBox
					id='quotaMet'
					checked={notifyOnQuotaMet === true}
					onCheckedChange={handleNotifyOnQuotaMet}
				>
					<FormattedMessage {...DialogMessages.settingsShowOverlayOnQuotaMet} />
				</CheckBox>
				<CheckBox
					id='waveFinished'
					checked={notifyOnWaveFinished !== false}
					onCheckedChange={handleNotifyOnWaveFinished}
				>
					<FormattedMessage {...DialogMessages.settingsShowOverlayOnWaveFinished} />
				</CheckBox>
			</section>

			<section className='Form-group'>
				<h3>
					<FormattedMessage {...DialogMessages.settingsLanguage} />
				</h3>
				<LanguageSelector />
			</section>
		</>
	)
}

export default SettingsPage
