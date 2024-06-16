import './styles.css'

import EggGraph, { type EggGraphProps, type EggGraphSizeProps } from '@/core/components/EggGraph'

const rem = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'), 10)

const getPreferredGraphSize = (): EggGraphSizeProps => {
	const olWidth = Math.min(window.innerWidth, 16 * (window.innerHeight - 2.25 * rem - 8) / 9)
	const em = 0.0125 * olWidth
	const width = 24 * em
	const height = (2 + 10) * em
	return {
		containerWidth: width,
		containerHeight: height,
		graphWidth: 384,
		graphHeight: 192,
		marginTop: 48,     // 3.0em in 720p
		marginLeft: 48,    // 3.0em in 720p
		marginRight: 56,   // 3.5em in 720p
		marginBottom: 32,  // 2.0em in 720p
	}
}

const OverlayEggGraph = (props: EggGraphProps) => {
	const size = getPreferredGraphSize()
	return (
		<div className='Overlay Overlay-right OverlayEggGraph'>
			<EggGraph {...props} {...size} />
		</div>
	)
}

export default OverlayEggGraph
