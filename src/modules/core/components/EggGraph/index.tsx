import './styles.css'

import { ReactNode, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { AxisBottom, AxisLeft, type TickLabelProps } from '@visx/axis'
import { curveLinear } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { scaleLinear, type ScaleInput } from '@visx/scale'
import { LinePath } from '@visx/shape'

import { forceLast } from '@/core/utils/collection'
import type { ShakeDefaultWave, ShakeTelemetry } from '@/telemetry/models/data'

import EggGraphMessages from './messages'

import type { ScaleLinear } from 'd3-scale'

const getLargeTextNode = (chunks: ReactNode[]) => {
	return (
		<span style={{ fontSize: '1.25em' }}>{chunks}</span>
	)
}

export interface EggGraphSizeProps {
	containerWidth: number
	containerHeight: number
	graphWidth?: number
	graphHeight?: number

	marginTop: number
	marginLeft: number
	marginRight: number
	marginBottom: number
}

export interface EggGraphProps {
	telemetry?: Readonly<ShakeTelemetry>
	wave?: number
}

const amountLabelProps: TickLabelProps<ScaleInput<ScaleLinear<number, number, never>>> = {
	dy: '.4em',
	fontFamily: undefined,
	fontSize: undefined,
	fill: undefined,
}

const countLabelProps: TickLabelProps<ScaleInput<ScaleLinear<number, number, never>>> = {
	dy: '.6em',
	fontFamily: undefined,
	fontSize: undefined,
	fill: undefined,
}

const getSvgProps = (props: {
	containerWidth: number
	containerHeight: number
	graphWidth?: number
	graphHeight?: number
}): {
	width: number | string
	height: number | string
	viewBox?: string
	preserveAspectRatio?: string
} => {
	if (!props.graphWidth || !props.graphHeight) {
		return {
			width: props.containerWidth,
			height: props.containerHeight,
		}
	}

	return {
		width: '100%',
		height: '100%',
		preserveAspectRatio: 'xMinYMax meet',
		viewBox: `0 0 ${props.graphWidth} ${props.graphHeight}`,
	}
}

const EggGraph = (props: EggGraphProps & EggGraphSizeProps) => {
	const {
		marginTop,
		marginLeft,
		marginRight,
		marginBottom,

		telemetry,
		wave,
	} = props

	const intl = useIntl()

	const waveData: ShakeDefaultWave | undefined = useMemo(() => {
		const targetWave = telemetry?.waves.find(w => w.wave === wave)
		if (!targetWave || targetWave.wave === 'extra') {
			return undefined
		}

		return targetWave
	}, [telemetry, wave])
	if (waveData === undefined) {
		return null
	}

	const svgProps = getSvgProps(props)
	const width = (props.graphWidth ?? props.containerWidth) - marginLeft - marginRight
	const height = (props.graphHeight ?? props.containerHeight) - marginTop - marginBottom
	const positionProps = {
		left: marginLeft,
		top: marginTop,
	}

	const lastUpdate = forceLast(waveData.updates)
	const status = waveData.quota <= lastUpdate.amount
		? true
		: lastUpdate.count === 0
			? false
			: telemetry?.closed
				? false
				: undefined
	const amountScale = scaleLinear<number>({
		domain: [Math.max(5 * Math.ceil(0.2 * waveData.quota), lastUpdate.amount), 0],
		range: [0, height],
		nice: true,
	})
	const countScale = scaleLinear<number>({
		domain: [0, 100],
		range: [0, width],
		clamp: true,
	})
	const quotaY = amountScale(waveData.quota)

	return (
		<div className={`EggGraph EggGraph-wave${waveData.wave}`}>
			<header>
				<span className='EggGraph-wave'>
					{intl.formatMessage(
						EggGraphMessages.wave,
						{
							big: getLargeTextNode,
							wave: waveData.wave,
						},
					)}
				</span>
				{
					status
						? (
							<span className='EggGraph-status EggGraph-clear'>
								{intl.formatMessage(EggGraphMessages.clear)}
							</span>
						)
						: status === false
							? (
								<span className='EggGraph-status EggGraph-failure'>
									{intl.formatMessage(EggGraphMessages.fail)}
								</span>
							)
							: null
				}
				<span className='EggGraph-quota'>
					{`${waveData.amount}/${waveData.quota}`}
				</span>
			</header>

			<svg {...svgProps}>
				<rect
					className='EggGraph-background'
					x={marginLeft}
					y={marginTop}
					width={width}
					height={height}
				/>

				<GridRows
					className='EggGraph-grid EggGraph-grid-y'
					scale={amountScale}
					numTicks={2}
					{...positionProps}
					width={width}
					height={height}
				/>

				<Group className='EggGraph-lines-quota' {...positionProps}>
					<line
						x2={width}
						y1={quotaY}
						y2={quotaY}
					/>
					<text
						y={quotaY}
						dx='.2em'
						dy='-.333em'
					>
						{intl.formatMessage(EggGraphMessages.quota)}
					</text>
				</Group>

				<AxisLeft
					axisClassName='EggGraph-axis EggGraph-axis-y'
					scale={amountScale}
					numTicks={4}
					tickLength={4}
					hideZero
					tickLabelProps={amountLabelProps}
					{...positionProps}
				/>
				<AxisBottom
					axisClassName='EggGraph-axis EggGraph-axis-x'
					scale={countScale}
					numTicks={4}
					tickLength={4}
					tickLabelProps={countLabelProps}
					left={marginLeft}
					top={marginTop + height}
				/>

				<Group {...positionProps}>
					<LinePath
						className='EggGraph-item EggGraph-item-line EggGraph-item-amount'
						data={waveData.updates}
						curve={curveLinear}
						y={d => amountScale(d.amount)}
						x={d => countScale(d.timestamp - waveData.startTimestamp)}
					/>
				</Group>
			</svg>
		</div>
	)
}

export default EggGraph
