import './styles.css'

import { FC, PropsWithChildren } from 'react'

import { clsx } from 'clsx'

import { useAppSelector } from 'app/hooks'

import { selectWave, selectOverlay } from '../../selectors'
import EggGraph from '../EggGraph'
import ProductLogo from '../ProductLogo'
import { RightSlideAnimation } from '../SlideAnimation'

const OverlayHost: FC<PropsWithChildren> = ({ children }) => {
	const broadcastEnabled = useAppSelector(state => state.overlay.broadcast.enabled)

	const currentWave = useAppSelector(selectWave)
	const currentOverlay = useAppSelector(selectOverlay)
	const currentPoweredby = useAppSelector(state => state.overlay.poweredby)
	return (
		<div className={clsx(
			'OverlayHost',
			broadcastEnabled && 'OverlayHost--broadcast',
		)}>
			<RightSlideAnimation visible={currentOverlay}>
				<EggGraph wave={currentWave} />
			</RightSlideAnimation>

			<RightSlideAnimation visible={currentPoweredby}>
				<ProductLogo />
			</RightSlideAnimation>

			{children}
		</div>
	)
}

export default OverlayHost
