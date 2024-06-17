import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { WritableDraft, produce } from 'immer'

import { ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry, ShakeUpdate } from '../models/data'
import { ShakeEvent } from '../models/telemetry'
import { TelemetryProcessor } from '../utils/processor'

// State
type TelemetryState = Record<string, Readonly<ShakeTelemetry>>

const initialState: TelemetryState = {}

// Filters
const processor = new TelemetryProcessor(4)

const produceUpdates = (
	draft: WritableDraft<Readonly<ShakeUpdate>>[],
	payload: Readonly<ShakeUpdate>[],
) => {
	// let i = 0
	// for (; i < draft.length; ++i) {
	// 	draft[i] = Object.assign(draft[i], payload[i])  // TODO: diff check
	// }
	let i = draft.length
	for (; i < payload.length; ++i) {
		const clonePayload = Object.assign({}, payload[i])
		draft.push(clonePayload)
	}
}

const produceWave = (
	draft: (WritableDraft<Readonly<ShakeDefaultWave> | Readonly<ShakeExtraWave>>),
	payload: (Readonly<ShakeDefaultWave | ShakeExtraWave>),
) => {
	if (payload.wave === 'extra') {
		return Object.assign(draft, payload)
	}

	const { updates, ...props } = payload
	produceUpdates((draft as WritableDraft<Readonly<ShakeDefaultWave>>).updates, updates)
	return Object.assign(draft, props)
}

const produceWaves = (
	draft: (WritableDraft<Readonly<ShakeDefaultWave> | Readonly<ShakeExtraWave>>)[],
	payload: (Readonly<ShakeDefaultWave> | Readonly<ShakeExtraWave>)[],
) => {
	let i = 0
	for (; i < draft.length; ++i) {
		draft[i] = produceWave(draft[i], payload[i])
	}
	for (; i < payload.length; ++i) {
		const childPayload = payload[i]
		if (childPayload.wave === 'extra') {
			const clonePayload = Object.assign({}, childPayload)
			draft.push(clonePayload)
		} else {
			const { updates, ...props } = childPayload
			const clonePayload = {
				...props,
				updates: updates.map(u => Object.assign({}, u)),
			}
			draft.push(clonePayload)
		}
	}
}

const produceMatch = (
	draft: (WritableDraft<Readonly<ShakeTelemetry>>),
	payload: (Readonly<ShakeTelemetry>),
) => {
	const { waves, ...props } = payload
	produceWaves(draft.waves, waves)
	return Object.assign(draft, props)
}

// Slice
const telemetrySlice = createSlice({
	name: 'telemetry',
	initialState,
	reducers: {
		addTelemetry(state, action: PayloadAction<ShakeEvent>) {
			processor.process(action.payload)
			return produce(state, draftState => {
				const newMatch = processor.current
				const newMatchId = newMatch.id
				if (newMatchId in draftState) {
					const draftMatchState = draftState[newMatchId]
					produceMatch(draftMatchState, newMatch)
				} else {
					const { waves, ...props } = newMatch
					draftState[newMatchId] = {
						...props,
						waves: waves.map(w => {
							if (w.wave === 'extra') {
								return Object.assign({}, w)
							}

							const { updates, ...props } = w
							return {
								...props,
								updates: updates.map(u => Object.assign({}, u)),
							}
						}),
					}
				}
			})
		},
		resetTelemetry() {
			return {}
		},

		setTelemetry(state, action: PayloadAction<ShakeEvent[]>) {
			const temporary = new TelemetryProcessor(4)
			action.payload.forEach(ev => {
				temporary.process(ev)

				if (temporary.isNewContext()) {
					const match = temporary.current
					state[match.id] = match
				}
			})

			// Set closed to the last match
			temporary.resetContext()
		},
	},
})

export const {
	addTelemetry,
	resetTelemetry,
	setTelemetry,
} = telemetrySlice.actions
export default telemetrySlice.reducer
