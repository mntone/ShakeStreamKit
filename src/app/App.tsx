import './App.css'

import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import { useEnvironment } from '@/core/components/EnvironmentProvider'
import { useBodyClass } from '@/core/hooks/bodyclass'
import { loadLocale } from '@/core/utils/language'
import NotificationController from '@/notification/components/NotificationController'
import OverlayController from '@/overlay/components/OverlayController'
import OverlayHost from '@/overlay/components/OverlayHost'
import SettingsWindow from '@/settings'

import { useAppSelector } from './hooks'

const App = () => {
	const [messages, setMessages] = useState(null)

	useBodyClass()

	const environment = useEnvironment()
	const userLanguage = environment?.lang ?? 'en'
	const lang = useAppSelector(state => state.config.language) ?? userLanguage
	useEffect(() => {
		const fetchMessages = async () => {
			const messages = await loadLocale(lang)
			document.documentElement.setAttribute('lang', lang)
			setMessages(messages)
		}
		if (lang === 'en') {
			document.documentElement.setAttribute('lang', 'en')
			setMessages(null)
		} else {
			fetchMessages()
		}
	}, [lang])

	return (
		<IntlProvider defaultLocale='en' locale={lang} messages={messages as any}>
			<OverlayHost />

			<NotificationController />

			<div className='App-ui'>
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
