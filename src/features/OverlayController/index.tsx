import { createSelector } from '@reduxjs/toolkit'
import { MouseEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import type { ShakeGameUpdateEvent } from 'features/telemetry/model'

import { useAppSelector } from 'app/hooks'
import type { RootState } from 'app/store'
import { selectOverlay, selectWave } from 'app/viewSelector'
import { hideOverlay, showOverlay } from 'app/viewSlice'

import OverlayControllerMessages from './messages'

const selectWaves = createSelector(
	(state: RootState) => state.telemetry.payload
		.filter(t => t.event === 'game_update' && t.wave !== 'extra' && t.wave > 0) as ShakeGameUpdateEvent[],
	t => t.length !== 0
		? Array.from({ length: t[t.length - 1].wave as number }, (_, i) => i + 1)
		: [],
)

const OverlayController = () => {
	const currentOverlay = useAppSelector(selectOverlay)
	const currentWave = useAppSelector(selectWave)
	const waves = useAppSelector(selectWaves)

	const dispatch = useDispatch()
	const handleHideOverlay = () => {
		dispatch(hideOverlay())
	}
	const handleSelectWave = (e: MouseEvent<HTMLButtonElement>) => {
		const wave = Number(e.currentTarget.value)
		dispatch(showOverlay(wave))
	}

	return (
		<>
			<button
				type='button'
				className='Button'
				disabled={!currentOverlay}
				onClick={handleHideOverlay}
			>
				<FormattedMessage {...OverlayControllerMessages.hideOverlay} />
			</button>
			{waves.map(wave => (
				<button
					key={wave}
					type='button'
					className='Button'
					disabled={currentOverlay && currentWave === wave}
					value={wave}
					onClick={handleSelectWave}
				>
					<FormattedMessage
						values={{ wave }}
						{...OverlayControllerMessages.showOverlayWithWave}
					/>
				</button>
			))}
		</>
	)
}

export default OverlayController
