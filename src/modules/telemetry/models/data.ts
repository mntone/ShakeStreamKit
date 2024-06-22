import { DefaultWaveStringType, DefaultWaveType, WaveType } from '@/core/utils/wave'

import { ShakeCloseReason, ShakeColor, ShakeKing, ShakeStage } from './constant'

export interface ShakeUpdate {
	readonly timestamp: number
	readonly count: number
	readonly amount: number
	readonly unstable: boolean
}

interface ShakeBaseWave {
	readonly wave: WaveType
	startTimestamp: number
	endTimestamp?: number
}

export interface ShakeDefaultWave extends ShakeBaseWave {
	readonly wave: DefaultWaveType
	amount: number
	quota: number
	readonly updates: Readonly<ShakeUpdate>[]
}

export interface ShakeExtraWave extends ShakeBaseWave {
	readonly wave: 'extra'
	readonly king: ShakeKing
}

export type ShakeWave = ShakeDefaultWave | ShakeExtraWave

export type ShakeWaveRecord = Partial<Record<DefaultWaveStringType, ShakeDefaultWave> & Record<'extra', ShakeExtraWave>>

export interface ShakeTelemetry {
	readonly id: string
	readonly timestamp: number
	color?: ShakeColor
	stage?: ShakeStage
	power?: number
	readonly waveKeys: WaveType[]
	readonly waves: ShakeWaveRecord
	closed?: ShakeCloseReason
}
