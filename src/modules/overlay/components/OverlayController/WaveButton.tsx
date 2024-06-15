import { MouseEvent, memo } from 'react'
import { FormattedMessage } from 'react-intl'

import OverlayControllerMessages from './messages'

export type WaveData = number | 'extra'

interface WaveButtonProps {
	disabled: boolean
	wave: WaveData
	onWaveChange(value: WaveData): void
}

const WaveButton = ({ wave, disabled, onWaveChange }: WaveButtonProps) => {
	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		const waveText = e.currentTarget.value
		if (waveText === 'extra') {
			onWaveChange(waveText)
		} else {
			const wave = Number(waveText)
			onWaveChange(wave)
		}
	}

	return (
		<button
			type='button'
			className='Button'
			disabled={disabled}
			value={wave}
			onClick={handleClick}
		>
			<FormattedMessage
				values={{ wave }}
				{...OverlayControllerMessages.showOverlayWithWave}
			/>
		</button>
	)
}

export default memo(WaveButton)
