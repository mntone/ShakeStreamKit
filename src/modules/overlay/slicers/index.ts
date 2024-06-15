import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// State
interface OverlayState {
	poweredby: boolean
	server?: string
	wave?: number | 'extra'
}

const initialState: OverlayState = {
	poweredby: false,
}

// Create thunk
let poweredbyTimerId: number | undefined = undefined
const POWEREDBY_DURATION = 3 * 1000
export const showPoweredby = createAsyncThunk(
	'overlay/showPoweredby',
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
export const hideEggGraphDelayed = createAsyncThunk(
	'overlay/hideEggGraphDelayed',
	async (delayInSeconds: number) => {
		clearTimer()
		await new Promise(resolve => {
			timerId = window.setTimeout(resolve, 1000 * delayInSeconds)
		})
	},
)

// Slice
const overlaySlice = createSlice({
	name: 'overlay',
	initialState,
	reducers: {
		hideEggGraph(state) {
			clearTimer()
			delete state.wave
		},
		showEggGraph(state, action: PayloadAction<number | 'extra' | undefined>) {
			clearTimer()
			state.wave = action.payload
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
			.addCase(hideEggGraphDelayed.fulfilled, state => {
				delete state.wave
			})
	},
})

export const {
	hideEggGraph,
	showEggGraph,
	setServer,
} = overlaySlice.actions
export default overlaySlice.reducer
