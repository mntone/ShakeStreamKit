import './styles.css'

import { useRef } from 'react'
import { connect } from 'react-redux'

import { createSelector } from '@reduxjs/toolkit'

import EggGraph, { type EggGraphProps, type EggGraphSizeProps } from '@/core/components/EggGraph'
import { isDefaultWave } from '@/core/utils/wave'

import { RootState } from 'app/store'

import { RightSlideAnimation } from '../SlideAnimation'

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

export interface OverlayEggGraphProps extends EggGraphProps {
	visible: boolean
}

export const OverlayEggGraph = (props: OverlayEggGraphProps) => {
	const { visible, ...nextProps } = props
	const ref = useRef<HTMLDivElement>(null)
	const size = getPreferredGraphSize()
	return (
		<RightSlideAnimation
			nodeRef={ref}
			rich
			visible={visible}
		>
			<div className='Overlay Overlay-right OverlayEggGraph' ref={ref}>
				<EggGraph {...nextProps} {...size} />
			</div>
		</RightSlideAnimation>
	)
}

const selectData = createSelector(
	(state: RootState) => state.overlay.match,
	(state: RootState) => state.telemetry,
	(matchId, telemetry) => {
		const data = matchId ? telemetry[matchId] : undefined
		return data
	},
)

const mapStateToProps = (state: RootState) => {
	const wave = state.overlay.wave
	if (!isDefaultWave(wave)) {
		return {
			visible: false,
		} satisfies Pick<OverlayEggGraphProps, 'visible'>
	}

	const telemetry = selectData(state)
	if (!telemetry) {
		return {
			visible: false,
		} satisfies Pick<OverlayEggGraphProps, 'visible'>
	}

	return {
		telemetry,
		visible: true,
		wave,
	} satisfies Pick<OverlayEggGraphProps, 'telemetry' | 'visible' | 'wave'>
}

export default connect(
	mapStateToProps,
)(OverlayEggGraph)
