import { MouseEvent } from 'react'
import { useIntl } from 'react-intl'

import { WaveType } from '@/core/utils/wave'

import OverlayControllerMessages from './messages'

interface WaveButtonProps {
	disabled: boolean
	wave: WaveType
	onWaveChange(value: WaveType): void
}

const WaveButton = ({ wave, disabled, onWaveChange }: WaveButtonProps) => {
	const intl = useIntl()

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		const waveText = e.currentTarget.value
		if (waveText === 'extra') {
			onWaveChange(waveText)
		} else {
			const wave = Number(waveText)
			onWaveChange(wave as WaveType)
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
			{intl.formatMessage(
				OverlayControllerMessages.showOverlayWithWave,
				{ wave },
			)}
		</button>
	)
}

export default WaveButton
