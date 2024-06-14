import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ShakeEvent } from './model'
import LimitedIncreaseTelemetryProcessor from './processors/limited'

// State
interface TelemetryState {
	realtime: boolean
	payload: ShakeEvent[]
}

const initialState: TelemetryState = {
	realtime: true,
	payload: [],
}

// Filters
const telemetryProcessor = new LimitedIncreaseTelemetryProcessor(4)

// Slice
const telemetrySlice = createSlice({
	name: 'telemetry',
	initialState,
	reducers: {
		addTelemetry(state, action: PayloadAction<ShakeEvent>) {
			if (action.payload.event === 'matchmaking') {
				state.realtime = true
				state.payload = []
				telemetryProcessor.reset()
			}

			const payload = telemetryProcessor.process(action.payload)
			if (payload) {
				state.payload.push(payload)
			}
		},
		resetTelemetry(state) {
			state.payload = []

			// Reset processor
			telemetryProcessor.reset()
		},

		setTelemetry(state, action: PayloadAction<ShakeEvent[]>) {
			// Reset processor
			telemetryProcessor.reset()

			state.realtime = false
			state.payload = action.payload
				.map(ev => telemetryProcessor.process(ev))
				.filter(ev => ev !== undefined) as ShakeEvent[]
		},
	},
})

export const {
	addTelemetry,
	resetTelemetry,
	setTelemetry,
} = telemetrySlice.actions
export default telemetrySlice.reducer
