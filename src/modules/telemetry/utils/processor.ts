import { DefaultWaveType } from '@/core/utils/wave'

import { ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry, ShakeUpdate } from '../models/data'
import { ShakeEvent, ShakeGameUpdateEvent } from '../models/telemetry'

import { CounterAnomalyDetector } from './CounterAnomalyDetector'
import { FrequencyCounter } from './frequencyCounter'

export class TelemetryProcessor {
	readonly #maxIncreaseAmountInSeconds: number

	// New context flag
	#newContext: boolean = true

	// Data processing instances
	readonly #quotaCounter: FrequencyCounter<number> = new FrequencyCounter()
	readonly #countAnomalyDetector: CounterAnomalyDetector = new CounterAnomalyDetector()

	// Base count; use this value as base of this.#waveData.startTimestamp
	#baseCount: number = 110

	// Current wave
	#currentWave: number = 0

	// Raw event storage
	readonly #storage: ShakeEvent[] = []

	// Telemetry data
	#data: ShakeTelemetry = undefined as any
	#waveData: ShakeDefaultWave = undefined as any

	constructor(maxIncreaseAmountInSeconds: number) {
		this.#maxIncreaseAmountInSeconds = maxIncreaseAmountInSeconds
	}

	resetContext(ev?: Readonly<ShakeEvent>) {
		// Finalize previous data
		if (this.#data && this.#data.closed === undefined) {
			this.#data.closed = 'unknown'
		}

		// Return if ev is undefined
		if (ev === undefined) {
			return
		}

		// Reset initial state
		this.#newContext = true

		this.#countAnomalyDetector.reset()
		this.#quotaCounter.reset()
		this.#baseCount = 110
		this.#currentWave = 0

		this.#storage.length = 0
		this.#data = {
			id: ev.session,
			timestamp: ev.timestamp,
			waves: [],
		}
		this.#waveData = undefined as any
	}

	#processUpdate(ev: Readonly<ShakeGameUpdateEvent>) {
		// Extra wave
		if (ev.wave === 'extra') {
			return
		}

		// Set color
		if (this.#currentWave === 0) {
			this.#data.color = ev.color
		}

		// Detect new wave from telemetry
		let currentWave = ev.wave
		if (this.#currentWave !== currentWave && this.#waveData !== undefined) {
			// N sec have not elapsed since base time
			const diffTimestamp = ev.timestamp - this.#waveData.startTimestamp
			if (diffTimestamp <= this.#baseCount) {
				currentWave = this.#currentWave  // Restore
			} else if (currentWave !== undefined) {
				// The "wave" is clearly strange
				const nextWave = this.#currentWave + Math.min(5, Math.floor(diffTimestamp / 108))
				if (currentWave < this.#currentWave || currentWave > nextWave) {
					return // DISPOSE!!
				}
			} else {
				return // DISPOSE!!
			}
		} else if (currentWave === undefined) {
			return // DISPOSE!!
		}

		if (this.#currentWave !== currentWave) {
			if (ev.count === undefined) {
				return // DISPOSE!!
			}

			this.#countAnomalyDetector.reset()
			this.#quotaCounter.reset(ev.quota)
			this.#baseCount = ev.count
			this.#currentWave = currentWave

			// Create new wave data
			const newWaveData: ShakeDefaultWave = {
				wave: currentWave as DefaultWaveType,
				startTimestamp: ev.timestamp,
				amount: ev.amount ?? 0 /* MAYBE 0 */,
				quota: this.#quotaCounter.mode,
				updates: [
					{
						timestamp: ev.timestamp,
						count: ev.count,
						amount: ev.amount ?? 0 /* MAYBE 0 */,
						unstable: ev.unstable,
					},
				],
			} as const
			this.#data.waves.push(newWaveData)
			this.#waveData = newWaveData
			return
		}

		// Update wave
		const currentWaveData = this.#waveData

		let count = ev.count
		if (count === undefined) {
			// Calc count
			count = Math.floor(100 + currentWaveData.startTimestamp - ev.timestamp)
		} else {
			const isAnomalous = this.#countAnomalyDetector.isAnomalous(count, ev.timestamp)
			if (isAnomalous) {
				// Correct count
				count = Math.floor(100 + currentWaveData.startTimestamp - ev.timestamp)
			} else {
				// Update timestamp
				switch (count) {
				case 0:
					if (currentWaveData.endTimestamp === undefined) {
						this.#baseCount = 0
						currentWaveData.startTimestamp = ev.timestamp - 100
						currentWaveData.endTimestamp = ev.timestamp
					}
					break
				default:
					if (this.#baseCount >= 100) {
						this.#baseCount = count
						currentWaveData.startTimestamp = ev.timestamp - (100 - count)
					}
					break
				}
			}
		}

		// Update quota
		currentWaveData.quota = this.#quotaCounter.add(ev.quota).mode

		// Check diff >= 0
		const lastUpdate = currentWaveData.updates.at(-1)
		if (lastUpdate === undefined) {
			throw Error('Wave update is empty.')
		}

		if (ev.amount === undefined) {
			return // DISPOSE!!
		}

		const diffAmount = ev.amount - lastUpdate.amount
		if (diffAmount < 0) {
			return // DISPOSE!!
		}

		// Check diff < allowed
		const elapsedTime = ev.timestamp - lastUpdate.timestamp
		const allowedIncrase = elapsedTime * this.#maxIncreaseAmountInSeconds
		if (diffAmount > allowedIncrase) {
			return // DISPOSE!!
		}

		// Update amount to wave data
		currentWaveData.amount = ev.amount

		// Create new update data
		const newUpdateData: ShakeUpdate = {
			timestamp: ev.timestamp,
			count,
			amount: ev.amount,
			unstable: ev.unstable,
		} as const
		currentWaveData.updates.push(newUpdateData)
	}

	process(ev: Readonly<ShakeEvent>) {
		// Reset context when matchmaking or different session ID
		if (ev.event === 'matchmaking' || ev.session !== this.#data?.id) {
			this.resetContext(ev)
		}

		// Insert data to storage
		this.#storage.push(ev)

		// Check finalized flag
		if (this.#data.closed) {
			throw Error('Current context is closed.')
		}

		switch (ev.event) {
		case 'game_update':
			this.#processUpdate(ev)
			break
		case 'game_result':
			this.#data.closed = 'unknown'
			this.#data.power = ev.power
			break
		case 'game_error':
			this.#data.closed = 'network'
			break
		case 'game_stage':
			this.#data.stage = ev.stage
			break
		case 'game_king': {
			const newExtraWaveData: ShakeExtraWave = {
				wave: 'extra',
				startTimestamp: ev.timestamp,
				king: ev.king,
			}
			this.#data.waves.push(newExtraWaveData)
			break
		}
		}
	}

	// Check new context
	isNewContext(): boolean {
		if (this.#newContext) {
			this.#newContext = false
			return true
		}
		return false
	}

	// Current Telemetry
	get current(): ShakeTelemetry {
		return this.#data
	}
}
