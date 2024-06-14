import './styles.css'

import { clsx } from 'clsx'

import { useEnvironment } from '@/core/components/EnvironmentProvider'

import { useAppSelector } from 'app/hooks'

import { selectWave, selectOverlay } from '../../selectors'
import CameraPreview from '../CameraPreview'
import EggGraph from '../EggGraph'
import ProductLogo from '../ProductLogo'
import { RightSlideAnimation } from '../SlideAnimation'

const OverlayHost = () => {
	const environment = useEnvironment()
	const broadcastEnabled = environment && 'broadcast' in environment

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

			{!broadcastEnabled && (
				<CameraPreview />
			)}
		</div>
	)
}

export default OverlayHost
