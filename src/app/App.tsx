import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import { getPreferredLocale, loadLocale } from 'utils/language'

import OverlayHost from 'components/OverlayHost'
import { RightSlideAnimation } from 'components/SlideAnimation'

import CameraPreview from 'features/CameraPreview'
import Dialog from 'features/Dialog'
import EggGraph from 'features/EggGraph'
import NotificationController from 'features/NotificationController'
import OverlayController from 'features/OverlayController'
import ProductLogo from 'features/ProductLogo'

import { useAppSelector } from './hooks'
import { selectOverlay, selectWave } from './viewSelector'

import './App.css'

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

	const currentWave = useAppSelector(selectWave)
	const currentOverlay = useAppSelector(selectOverlay)
	const currentPoweredby = useAppSelector(state => state.view.poweredby)
	return (
		<IntlProvider defaultLocale='en' locale={lang} messages={messages as any}>
			<div className='App'>
				<OverlayHost>
					<RightSlideAnimation visible={currentOverlay}>
						<EggGraph wave={currentWave} />
					</RightSlideAnimation>

					<RightSlideAnimation visible={currentPoweredby}>
						<ProductLogo />
					</RightSlideAnimation>

					<CameraPreview />
				</OverlayHost>

				<NotificationController />

				<div className='App-ui'>
					<div className='App-buttons'>
						<Dialog />
						<OverlayController />
					</div>

					<footer className='App-footer'>
						ShakeStreamKit. Copyright © 2024 mntone. Licensed under the GPLv3 license.
					</footer>
				</div>
			</div>
		</IntlProvider>
	)
}

export default App
