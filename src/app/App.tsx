import './App.css'

import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import CameraPreview from '@/core/components/CameraPreview'
import { getPreferredLocale, loadLocale } from '@/core/utils/language'
import NotificationController from '@/notification/components/NotificationController'
import OverlayController from '@/overlay/components/OverlayController'
import OverlayHost from '@/overlay/components/OverlayHost'
import SettingsWindow from '@/settings'

import { useAppSelector } from './hooks'

const App = () => {
	const [messages, setMessages] = useState(null)

	const lang = useAppSelector(state => getPreferredLocale(state.config.language))
	useEffect(() => {
		const fetchMessages = async () => {
			const messages = await loadLocale(lang)
			document.documentElement.setAttribute('lang', lang)
			setMessages(messages)
		}
		if (lang === 'en') {
			setMessages(null)
		} else {
			fetchMessages()
		}
	}, [lang])

	return (
		<IntlProvider defaultLocale='en' locale={lang} messages={messages as any}>
			<OverlayHost>
				<CameraPreview />
			</OverlayHost>

			<NotificationController />

			<div className='App-ui App-buttons'>
				<SettingsWindow />
				<OverlayController />

				<footer className='App-footer'>
					ShakeStreamKit. Copyright © 2024 mntone. Licensed under the GPLv3 license.
				</footer>
			</div>
		</IntlProvider>
	)
}

export default App
