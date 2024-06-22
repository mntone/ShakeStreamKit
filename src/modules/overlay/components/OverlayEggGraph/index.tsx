import './styles.css'

import { useRef } from 'react'
import { connect } from 'react-redux'

import EggGraph, { type EggGraphProps } from '@/core/components/EggGraph'
import type { GraphLayoutProps } from '@/core/models/graph'

import { RootState } from 'app/store'

import { getCurrentTelemetry, getCurrentWaveFromTelemetry } from '../../selector'
import { RightSlideAnimation } from '../SlideAnimation'

const preferredGraphLayout = Object.freeze({
	containerWidth: '100%',
	containerHeight: '100%',
	graphWidth: 320,
	graphHeight: 192,
	marginTop: 48,     // 3.0em  in 720p (1em = 16px @ 720p, 1em = 24px @ 1080p)
	marginLeft: 48,    // 3.0em  in 720p
	marginRight: 20,   // 1.25em in 720p, with 2.25em padding
	marginBottom: 32,  // 2.0em  in 720p
} satisfies GraphLayoutProps)

type OverlayEggGraphProps =
	& { readonly visible: boolean }
	& Omit<EggGraphProps, keyof GraphLayoutProps>

export const OverlayEggGraph = (props: OverlayEggGraphProps) => {
	const { visible, ...nextProps } = props
	const ref = useRef<HTMLDivElement>(null)
	return (
		<RightSlideAnimation
			nodeRef={ref}
			rich
			visible={visible}
		>
			<div className='Overlay Overlay-right OverlayEggGraph' ref={ref}>
				<EggGraph {...nextProps} {...preferredGraphLayout} />
			</div>
		</RightSlideAnimation>
	)
}

function mapStateToProps(state: RootState) {
	const telemetry = getCurrentTelemetry(state)
	let wave = getCurrentWaveFromTelemetry(state, telemetry)
	if (wave?.wave === 'extra') {
		wave = undefined
	}
	return {
		colorLock: state.config.colorLock,
		telemetry,
		visible: telemetry !== undefined && wave !== undefined,
		wave,
	} satisfies OverlayEggGraphProps
}

export default connect(
	mapStateToProps,
)(OverlayEggGraph)
