import { ShakeEvent } from '../model'

import { TelemetryProcessor } from './base'

class ChainedTelemetryProcessor implements TelemetryProcessor {
	readonly #processors: TelemetryProcessor[]

	constructor(processors: TelemetryProcessor[]) {
		this.#processors = processors
	}

	reset(): void {
		this.#processors.forEach(p => p.reset())
	}

	process(ev: ShakeEvent): ShakeEvent | undefined {
		let processedValue: ShakeEvent | undefined = ev
		for (const processor of this.#processors) {
			if (processedValue === undefined) {
				break
			}
			processedValue = processor.process(processedValue)
		}
		return processedValue
	}
}

export default ChainedTelemetryProcessor
