import { ShakeEvent } from '../model'

export interface TelemetryProcessor {
	reset(): void
	process(ev: ShakeEvent): ShakeEvent | undefined
}
