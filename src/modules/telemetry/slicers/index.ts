import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { WritableDraft, produce } from 'immer'

import { getMatchFromTelemetry } from '../utils/getMatchFromTelemetry'
import { TelemetryProcessor } from '../utils/processor'

import type { ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry, ShakeUpdate, ShakeWaveRecord } from '../models/data'
import type { ShakeMatch } from '../models/match'
import type { ShakeEvent } from '../models/telemetry'

// State
export type TelemetryState = {
	readonly matches: ShakeMatch[]
	readonly entities: Record<string, Readonly<ShakeTelemetry>>
}

const initialState: TelemetryState = {
	matches: [],
	entities: {},
}

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

function produceWave(
	draft: WritableDraft<Readonly<ShakeDefaultWave>>,
	payload: Readonly<ShakeDefaultWave>,
) {
	const { updates, ...props } = payload
	produceUpdates((draft as WritableDraft<Readonly<ShakeDefaultWave>>).updates, updates)
	Object.assign(draft, props)
}

function produceWaves(draft: WritableDraft<ShakeWaveRecord>, payload: Readonly<ShakeWaveRecord>) {
	for (const [waveKey, wavePayload] of Object.entries(payload)) {
		if (Object.hasOwn(draft, waveKey)) {
			if (waveKey !== 'extra') {
				produceWave(draft[waveKey]!, wavePayload as Readonly<ShakeDefaultWave>)
			}
		} else {
			if (waveKey === 'extra') {
				draft['extra'] = wavePayload as Readonly<ShakeExtraWave>
			} else {
				const { updates, ...props } = wavePayload as Readonly<ShakeDefaultWave>
				draft[waveKey] = {
					...props,
					updates: updates.map(u => Object.assign({}, u)),
				}
			}
		}
	}
}

function produceMatch(
	draft: (WritableDraft<Readonly<ShakeTelemetry>>),
	payload: (Readonly<ShakeTelemetry>),
) {
	const { waveKeys, waves, ...props } = payload
	if (!waveKeys.equals(draft.waveKeys)) {
		draft.waveKeys = waveKeys.slice(0)
	}
	produceWaves(draft.waves, waves)
	Object.assign(draft, props)
}

// Slice
const telemetrySlice = createSlice({
	name: 'telemetry',
	initialState,
	reducers: {
		addTelemetry(state, action: PayloadAction<ShakeEvent>) {
			processor.process(action.payload)

			return produce(state, draft => {
				const newTelemetry = processor.current
				const newTelemetryId = newTelemetry.id
				if (Object.hasOwn(draft.entities, newTelemetryId)) {
					const draftMatchState = draft.entities[newTelemetryId]
					produceMatch(draftMatchState, newTelemetry)
				} else {
					const { waveKeys, waves, ...props } = newTelemetry
					draft.entities[newTelemetryId] = {
						...props,
						waveKeys: waveKeys.slice(0),
						waves: Object.entries(waves).reduce((draftWaves, pair) => {
							const [waveKey, wave] = pair
							if (waveKey === 'extra') {
								draftWaves['extra'] = wave as ShakeExtraWave
							} else {
								const { updates, ...props } = wave as ShakeDefaultWave
								draftWaves[waveKey] = {
									...props,
									updates: updates.map(u => Object.assign({}, u)),
								}
							}
							return draftWaves
						}, {} as ShakeWaveRecord),
					}

					const match = getMatchFromTelemetry(newTelemetry)
					draft.matches.push(match)
				}
				return draft
			})
		},
		removeTelemetry(state, action: PayloadAction<string>) {
			const matchId = action.payload
			if (Object.hasOwn(state.entities, matchId)) {
				delete state.entities[matchId]

				const index = state.matches.findIndex(match => match.id === matchId)
				state.matches.splice(index, 1)
			}
		},
		resetTelemetry(state) {
			state.matches.length = 0
			state.entities = {}
		},

		setTelemetry(state, action: PayloadAction<ShakeEvent[]>) {
			const temporary = new TelemetryProcessor(4)
			action.payload.forEach(ev => {
				temporary.process(ev)

				if (temporary.isNewContext()) {
					const telemetry = temporary.current
					state.entities[telemetry.id] = telemetry

					const match = getMatchFromTelemetry(telemetry)
					state.matches.push(match)
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
