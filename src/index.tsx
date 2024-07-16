import './index.css'
import './wdyr'

import React from 'react'
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react'

import EnvironmentProvider from '@/core/components/EnvironmentProvider'
import IntlLoader from '@/core/components/IntlLoader'
import initCollection from '@/core/utils/collection'
import WebSocketProvider from '@/telemetry/components/WebSocketProvider'

import App from 'app/App'
import store, { persistor } from 'app/store'

initCollection()

const element = document.getElementById('r')
if (element) {
	const root = createRoot(element)
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<PersistGate
					loading={null}
					persistor={persistor}
				>
					<EnvironmentProvider>
						<WebSocketProvider>
							<IntlLoader>
								<App />
							</IntlLoader>
						</WebSocketProvider>
					</EnvironmentProvider>
				</PersistGate>
			</Provider>
		</React.StrictMode>,
	)
}
