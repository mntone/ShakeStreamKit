import './styles.css'

import { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { AxisBottom, AxisLeft, type TickLabelProps } from '@visx/axis'
import { curveLinear } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { scaleLinear, type ScaleInput } from '@visx/scale'
import { LinePath } from '@visx/shape'
import { concat, findLastIndex } from 'lodash'

import type { ShakeGameUpdateEvent } from '@/telemetry/model'

import { useAppSelector } from 'app/hooks'

import EggGraphMessages from './messages'

import type { ScaleLinear } from 'd3-scale'

const EMPTY_TELEMETRY = {
	wave: 0,
	amount: 0,
	quota: 0,
	status: undefined,
	events: [],
}

const zip = <T,>(arr1: T[], arr2: T[]): T[][] => {
	return arr1.slice(0, -1).map((item, index) => [item, arr2[index]])
}

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

		wave,
	} = props

	const telemetry = useAppSelector(state => {
		if (wave === undefined) {
			return EMPTY_TELEMETRY
		}

		const telemetry = state.telemetry.payload.filter(t => t.event === 'game_update' && t.wave === wave) as ShakeGameUpdateEvent[]
		if (telemetry.length === 0) {
			return EMPTY_TELEMETRY
		}

		const latestCount = telemetry[telemetry.length - 1].count
		const lastEvent = telemetry.find(t => t.count === latestCount)
		if (lastEvent === undefined) {
			return EMPTY_TELEMETRY
		}

		const startTime = lastEvent.timestamp + latestCount - 100
		const firstEvent = {
			timeOffset: 0,
			amount: 0,
		}

		const firstIndex = Math.max(0, findLastIndex(telemetry, t => t.count === 100) - 1)
		const paired = zip(telemetry.slice(firstIndex, -1), telemetry.slice(firstIndex + 1))
		const newEventData = paired.flatMap(p => {
			const a0 = p[0].amount
			const a1 = p[1].amount
			const diff = a1 - a0
			if (diff >= 0 && diff < 5) {
				return [{
					timeOffset: p[1].timestamp - startTime,
					amount: p[1].amount,
				}]
			}
			return []
		})

		const quota = telemetry[0].quota
		return {
			wave,
			amount: lastEvent.amount,
			quota,
			status: lastEvent.amount >= quota ? true : latestCount === 0 ? false : undefined,
			events: concat([firstEvent], newEventData),
		}
	})

	if (telemetry.events.length === 0) {
		return null
	}

	const svgProps = getSvgProps(props)
	const width = (props.graphWidth ?? props.containerWidth) - marginLeft - marginRight
	const height = (props.graphHeight ?? props.containerHeight) - marginTop - marginBottom
	const positionProps = {
		left: marginLeft,
		top: marginTop,
	}

	const quota = telemetry.quota
	const lastAmount = telemetry.events[telemetry.events.length - 1].amount
	const amountScale = scaleLinear<number>({
		domain: [Math.max(5 * Math.ceil(0.2 * quota), lastAmount), 0],
		range: [0, height],
		nice: true,
	})
	const countScale = scaleLinear<number>({
		domain: [0, 100],
		range: [0, width],
	})
	const quotaY = amountScale(quota)

	return (
		<div className={`EggGraph EggGraph-wave${telemetry.wave}`}>
			<header>
				<FormattedMessage
					values={{
						big: getLargeTextNode,
						wave: telemetry.wave,
					}}
					{...EggGraphMessages.wave}
				/>
				{
					telemetry.status
						? (
							<span className='EggGraph-clear'>
								<FormattedMessage {...EggGraphMessages.clear} />
							</span>
						)
						: telemetry.status === false
							? (
								<span className='EggGraph-failure'>
									<FormattedMessage {...EggGraphMessages.fail} />
								</span>
							)
							: null
				}
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
						<FormattedMessage {...EggGraphMessages.quota} />
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
						data={telemetry.events}
						curve={curveLinear}
						y={d => amountScale(d.amount)}
						x={d => countScale(d.timeOffset)}
					/>
				</Group>
			</svg>
		</div>
	)
}

export default EggGraph
