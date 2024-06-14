export interface ShakeBaseEvent {
	event: string
	timestamp: number
}

export type ShakeMatchmakingEvent = ShakeBaseEvent & {
	event: 'matchmaking'
}

export type ShakeStage =
	| 'sockeye_station'          // アラマキ砦
	| 'spawning_grounds'         // シャケナダム
	| 'gone_fission_hydroplant'  // ムニ・エール海洋発電所
	| 'marooners_bay'            // 難破船ドン・ブラコ
	| 'jammin_salmon_junction'   // すじこジャンクション跡
	| 'salmonid_smokeyard'       // トキシラズいぶし工房
	| 'bonerattle_arena'         // どんぴこ闘技場
	| 'wahoo_world'              // スメーシーワールド
	| 'inkblot_art_academy'      // 海女美術大学
	| 'undertow_spillway'        // マテガイ放水路
	| 'umami_ruins'              // ナンプラー遺跡
	| 'barnacle_and_dime'        // タラポートショッピングパーク
	| 'eeltail_alley'            // ゴンズイ地区

export type ShakeGameStageEvent = ShakeBaseEvent & {
	event: 'game_stage'
	stage: ShakeStage
}

export type ShakeKing =
	| 'cohozuna'      // ヨコヅナ
	| 'horrorboros'   // タツ
	| 'megalodontia'  // ジョー
	| 'triumvirate'   // オカシラ連合

export type ShakeGameKingEvent = ShakeBaseEvent & {
	event: 'game_king'
	king: ShakeKing
}

export type ShakeColor =
	| 'default'
	| 'blue'
	| 'orange'
	| 'pink'
	| 'purple'
	| 'sunyellow'
	| 'yellow'
	| 'support_yellow'

export interface ShakeGameUpdateEvent extends ShakeBaseEvent {
	event: 'game_update'
	color: ShakeColor
	wave: number | 'extra'
	count: number
	amount: number
	quota: number
	unstable: boolean
}

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
