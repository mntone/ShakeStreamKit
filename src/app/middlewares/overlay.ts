import { findLast, findLastIndex, last } from 'lodash'
import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { hideEggGraphDelayed, showEggGraph, showPoweredby } from '@/overlay/slicers'
import type { ShakeGameUpdateEvent } from '@/telemetry/model'
import { addTelemetry } from '@/telemetry/slicers'

import type { RootState } from 'app/store'

const overlay = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const state = store.getState()

	// Return when not realtime
	if (!state.telemetry.realtime) {
		return next(action)
	}

	// Show powered-by
	const inAddTelemetry = addTelemetry.match(action)
	if (inAddTelemetry) {
		const latestUpdate = last(state.telemetry.payload)
		if (latestUpdate && latestUpdate.event === 'game_result') {
			store.dispatch(showPoweredby() as any)
		}
	}

	if (!state.overlay.wave) {
		// Whether to notify upon quota met
		const notifyOnQuotaMet = state.config.notifyOnQuotaMet === true

		// Whether to notify upon wave finished
		const notifyOnWaveFinished = state.config.notifyOnWaveFinished !== false

		const notify = notifyOnQuotaMet || notifyOnWaveFinished
		if (notify && inAddTelemetry) {
			const telemetry = state.telemetry.payload
			const latestIndex = findLastIndex(telemetry, t => t.event === 'game_update')
			if (latestIndex !== -1) {
				const latest = telemetry[latestIndex] as ShakeGameUpdateEvent

				// Notify upon quota met or wave finished
				const waveFinished = notifyOnWaveFinished && latest.count === 0
				let quotaMet = notifyOnQuotaMet && latest.amount >= latest.quota
				if (quotaMet && latestIndex - 1 >= 0) {
					const previous = findLast(telemetry, t => t.event === 'game_update', latestIndex - 1) as ShakeGameUpdateEvent | undefined
					quotaMet = previous && previous.amount < previous.quota ? true : false
				}

				if (waveFinished || quotaMet) {
					store.dispatch(showEggGraph(latest.wave))

					// Whether to hide overlay automatically
					const autoHide = state.config.autoHide !== false
					if (autoHide) {
						const delayInSeconds = waveFinished ? 12 : 3
						store.dispatch(hideEggGraphDelayed(delayInSeconds) as any)
					}
				}
			}
		}
	}

	return next(action)
}

export default overlay
