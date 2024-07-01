import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'

import autoCleanupLogs from '@/notification/middlewares/autoCleanupLogs'
import log from '@/notification/slicers'
import overlay from '@/overlay/slicers'
import config from '@/settings/slicers'
import telemetry from '@/telemetry/slicers'

import overlayMiddleware from '../modules/overlay/middlewares'

const rootReducer = combineReducers({
	config,
	log,
	overlay,
	telemetry,
})

// Infer the `RootState` types from the store itself
export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}).concat(overlayMiddleware as any, autoCleanupLogs),
})

export const persistor = persistStore(store)

// Get the type of our store variable
export type AppStore = typeof store

// Infer the `AppDispatch` types from the store itself
export type AppDispatch = AppStore['dispatch']

export default store
