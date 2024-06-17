import { DefaultWaveType, WaveType } from '@/core/utils/wave'

import { ShakeCloseReason, ShakeColor, ShakeKing, ShakeStage } from './constant'

export interface ShakeUpdate {
	timestamp: number
	count: number
	amount: number
	unstable: boolean
}

interface ShakeBaseWave {
	readonly wave: WaveType
	startTimestamp: number
	endTimestamp?: number
}

export interface ShakeDefaultWave extends ShakeBaseWave {
	readonly wave: DefaultWaveType
	quota: number
	readonly updates: Readonly<ShakeUpdate>[]
}

export interface ShakeExtraWave extends ShakeBaseWave {
	readonly wave: 'extra'
	readonly king: ShakeKing
}

export type ShakeWave = ShakeDefaultWave | ShakeExtraWave

export interface ShakeTelemetry {
	readonly id: string
	readonly timestamp: number
	color?: ShakeColor
	stage?: ShakeStage
	power?: number
	waves: ShakeWave[]
	closed?: ShakeCloseReason
}
