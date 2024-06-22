import './styles.css'

import { ReactNode, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { AxisBottom, AxisLeft, type TickLabelProps } from '@visx/axis'
import { curveLinear } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { scaleLinear, type ScaleInput } from '@visx/scale'
import { LinePath } from '@visx/shape'

import { getSvgProps, type GraphLayoutProps } from '@/core/models/graph'
import { forceLast } from '@/core/utils/collection'
import type { ShakeDefaultWave, ShakeTelemetry } from '@/telemetry/models/data'

import EggGraphMessages from './messages'

import type { ScaleLinear } from 'd3-scale'

const getLargeTextNode = (chunks: ReactNode[]) => {
	return (
		<span style={{ fontSize: '1.25em' }}>{chunks}</span>
	)
}

export interface EggGraphProps extends GraphLayoutProps {
	readonly colorLock?: boolean
	readonly telemetry?: Readonly<ShakeTelemetry>
	readonly wave?: Readonly<ShakeDefaultWave>
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

const EggGraph = (props: EggGraphProps) => {
	const {
		graphWidth,
		graphHeight,

		marginTop,
		marginLeft,
		marginRight,
		marginBottom,

		colorLock,
		telemetry,
		wave: waveData,
	} = props
	if (waveData === undefined) {
		return null
	}

	const intl = useIntl()

	const svgProps = getSvgProps(props)
	const width = graphWidth - marginLeft - marginRight
	const height = graphHeight - marginTop - marginBottom
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
	const maxY = Math.max(5 * Math.ceil(0.2 * waveData.quota), lastUpdate.amount)
	const amountScale = scaleLinear<number>({
		domain: [maxY, 0],
		range: [0, height],
		nice: true,
	})
	const countScale = scaleLinear<number>({
		domain: [100, 0],
		range: [0, width],
		clamp: true,
	})
	const quotaY = amountScale(waveData.quota)

	return (
		<div className={colorLock !== true && telemetry?.color
			? `EggGraph EggGraph-wave${waveData.wave} EggGraph-ink-${telemetry.color}`
			: `EggGraph EggGraph-wave${waveData.wave}`}>
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
						dy={waveData.quota + 3 > maxY ? '1.2em' : '-.333em'}
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
						className='EggGraph-item-line-bg'
						data={waveData.updates}
						curve={curveLinear}
						strokeLinecap={undefined}
						y={d => amountScale(d.amount)}
						x={d => countScale(100 + waveData.startTimestamp - d.timestamp)}
					/>
					<LinePath
						className='EggGraph-item EggGraph-item-line'
						data={waveData.updates}
						curve={curveLinear}
						strokeLinecap={undefined}
						y={d => amountScale(d.amount)}
						x={d => countScale(100 + waveData.startTimestamp - d.timestamp)}
					/>
				</Group>
			</svg>
		</div>
	)
}

export default EggGraph
