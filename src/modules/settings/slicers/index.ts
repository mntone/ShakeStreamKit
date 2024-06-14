import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'

// State
interface ConfigState {
	autoHide?: boolean
	cameraId?: string
	language?: string
	notifyOnQuotaMet?: boolean
	notifyOnWaveFinished?: boolean
	server?: string
}

const initialState: ConfigState = {
}

// Slice
const configSlice = createSlice({
	name: 'config',
	initialState,
	reducers: {
		setAutoHide(state, action: PayloadAction<boolean>) {
			state.autoHide = action.payload
		},
		setCameraId(state, action: PayloadAction<string | undefined>) {
			state.cameraId = action.payload
		},
		setLanguage(state, action: PayloadAction<string>) {
			state.language = action.payload
		},
		setNotifyOnQuotaMet(state, action: PayloadAction<boolean | undefined>) {
			state.notifyOnQuotaMet = action.payload
		},
		setNotifyOnWaveFinished(state, action: PayloadAction<boolean | undefined>) {
			state.notifyOnWaveFinished = action.payload
		},
		setServer(state, action: PayloadAction<string | undefined>) {
			const server = action.payload
			if (server && server != import.meta.env.VITE_WS_SERVER) {
				state.server = action.payload
			} else {
				delete state.server
			}
		},
	},
})

// Persist
const persistConfig: PersistConfig<ConfigState> = {
	storage,
	key: 'conf',
}

const persistConfigReducer = persistReducer(persistConfig, configSlice.reducer)

export const {
	setAutoHide,
	setCameraId,
	setLanguage,
	setNotifyOnQuotaMet,
	setNotifyOnWaveFinished,
	setServer,
} = configSlice.actions
export default persistConfigReducer
