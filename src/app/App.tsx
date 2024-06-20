import './App.css'

import { useBodyClass } from '@/core/hooks/bodyclass'
import NotificationController from '@/notification/components/NotificationController'
import OverlayController from '@/overlay/components/OverlayController'
import OverlayHost from '@/overlay/components/OverlayHost'
import SettingsWindow from '@/settings'

const App = () => {
	useBodyClass()

	return (
		<>
			<OverlayHost />

			<NotificationController />

			<div className='App-ui'>
				<SettingsWindow />
				<OverlayController />

				<footer className='App-footer'>
					ShakeStreamKit. Copyright © 2024 mntone. Licensed under the GPLv3 license.
				</footer>
			</div>
		</>
	)
}

export default App
