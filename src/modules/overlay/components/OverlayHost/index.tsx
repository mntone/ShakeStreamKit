import './styles.css'

import { clsx } from 'clsx'

import { useEnvironment } from '@/core/components/EnvironmentProvider'

import { useAppSelector } from 'app/hooks'

import { selectWave } from '../../selectors'
import CameraPreview from '../CameraPreview'
import EggGraph from '../EggGraph'
import ProductLogo from '../ProductLogo'
import { RightSlideAnimation } from '../SlideAnimation'

const OverlayHost = () => {
	const environment = useEnvironment()
	const broadcastEnabled = environment && 'broadcast' in environment

	const selectedWave = useAppSelector(selectWave)
	const currentPoweredby = useAppSelector(state => state.overlay.poweredby)
	return (
		<div className={clsx(
			'OverlayHost',
			broadcastEnabled && 'OverlayHost--broadcast',
		)}>
			<RightSlideAnimation
				rich
				visible={selectedWave !== undefined}
			>
				<EggGraph wave={selectedWave} />
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
