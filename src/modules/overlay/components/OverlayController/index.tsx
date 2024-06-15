import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { createSelector } from '@reduxjs/toolkit'

import type { ShakeEvent, ShakeGameUpdateEvent } from '@/telemetry/model'

import type { AppDispatch, RootState } from 'app/store'

import { hideEggGraph, showEggGraph } from '../../slicers'

import WaveButton, { type WaveData } from './WaveButton'
import OverlayControllerMessages from './messages'

interface OverlayControllerProps {
	wave?: WaveData
	waves: WaveData[]
	hide(): void
	show(wave: WaveData): void
}

export const OverlayController = ({ wave: selectedWave, waves, hide, show }: OverlayControllerProps) => {
	return (
		<>
			<button
				type='button'
				className='Button'
				disabled={selectedWave === undefined}
				onClick={hide}
			>
				<FormattedMessage {...OverlayControllerMessages.hideOverlay} />
			</button>
			{waves.map(wave => (
				<WaveButton
					key={wave}
					wave={wave}
					onWaveChange={show}
					disabled={wave === selectedWave}
				/>
			))}
		</>
	)
}

const selectWaves = createSelector(
	(state: RootState) => state.telemetry.payload,
	(t: ShakeEvent[]) => {
		const telemetry = t.filter(t => t.event === 'game_update' && t.wave !== 'extra' && t.wave > 0) as ShakeGameUpdateEvent[]
		return telemetry.length !== 0
			? Array.from({ length: telemetry[telemetry.length - 1].wave as number }, (_, i) => i + 1)
			: []
	},
)

const mapStateToProps = (state: RootState) => {
	return {
		wave: state.overlay.wave,
		waves: selectWaves(state),
	}
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
	return {
		hide() {
			dispatch(hideEggGraph())
		},
		show(wave: WaveData) {
			dispatch(showEggGraph(wave))
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(OverlayController)
