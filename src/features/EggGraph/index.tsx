import { useParentSize } from '@visx/responsive'
import {
	AnimatedLineSeries,
	Axis,
	Grid,
	XYChart,
} from '@visx/xychart'
import { concat, findLastIndex } from 'lodash'
import { FormattedMessage } from 'react-intl'

import { ShakeGameUpdateEvent } from 'features/telemetry/model'

import { useAppSelector } from 'app/hooks'

import EggGraphMessages from './messages'

import './styles.css'

export interface EggGraphProps {
	wave: number | 'extra' | undefined
}

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

const EggGraph = ({ wave }: EggGraphProps) => {
	const { parentRef, width } = useParentSize({ debounceTime: 300 })

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

	const quotaLine = [
		{ timeOffset: 0, amount: telemetry.quota },
		{ timeOffset: 100, amount: telemetry.quota },
	]
	const accessors = {
		xAccessor: (d: any) => d.timeOffset,
		yAccessor: (d: any) => d.amount,
	}

	return (
		<div
			className={`Overlay EggGraph EggGraph-wave${telemetry.wave}`}
			ref={parentRef}
		>
			<header>
				{telemetry.wave === 'extra'
					? <FormattedMessage {...EggGraphMessages.extraWave} />
					: (
						<FormattedMessage
							values={{
								big: chunks => <span style={{ fontSize: '1.25em' }}>{chunks}</span>,
								wave: telemetry.wave,
							}}
							{...EggGraphMessages.wave}
						/>
					)}
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
			<XYChart
				width={width}
				height={Math.floor(0.6 * width)}
				xScale={{ type: 'linear' }}
				yScale={{ type: 'linear' }}
			>
				<Axis
					axisClassName='EggGraph-axis-x'
					orientation='bottom'
				/>
				<Axis
					axisClassName='EggGraph-axis-y'
					hideZero={true}
					label='Quota'
					numTicks={3}
					orientation='left'
					tickClassName='EggGraph-axis-y-tick'
				/>
				<Grid rows={false} numTicks={4} />
				<AnimatedLineSeries
					dataKey='Quota Line'
					data={quotaLine}
					strokeDasharray='4'
					{...accessors}
				/>
				<AnimatedLineSeries
					dataKey='Events'
					data={telemetry.events}
					{...accessors}
				/>
			</XYChart>
		</div>
	)
}

export default EggGraph
