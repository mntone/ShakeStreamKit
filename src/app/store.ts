import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'

import telemetry from 'features/telemetry/telemetrySlice'

import log from 'app/logSlice'

import config from './configSlice'
import overlay from './middlewares/overlay'
import view from './viewSlice'

const rootReducer = combineReducers({
	config,
	log,
	telemetry,
	view,
})

// Infer the `RootState` types from the store itself
export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}).concat(overlay as any),
})

export const persistor = persistStore(store)

// Get the type of our store variable
export type AppStore = typeof store

// Infer the `AppDispatch` types from the store itself
export type AppDispatch = AppStore['dispatch']

export default store
