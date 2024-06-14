import './index.css'

import React from 'react'
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react'

import WebSocketProvider from '@/telemetry/components/WebSocketProvider'

import App from 'app/App'
import store, { persistor } from 'app/store'

const element = document.getElementById('root')
if (element) {
	const root = createRoot(element)
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<PersistGate
					loading={null}
					persistor={persistor}
				>
					<WebSocketProvider>
						<App />
					</WebSocketProvider>
				</PersistGate>
			</Provider>
		</React.StrictMode>,
	)
}
