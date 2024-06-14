import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { BroadcastSoftwareInfo, detectBroadcast } from '../utils/broadcast'

// State
interface ViewState {
	broadcast: BroadcastSoftwareInfo
	overlay: boolean
	poweredby: boolean
	server?: string
	wave?: number | 'extra'
}

const initialState: ViewState = {
	broadcast: detectBroadcast(),
	overlay: false,
	poweredby: false,
}

// Create thunk
let poweredbyTimerId: number | undefined = undefined
const POWEREDBY_DURATION = 3 * 1000
export const showPoweredby = createAsyncThunk(
	'view/showPoweredby',
	async () => {
		if (poweredbyTimerId) {
			window.clearTimeout(poweredbyTimerId)
		}
		await new Promise(resolve => {
			poweredbyTimerId = window.setTimeout(resolve, POWEREDBY_DURATION)
		})
	},
)

let timerId: number | undefined = undefined
const clearTimer = () => {
	if (timerId) {
		window.clearTimeout(timerId)
	}
}
export const hideOverlayDelayed = createAsyncThunk(
	'view/hideOverlayDelayed',
	async (delayInSeconds: number) => {
		clearTimer()
		await new Promise(resolve => {
			timerId = window.setTimeout(resolve, 1000 * delayInSeconds)
		})
	},
)

// Slice
const viewSlice = createSlice({
	name: 'view',
	initialState,
	reducers: {
		hideOverlay(state) {
			clearTimer()
			state.overlay = false
		},
		showOverlay(state, action: PayloadAction<number | 'extra' | undefined>) {
			const wave = action.payload
			if (wave) {
				if (wave !== 'extra' && (1 <= wave && wave <= 5)) {
					state.wave = action.payload
				}
			}

			clearTimer()
			state.overlay = true
		},
		setServer(state, action: PayloadAction<string | undefined>) {
			state.server = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(showPoweredby.pending, state => {
				state.poweredby = true
			})
			.addCase(showPoweredby.fulfilled, state => {
				state.poweredby = false
			})
			.addCase(hideOverlayDelayed.fulfilled, state => {
				state.overlay = false
			})
	},
})

export const {
	hideOverlay,
	showOverlay,
	setServer,
} = viewSlice.actions
export default viewSlice.reducer
