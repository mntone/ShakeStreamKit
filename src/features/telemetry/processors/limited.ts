import { ShakeEvent, ShakeGameUpdateEvent } from '../model'

import { TelemetryProcessor } from './base'

class LimitedIncreaseTelemetryProcessor implements TelemetryProcessor {
	readonly #maxIncreaseInSeconds: number

	#previousEvent: ShakeGameUpdateEvent | undefined

	constructor(maxIncreaseInSeconds: number) {
		this.#maxIncreaseInSeconds = maxIncreaseInSeconds

		this.#previousEvent = undefined
	}

	reset(): void {
		this.#previousEvent = undefined
	}

	process(ev: ShakeEvent): ShakeEvent | undefined {
		switch (ev.event) {
		case 'game_update': {
			if (this.#previousEvent === undefined || this.#previousEvent.wave !== ev.wave) {
				this.#previousEvent = ev
				return ev
			}

			const elapsedTime = ev.timestamp - this.#previousEvent.timestamp
			const allowedIncrase = elapsedTime * this.#maxIncreaseInSeconds
			const diffAmount = ev.amount - this.#previousEvent.amount
			if (0 <= diffAmount && diffAmount <= allowedIncrase) {
				this.#previousEvent = ev
				return ev
			}
			return undefined
		}
		default:
			return ev
		}
	}
}

export default LimitedIncreaseTelemetryProcessor
