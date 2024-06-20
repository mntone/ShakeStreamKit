import { ShakeColor, ShakeKing, ShakeStage } from './constant'

export interface ShakeBaseEvent {
	session: string
	event: string
	timestamp: number
}

export type ShakeMatchmakingEvent = ShakeBaseEvent & {
	event: 'matchmaking'
}

export type ShakeGameStageEvent = ShakeBaseEvent & {
	event: 'game_stage'
	stage: ShakeStage
}

export type ShakeGameKingEvent = ShakeBaseEvent & {
	event: 'game_king'
	king: ShakeKing
}

export type ShakeGameUpdateEvent = ShakeBaseEvent & {
	event: 'game_update'
	color: ShakeColor
	count?: number
	unstable: boolean
} & ({
	wave?: number
	amount?: number
	quota: number
} | {
	wave: 'extra'
})

export type ShakeGameResultEvent = ShakeBaseEvent & {
	event: 'game_result'
	golden: number
	power: number
}

export type ShakeGameErrorEvent = ShakeBaseEvent & {
	event: 'game_error'
}

export type ShakeEvent =
	| ShakeMatchmakingEvent
	| ShakeGameStageEvent
	| ShakeGameKingEvent
	| ShakeGameUpdateEvent
	| ShakeGameResultEvent
	| ShakeGameErrorEvent
