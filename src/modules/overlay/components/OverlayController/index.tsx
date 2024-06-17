import { FormatDateOptions, useIntl } from 'react-intl'
import { connect } from 'react-redux'

import { createSelector } from '@reduxjs/toolkit'

import { Select, SelectItem } from '@/core/components/Select'
import { type WaveType, isDefaultWave } from '@/core/utils/wave'

import type { AppDispatch, RootState } from 'app/store'

import { hideEggGraph, setMatch, showEggGraph } from '../../slicers'

import WaveButton from './WaveButton'
import OverlayControllerMessages from './messages'

const opts: FormatDateOptions = Object.freeze({
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

interface OverlayControllerProps {
	readonly matches: readonly {
		readonly id: string
		readonly timestamp: number
	}[]
	readonly match?: string
	changeMatch(id: string): void

	readonly waves: readonly WaveType[]
	readonly wave?: WaveType
	hide(): void
	show(wave: WaveType): void
}

export const OverlayController = (props: OverlayControllerProps) => {
	const {
		matches,
		match: selectedMatch,
		waves,
		wave: selectedWave,

		changeMatch,
		hide,
		show,
	} = props

	const intl = useIntl()

	return (
		<>
			<Select
				value={selectedMatch}
				placeholder='Select Match'
				onValueChange={changeMatch}
			>
				{matches.map(({ id, timestamp }) => (
					<SelectItem key={id} value={id}>
						{intl.formatDate(timestamp, opts)}
					</SelectItem>
				))}
			</Select>
			<button
				type='button'
				className='Button'
				disabled={selectedWave === undefined}
				onClick={hide}
			>
				{intl.formatMessage(OverlayControllerMessages.hideOverlay)}
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

const selectMatches = createSelector(
	(state: RootState) => state.telemetry,
	telemetry => {
		const matches = Object.values(telemetry).map(t => {
			return Object.freeze({
				id: t.id,
				timestamp: 1000 * t.timestamp,
			})
		})
		return Object.freeze(matches)
	},
)

const selectWaves = createSelector(
	(state: RootState) => state.overlay.match,
	(state: RootState) => state.telemetry,
	(matchId, telemetry) => {
		if (matchId === undefined) {
			return []
		}

		const waves = telemetry[matchId].waves
			.map(wave => wave.wave)
			.filter(isDefaultWave)
			.sort()
		return Object.freeze(waves)
	},
)

const mapStateToProps = (state: RootState) => {
	return {
		matches: selectMatches(state),
		match: state.overlay.match,
		waves: selectWaves(state),
		wave: state.overlay.wave,
	}
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
	return {
		changeMatch(session: string) {
			dispatch(setMatch(session))
		},
		hide() {
			dispatch(hideEggGraph())
		},
		show(wave: WaveType) {
			dispatch(showEggGraph(wave))
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(OverlayController)
