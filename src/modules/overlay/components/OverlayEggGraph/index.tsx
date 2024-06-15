import './styles.css'

import EggGraph, { type EggGraphProps, type EggGraphSizeProps } from '@/core/components/EggGraph'

const rem = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'), 10)

const getPreferredGraphSize = (): EggGraphSizeProps => {
	const olWidth = Math.min(window.innerWidth, 16 * (window.innerHeight - 2.25 * rem - 8) / 9)
	const em = 0.0125 * olWidth
	const top = (2 + .5) * em
	const left = (1.25 + 1.75) * em
	const right = (0 + 3.5) * em
	const bottom = (.25 + 1.75) * em
	const width = 24 * em
	const height = (2 + 10) * em
	return {
		containerWidth: width,
		containerHeight: height,
		marginTop: top,
		marginLeft: left,
		marginRight: right,
		marginBottom: bottom,
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
