import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import SliderBox from '@/core/components/SliderBox'

import { useAppSelector } from 'app/hooks'

import DialogMessages from '../messages'
import {
	setNotifyOnQuotaMetDuration,
	setNotifyOnWaveFinishedDuration,
} from '../slicers'

const AdvancedPage = () => {
	const intl = useIntl()
	const unit = intl.formatMessage(DialogMessages.advancedDisplayDurationUnit)

	const notifyOnQuotaMet = useAppSelector(state => state.config.notifyOnQuotaMet)
	const notifyOnQuotaMetDuration = useAppSelector(state => state.config.notifyOnQuotaMetDuration) ?? 3.0
	const notifyOnWaveFinished = useAppSelector(state => state.config.notifyOnWaveFinished)
	const notifyOnWaveFinishedDuration = useAppSelector(state => state.config.notifyOnWaveFinishedDuration) ?? 12.0

	const dispatch = useDispatch()
	const handleNotifyOnQuotaMetDuration = useCallback((notifyOnQuotaMetDuration: number) => {
		dispatch(setNotifyOnQuotaMetDuration(notifyOnQuotaMetDuration))
	}, [dispatch])
	const handleNotifyOnWaveFinishedDuration = useCallback((notifyOnWaveFinishedDuration: number) => {
		dispatch(setNotifyOnWaveFinishedDuration(notifyOnWaveFinishedDuration))
	}, [dispatch])

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.advanced)}
			</h2>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.advancedDisplayDuration)}
				</h3>
				<h4>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnQuotaMet)}
				</h4>
				<SliderBox
					disabled={!notifyOnQuotaMet}
					min={0.1}
					max={15}
					step={0.1}
					value={notifyOnQuotaMetDuration}
					unit={unit}
					onValueChange={handleNotifyOnQuotaMetDuration}
				/>
				<h4>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnWaveFinished)}
				</h4>
				<SliderBox
					disabled={notifyOnWaveFinished === false}
					min={0.1}
					max={15}
					step={0.1}
					value={notifyOnWaveFinishedDuration}
					unit={unit}
					onValueChange={handleNotifyOnWaveFinishedDuration}
				/>
			</section>
		</>
	)
}

export default AdvancedPage
